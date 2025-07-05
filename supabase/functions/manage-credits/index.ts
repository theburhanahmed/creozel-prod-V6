import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declare Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface CreditRequest {
  action: "add" | "deduct" | "balance"
  amount?: number
  description?: string
  reference_id?: string
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser(req.headers.get("Authorization")?.replace("Bearer ", "") ?? "")

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (req.method === "GET") {
      // Get credit balance and history
      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single()

      if (userError) {
        return new Response(JSON.stringify({ error: userError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      const { data: transactions, error: transError } = await supabaseClient
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (transError) {
        return new Response(JSON.stringify({ error: transError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      return new Response(
        JSON.stringify({
          credits: userData.credits,
          transactions,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    if (req.method === "POST") {
      // Add or deduct credits
      const { action, amount, description, reference_id } = await req.json()

      if (!["add", "deduct"].includes(action)) {
        return new Response(JSON.stringify({ error: "Invalid action. Must be 'add' or 'deduct'" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      if (!amount || amount <= 0) {
        return new Response(JSON.stringify({ error: "Amount must be a positive number" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      let result
      if (action === "add") {
        result = await supabaseClient.rpc("add_credits", {
          user_id: user.id,
          amount,
          description: description || "Credit purchase",
          reference_id,
        })
      } else {
        result = await supabaseClient.rpc("deduct_credits", {
          user_id: user.id,
          amount,
          description: description || "Credit deduction",
        })
      }

      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // Get updated balance
      const { data: updatedUser } = await supabaseClient.from("users").select("credits").eq("id", user.id).single()

      return new Response(
        JSON.stringify({
          success: true,
          credits: updatedUser?.credits || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Function error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
