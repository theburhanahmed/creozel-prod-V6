import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import { validateRequest } from "../_shared/validation.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declare Deno variable

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
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY")

    if (!apiKey) {
      return createResponse({ error: "ElevenLabs API key not configured" }, 500)
    }

    if (type !== "audio") {
      return createResponse({ error: `Unsupported type: ${type}` }, 400)
    }

    const result = await generateAudio(apiKey, prompt, options)
    const cost = calculateAudioCost(prompt)

    return createResponse({
      success: true,
      data: result,
      cost: cost,
      provider: "elevenlabs",
      model: result.model || "unknown",
    })
  } catch (error) {
    console.error("ElevenLabs generation error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      500,
    )
  }
})

async function generateAudio(apiKey: string, text: string, options: any) {
  const voiceId = options.voiceId || "pNInz6obpgDQGcFmaJgB"

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      model_id: options.model || "eleven_monolingual_v1",
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarityBoost || 0.5,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail?.message || "ElevenLabs API error")
  }

  const audioBuffer = await response.arrayBuffer()
  const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

  return {
    url: `data:audio/mpeg;base64,${audioBase64}`,
    model: options.model || "eleven_monolingual_v1",
  }
}

function calculateAudioCost(text: string): number {
  const charactersPerCredit = 1000
  const characters = text.length
  return Math.ceil(characters / charactersPerCredit) * 0.024
}
