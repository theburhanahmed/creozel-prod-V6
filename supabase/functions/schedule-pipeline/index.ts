import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { authenticateRequest } from "../_shared/auth.ts"
import Cron from "https://deno.land/x/croner@7.0.4/dist/croner.js"

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

    // Parse cron expression for next run (Deno-native)
    let nextRunAt: Date
    try {
      const cron = new Cron(cronExpression)
      const next = cron.next()
      if (!next) throw new Error("Could not determine next run date from cron expression")
      nextRunAt = next
    } catch (error) {
      return createResponse(
        {
          error: `Invalid cron expression: ${error.message}`,
        },
        400,
      )
    }

    // Determine new status
    let newStatus = "active"
    if (action === "pause") newStatus = "paused"
    if (action === "resume") newStatus = "active"

    // Update pipeline with new schedule and status
    const { data, error } = await supabase
      .from("pipelines")
      .update({
        schedule_cron: cronExpression,
        next_run_at: nextRunAt.toISOString(),
        status: newStatus,
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
      status: newStatus,
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
