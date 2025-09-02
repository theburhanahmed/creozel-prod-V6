import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""

serve(async (req) => {
  // Webhooks don't need CORS handling
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return createResponse({ error: "Missing stripe signature" }, 400)
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return createResponse({ error: "Invalid signature" }, 400)
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Processing webhook event:", event.type)

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return createResponse({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return createResponse({ error: "Webhook processing failed" }, 500)
  }
})

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  try {
    const { userId, creditAmount } = paymentIntent.metadata

    if (!userId || !creditAmount) {
      console.error("Missing metadata in payment intent:", paymentIntent.id)
      return
    }

    // Update transaction status
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (transactionError) {
      console.error("Failed to update transaction:", transactionError)
    }

    // Add credits to user wallet
    const { error: creditError } = await supabase
      .from("users")
      .update({
        credits: supabase.rpc("add_credits", {
          user_id: userId,
          amount: parseInt(creditAmount),
        }),
        updated_at: new Date().toISOString(),
      })

    if (creditError) {
      console.error("Failed to add credits:", creditError)
      
      // Fallback: direct SQL update
      const { error: fallbackError } = await supabase
        .rpc('update_user_credits', {
          user_id: userId,
          amount: parseInt(creditAmount)
        })

      if (fallbackError) {
        console.error("Fallback credit update also failed:", fallbackError)
      }
    }

    // Create credit transaction record
    const { error: creditTransactionError } = await supabase
      .from("credit_transactions")
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        type: "credit_purchase",
        amount: parseInt(creditAmount),
        description: `Credit purchase via Stripe - ${paymentIntent.id}`,
        metadata: {
          stripe_payment_intent_id: paymentIntent.id,
          amount_paid: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
        created_at: new Date().toISOString(),
      })

    if (creditTransactionError) {
      console.error("Failed to create credit transaction record:", creditTransactionError)
    }

    console.log(`Successfully processed payment for user ${userId}: ${creditAmount} credits added`)
  } catch (error) {
    console.error("Error handling payment success:", error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  try {
    // Update transaction status
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (transactionError) {
      console.error("Failed to update transaction status:", transactionError)
    }

    console.log(`Payment failed for intent: ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  try {
    // Update transaction status
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (transactionError) {
      console.error("Failed to update transaction status:", transactionError)
    }

    console.log(`Payment canceled for intent: ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling payment cancellation:", error)
  }
}
