import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!

    // Verify the user's JWT
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Service role client for DB operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    // Check usage limits
    const { data: profile } = await adminClient
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (profile?.plan !== 'pro') {
      const { data: usageCount } = await adminClient.rpc('conversions_this_month', {
        uid: user.id,
      })
      if ((usageCount ?? 0) >= 5) {
        return new Response(
          JSON.stringify({ error: 'Monthly limit reached. Upgrade to Pro for unlimited conversions.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Parse request body
    const { imageBase64, fileName } = await req.json()

    // Insert conversion row
    const { data: conversion, error: insertError } = await adminClient
      .from('conversions')
      .insert({
        user_id: user.id,
        image_url: '',
        status: 'processing',
      })
      .select()
      .single()

    if (insertError || !conversion) {
      throw new Error('Failed to create conversion record')
    }

    // Upload image to storage
    const ext = fileName?.split('.').pop() || 'png'
    const storagePath = `${user.id}/${conversion.id}.${ext}`
    const imageBuffer = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0))

    const { error: uploadError } = await adminClient.storage
      .from('conversion-images')
      .upload(storagePath, imageBuffer, { contentType: `image/${ext}` })

    if (uploadError) {
      throw new Error('Failed to upload image')
    }

    const { data: urlData } = adminClient.storage
      .from('conversion-images')
      .getPublicUrl(storagePath)

    // Update conversion with image URL
    await adminClient
      .from('conversions')
      .update({ image_url: urlData.publicUrl })
      .eq('id', conversion.id)

    // Call Claude API for vision extraction
    const mediaType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
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

    const claudeData = await claudeResponse.json()
    const content = claudeData.content?.[0]?.text ?? ''

    // Parse the JSON response
    let extractedData
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      extractedData = JSON.parse(jsonMatch ? jsonMatch[0] : content)
    } catch {
      await adminClient
        .from('conversions')
        .update({ status: 'failed', error_message: 'Failed to parse AI response' })
        .eq('id', conversion.id)

      return new Response(
        JSON.stringify({ error: 'Failed to parse table data from image' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Update conversion with extracted data
    await adminClient
      .from('conversions')
      .update({ status: 'completed', extracted_data: extractedData })
      .eq('id', conversion.id)

    return new Response(
      JSON.stringify({ conversionId: conversion.id, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
