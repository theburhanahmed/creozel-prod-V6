// Facebook posting implementation

interface PostParams {
  connection: any
  content: any
  contentUrl: string | null
  postConfig: Record<string, any>
}

interface PostResult {
  success: boolean
  platform_post_id?: string
  platform_post_url?: string
  posted_at?: string
  error?: string
}

export async function postToFacebook({ connection, content, contentUrl, postConfig }: PostParams): Promise<PostResult> {
  try {
    console.log("Posting to Facebook:", { connection: connection.account_name, content: content.text })

    // Get the page access token if posting to a page
    let accessToken = connection.access_token
    const pageId = postConfig?.pageId || "me" // Default to user's timeline

    // If posting to a page, exchange user token for page token
    if (pageId !== "me") {
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${connection.access_token}`,
      )

      if (pagesResponse.ok) {
        const { data: pages } = await pagesResponse.json()
        const targetPage = pages.find((page: any) => page.id === pageId)

        if (targetPage) {
          accessToken = targetPage.access_token
        } else {
          return {
            success: false,
            error: "Page not found or no permissions to post",
          }
        }
      }
    }

    let postId: string
    let postUrl: string

    // Handle different content types
    if (content.content_type === "image" && contentUrl) {
      // Post photo
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: contentUrl,
          message: content.content_text || "",
          access_token: accessToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Facebook API error:", errorData)
        return {
          success: false,
          error: `Facebook API error: ${response.status} - ${errorData}`,
        }
      }

      const result = await response.json()
      postId = result.id
      postUrl = `https://www.facebook.com/${postId}`
    } else if (content.content_type === "video" && contentUrl) {
      // Post video
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_url: contentUrl,
          description: content.content_text || "",
          access_token: accessToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Facebook API error:", errorData)
        return {
          success: false,
          error: `Facebook API error: ${response.status} - ${errorData}`,
        }
      }

      const result = await response.json()
      postId = result.id
      postUrl = `https://www.facebook.com/${pageId}/videos/${postId}`
    } else {
      // Text-only post
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.content_text || postConfig?.message || "",
          access_token: accessToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Facebook API error:", errorData)
        return {
          success: false,
          error: `Facebook API error: ${response.status} - ${errorData}`,
        }
      }

      const result = await response.json()
      postId = result.id

      // For feed posts, the ID format is {pageId}_{postId}
      const actualPostId = postId.split("_")[1] || postId
      postUrl =
        pageId === "me"
          ? `https://www.facebook.com/${actualPostId}`
          : `https://www.facebook.com/${pageId}/posts/${actualPostId}`
    }

    return {
      success: true,
      platform_post_id: `fb_${postId}`,
      platform_post_url: postUrl,
      posted_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error posting to Facebook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post to Facebook",
    }
  }
}
