// Instagram posting implementation

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

export async function postToInstagram({
  connection,
  content,
  contentUrl,
  postConfig,
}: PostParams): Promise<PostResult> {
  try {
    console.log("Posting to Instagram:", { connection: connection.account_name, content: content.text })

    // Instagram requires business or creator accounts and Facebook Page connection
    const instagramBusinessAccountId =
      connection.additional_data?.instagram_business_account_id ||
      connection.profile_info?.instagram_business_account?.id

    if (!instagramBusinessAccountId) {
      return {
        success: false,
        error:
          "Instagram Business Account ID not found. Please ensure your Instagram account is connected to a Facebook Page.",
      }
    }

    // Instagram API only supports image and video posts
    if (!contentUrl || !["image", "video"].includes(content.content_type)) {
      return {
        success: false,
        error: "Instagram requires image or video content",
      }
    }

    let mediaId = ""

    // Step 1: Create media container
    if (content.content_type === "image") {
      // Create image container
      const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: contentUrl,
          caption: content.content_text || postConfig?.caption || "",
          access_token: connection.access_token,
        }),
      })

      if (!containerResponse.ok) {
        const errorData = await containerResponse.text()
        console.error("Instagram container creation failed:", errorData)
        return {
          success: false,
          error: `Failed to create media container: ${errorData}`,
        }
      }

      const containerData = await containerResponse.json()
      mediaId = containerData.id
    } else if (content.content_type === "video") {
      // Create video container
      const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: contentUrl,
          caption: content.content_text || postConfig?.caption || "",
          media_type: "VIDEO",
          access_token: connection.access_token,
        }),
      })

      if (!containerResponse.ok) {
        const errorData = await containerResponse.text()
        console.error("Instagram container creation failed:", errorData)
        return {
          success: false,
          error: `Failed to create media container: ${errorData}`,
        }
      }

      const containerData = await containerResponse.json()
      mediaId = containerData.id

      // For videos, we need to wait for processing
      let processingComplete = false
      let attempts = 0
      const maxAttempts = 30 // 30 seconds timeout

      while (!processingComplete && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second

        const statusResponse = await fetch(
          `https://graph.facebook.com/v18.0/${mediaId}?fields=status_code&access_token=${connection.access_token}`,
        )

        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.status_code === "FINISHED") {
            processingComplete = true
          } else if (statusData.status_code === "ERROR") {
            return {
              success: false,
              error: "Video processing failed",
            }
          }
        }

        attempts++
      }

      if (!processingComplete) {
        return {
          success: false,
          error: "Video processing timeout",
        }
      }
    }

    // Step 2: Publish the media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: mediaId,
          access_token: connection.access_token,
        }),
      },
    )

    if (!publishResponse.ok) {
      const errorData = await publishResponse.text()
      console.error("Instagram publish failed:", errorData)
      return {
        success: false,
        error: `Failed to publish media: ${errorData}`,
      }
    }

    const publishData = await publishResponse.json()
    const postId = publishData.id

    // Get the Instagram username for the URL
    const username = connection.profile_info?.username || connection.account_name

    return {
      success: true,
      postId: postId,
      postUrl: username ? `https://www.instagram.com/p/${postId}/` : `https://www.instagram.com/`,
      platform_post_id: `ig_${Date.now()}`,
      platform_post_url: `https://instagram.com/p/${Date.now()}`,
      posted_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error posting to Instagram:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post to Instagram",
    }
  }
}
