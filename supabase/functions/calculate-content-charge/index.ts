import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    })

    const { userId, contentType, providerId } = await req.json()
    let actualProviderId = providerId

    // 1. Fetch default provider if not provided
    if (!actualProviderId) {
      const { data: provider, error: providerError } = await supabaseClient
        .from("ai_providers")
        .select("id, price_per_1k_tokens, price_per_image, price_per_video_min, profit_margin_percent")
        .eq("type", contentType)
        .eq("is_default", true)
        .eq("is_active", true)
        .single()
      if (providerError || !provider) {
        return createResponse({ error: "Default provider not found for this content type" }, 400)
      }
      actualProviderId = provider.id
    }

    // 1b. Fetch provider record by actualProviderId to ensure we have pricing fields
    const { data: provider, error: providerFetchError } = await supabaseClient
      .from("ai_providers")
      .select("id, price_per_1k_tokens, price_per_image, price_per_video_min, profit_margin_percent")
      .eq("id", actualProviderId)
      .eq("is_active", true)
      .single()
    if (providerFetchError || !provider) {
      return createResponse({ error: "Provider not found" }, 404)
    }

    // 2. Calculate pricing locally using provider record
    let baseCost = 0
    switch (contentType) {
      case "text":
      case "audio": {
        const tokensPerK = 1 // assume 1k tokens preview
        baseCost = (provider.price_per_1k_tokens || 0) * tokensPerK
        break
      }
      case "image": {
        baseCost = provider.price_per_image || 0
        break
      }
      case "video": {
        baseCost = (provider.price_per_video_min || 0) * 1 // assume 1 min preview
        break
      }
      default:
        baseCost = 0
    }
    const cost_per_unit = baseCost
    const profit_percent = provider.profit_margin_percent || 0
    const finalCharge = cost_per_unit * (1 + profit_percent / 100)

    if (finalCharge <= 0) {
      return createResponse({ error: "Pricing not configured" }, 400)
    }

    return createResponse({
      providerId: actualProviderId,
      cost_per_unit,
      profit_percent,
      finalCharge,
    })
  } catch (error) {
    return createResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500)
  }
})
