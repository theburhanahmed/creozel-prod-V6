import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"

interface CreditRequest {
  action: "add" | "deduct" | "balance"
  amount?: number
  description?: string
  reference_id?: string
}

serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser(req.headers.get("Authorization")?.replace("Bearer ", "") ?? "")

    if (!user) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    if (req.method === "GET") {
      // Get credit balance and history
      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single()

      if (userError) {
        return createResponse({ error: userError.message }, 500)
      }

      const { data: transactions, error: transactionsError } = await supabaseClient
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (transactionsError) {
        return createResponse({ error: transactionsError.message }, 500)
      }

      return createResponse({
        balance: userData?.credits || 0,
        transactions: transactions || [],
      })
    }

    if (req.method === "POST") {
      // Add or deduct credits
      const { action, amount, description, reference_id } = await req.json()

      if (!["add", "deduct"].includes(action)) {
        return createResponse({ error: "Invalid action. Must be 'add' or 'deduct'" }, 400)
      }

      if (!amount || amount <= 0) {
        return createResponse({ error: "Amount must be a positive number" }, 400)
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
        return createResponse({ error: result.error.message }, 500)
      }

      // Get updated balance
      const { data: updatedUser } = await supabaseClient.from("users").select("credits").eq("id", user.id).single()

      return createResponse({
        success: true,
        credits: updatedUser?.credits || 0,
      })
    }

    return createResponse({ error: "Method not allowed" }, 405)
  } catch (error) {
    console.error("Function error:", error)
    return createResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500)
  }
})
