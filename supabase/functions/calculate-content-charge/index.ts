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
        .select("id")
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

    // 2. Fetch cost and profit percent
    const { data, error } = await supabaseClient.rpc("get_provider_cost_and_profit", {
      p_user_id: userId,
      p_provider_id: actualProviderId,
      p_content_type: contentType,
    })
    if (error || !data || !data[0]) {
      return new Response(JSON.stringify({ error: "Pricing info not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    const { cost_per_unit, profit_percent } = data[0]
    const finalCharge = cost_per_unit * (1 + profit_percent / 100)

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