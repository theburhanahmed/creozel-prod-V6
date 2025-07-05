import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import { validateRequest } from "../_shared/validation.ts"
import { rateLimit } from "../_shared/rate-limit.ts"

interface DeductCreditsRequest {
  userId: string
  generationCost: number
  generationType: string
  generationMetadata?: any
}

const VALIDATION_RULES = [
  { field: "userId", required: true, type: "string" as const },
  { field: "generationCost", required: true, type: "number" as const, min: 0.1, max: 1000 },
  { field: "generationType", required: true, type: "string" as const, min: 1, max: 50 },
]

const RATE_LIMIT_CONFIG = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyGenerator: (req: Request) => {
    const auth = req.headers.get("Authorization")
    return auth ? `deduct-credits:${auth.slice(-10)}` : "anonymous"
  },
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  // Rate limiting
  const rateLimitResponse = await rateLimit(req, RATE_LIMIT_CONFIG)
  if (rateLimitResponse) return rateLimitResponse

  try {
    // Authenticate request
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) return authResult
    const { user, supabase } = authResult

    // Parse and validate request body
    const body: DeductCreditsRequest = await req.json()
    const validation = validateRequest(body, VALIDATION_RULES)

    if (!validation.isValid) {
      return createResponse(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        400,
      )
    }

    const { userId, generationCost, generationType, generationMetadata } = body

    // Security check: ensure user can only deduct credits for themselves
    if (user.id !== userId) {
      console.error(`Security violation: User ${user.id} attempted to deduct credits for user ${userId}`)
      return createResponse(
        {
          error: "Forbidden: Cannot deduct credits for another user",
        },
        403,
      )
    }

    console.log(`Deducting ${generationCost} credits for user ${userId} for ${generationType}`)

    // Call the atomic deduction function
    const { data, error } = await supabase.rpc("deduct_credits_for_generation", {
      p_user_id: userId,
      p_generation_cost: generationCost,
      p_generation_type: generationType,
      p_generation_metadata: generationMetadata || {},
    })

    if (error) {
      console.error("Database error during credit deduction:", error)
      return createResponse(
        {
          error: "Database error during credit deduction",
          details: error.message,
        },
        500,
      )
    }

    // Check if deduction was successful
    if (!data?.success) {
      console.log(`Credit deduction failed for user ${userId}: ${data?.message}`)
      return createResponse(
        {
          success: false,
          message: data?.message || "Credit deduction failed",
          currentBalance: data?.current_balance,
          requiredCredits: data?.required_credits,
        },
        400,
      )
    }

    console.log(`Successfully deducted ${generationCost} credits for user ${userId}. New balance: ${data.new_balance}`)

    return createResponse({
      success: true,
      message: data.message,
      newBalance: data.new_balance,
      generationId: data.generation_id,
    })
  } catch (error) {
    console.error("Unexpected error in deduct-credits function:", error)
    return createResponse(
      {
        error: "Internal server error",
        details: error.message,
      },
      500,
    )
  }
})
