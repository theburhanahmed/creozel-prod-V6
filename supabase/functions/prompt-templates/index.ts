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

    const url = new URL(req.url)
    const method = req.method

    // GET: List or fetch templates
    if (method === "GET") {
      const type = url.searchParams.get("type")
      const platform = url.searchParams.get("platform")
      let query = supabaseClient.from("prompt_templates").select("*")
      if (type) query = query.eq("type", type)
      if (platform) query = query.eq("platform", platform)
      // Show global and user-owned templates
      query = query.or(`owner_id.is.null,owner_id.eq.${user.id}`)
      const { data, error } = await query
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ templates: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // POST: Create new template
    if (method === "POST") {
      const { name, type, platform, template } = await req.json()
      if (!name || !type || !platform || !template) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      const { data, error } = await supabaseClient.from("prompt_templates").insert({
        name,
        type,
        platform,
        template,
        owner_id: user.id,
      }).select().single()
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ template: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // PUT: Update template (must own)
    if (method === "PUT") {
      const { id, name, type, platform, template } = await req.json()
      if (!id) {
        return new Response(JSON.stringify({ error: "Template id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      // Only allow update if user owns the template
      const { data: existing, error: fetchError } = await supabaseClient.from("prompt_templates").select("*").eq("id", id).single()
      if (fetchError || !existing || (existing.owner_id && existing.owner_id !== user.id)) {
        return new Response(JSON.stringify({ error: "Not found or not authorized" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      const { data, error } = await supabaseClient.from("prompt_templates").update({
        name,
        type,
        platform,
        template,
      }).eq("id", id).select().single()
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({ template: data }), {
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