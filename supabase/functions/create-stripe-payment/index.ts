import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
})

interface PaymentRequest {
  amount: number
  currency: string
  userId: string
  creditAmount: number
  description?: string
}

interface Transaction {
  id: string
  user_id: string
  amount: number
  currency: string
  credit_amount: number
  payment_method: string
  status: string
  stripe_payment_intent_id?: string
  razorpay_order_id?: string
  created_at: string
  updated_at: string
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { amount, currency, userId, creditAmount, description }: PaymentRequest = await req.json()

    // Validate input
    if (!amount || !currency || !userId || !creditAmount) {
      return createResponse(
        { error: "Missing required fields: amount, currency, userId, creditAmount" },
        400
      )
    }

    if (amount <= 0 || creditAmount <= 0) {
      return createResponse(
        { error: "Amount and credit amount must be greater than 0" },
        400
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return createResponse({ error: "User not found" }, 404)
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        creditAmount: creditAmount.toString(),
        description: description || `Purchase of ${creditAmount} credits`,
      },
      description: description || `Purchase of ${creditAmount} credits`,
      receipt_email: user.email,
    })

    // Store transaction in database
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      user_id: userId,
      amount,
      currency,
      credit_amount: creditAmount,
      payment_method: "stripe",
      status: "pending",
      stripe_payment_intent_id: paymentIntent.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(transaction)

    if (transactionError) {
      console.error("Failed to store transaction:", transactionError)
      // Still return the payment intent even if transaction storage fails
      // The webhook will handle the transaction creation if needed
    }

    return createResponse({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      transaction_id: transaction.id,
    })
  } catch (error: unknown) {
    console.error("Stripe payment creation error:", error)
    
    if (error && typeof error === 'object' && 'message' in error && 'code' in error) {
      return createResponse(
        { 
          error: "Payment creation failed", 
          details: (error as any).message,
          code: (error as any).code 
        },
        400
      )
    }

    return createResponse(
      { error: "Internal server error" },
      500
    )
  }
})
