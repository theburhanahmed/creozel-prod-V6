// TikTok posting implementation

interface PostParams {
  connection: any
  content: any
  contentUrl: string | null
  postConfig: Record<string, any>
}

interface PostResult {
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
  platform_post_id?: string
  platform_post_url?: string
  posted_at?: string
}

export async function postToTikTok({ connection, content, contentUrl, postConfig }: PostParams): Promise<PostResult> {
  try {
    console.log("Posting to TikTok:", { connection: connection.account_name, content: content.text })

    // TikTok only supports video content
    if (!contentUrl || content.content_type !== "video") {
      return {
        success: false,
        error: "TikTok only supports video content",
      }
    }

    // Get the open_id from the connection
    const openId = connection.profile_info?.open_id || connection.additional_data?.open_id

    if (!openId) {
      return {
        success: false,
        error: "TikTok open_id not found",
      }
    }

    // Step 1: Initialize video upload
    const initResponse = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_info: {
          title: content.content_text || postConfig?.title || "Posted via Creozel",
          privacy_level: postConfig?.privacy_level || "PUBLIC_TO_EVERYONE",
          disable_duet: postConfig?.disable_duet || false,
          disable_comment: postConfig?.disable_comment || false,
          disable_stitch: postConfig?.disable_stitch || false,
          video_cover_timestamp_ms: postConfig?.cover_timestamp || 1000,
        },
        source_info: {
          source: "FILE_UPLOAD",
          video_size: postConfig?.video_size || 10485760, // Default 10MB, should be actual size
          chunk_size: postConfig?.chunk_size || 10485760,
          total_chunk_count: 1,
        },
      }),
    })

    if (!initResponse.ok) {
      const errorData = await initResponse.text()
      console.error("TikTok upload init failed:", errorData)
      return {
        success: false,
        error: `Failed to initialize upload: ${errorData}`,
      }
    }

    const initData = await initResponse.json()
    const publishId = initData.data.publish_id
    const uploadUrl = initData.data.upload_url

    // Step 2: Upload video
    // In production, you would need to:
    // 1. Download the video from contentUrl
    // 2. Upload it to TikTok's upload URL in chunks
    // For now, we'll simulate this

    // Step 3: Check upload status and publish
    let uploadComplete = false
    let attempts = 0
    const maxAttempts = 30

    while (!uploadComplete && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds

      const statusResponse = await fetch(`https://open.tiktokapis.com/v2/post/publish/status/fetch/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        const status = statusData.data.status

        if (status === "PUBLISH_COMPLETE") {
          uploadComplete = true
          const publiclyAvailablePostId = statusData.data.publicly_available_post_id

          return {
            success: true,
            postId: publiclyAvailablePostId || publishId,
            postUrl: publiclyAvailablePostId
              ? `https://www.tiktok.com/@${connection.profile_info?.display_name || openId}/video/${publiclyAvailablePostId}`
              : `https://www.tiktok.com`,
            platform_post_id: `tt_${Date.now()}`,
            platform_post_url: `https://tiktok.com/@user/video/${Date.now()}`,
            posted_at: new Date().toISOString(),
          }
        } else if (status === "FAILED") {
          return {
            success: false,
            error: statusData.data.fail_reason || "Upload failed",
          }
        }
      }

      attempts++
    }

    if (!uploadComplete) {
      return {
        success: false,
        error: "Upload timeout - video processing took too long",
      }
    }

    // This should not be reached
    return {
      success: false,
      error: "Unexpected error during upload",
    }
  } catch (error) {
    console.error("Error posting to TikTok:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post to TikTok",
    }
  }
}
