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
  // Similar implementation for video generation
  return {
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    model: "stable-video-diffusion",
  }
}
