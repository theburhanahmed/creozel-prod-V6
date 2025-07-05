// Twitter/X posting implementation

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

export async function postToTwitter({ connection, content, contentUrl, postConfig }: PostParams): Promise<PostResult> {
  try {
    console.log("Posting to Twitter/X:", { connection: connection.account_name, content: content.text })

    // Prepare the tweet text
    let tweetText = content.content_text || ""

    // Handle hashtags if provided in config
    if (postConfig?.hashtags && Array.isArray(postConfig.hashtags)) {
      const hashtagsText = postConfig.hashtags.map((tag: string) => `#${tag.replace(/^#/, "")}`).join(" ")
      tweetText = `${tweetText} ${hashtagsText}`.trim()
    }

    // Check tweet length (280 characters limit)
    if (tweetText.length > 280) {
      tweetText = tweetText.substring(0, 277) + "..."
    }

    // Prepare request body
    const requestBody: any = {
      text: tweetText,
    }

    // If there's media content, we need to upload it first
    let mediaId: string | null = null
    if (contentUrl && content.content_type !== "text") {
      try {
        // Upload media to Twitter
        const mediaUploadResponse = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${connection.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            media_url: contentUrl,
            media_category: content.content_type === "video" ? "tweet_video" : "tweet_image",
          }),
        })

        if (mediaUploadResponse.ok) {
          const mediaData = await mediaUploadResponse.json()
          mediaId = mediaData.media_id_string

          // Add media to tweet
          requestBody.media = {
            media_ids: [mediaId],
          }
        } else {
          console.error("Failed to upload media to Twitter:", await mediaUploadResponse.text())
        }
      } catch (mediaError) {
        console.error("Error uploading media:", mediaError)
        // Continue without media
      }
    }

    // Post the tweet using Twitter API v2
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Twitter API error:", errorData)
      return {
        success: false,
        error: `Twitter API error: ${response.status} - ${errorData}`,
      }
    }

    const result = await response.json()
    const tweetId = result.data.id

    return {
      success: true,
      postId: tweetId,
      postUrl: `https://twitter.com/i/web/status/${tweetId}`,
      platform_post_id: `tw_${tweetId}`,
      platform_post_url: `https://twitter.com/status/${tweetId}`,
      posted_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error posting to Twitter:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post to Twitter",
    }
  }
}
