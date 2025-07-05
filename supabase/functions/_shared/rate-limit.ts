import { createResponse } from "./cors.ts"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator: (req: Request) => string
}

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(req: Request, config: RateLimitConfig): Promise<Response | null> {
  const key = config.keyGenerator(req)
  const now = Date.now()

  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k)
    }
  }

  const current = rateLimitStore.get(key)

  if (!current) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return null
  }

  if (current.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return null
  }

  if (current.count >= config.maxRequests) {
    return createResponse(
      {
        error: "Rate limit exceeded",
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
      429,
    )
  }

  current.count++
  return null
}
