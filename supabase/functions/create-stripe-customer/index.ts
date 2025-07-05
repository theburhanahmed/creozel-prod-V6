import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14.21.0"
// Deno is globally available in Edge Functions, no need to import

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    // Get request body
    const { userId, email, name } = await req.json()

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: "User ID and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    console.log(`Creating Stripe customer for user: ${userId}, email: ${email}`)

    // Check if user already has a Stripe customer ID
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from("users_table")
      .select("stripe_id")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching user:", fetchError)
      return new Response(JSON.stringify({ error: "Failed to fetch user data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // If user already has a Stripe customer ID, return it
    if (existingUser?.stripe_id) {
      console.log(`User already has Stripe customer ID: ${existingUser.stripe_id}`)
      return new Response(
        JSON.stringify({
          success: true,
          customerId: existingUser.stripe_id,
          message: "Customer already exists",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      name: name || "",
      metadata: {
        supabase_user_id: userId,
      },
    })

    console.log(`Created Stripe customer: ${customer.id}`)

    // Update user record with Stripe customer ID
    const { error: updateError } = await supabaseClient
      .from("users_table")
      .update({ stripe_id: customer.id })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating user with Stripe customer ID:", updateError)

      // Try to delete the Stripe customer if database update fails
      try {
        await stripe.customers.del(customer.id)
        console.log(`Deleted Stripe customer ${customer.id} due to database update failure`)
      } catch (deleteError) {
        console.error("Failed to delete Stripe customer after database error:", deleteError)
      }

      return new Response(JSON.stringify({ error: "Failed to update user with Stripe customer ID" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    console.log(`Successfully linked Stripe customer ${customer.id} to user ${userId}`)

    return new Response(
      JSON.stringify({
        success: true,
        customerId: customer.id,
        message: "Stripe customer created and linked successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error in create-stripe-customer function:", error)

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})
