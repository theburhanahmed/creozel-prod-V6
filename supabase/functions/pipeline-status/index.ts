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

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const url = new URL(req.url)
    const pipelineId = url.searchParams.get("pipelineId")

    // Fetch pipelines (or single pipeline)
    let pipelineQuery = supabaseClient.from("pipelines").select("*, pipeline_targets(*)").eq("user_id", user.id)
    if (pipelineId) pipelineQuery = pipelineQuery.eq("id", pipelineId)
    const { data: pipelines, error: pipelineError } = await pipelineQuery
    if (pipelineError) {
      return new Response(JSON.stringify({ error: pipelineError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Fetch recent runs (last 10 generations per pipeline)
    let runs = []
    if (pipelineId) {
      const { data: genRuns } = await supabaseClient
        .from("generated_content")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("created_at", { ascending: false })
        .limit(10)
      runs = genRuns || []
    }

    // Fetch post statuses from posting_queue
    let posts = []
    if (pipelineId) {
      const { data: postQueue } = await supabaseClient
        .from("posting_queue")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("scheduled_for", { ascending: false })
        .limit(20)
      posts = postQueue || []
    }

    return new Response(
      JSON.stringify({ pipelines, runs, posts }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
}) 