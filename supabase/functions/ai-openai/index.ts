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
    const apiKey = Deno.env.get("OPENAI_API_KEY")

    if (!apiKey) {
      return createResponse({ error: "OpenAI API key not configured" }, 500)
    }

    let result
    let cost = 0

    switch (type) {
      case "text":
        result = await generateText(apiKey, prompt, options)
        cost = calculateTextCost(options)
        break
      case "image":
        result = await generateImage(apiKey, prompt, options)
        cost = calculateImageCost(options)
        break
      default:
        return createResponse({ error: `Unsupported type: ${type}` }, 400)
    }

    return createResponse({
      success: true,
      data: result,
      cost: cost,
      provider: "openai",
      model: result.model || "unknown",
    })
  } catch (error) {
    console.error("OpenAI generation error:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      500,
    )
  }
})

async function generateText(apiKey: string, prompt: string, options: any) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error")

  return {
    content: data.choices[0]?.message?.content,
    model: data.model,
    usage: data.usage,
  }
}

async function generateImage(apiKey: string, prompt: string, options: any) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model || "dall-e-3",
      prompt: prompt,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      n: 1,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "OpenAI API error")

  return {
    url: data.data[0]?.url,
    model: options.model || "dall-e-3",
  }
}

function calculateTextCost(options: any): number {
  const model = options.model || "gpt-4o-mini"
  const tokens = options.maxTokens || 1000
  const costs = {
    "gpt-4o": 0.00003,
    "gpt-4o-mini": 0.000002,
    "gpt-3.5-turbo": 0.000002,
  }
  return (costs[model as keyof typeof costs] || 0.000002) * tokens
}

function calculateImageCost(options: any): number {
  const model = options.model || "dall-e-3"
  const costs = {
    "dall-e-3": 0.04,
    "dall-e-2": 0.02,
  }
  return costs[model as keyof typeof costs] || 0.04
}
