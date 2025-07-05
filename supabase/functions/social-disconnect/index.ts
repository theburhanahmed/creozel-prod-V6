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

    const { accountId } = await req.json()

    // Verify account belongs to user
    const { data: account, error: fetchError } = await supabase
      .from("oauth_connections")
      .select("*")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !account) {
      return createResponse({ error: "Account not found" }, 404)
    }

    // Revoke tokens if possible
    try {
      await revokeTokens(account)
    } catch (error) {
      console.warn("Failed to revoke tokens:", error)
      // Continue with disconnection even if token revocation fails
    }

    // Mark as inactive instead of deleting
    const { error: updateError } = await supabase
      .from("oauth_connections")
      .update({
        is_active: false,
        access_token: null,
        refresh_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId)

    if (updateError) throw updateError

    return createResponse({
      success: true,
      message: `Successfully disconnected ${account.provider} account`,
    })
  } catch (error) {
    console.error("Social disconnect error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Disconnection failed",
      },
      500,
    )
  }
})

async function revokeTokens(account: any) {
  switch (account.provider) {
    case "google":
      await fetch(`https://oauth2.googleapis.com/revoke?token=${account.access_token}`, {
        method: "POST",
      })
      break
    case "facebook":
      await fetch(
        `https://graph.facebook.com/${account.provider_user_id}/permissions?access_token=${account.access_token}`,
        { method: "DELETE" },
      )
      break
    // Add other providers as needed
  }
}
