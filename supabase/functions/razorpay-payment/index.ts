import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Helper to verify Razorpay webhook signature
function verifyRazorpaySignature(body: string, signature: string, secret: string) {
  const encoder = new TextEncoder()
  const key = encoder.encode(secret)
  const data = encoder.encode(body)
  // Deno does not have crypto.createHmac, so use subtle API
  return crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  ).then(importedKey =>
    crypto.subtle.sign("HMAC", importedKey, data)
  ).then(signatureBuffer => {
    const expected = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
    return expected === signature
  })
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Razorpay webhook endpoint
  if (req.method === "POST" && new URL(req.url).pathname.endsWith("/webhook")) {
    try {
      const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")
      if (!webhookSecret) {
        return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      const rawBody = await req.text()
      const signature = req.headers.get("x-razorpay-signature") || ""
      // Verify signature
      const valid = await verifyRazorpaySignature(rawBody, signature, webhookSecret)
      if (!valid) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      const event = JSON.parse(rawBody)
      if (event.event === "payment.captured" && event.payload && event.payload.payment) {
        const payment = event.payload.payment.entity
        const userId = payment.notes?.user_id
        const amount = payment.amount
        if (!userId || !amount) {
          return new Response(JSON.stringify({ error: "Missing user_id or amount in payment notes" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
        // Credit the user's wallet
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        )
        // Add credits and record transaction
        const { error: creditError } = await supabaseClient.rpc("add_credits", {
          user_id: userId,
          amount: Math.floor(amount / 100), // Convert paise to credits (₹1 = 1 credit)
          description: `Razorpay payment: ${payment.id}`,
          reference_id: payment.id,
        })
        if (creditError) {
          return new Response(JSON.stringify({ error: creditError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Ignore other events
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message || "Webhook error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
  }

  try {
    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    )
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Parse request
    const { amount, currency = "INR" } = await req.json()
    if (!amount || amount < 100) {
      return new Response(JSON.stringify({ error: "Amount must be at least 100 paise (₹1)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Prepare Razorpay order
    const keyId = Deno.env.get("RAZORPAY_KEY_ID")
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Razorpay keys not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Create order via Razorpay API
    const orderPayload = {
      amount: Math.round(amount), // in paise
      currency,
      receipt: `user_${user.id}_${Date.now()}`,
      payment_capture: 1,
      notes: { user_id: user.id },
    }
    const auth = btoa(`${keyId}:${keySecret}`)
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    })
    const data = await response.json()
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.description || "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Return order details
    return new Response(JSON.stringify({ order: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
}) 