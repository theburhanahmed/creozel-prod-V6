// LinkedIn posting implementation

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

export async function postToLinkedIn({ connection, content, contentUrl, postConfig }: PostParams): Promise<PostResult> {
  try {
    console.log("Posting to LinkedIn:", { connection: connection.account_name, content: content.text })

    // Get the LinkedIn person URN
    const personUrn = connection.profile_info?.sub || connection.additional_data?.person_urn

    if (!personUrn) {
      return {
        success: false,
        error: "LinkedIn person URN not found",
      }
    }

    // LinkedIn uses different endpoints for different content types
    if (contentUrl && ["image", "video"].includes(content.content_type)) {
      // Media post flow

      // Step 1: Register upload
      const registerResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: `urn:li:person:${personUrn}`,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        }),
      })

      if (!registerResponse.ok) {
        const errorData = await registerResponse.text()
        console.error("LinkedIn upload registration failed:", errorData)
        return {
          success: false,
          error: `Failed to register upload: ${errorData}`,
        }
      }

      const uploadData = await registerResponse.json()
      const asset = uploadData.value.asset

      // For simplicity, we'll use the contentUrl directly
      // In production, you'd upload the file to LinkedIn's upload URL

      // Step 2: Create share with media
      const shareResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${personUrn}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content.content_text || "",
              },
              shareMediaCategory: content.content_type === "video" ? "VIDEO" : "IMAGE",
              media: [
                {
                  status: "READY",
                  description: {
                    text: content.content_text || "",
                  },
                  media: asset,
                  title: {
                    text: postConfig?.title || "Shared content",
                  },
                },
              ],
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": postConfig?.visibility || "PUBLIC",
          },
        }),
      })

      if (!shareResponse.ok) {
        const errorData = await shareResponse.text()
        console.error("LinkedIn share creation failed:", errorData)
        return {
          success: false,
          error: `Failed to create share: ${errorData}`,
        }
      }

      const shareData = await shareResponse.json()
      const shareId = shareData.id

      return {
        success: true,
        platform_post_id: shareId,
        platform_post_url: `https://www.linkedin.com/feed/update/${shareId}/`,
        posted_at: new Date().toISOString(),
      }
    } else {
      // Text-only post
      const shareResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${personUrn}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content.content_text || postConfig?.text || "",
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": postConfig?.visibility || "PUBLIC",
          },
        }),
      })

      if (!shareResponse.ok) {
        const errorData = await shareResponse.text()
        console.error("LinkedIn share creation failed:", errorData)
        return {
          success: false,
          error: `Failed to create share: ${errorData}`,
        }
      }

      const shareData = await shareResponse.json()
      const shareId = shareData.id

      return {
        success: true,
        platform_post_id: shareId,
        platform_post_url: `https://www.linkedin.com/feed/update/${shareId}/`,
        posted_at: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error("Error posting to LinkedIn:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post to LinkedIn",
    }
  }
}
