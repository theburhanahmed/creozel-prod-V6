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

    const method = req.method

    // GET: List pipelines (with targets)
    if (method === "GET") {
      const { data: pipelines, error } = await supabaseClient
        .from("pipelines")
        .select("*, pipeline_targets(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ pipelines }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // POST: Create pipeline (with targets)
    if (method === "POST") {
      const { name, content_type, ai_provider_id, prompt_template, prompt_variables, generation_config, schedule_cron, targets } = await req.json()
      if (!name || !content_type || !ai_provider_id || !prompt_template) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Insert pipeline
      const { data: pipeline, error: pipelineError } = await supabaseClient
        .from("pipelines")
        .insert({
          user_id: user.id,
          name,
          content_type,
          ai_provider_id,
          prompt_template,
          prompt_variables: prompt_variables || {},
          generation_config: generation_config || {},
          schedule_cron: schedule_cron || null,
          status: "active",
        })
        .select()
        .single()
      if (pipelineError) {
        return new Response(JSON.stringify({ error: pipelineError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Insert targets if provided
      let targetsResult = []
      if (Array.isArray(targets) && targets.length > 0) {
        const targetsToInsert = targets.map((t) => ({ ...t, pipeline_id: pipeline.id }))
        const { data: insertedTargets, error: targetsError } = await supabaseClient
          .from("pipeline_targets")
          .insert(targetsToInsert)
          .select()
        if (targetsError) {
          return new Response(JSON.stringify({ error: targetsError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
        targetsResult = insertedTargets
      }
      return new Response(JSON.stringify({ pipeline, targets: targetsResult }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // PUT: Edit pipeline (fields, targets)
    if (method === "PUT") {
      const { id, name, content_type, ai_provider_id, prompt_template, prompt_variables, generation_config, schedule_cron, status, targets } = await req.json()
      if (!id) {
        return new Response(JSON.stringify({ error: "Pipeline id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Update pipeline (only if user owns it)
      const { data: updated, error: updateError } = await supabaseClient
        .from("pipelines")
        .update({
          name,
          content_type,
          ai_provider_id,
          prompt_template,
          prompt_variables,
          generation_config,
          schedule_cron,
          status,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()
      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Update targets: remove all, then insert new if provided
      if (Array.isArray(targets)) {
        await supabaseClient.from("pipeline_targets").delete().eq("pipeline_id", id)
        if (targets.length > 0) {
          const targetsToInsert = targets.map((t) => ({ ...t, pipeline_id: id }))
          await supabaseClient.from("pipeline_targets").insert(targetsToInsert)
        }
      }
      return new Response(JSON.stringify({ pipeline: updated }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // DELETE: Remove pipeline (cascade targets, queue)
    if (method === "DELETE") {
      const { id } = await req.json()
      if (!id) {
        return new Response(JSON.stringify({ error: "Pipeline id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Only allow delete if user owns
      await supabaseClient.from("pipeline_targets").delete().eq("pipeline_id", id)
      await supabaseClient.from("posting_queue").delete().eq("pipeline_id", id)
      const { error: delError } = await supabaseClient.from("pipelines").delete().eq("id", id).eq("user_id", user.id)
      if (delError) {
        return new Response(JSON.stringify({ error: delError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
}) 