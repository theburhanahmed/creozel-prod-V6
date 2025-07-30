// Supabase Edge Function: post-to-platform
// This function handles posting content to various social media platforms

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
// Deno is globally available in Edge Functions, no need to import

// Platform-specific API handlers
import { postToInstagram } from "./platforms/instagram.ts"
import { postToTwitter } from "./platforms/twitter.ts"
import { postToYouTube } from "./platforms/youtube.ts"
import { postToFacebook } from "./platforms/facebook.ts"
import { postToLinkedIn } from "./platforms/linkedin.ts"
import { postToTikTok } from "./platforms/tiktok.ts"

// Types
interface QueueItem {
  id: string
  user_id: string
  content_id: string
  platform: string
  account_id: string
  scheduled_for: string
  post_config: Record<string, any>
  status: string
  attempts: number
  max_attempts: number
}

interface OAuthConnection {
  id: string
  user_id: string
  platform: string
  account_id: string
  account_name: string
  access_token: string
  refresh_token: string | null
  token_expires_at: string | null
  scope: string | null
  additional_data: Record<string, any> | null
}

interface GeneratedContent {
  id: string
  user_id: string
  content_type: string
  storage_path: string
  content_text: string | null
  metadata: Record<string, any> | null
  created_at: string
}

// Platform posting functions map
const platformPostFunctions: Record<string, Function> = {
  instagram: postToInstagram,
  twitter: postToTwitter,
  youtube: postToYouTube,
  facebook: postToFacebook,
  linkedin: postToLinkedIn,
  tiktok: postToTikTok,
}

async function notifyUser(supabase, userId, title, message, type = "info", action_url = null) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    action_url,
  })
}

// Main handler function
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current time
    const now = new Date()

    // Parse request body if present (for manual triggers with specific queue IDs)
    let specificQueueId: string | null = null
    if (req.method === "POST") {
      try {
        const body = await req.json()
        specificQueueId = body.queueId || null
      } catch (e) {
        // No body or invalid JSON, continue with normal processing
      }
    }

    // Query for pending posts
    const { data: queueItems, error: queueError } = specificQueueId
      ? await supabase.from("posting_queue").select("*").eq("id", specificQueueId).eq("status", "pending").limit(1)
      : await supabase
          .from("posting_queue")
          .select("*")
          .eq("status", "pending")
          .lte("scheduled_for", now.toISOString())
          .order("scheduled_for", { ascending: true })
          .limit(20) // Process in batches to avoid timeouts

    if (queueError) {
      console.error("Error fetching queue items:", queueError)
      return createResponse({ error: "Failed to fetch queue items" }, 500)
    }

    if (!queueItems || queueItems.length === 0) {
      return createResponse({ message: "No pending posts to process" })
    }

    console.log(`Processing ${queueItems.length} pending posts`)

    // Process each queue item
    const results = await Promise.all(
      queueItems.map(async (item: any) => {
        try {
          // Mark as processing to prevent duplicate processing
          await supabase
            .from("posting_queue")
            .update({ status: "processing", updated_at: new Date().toISOString() })
            .eq("id", item.id)

          // --- Real posting implementation start ---
          // 1. Fetch OAuth connection for this account
          const { data: connRows, error: connErr } = await supabase
            .from<Omit<OAuthConnection, "additional_data"> & { additional_data: any }>(
              "oauth_connections",
            )
            .select("*")
            .eq("id", item.account_id)
            .limit(1)
            .maybeSingle()

          if (connErr || !connRows) {
            throw new Error(`OAuth connection not found for account_id ${item.account_id}`)
          }

          // 2. Fetch the content we need to post
          const { data: contentRow, error: contentErr } = await supabase
            .from<GeneratedContent>("generated_content")
            .select("*")
            .eq("id", item.content_id)
            .limit(1)
            .maybeSingle()

          if (contentErr || !contentRow) {
            throw new Error(`Content not found for content_id ${item.content_id}`)
          }

          // Generate a public URL if media exists
          let contentUrl: string | null = null
          if (contentRow.storage_path) {
            const { data: pub } = supabase.storage
              .from("generated")
              .getPublicUrl(contentRow.storage_path)
            contentUrl = pub.publicUrl || null
          }

          // 3. Get platform poster function
          const poster = platformPostFunctions[item.platform]
          if (!poster) {
            throw new Error(`Platform '${item.platform}' is not supported`)
          }

          // 4. Call poster
          const postResult: any = await poster({
            connection: connRows,
            content: contentRow,
            contentUrl,
            postConfig: item.post_config || {},
          })

          if (!postResult.success) {
            throw new Error(postResult.error || "Unknown error from poster")
          }

          // 5. Update queue row with success result
          await supabase
            .from("posting_queue")
            .update({
              status: "posted",
              updated_at: new Date().toISOString(),
              platform_post_id: postResult.platform_post_id || postResult.postId,
              platform_post_url: postResult.platform_post_url || postResult.postUrl,
              posted_at: postResult.posted_at || new Date().toISOString(),
            })
            .eq("id", item.id)

          // Notify user
          await notifyUser(
            supabase,
            item.user_id,
            `Post Success: ${item.platform}`,
            `Content posted successfully to ${item.platform}.`,
            "success",
            postResult.postUrl || null,
          )
          // --- Real posting implementation end ---

          await notifyUser(
            supabase,
            item.user_id,
            `Post Success: ${item.platform}`,
            `Content posted successfully to ${item.platform}.`,
            "success"
          )
          return { id: item.id, success: true, platform: item.platform }
        } catch (error) {
          console.error(`Error processing queue item ${item.id}:`, error)
          await supabase
            .from("posting_queue")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", item.id)
          await notifyUser(
            supabase,
            item.user_id,
            `Post Failed: ${item.platform}`,
            `Failed to post content to ${item.platform}: ${error.message}`,
            "error"
          )
          return { id: item.id, success: false, error: error.message }
        }
      }),
    )

    return createResponse({
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (error) {
    console.error("Unexpected error in post-to-platform function:", error)
    return createResponse({ error: error.message }, 500)
  }
})
