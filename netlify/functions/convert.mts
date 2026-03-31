import type { Context } from "@netlify/functions"

export default async (req: Request, _context: Context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    const { imageBase64, fileName } = await req.json()

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
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
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    return new Response(
      JSON.stringify({ data: extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
}

export const config = {
  path: "/.netlify/functions/convert",
}
