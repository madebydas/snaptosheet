import type { Context } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  monthly: 50,
  yearly: 50,
  lifetime: 50,
}

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function getUserFromToken(token: string) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: { user } } = await client.auth.getUser()
  return user
}

export default async (req: Request, _context: Context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: jsonHeaders },
      )
    }

    // Optional auth — check if user is logged in
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    const user = token ? await getUserFromToken(token) : null
    const admin = getSupabaseAdmin()

    // Server-side usage limit check for authenticated users
    if (user && admin) {
      const { data: profile } = await admin
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()

      const plan = profile?.plan ?? "free"
      const limit = PLAN_LIMITS[plan] ?? 5

      const { data: usageCount } = await admin.rpc("conversions_this_month", {
        uid: user.id,
      })

      if ((usageCount ?? 0) >= limit) {
        return new Response(
          JSON.stringify({ error: "Monthly limit reached. Upgrade your plan for more conversions." }),
          { status: 429, headers: jsonHeaders },
        )
      }
    }

    const { imageBase64, fileName } = await req.json()

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: jsonHeaders },
      )
    }

    const ext = fileName?.split(".").pop()?.toLowerCase() || "png"
    const mediaType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: imageBase64 },
              },
              {
                type: "text",
                text: `Extract ALL visible tabular data from this image.

Return ONLY valid JSON in this exact format:
{
  "headers": ["Column1", "Column2", ...],
  "rows": [
    ["cell1", "cell2", ...],
    ["cell3", "cell4", ...]
  ]
}

Rules:
- If headers are not explicitly visible, infer reasonable column names.
- Preserve all text exactly as shown (numbers, currencies, dates).
- If multiple tables exist, extract the largest/most prominent one.
- Empty cells should be represented as empty strings "".
- Do not include any explanation, markdown, or text outside the JSON.`,
              },
            ],
          },
        ],
      }),
    })

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text()
      return new Response(
        JSON.stringify({ error: `Claude API error: ${errText}` }),
        { status: 502, headers: jsonHeaders },
      )
    }

    const claudeData = await claudeResponse.json()
    const content = claudeData.content?.[0]?.text ?? ""

    let extractedData
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      extractedData = JSON.parse(jsonMatch ? jsonMatch[0] : content)
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse table data from image" }),
        { status: 422, headers: jsonHeaders },
      )
    }

    // Save conversion to DB for authenticated users
    if (user && admin) {
      await admin.from("conversions").insert({
        user_id: user.id,
        image_url: "",
        extracted_data: extractedData,
        status: "completed",
      })
    }

    return new Response(
      JSON.stringify({ data: extractedData }),
      { headers: jsonHeaders },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
}
