import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import { validateRequest } from "../_shared/validation.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declaring Deno variable
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

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
      version: "a4a8baf88b2b9c6f65ef7422995fe48c8f0c10f4e4cf2973360604b4fc882d8b7",
      input: {
        prompt: prompt,
        duration: options.duration || 3,
        width: options.width || 1024,
        height: options.height || 576,
        fps: options.fps || 24,
        motion_bucket_id: options.motion_bucket_id || 127,
        cond_aug: options.cond_aug || 0.02,
        decoding_t: options.decoding_t || 7,
        seed: options.seed || 0,
      },
    }),
  })

  const prediction = await response.json()
  if (!response.ok) throw new Error(prediction.detail || "Replicate API error")

  console.log(`Video generation started with prediction ID: ${prediction.id}`)

  // Poll for completion
  let result = prediction
  let attempts = 0
  const maxAttempts = 300 // 5 minutes with 1-second intervals
  
  while ((result.status === "starting" || result.status === "processing") && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    attempts++
    
    try {
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { Authorization: `Token ${apiKey}` },
      })
      
      if (!pollResponse.ok) {
        console.warn(`Poll attempt ${attempts} failed: ${pollResponse.status}`)
        continue
      }
      
      result = await pollResponse.json()
      console.log(`Video generation status: ${result.status} (attempt ${attempts})`)
    } catch (error) {
      console.warn(`Poll attempt ${attempts} error:`, error)
      continue
    }
  }

  if (result.status === "failed") {
    throw new Error(result.error || "Video generation failed")
  }

  if (result.status !== "succeeded") {
    throw new Error(`Video generation timed out after ${maxAttempts} seconds. Status: ${result.status}`)
  }

  // Get the video URL from the output
  const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output
  
  if (!videoUrl) {
    throw new Error("No video URL in generation result")
  }

  // Upload to Supabase Storage
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials not available, returning direct URL")
      return {
        url: videoUrl,
        model: "stable-video-diffusion",
        storage_path: null,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Download the video
    const videoResponse = await fetch(videoUrl)
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status}`)
    }
    
    const videoBuffer = await videoResponse.arrayBuffer()
    const fileName = `videos/${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-content')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
      })
    
    if (uploadError) {
      console.warn("Failed to upload to Supabase Storage:", uploadError)
      return {
        url: videoUrl,
        model: "stable-video-diffusion",
        storage_path: null,
      }
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-content')
      .getPublicUrl(fileName)
    
    return {
      url: urlData.publicUrl,
      model: "stable-video-diffusion",
      storage_path: fileName,
    }
  } catch (storageError) {
    console.warn("Storage upload failed, returning direct URL:", storageError)
    return {
      url: videoUrl,
      model: "stable-video-diffusion",
      storage_path: null,
    }
  }
}
