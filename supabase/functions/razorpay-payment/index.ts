import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { hmac, sha256 } from "https://deno.land/x/hmac@v2.0.1/mod.ts"

interface RazorpayOrderRequest {
  amount: number
  currency: string
  userId: string
  creditAmount: number
  description?: string
}

interface RazorpayPaymentVerification {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  userId: string
  creditAmount: number
}

interface Transaction {
  id: string
  user_id: string
  amount: number
  currency: string
  credit_amount: number
  payment_method: string
  status: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  created_at: string
  updated_at: string
}

const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") ?? ""
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? ""

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { action, ...data } = await req.json()

    switch (action) {
      case "create_order":
        return await createRazorpayOrder(data as RazorpayOrderRequest)
      case "verify_payment":
        return await verifyRazorpayPayment(data as RazorpayPaymentVerification)
      default:
        return createResponse({ error: "Invalid action" }, 400)
    }
  } catch (error) {
    console.error("Razorpay payment error:", error)
    return createResponse({ error: "Payment processing failed" }, 500)
  }
})

async function createRazorpayOrder(request: RazorpayOrderRequest) {
  try {
    const { amount, currency, userId, creditAmount, description } = request

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

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toUpperCase(),
      receipt: `credit_purchase_${Date.now()}`,
      notes: {
        userId,
        creditAmount: creditAmount.toString(),
        description: description || `Purchase of ${creditAmount} credits`,
      },
    }

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("Razorpay order creation failed:", errorData)
      return createResponse(
        { error: "Failed to create payment order", details: errorData },
        400
      )
    }

    const order = await orderResponse.json()

    // Store transaction in database
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      user_id: userId,
      amount,
      currency,
      credit_amount: creditAmount,
      payment_method: "razorpay",
      status: "pending",
      razorpay_order_id: order.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(transaction)

    if (transactionError) {
      console.error("Failed to store transaction:", transactionError)
      // Still return the order even if transaction storage fails
    }

    return createResponse({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      transaction_id: transaction.id,
      key_id: razorpayKeyId, // Frontend needs this for payment form
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return createResponse({ error: "Order creation failed" }, 500)
  }
}

async function verifyRazorpayPayment(verification: RazorpayPaymentVerification) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, creditAmount } = verification

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !creditAmount) {
      return createResponse(
        { error: "Missing required verification fields" },
        400
      )
    }

    // Verify signature
    const expectedSignature = await generateRazorpaySignature(razorpay_order_id, razorpay_payment_id)
    
    if (razorpay_signature !== expectedSignature) {
      console.error("Invalid Razorpay signature")
      return createResponse({ error: "Invalid payment signature" }, 400)
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update transaction status
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({
        status: "completed",
        razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", userId)

    if (transactionError) {
      console.error("Failed to update transaction:", transactionError)
    }

    // Add credits to user wallet
    const { error: creditError } = await supabase
      .from("users")
      .update({
        credits: supabase.rpc("add_credits", {
          user_id: userId,
          amount: parseInt(creditAmount.toString()),
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (creditError) {
      console.error("Failed to add credits:", creditError)
      
      // Fallback: direct SQL update
      const { error: fallbackError } = await supabase
        .rpc('update_user_credits', {
          user_id: userId,
          credit_amount: parseInt(creditAmount.toString())
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
        amount: parseInt(creditAmount.toString()),
        description: `Credit purchase via Razorpay - ${razorpay_order_id}`,
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          credit_amount: creditAmount,
        },
        created_at: new Date().toISOString(),
      })

    if (creditTransactionError) {
      console.error("Failed to create credit transaction record:", creditTransactionError)
    }

    console.log(`Successfully processed Razorpay payment for user ${userId}: ${creditAmount} credits added`)

    return createResponse({
      success: true,
      message: "Payment verified successfully",
      credits_added: creditAmount,
    })
  } catch (error) {
    console.error("Razorpay payment verification error:", error)
    return createResponse({ error: "Payment verification failed" }, 500)
  }
}

async function generateRazorpaySignature(orderId: string, paymentId: string): Promise<string> {
  const text = `${orderId}|${paymentId}`
  const key = new TextEncoder().encode(razorpayKeySecret)
  const message = new TextEncoder().encode(text)
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}
