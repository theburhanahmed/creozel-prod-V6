import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { createResponse } from "./cors.ts"
import { Deno } from "https://deno.land/std@0.166.0/node/global.ts"

export async function authenticateRequest(req: Request) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseAnonKey) {
      return createResponse({ error: "Server configuration error" }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    return { user, supabase }
  } catch (error) {
    console.error("Authentication error:", error)
    return createResponse({ error: "Authentication failed" }, 401)
  }
}
