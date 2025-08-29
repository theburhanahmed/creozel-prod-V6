import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declare Deno variable

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) return authResult
    const { user, supabase } = authResult

    const { platform, code, state } = await req.json()

    // Validate state parameter
    const stateData = JSON.parse(atob(state))
    if (stateData.userId !== user.id) {
      return createResponse({ error: "Invalid state parameter" }, 400)
    }

    let result
    switch (platform) {
      case "google":
        result = await connectGoogle(code, user.id, supabase)
        break
      case "facebook":
        result = await connectFacebook(code, user.id, supabase)
        break
      case "instagram":
        result = await connectInstagram(code, user.id, supabase)
        break
      case "twitter":
      case "x":
        result = await connectTwitter(code, user.id, supabase)
        break
      case "linkedin":
        result = await connectLinkedIn(code, user.id, supabase)
        break
      case "tiktok":
        result = await connectTikTok(code, user.id, supabase)
        break
      default:
        return createResponse({ error: `Unsupported platform: ${platform}` }, 400)
    }

    return createResponse({
      success: true,
      data: result,
      message: `Successfully connected ${platform} account`,
    })
  } catch (error) {
    console.error("Social connect error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed",
      },
      500,
    )
  }
})

async function connectGoogle(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID")
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/google`

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  })

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok) throw new Error(tokens.error_description || "Token exchange failed")

  // Get user info
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const userInfo = await userResponse.json()
  if (!userResponse.ok) throw new Error("Failed to get user info")

  // Store connection
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "google",
    provider_user_id: userInfo.sub,
    account_name: userInfo.name,
    account_email: userInfo.email,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scope: tokens.scope,
    is_active: true,
    additional_data: {
      picture: userInfo.picture,
      verified_email: userInfo.email_verified,
    },
  })

  if (error) throw error
  return data
}

async function connectFacebook(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("FACEBOOK_CLIENT_ID")
  const clientSecret = Deno.env.get("FACEBOOK_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/facebook`

  // Exchange code for tokens
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`,
  )

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok) throw new Error(tokens.error?.message || "Token exchange failed")

  // Get user info
  const userResponse = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`,
  )

  const userInfo = await userResponse.json()
  if (!userResponse.ok) throw new Error("Failed to get user info")

  // Store connection
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "facebook",
    provider_user_id: userInfo.id,
    account_name: userInfo.name,
    account_email: userInfo.email,
    access_token: tokens.access_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    is_active: true,
    additional_data: {
      picture: userInfo.picture?.data?.url,
    },
  })

  if (error) throw error
  return data
}

async function connectInstagram(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("INSTAGRAM_CLIENT_ID")
  const clientSecret = Deno.env.get("INSTAGRAM_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/instagram`

  // Exchange code for access token
  const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }),
  })

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok) throw new Error(tokens.error_description || "Token exchange failed")

  // Get long-lived access token
  const longLivedTokenResponse = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokens.access_token}`,
  )
  const longLivedToken = await longLivedTokenResponse.json()

  // Get user profile
  const userResponse = await fetch(
    `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken.access_token}`,
  )
  const userInfo = await userResponse.json()
  if (!userResponse.ok) throw new Error("Failed to get user info")

  // Store connection in oauth_connections table
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "instagram",
    provider_user_id: userInfo.id,
    account_name: userInfo.username,
    access_token: longLivedToken.access_token,
    token_expires_at: new Date(Date.now() + longLivedToken.expires_in * 1000).toISOString(),
    is_active: true,
    additional_data: {
      account_type: userInfo.account_type,
      media_count: userInfo.media_count,
    },
  })

  if (error) throw error
  return data
}

async function connectTwitter(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("TWITTER_CLIENT_ID")
  const clientSecret = Deno.env.get("TWITTER_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/twitter`

  // Exchange code for access token
  const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: "challenge", // In production, use proper PKCE
    }),
  })

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok) throw new Error(tokens.error_description || "Token exchange failed")

  // Get user profile
  const userResponse = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    },
  )
  const userData = await userResponse.json()
  if (!userResponse.ok) throw new Error("Failed to get user info")

  const userInfo = userData.data

  // Store connection
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "twitter",
    provider_user_id: userInfo.id,
    account_name: userInfo.username,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scope: tokens.scope,
    is_active: true,
    additional_data: {
      name: userInfo.name,
      profile_image_url: userInfo.profile_image_url,
    },
  })

  if (error) throw error
  return data
}

async function connectLinkedIn(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("LINKEDIN_CLIENT_ID")
  const clientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/linkedin`

  // Exchange code for access token
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
    }),
  })

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok) throw new Error(tokens.error_description || "Token exchange failed")

  // Get user profile
  const userResponse = await fetch(
    "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    },
  )
  const userInfo = await userResponse.json()
  if (!userResponse.ok) throw new Error("Failed to get user info")

  // Store connection
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "linkedin",
    provider_user_id: userInfo.id,
    account_name: `${userInfo.firstName.localized.en_US} ${userInfo.lastName.localized.en_US}`,
    account_email: userInfo.emailAddress,
    access_token: tokens.access_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scope: tokens.scope,
    is_active: true,
    additional_data: {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      profilePicture: userInfo.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
    },
  })

  if (error) throw error
  return data
}

async function connectTikTok(code: string, userId: string, supabase: any) {
  const clientId = Deno.env.get("TIKTOK_CLIENT_ID")
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET")
  const redirectUri = `${Deno.env.get("NEXT_PUBLIC_WEBSITE_URL")}/api/auth/callback/tiktok`

  // Exchange code for access token
  const tokenResponse = await fetch("https://open-api.tiktok.com/oauth/access_token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientId!,
      client_secret: clientSecret!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  })

  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok || tokens.data?.error_code) {
    throw new Error(tokens.data?.description || "Token exchange failed")
  }

  const accessToken = tokens.data.access_token

  // Get user profile
  const userResponse = await fetch(
    "https://open-api.tiktok.com/user/info/?fields=open_id,union_id,avatar_url,display_name",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const userData = await userResponse.json()
  if (!userResponse.ok || userData.data?.error_code) {
    throw new Error("Failed to get user info")
  }

  const userInfo = userData.data.user

  // Store connection
  const { data, error } = await supabase.from("oauth_connections").upsert({
    user_id: userId,
    provider: "tiktok",
    provider_user_id: userInfo.open_id,
    account_name: userInfo.display_name,
    access_token: accessToken,
    refresh_token: tokens.data.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.data.expires_in * 1000).toISOString(),
    scope: tokens.data.scope,
    is_active: true,
    additional_data: {
      union_id: userInfo.union_id,
      avatar_url: userInfo.avatar_url,
    },
  })

  if (error) throw error
  return data
}
