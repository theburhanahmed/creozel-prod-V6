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
        return new Response(JSON.stringify({ error: "Default provider not found for this content type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
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
      return new Response(JSON.stringify({ error: "Provider not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
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
      return new Response(JSON.stringify({ error: "Pricing not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({
        providerId: actualProviderId,
        cost_per_unit,
        profit_percent,
        finalCharge,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
}) 