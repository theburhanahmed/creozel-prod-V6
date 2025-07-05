import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declaring Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Check user credits
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

    // Calculate credits needed based on type
    let creditsNeeded = 1
    switch (type) {
      case "text":
        creditsNeeded = Math.ceil((options.maxTokens || 100) / 100)
        break
      case "image":
        creditsNeeded = 5
        break
      case "video":
        creditsNeeded = 20
        break
      case "audio":
        creditsNeeded = 3
        break
    }

    if (userData.credits < creditsNeeded) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Create generation record
    const { data: generation, error: genError } = await supabaseClient
      .from("content_generations")
      .insert({
        user_id: user.id,
        type,
        prompt,
        credits_used: creditsNeeded,
        status: "processing",
      })
      .select()
      .single()

    if (genError) {
      return new Response(JSON.stringify({ error: "Failed to create generation record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Deduct credits
    const { error: deductError } = await supabaseClient.rpc("deduct_credits", {
      user_id: user.id,
      amount: creditsNeeded,
      description: `${type} generation`,
    })

    if (deductError) {
      return new Response(JSON.stringify({ error: "Failed to deduct credits" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Generate content based on type
    let result = null
    let error_message = null

    try {
      switch (type) {
        case "text":
          result = await generateText(prompt, options)
          break
        case "image":
          result = await generateImage(prompt, options)
          break
        case "video":
          result = await generateVideo(prompt, options)
          break
        case "audio":
          result = await generateAudio(prompt, options)
          break
        default:
          throw new Error("Unsupported generation type")
      }
    } catch (error) {
      error_message = error.message
    }

    // Update generation record
    await supabaseClient
      .from("content_generations")
      .update({
        result,
        status: error_message ? "failed" : "completed",
        error_message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", generation.id)

    return new Response(
      JSON.stringify({
        id: generation.id,
        result,
        status: error_message ? "failed" : "completed",
        error_message,
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
