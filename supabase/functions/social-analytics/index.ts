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

    const { platform, accountId, dateRange } = await req.json()

    // Get account details
    const { data: account, error: accountError } = await supabase
      .from("oauth_connections")
      .select("*")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (accountError || !account) {
      return createResponse({ error: "Account not found or inactive" }, 404)
    }

    let analytics
    switch (platform) {
      case "google":
        analytics = await getGoogleAnalytics(account, dateRange)
        break
      case "facebook":
        analytics = await getFacebookAnalytics(account, dateRange)
        break
      case "instagram":
        analytics = await getInstagramAnalytics(account, dateRange)
        break
      case "twitter":
      case "x":
        analytics = await getTwitterAnalytics(account, dateRange)
        break
      case "linkedin":
        analytics = await getLinkedInAnalytics(account, dateRange)
        break
      case "tiktok":
        analytics = await getTikTokAnalytics(account, dateRange)
        break
      default:
        return createResponse({ error: `Unsupported platform: ${platform}` }, 400)
    }

    // Store analytics data
    await supabase.from("social_analytics").upsert({
      user_id: user.id,
      account_id: accountId,
      platform: platform,
      data: analytics,
      date_range: dateRange,
      retrieved_at: new Date().toISOString(),
    })

    return createResponse({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Social analytics error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analytics retrieval failed",
      },
      500,
    )
  }
})

async function getGoogleAnalytics(account: any, dateRange: any) {
  // YouTube Analytics API integration
  const response = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${account.provider_user_id}&startDate=${dateRange.start}&endDate=${dateRange.end}&metrics=views,likes,comments,shares`,
    {
      headers: { Authorization: `Bearer ${account.access_token}` },
    },
  )

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "YouTube Analytics API error")

  return {
    views: data.rows?.[0]?.[0] || 0,
    likes: data.rows?.[0]?.[1] || 0,
    comments: data.rows?.[0]?.[2] || 0,
    shares: data.rows?.[0]?.[3] || 0,
  }
}

async function getFacebookAnalytics(account: any, dateRange: any) {
  // Facebook Graph API integration
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${account.provider_user_id}/insights?metric=page_views,page_likes,page_engaged_users&since=${dateRange.start}&until=${dateRange.end}&access_token=${account.access_token}`,
  )

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "Facebook API error")

  return {
    views: data.data?.find((d: any) => d.name === "page_views")?.values?.[0]?.value || 0,
    likes: data.data?.find((d: any) => d.name === "page_likes")?.values?.[0]?.value || 0,
    engagement: data.data?.find((d: any) => d.name === "page_engaged_users")?.values?.[0]?.value || 0,
  }
}

// Similar implementations for other platforms...
async function getInstagramAnalytics(account: any, dateRange: any) {
  return { views: 0, likes: 0, comments: 0, shares: 0 }
}

async function getTwitterAnalytics(account: any, dateRange: any) {
  return { views: 0, likes: 0, comments: 0, shares: 0 }
}

async function getLinkedInAnalytics(account: any, dateRange: any) {
  return { views: 0, likes: 0, comments: 0, shares: 0 }
}

async function getTikTokAnalytics(account: any, dateRange: any) {
  return { views: 0, likes: 0, comments: 0, shares: 0 }
}
