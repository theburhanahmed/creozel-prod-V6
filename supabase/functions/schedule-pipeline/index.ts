import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method !== "POST") {
      return createResponse({ error: "Method not allowed" }, 405)
    }

    // Authenticate request
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) return authResult
    const { user, supabase } = authResult

    const { pipelineId, cronExpression, action } = await req.json()

    if (!pipelineId || !cronExpression) {
      return createResponse(
        {
          error: "Missing required fields: pipelineId, cronExpression",
        },
        400,
      )
    }

    // Simple next run calculation (for demo - in production use proper cron parser)
    let nextRunAt: Date
    try {
      // For demo, just add 1 hour
      nextRunAt = new Date(Date.now() + 60 * 60 * 1000)
    } catch (error) {
      return createResponse(
        {
          error: `Invalid cron expression: ${error.message}`,
        },
        400,
      )
    }

    // Update pipeline with new schedule
    const { data, error } = await supabase
      .from("pipelines")
      .update({
        schedule_cron: cronExpression,
        next_run_at: nextRunAt.toISOString(),
        status: action === "pause" ? "paused" : "active",
      })
      .eq("id", pipelineId)
      .eq("user_id", user.id) // Ensure user owns the pipeline
      .select()
      .single()

    if (error) {
      throw error
    }

    return createResponse({
      success: true,
      pipeline: data,
      nextRunAt: nextRunAt.toISOString(),
    })
  } catch (error) {
    console.error("Error in schedule-pipeline function:", error)
    return createResponse(
      {
        error: error.message,
      },
      500,
    )
  }
})
