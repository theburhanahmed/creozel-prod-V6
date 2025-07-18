import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) return authResult
    const { user, supabase } = authResult

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // POST /teams - Create a new team
    if (method === "POST" && path.endsWith("/teams")) {
      const { name } = await req.json()
      if (!name) return createResponse({ error: "Team name required" }, 400)
      const { data, error } = await supabase.from("teams").insert({ name, owner_id: user.id }).select().single()
      if (error) return createResponse({ error: error.message }, 500)
      // Add creator as team member (Owner)
      await supabase.from("team_members").insert({ team_id: data.id, user_id: user.id, role: "owner", status: "active" })
      return createResponse({ team: data })
    }

    // POST /teams/invite - Invite a member
    if (method === "POST" && path.endsWith("/teams/invite")) {
      const { team_id, email, role } = await req.json()
      if (!team_id || !email) return createResponse({ error: "team_id and email required" }, 400)
      // Create a pending invite (status: pending)
      const { data, error } = await supabase.from("team_members").insert({ team_id, email, role: role || "member", status: "pending" }).select().single()
      if (error) return createResponse({ error: error.message }, 500)
      // TODO: Send invite email (out of scope for now)
      return createResponse({ invite: data })
    }

    // POST /teams/accept - Accept an invite
    if (method === "POST" && path.endsWith("/teams/accept")) {
      const { team_id } = await req.json()
      if (!team_id) return createResponse({ error: "team_id required" }, 400)
      // Update member status to active
      const { data, error } = await supabase.from("team_members").update({ user_id: user.id, status: "active" }).eq("team_id", team_id).eq("email", user.email).select().single()
      if (error) return createResponse({ error: error.message }, 500)
      return createResponse({ member: data })
    }

    // GET /teams - List teams for user
    if (method === "GET" && path.endsWith("/teams")) {
      const { data, error } = await supabase.rpc("get_user_teams", { user_id: user.id })
      if (error) return createResponse({ error: error.message }, 500)
      return createResponse({ teams: data })
    }

    // POST /teams/switch - Switch active team
    if (method === "POST" && path.endsWith("/teams/switch")) {
      const { team_id } = await req.json()
      if (!team_id) return createResponse({ error: "team_id required" }, 400)
      // Update user's active_team_id
      const { error } = await supabase.from("users").update({ active_team_id: team_id }).eq("id", user.id)
      if (error) return createResponse({ error: error.message }, 500)
      return createResponse({ success: true, active_team_id: team_id })
    }

    // PATCH /teams/member - Update member role or remove member
    if (method === "PATCH" && path.endsWith("/teams/member")) {
      const { team_id, user_id, role, remove } = await req.json()
      if (!team_id || !user_id) return createResponse({ error: "team_id and user_id required" }, 400)
      if (remove) {
        const { error } = await supabase.from("team_members").delete().eq("team_id", team_id).eq("user_id", user_id)
        if (error) return createResponse({ error: error.message }, 500)
        return createResponse({ success: true, removed: true })
      } else if (role) {
        const { data, error } = await supabase.from("team_members").update({ role }).eq("team_id", team_id).eq("user_id", user_id).select().single()
        if (error) return createResponse({ error: error.message }, 500)
        return createResponse({ member: data })
      }
      return createResponse({ error: "No action specified" }, 400)
    }

    return createResponse({ error: "Not found" }, 404)
  } catch (error) {
    return createResponse({ error: error.message }, 500)
  }
}) 