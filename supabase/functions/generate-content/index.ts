import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    })

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) {
      return createResponse({ error: "Unauthorized" }, 401)
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
      return createResponse({ error: "Default provider not found for this content type" }, 400)
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
      return createResponse({ error: "Pricing not configured for selected provider/content type" }, 400)
    }

    // 3. Check user credits
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()
    if (userError || !userData) {
      return createResponse({ error: "User not found" }, 404)
    }
    if (userData.credits < finalCharge) {
      return createResponse({ error: "Insufficient credits" }, 402)
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
      error_message = error instanceof Error ? error.message : "Unknown error"
    }

    if (error_message) {
      return createResponse({ error: error_message }, 500)
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
      return createResponse({ error: "Failed to deduct credits" }, 500)
    }

    // 6. Return content and charge info
    return createResponse({
      content: result,
      charge: finalCharge,
      cost_per_unit,
      profit_percent,
      provider: provider.name,
      content_type: type,
    })
  } catch (error) {
    console.error("Function error:", error)
    return createResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500)
  }
})

// Helper functions for content generation
async function generateText(prompt: string, options: any) {
  // Implementation for text generation
  return { text: `Generated text for: ${prompt}` }
}

async function generateImage(prompt: string, options: any) {
  // Implementation for image generation
  return { image_url: `https://example.com/generated-image-${Date.now()}.jpg` }
}

async function generateVideo(prompt: string, options: any) {
  // Implementation for video generation
  return { video_url: `https://example.com/generated-video-${Date.now()}.mp4` }
}

async function generateAudio(prompt: string, options: any) {
  // Implementation for audio generation
  return { audio_url: `https://example.com/generated-audio-${Date.now()}.mp3` }
}
