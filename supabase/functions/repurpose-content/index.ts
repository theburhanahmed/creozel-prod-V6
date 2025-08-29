import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
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

    const { original_id, target_type, options = {} } = await req.json()
    if (!original_id || !target_type) {
      return new Response(JSON.stringify({ error: "original_id and target_type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Fetch original content
    const { data: original, error: origError } = await supabaseClient
      .from("content_generations")
      .select("*")
      .eq("id", original_id)
      .eq("user_id", user.id)
      .single()
    if (origError || !original) {
      return new Response(JSON.stringify({ error: "Original content not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Calculate credits needed for repurposing
    let creditsNeeded = 2 // Default for repurpose
    switch (target_type) {
      case "text":
        creditsNeeded = 1
        break
      case "image":
        creditsNeeded = 5
        break
      case "video":
        creditsNeeded = 20
        break
      case "audio":
        creditsNeeded = 3
        break
    }
    // Check user credits
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()
    if (userError || !userData || userData.credits < creditsNeeded) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Prepare repurpose prompt
    let repurposePrompt = ""
    switch (target_type) {
      case "text":
        repurposePrompt = `Repurpose the following content for a blog post.\n\n${original.result?.text || original.prompt}`
        break
      case "image":
        repurposePrompt = `Create a social media image concept based on the following content.\n\n${original.result?.text || original.prompt}`
        break
      case "video":
        repurposePrompt = `Create a short video script or storyboard based on the following content.\n\n${original.result?.text || original.prompt}`
        break
      case "audio":
        repurposePrompt = `Create a podcast/audio script based on the following content.\n\n${original.result?.text || original.prompt}`
        break
      default:
        return new Response(JSON.stringify({ error: "Unsupported target_type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }

    // Call OpenAI for repurposing (text-based adaptation)
    let repurposedResult = null
    let error_message = null
    try {
      if (["text", "image", "video", "audio"].includes(target_type)) {
        repurposedResult = await generateText(repurposePrompt, options)
      } else {
        throw new Error("Unsupported repurpose type")
      }
    } catch (error) {
      error_message = error.message
    }

    // Record new generation
    const { data: newGen, error: newGenError } = await supabaseClient
      .from("content_generations")
      .insert({
        user_id: user.id,
        type: target_type,
        prompt: repurposePrompt,
        result: repurposedResult,
        credits_used: creditsNeeded,
        status: error_message ? "failed" : "completed",
        provider: "openai",
        model: options.model || "gpt-3.5-turbo",
        error_message,
        original_id,
      })
      .select()
      .single()
    if (newGenError) {
      return new Response(JSON.stringify({ error: "Failed to record repurposed content" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Deduct credits
    const { error: deductError } = await supabaseClient.rpc("deduct_credits", {
      user_id: user.id,
      amount: creditsNeeded,
      description: `Repurpose to ${target_type}`,
    })
    if (deductError) {
      return new Response(JSON.stringify({ error: "Failed to deduct credits" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({
        id: newGen.id,
        result: repurposedResult,
        status: error_message ? "failed" : "completed",
        error_message,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

async function generateText(prompt: string, options: any) {
  const openaiKey = Deno.env.get("OPENAI_API_KEY")
  if (!openaiKey) throw new Error("OpenAI API key not configured")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.maxTokens || 100,
      temperature: options.temperature || 0.7,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error")

  return {
    text: data.choices[0]?.message?.content || "",
    usage: data.usage,
  }
}
