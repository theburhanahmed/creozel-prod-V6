import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

// Create service role client for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface ScheduledJob {
  id: string
  pipeline_id: string
  user_id: string
  job_type: string
  schedule_cron: string
  next_run: string
  last_run: string | null
  is_active: boolean
  job_config: Record<string, any>
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    console.log("Job processor started")

    // Query scheduled jobs that are due for execution
    const now = new Date().toISOString()
    const { data: jobsDue, error: jobsError } = await supabase
      .from("scheduled_jobs")
      .select("*")
      .eq("is_active", true)
      .lte("next_run", now)
      .order("next_run", { ascending: true })
      .limit(50) // Process up to 50 jobs at a time

    if (jobsError) {
      console.error("Error fetching scheduled jobs:", jobsError)
      return createResponse({ error: "Failed to fetch scheduled jobs" }, 500)
    }

    if (!jobsDue || jobsDue.length === 0) {
      return createResponse({
        success: true,
        message: "No jobs due for execution",
        processed: 0,
      })
    }

    console.log(`Found ${jobsDue.length} jobs due for execution`)

    // Process each job
    const results = await Promise.allSettled(
      jobsDue.map(async (job: ScheduledJob) => {
        try {
          console.log(`Processing job ${job.id} for pipeline ${job.pipeline_id}`)

          // Record execution start in pipeline_history
          const { data: historyRecord, error: historyError } = await supabase
            .from("pipeline_history")
            .insert({
              pipeline_id: job.pipeline_id,
              user_id: job.user_id,
              status: "started",
              started_at: new Date().toISOString(),
              execution_data: {
                job_id: job.id,
                job_type: job.job_type,
                triggered_by: "scheduler",
              },
            })
            .select("id, execution_id")
            .single()

          if (historyError) {
            throw new Error(`Failed to create history record: ${historyError.message}`)
          }

          // Invoke run-pipelines function
          const { data: pipelineResult, error: pipelineError } = await supabase.functions.invoke("run-pipelines", {
            body: {
              pipelineId: job.pipeline_id,
              executionId: historyRecord.execution_id,
              triggeredBy: "scheduler",
            },
          })

          if (pipelineError) {
            throw new Error(`Pipeline execution failed: ${pipelineError.message}`)
          }

          // Calculate next run time based on cron schedule
          const nextRun = calculateNextRun(job.schedule_cron)

          // Update job with next run time and last run
          await supabase
            .from("scheduled_jobs")
            .update({
              last_run: new Date().toISOString(),
              next_run: nextRun.toISOString(),
            })
            .eq("id", job.id)

          // Update history record as completed
          await supabase
            .from("pipeline_history")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
              execution_data: {
                ...historyRecord.execution_data,
                pipeline_result: pipelineResult,
                next_scheduled_run: nextRun.toISOString(),
              },
            })
            .eq("id", historyRecord.id)

          console.log(`Successfully processed job ${job.id}. Next run: ${nextRun.toISOString()}`)

          return {
            success: true,
            jobId: job.id,
            pipelineId: job.pipeline_id,
            nextRun: nextRun.toISOString(),
          }
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error)

          // Update history record as failed
          await supabase
            .from("pipeline_history")
            .update({
              status: "failed",
              completed_at: new Date().toISOString(),
              error_message: error.message,
            })
            .eq("pipeline_id", job.pipeline_id)
            .eq("status", "started")
            .order("started_at", { ascending: false })
            .limit(1)

          // Still update next run time to prevent job from getting stuck
          const nextRun = calculateNextRun(job.schedule_cron)
          await supabase
            .from("scheduled_jobs")
            .update({
              last_run: new Date().toISOString(),
              next_run: nextRun.toISOString(),
            })
            .eq("id", job.id)

          return {
            success: false,
            jobId: job.id,
            pipelineId: job.pipeline_id,
            error: error.message,
          }
        }
      }),
    )

    // Analyze results
    const processedResults = results.map((result) =>
      result.status === "fulfilled" ? result.value : { success: false, error: result.reason },
    )

    const totalProcessed = processedResults.length
    const totalSuccessful = processedResults.filter((r) => r.success).length
    const totalFailed = processedResults.filter((r) => !r.success).length

    console.log(
      `Job processing completed. Processed: ${totalProcessed}, Successful: ${totalSuccessful}, Failed: ${totalFailed}`,
    )

    return createResponse({
      success: true,
      message: "Job processing completed",
      processed: totalProcessed,
      successful: totalSuccessful,
      failed: totalFailed,
      results: processedResults,
    })
  } catch (error) {
    console.error("Fatal error in job processor:", error)
    return createResponse(
      {
        success: false,
        error: error.message,
      },
      500,
    )
  }
})

function calculateNextRun(cronExpression: string): Date {
  try {
    // Simple cron parser for basic expressions
    // For production, consider using a proper cron library
    const parts = cronExpression.split(" ")

    if (parts.length !== 5) {
      throw new Error("Invalid cron expression")
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
    const now = new Date()
    const nextRun = new Date(now)

    // Simple hourly schedule: "0 * * * *" (every hour)
    if (minute === "0" && hour === "*") {
      nextRun.setHours(nextRun.getHours() + 1, 0, 0, 0)
      return nextRun
    }

    // Simple daily schedule: "0 9 * * *" (9 AM daily)
    if (minute === "0" && !hour.includes("*")) {
      const targetHour = Number.parseInt(hour)
      nextRun.setHours(targetHour, 0, 0, 0)

      // If time has passed today, schedule for tomorrow
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1)
      }
      return nextRun
    }

    // Default: add 1 hour
    nextRun.setHours(nextRun.getHours() + 1)
    return nextRun
  } catch (error) {
    console.error("Error parsing cron expression:", error)
    // Fallback: schedule for 1 hour from now
    const fallback = new Date()
    fallback.setHours(fallback.getHours() + 1)
    return fallback
  }
}
