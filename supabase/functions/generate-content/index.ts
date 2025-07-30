import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    })

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { type, prompt, options = {} } = await req.json()

    // 1. Fetch default provider for this content type
    const { data: provider, error: providerError } = await supabaseClient
      .from("ai_providers")
      .select("id, name, type, config, is_default, is_active, price_per_1k_tokens, price_per_image, price_per_video_min, profit_margin_percent")
      .eq("type", type)
      .eq("is_default", true)
      .eq("is_active", true)
      .single()
    if (providerError || !provider) {
      return new Response(JSON.stringify({ error: "Default provider not found for this content type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 2. Calculate charge based on provider pricing and admin profit margin
    let baseCost = 0
    switch (type) {
      case "text":
      case "audio": {
        const tokensPerK = options.tokens ?? 1000 // caller can pass estimated tokens
        baseCost = (provider.price_per_1k_tokens || 0) * (tokensPerK / 1000)
        break
      }
      case "image": {
        baseCost = provider.price_per_image || 0
        break
      }
      case "video": {
        const durationMin = options.durationMinutes ?? 1
        baseCost = (provider.price_per_video_min || 0) * durationMin
        break
      }
      default:
        baseCost = 0
    }

    const cost_per_unit = baseCost
    const profit_percent = provider.profit_margin_percent || 0
    const finalCharge = cost_per_unit * (1 + profit_percent / 100)

    if (finalCharge <= 0) {
      return new Response(JSON.stringify({ error: "Pricing not configured for selected provider/content type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    // pricing calculated locally; RPC removed
      p_user_id: user.id,
      p_provider_id: provider.id,
      p_content_type: type,
    })
    /* removed obsolete chargeData logic
      return new Response(JSON.stringify({ error: "Pricing info not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    

    // 3. Check user credits
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()
    if (userError || !userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    if (userData.credits < finalCharge) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 4. Generate content using the provider API
    let result = null
    let error_message = null
    try {
      switch (provider.name.toLowerCase()) {
        case "openai":
          result = await generateText(prompt, options)
          break
        case "dall-e":
          result = await generateImage(prompt, options)
          break
        case "replicate":
          if (type === "video") {
            result = await generateVideo(prompt, options)
          } else if (type === "image") {
            result = await generateImage(prompt, options)
          }
          break
        case "elevenlabs":
          result = await generateAudio(prompt, options)
          break
        default:
          throw new Error("Unsupported provider for this content type")
      }
    } catch (error) {
      error_message = error.message
    }

    if (error_message) {
      return new Response(JSON.stringify({ error: error_message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 5. Deduct credits using the deduct-credits Edge Function
    const { data: deductData, error: deductError } = await supabaseClient.functions.invoke("deduct-credits", {
      body: {
        userId: user.id,
        generationCost: finalCharge,
        generationType: `${type}_generation`,
        generationMetadata: {
          provider_id: provider.id,
          content_type: type,
          timestamp: new Date().toISOString(),
        },
      },
    })
    if (deductError || !deductData?.success) {
      return new Response(JSON.stringify({ error: "Failed to deduct credits" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 6. Return content and charge info
    return new Response(
      JSON.stringify({
        content: result,
        charge: finalCharge,
        cost_per_unit,
        profit_percent,
        provider: provider.name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

async function generateText(prompt: string, options: any) {
  const openaiKey = Deno.env.get("OPENAI_API_KEY")
  if (!openaiKey) throw new Error("OpenAI API key not configured")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.maxTokens || 100,
      temperature: options.temperature || 0.7,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error")

  return {
    text: data.choices[0]?.message?.content || "",
    usage: data.usage,
  }
}

async function generateImage(prompt: string, options: any) {
  const openaiKey = Deno.env.get("OPENAI_API_KEY")
  if (!openaiKey) throw new Error("OpenAI API key not configured")

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error")

  return {
    url: data.data[0]?.url || "",
    revised_prompt: data.data[0]?.revised_prompt || prompt,
  }
}

async function generateVideo(prompt: string, options: any) {
  // Placeholder for video generation
  // This would integrate with services like RunwayML, Pika Labs, etc.
  throw new Error("Video generation not yet implemented")
}

async function generateAudio(prompt: string, options: any) {
  const elevenlabsKey = Deno.env.get("ELEVENLABS_API_KEY")
  if (!elevenlabsKey) throw new Error("ElevenLabs API key not configured")

  const voiceId = options.voiceId || "pNInz6obpgDQGcFmaJgB"

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": elevenlabsKey,
    },
    body: JSON.stringify({
      text: prompt,
      model_id: options.model || "eleven_monolingual_v1",
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarity_boost || 0.5,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ElevenLabs API error: ${error}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

  return {
    audio_base64: base64Audio,
    content_type: "audio/mpeg",
  }
}
