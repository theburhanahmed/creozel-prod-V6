import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import { validateRequest } from "../_shared/validation.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declaring Deno variable

const VALIDATION_RULES = [
  { field: "type", required: true, type: "string" as const },
  { field: "prompt", required: true, type: "string" as const, min: 1, max: 5000 },
  { field: "options", required: false, type: "object" as const },
]

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) return authResult
    const { user, supabase } = authResult

    const body = await req.json()
    const validation = validateRequest(body, VALIDATION_RULES)

    if (!validation.isValid) {
      return createResponse({ error: "Validation failed", details: validation.errors }, 400)
    }

    const { type, prompt, options = {} } = body
    const apiKey = Deno.env.get("REPLICATE_API_TOKEN")

    if (!apiKey) {
      return createResponse({ error: "Replicate API key not configured" }, 500)
    }

    let result
    let cost = 0

    switch (type) {
      case "image":
        result = await generateImage(apiKey, prompt, options)
        cost = 0.01
        break
      case "video":
        result = await generateVideo(apiKey, prompt, options)
        cost = 0.05
        break
      default:
        return createResponse({ error: `Unsupported type: ${type}` }, 400)
    }

    return createResponse({
      success: true,
      data: result,
      cost: cost,
      provider: "replicate",
      model: result.model || "unknown",
    })
  } catch (error) {
    console.error("Replicate generation error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      500,
    )
  }
})

async function generateImage(apiKey: string, prompt: string, options: any) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      input: {
        prompt: prompt,
        width: options.width || 1024,
        height: options.height || 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: options.steps || 20,
        guidance_scale: options.guidance || 7.5,
      },
    }),
  })

  const prediction = await response.json()
  if (!response.ok) throw new Error(prediction.detail || "Replicate API error")

  // Poll for completion
  let result = prediction
  while (result.status === "starting" || result.status === "processing") {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { Authorization: `Token ${apiKey}` },
    })
    result = await pollResponse.json()
  }

  if (result.status === "failed") {
    throw new Error(result.error || "Generation failed")
  }

  return {
    url: Array.isArray(result.output) ? result.output[0] : result.output,
    model: "stable-diffusion",
  }
}

async function generateVideo(apiKey: string, prompt: string, options: any) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", // Stable Video Diffusion
      input: {
        prompt: prompt,
        duration: options.duration || 3,
        width: options.width || 1024,
        height: options.height || 576,
        fps: options.fps || 6,
        motion_bucket_id: options.motion_bucket_id || 127,
        cond_aug: options.cond_aug || 0.02,
      },
    }),
  })

  const prediction = await response.json()
  if (!response.ok) throw new Error(prediction.detail || "Replicate API error")

  // Poll for completion
  let result = prediction
  while (result.status === "starting" || result.status === "processing") {
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Poll every 2 seconds
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { Authorization: `Token ${apiKey}` },
    })
    result = await pollResponse.json()
  }

  if (result.status === "failed") {
    throw new Error(result.error || "Video generation failed")
  }

  if (result.status !== "succeeded" || !result.output) {
    throw new Error("Video generation did not complete successfully")
  }

  // Upload to Supabase Storage
  const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output
  const uploadedUrl = await uploadToSupabaseStorage(videoUrl, "video")

  return {
    url: uploadedUrl,
    model: "stable-video-diffusion",
    originalUrl: videoUrl,
  }
}

async function uploadToSupabaseStorage(fileUrl: string, fileType: string): Promise<string> {
  try {
    // Download the file from the original URL
    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error("Failed to download file")

    const fileBuffer = await response.arrayBuffer()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType === "video" ? "mp4" : "png"}`
    const filePath = `generated/${fileType}s/${fileName}`

    // Create Supabase client for storage operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2")

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("media").upload(filePath, fileBuffer, {
      contentType: fileType === "video" ? "video/mp4" : "image/png",
      upsert: false,
    })

    if (error) throw new Error(`Storage upload failed: ${error.message}`)

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error uploading to Supabase Storage:", error)
    // Return original URL as fallback
    return fileUrl
  }
}
