import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"

// Types
interface ScheduledJob {
  id: string
  pipeline_id: string
  user_id: string
  next_run: string
  last_run: string
  schedule_cron: string
  is_active: boolean
  retry_count: number
  max_retries: number
  created_at: string
  updated_at: string
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method === "POST") {
      // Manual job processing
      const { jobId } = await req.json()
      if (jobId) {
        const result = await processJob(jobId)
        return createResponse({
          success: true,
          jobId: jobId,
          result: result,
          message: "Job processed successfully"
        })
      }
    }

    // Automatic job processing - get all jobs due for execution
    const now = new Date()
    const { data: jobsDue, error: jobsError } = await supabase
      .from("scheduled_jobs")
      .select("*")
      .eq("is_active", true)
      .lte("next_run", now.toISOString())
      .order("next_run", { ascending: true })
      .limit(20) // Process up to 20 jobs at once

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

    // Process jobs
    const results = await Promise.all(
      jobsDue.map(async (job: ScheduledJob) => {
        try {
          const result = await processJob(job.id)
          return { success: true, jobId: job.id, result }
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error)
          return { 
            success: false, 
            jobId: job.id, 
            error: error instanceof Error ? error.message : "Unknown error" 
          }
        }
      })
    )

    const totalProcessed = results.length
    const totalSuccessful = results.filter((r) => r.success).length
    const totalFailed = results.filter((r) => !r.success).length

    return createResponse({
      success: true,
      message: "Job processing completed",
      processed: totalProcessed,
      successful: totalSuccessful,
      failed: totalFailed,
      results,
    })
  } catch (error) {
    console.error("Fatal error in job processor:", error)
    return createResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
})

async function processJob(jobId: string) {
  // Fetch job details
  const { data: job, error: jobError } = await supabase
    .from("scheduled_jobs")
    .select("*")
    .eq("id", jobId)
    .single()

  if (jobError || !job) {
    throw new Error("Scheduled job not found")
  }

  if (!job.is_active) {
    throw new Error("Job is not active")
  }

  console.log(`Processing job ${jobId} for pipeline ${job.pipeline_id}`)

  try {
    // Update job status and last run time
    await supabase
      .from("scheduled_jobs")
      .update({
        last_run: new Date().toISOString(),
        retry_count: 0, // Reset retry count on successful execution
      })
      .eq("id", jobId)

    // Invoke run-pipelines function
    const { data, error } = await supabase.functions.invoke("run-pipelines", {
      body: { pipelineId: job.pipeline_id },
    })

    if (error) {
      throw new Error(`Pipeline execution failed: ${error.message}`)
    }

    if (!data.success) {
      throw new Error(`Pipeline execution failed: ${data.error}`)
    }

    // Calculate next run time based on cron schedule
    const nextRun = calculateNextRunTime(job.schedule_cron)
    
    // Update next run time
    await supabase
      .from("scheduled_jobs")
      .update({
        next_run: nextRun.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)

    console.log(`Job ${jobId} processed successfully. Next run: ${nextRun}`)

    return {
      job_id: jobId,
      pipeline_id: job.pipeline_id,
      next_run: nextRun.toISOString(),
      result: data,
    }
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error)
    
    // Increment retry count
    const newRetryCount = job.retry_count + 1
    const isActive = newRetryCount <= job.max_retries
    
    // Update job status
    await supabase
      .from("scheduled_jobs")
      .update({
        retry_count: newRetryCount,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)

    // If max retries exceeded, deactivate the job
    if (!isActive) {
      console.warn(`Job ${jobId} deactivated after ${newRetryCount} failed attempts`)
      
      // Optionally notify the user about job deactivation
      try {
        await supabase.from("notifications").insert({
          user_id: job.user_id,
          title: "Scheduled Job Deactivated",
          message: `Job for pipeline ${job.pipeline_id} has been deactivated after ${newRetryCount} failed attempts.`,
          type: "warning",
          action_url: `/pipelines/${job.pipeline_id}`,
        })
      } catch (notificationError) {
        console.warn("Failed to create notification:", notificationError)
      }
    }

    throw error
  }
}

function calculateNextRunTime(cronExpression: string): Date {
  try {
    // Simple cron parsing for common patterns
    // In production, use a proper cron parser like cron-parser
    
    // For now, implement basic hourly scheduling
    if (cronExpression === "0 * * * *") {
      // Every hour
      return new Date(Date.now() + 60 * 60 * 1000)
    } else if (cronExpression === "0 */2 * * *") {
      // Every 2 hours
      return new Date(Date.now() + 2 * 60 * 60 * 1000)
    } else if (cronExpression === "0 */6 * * *") {
      // Every 6 hours
      return new Date(Date.now() + 6 * 60 * 60 * 1000)
    } else if (cronExpression === "0 0 * * *") {
      // Daily at midnight
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return tomorrow
    } else if (cronExpression === "0 0 * * 0") {
      // Weekly on Sunday
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()))
      nextWeek.setHours(0, 0, 0, 0)
      return nextWeek
    } else {
      // Default to hourly if pattern not recognized
      console.warn(`Unrecognized cron pattern: ${cronExpression}, defaulting to hourly`)
      return new Date(Date.now() + 60 * 60 * 1000)
    }
  } catch (error) {
    console.warn("Failed to parse cron expression, defaulting to hourly:", error)
    return new Date(Date.now() + 60 * 60 * 1000)
  }
}
