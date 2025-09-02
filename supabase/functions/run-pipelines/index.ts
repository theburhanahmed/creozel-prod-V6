import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, createResponse } from "../_shared/cors.ts"

// Types
interface Pipeline {
  id: string
  user_id: string
  name: string
  content_type: string
  ai_provider_id: string
  prompt_template: string
  prompt_variables: Record<string, any>
  generation_config: Record<string, any>
  schedule_cron: string
  next_run_at: string
  total_runs: number
  successful_runs: number
  failed_runs: number
  status: string
}

interface PipelineStep {
  id: string
  pipeline_id: string
  step_type: string
  step_order: number
  step_config: Record<string, any>
  is_active: boolean
}

interface PipelineHistory {
  id: string
  pipeline_id: string
  step_id: string
  status: string
  result: any
  error: string
  started_at: string
  completed_at: string
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method === "POST") {
      const { pipelineId } = await req.json()
      if (!pipelineId) {
        return createResponse({ error: "pipelineId required" }, 400)
      }

      // Run the specific pipeline
      const result = await runPipeline(pipelineId)
      return createResponse({
        success: true,
        pipelineId: pipelineId,
        result: result,
        message: "Pipeline execution completed"
      })
    }

    // Batch processing - get all pipelines due for execution
    const now = new Date()
    const { data: pipelinesDue, error: pipelinesError } = await supabase
      .from("pipelines")
      .select("*")
      .eq("status", "active")
      .lte("next_run_at", now.toISOString())
      .order("next_run_at", { ascending: true })
      .limit(10)

    if (pipelinesError) {
      console.error("Error fetching pipelines:", pipelinesError)
      return createResponse({ error: "Failed to fetch pipelines" }, 500)
    }

    if (!pipelinesDue || pipelinesDue.length === 0) {
      return createResponse({
        success: true,
        message: "No pipelines due for execution",
        processed: 0,
      })
    }

    console.log(`Found ${pipelinesDue.length} pipelines due for execution`)

    // Process pipelines
    const results = await Promise.all(
      pipelinesDue.map(async (pipeline: Pipeline) => {
        try {
          const result = await runPipeline(pipeline.id)
          return { success: true, pipelineId: pipeline.id, result }
        } catch (error) {
          console.error(`Error processing pipeline ${pipeline.id}:`, error)
          return { success: false, pipelineId: pipeline.id, error: error.message }
        }
      })
    )

    const totalProcessed = results.length
    const totalSuccessful = results.filter((r) => r.success).length
    const totalFailed = results.filter((r) => !r.success).length

    return createResponse({
      success: true,
      message: "Pipeline execution completed",
      processed: totalProcessed,
      successful: totalSuccessful,
      failed: totalFailed,
      results,
    })
  } catch (error) {
    console.error("Fatal error in pipeline runner:", error)
    return createResponse(
      {
        success: false,
        error: error.message,
      },
      500,
    )
  }
})

async function runPipeline(pipelineId: string) {
  // Fetch pipeline details
  const { data: pipeline, error: pipelineError } = await supabase
    .from("pipelines")
    .select("*")
    .eq("id", pipelineId)
    .single()

  if (pipelineError || !pipeline) {
    throw new Error("Pipeline not found")
  }

  // Fetch pipeline steps
  const { data: steps, error: stepsError } = await supabase
    .from("pipeline_steps")
    .select("*")
    .eq("pipeline_id", pipelineId)
    .eq("is_active", true)
    .order("step_order", { ascending: true })

  if (stepsError) {
    throw new Error(`Failed to fetch pipeline steps: ${stepsError.message}`)
  }

  if (!steps || steps.length === 0) {
    throw new Error("No active steps found for pipeline")
  }

  console.log(`Running pipeline ${pipeline.name} with ${steps.length} steps`)

  // Update pipeline status and stats
  await supabase
    .from("pipelines")
    .update({
      last_run_at: new Date().toISOString(),
      total_runs: pipeline.total_runs + 1,
    })
    .eq("id", pipelineId)

  const pipelineHistory: PipelineHistory[] = []
  let currentContentId: string | null = null

  // Execute each step in order
  for (const step of steps) {
    const stepHistory: PipelineHistory = {
      id: crypto.randomUUID(),
      pipeline_id: pipelineId,
      step_id: step.id,
      status: "running",
      result: null,
      error: null,
      started_at: new Date().toISOString(),
      completed_at: null,
    }

    try {
      console.log(`Executing step ${step.step_order}: ${step.step_type}`)
      
      let stepResult
      switch (step.step_type) {
        case "generate-content":
          stepResult = await executeGenerateContentStep(step, pipeline)
          currentContentId = stepResult.content_id
          break
          
        case "post-to-platform":
          if (!currentContentId) {
            throw new Error("No content generated for posting step")
          }
          stepResult = await executePostToPlatformStep(step, pipeline, currentContentId)
          break
          
        case "schedule-pipeline":
          stepResult = await executeSchedulePipelineStep(step, pipeline)
          break
          
        default:
          throw new Error(`Unknown step type: ${step.step_type}`)
      }

      stepHistory.status = "completed"
      stepHistory.result = stepResult
      stepHistory.completed_at = new Date().toISOString()
      
      console.log(`Step ${step.step_order} completed successfully`)
    } catch (error) {
      console.error(`Step ${step.step_order} failed:`, error)
      stepHistory.status = "failed"
      stepHistory.error = error.message
      stepHistory.completed_at = new Date().toISOString()
      
      // Record step failure
      pipelineHistory.push(stepHistory)
      
      // Update pipeline failure stats
      await supabase
        .from("pipelines")
        .update({
          failed_runs: pipeline.failed_runs + 1,
        })
        .eq("id", pipelineId)
      
      throw new Error(`Pipeline failed at step ${step.step_order}: ${error.message}`)
    }

    pipelineHistory.push(stepHistory)
  }

  // Record all step executions
  if (pipelineHistory.length > 0) {
    const { error: historyError } = await supabase
      .from("pipeline_history")
      .insert(pipelineHistory)

    if (historyError) {
      console.warn("Failed to record pipeline history:", historyError)
    }
  }

  // Update pipeline success stats and next run time
  const nextRunAt = calculateNextRunTime(pipeline.schedule_cron)
  await supabase
    .from("pipelines")
    .update({
      successful_runs: pipeline.successful_runs + 1,
      next_run_at: nextRunAt.toISOString(),
    })
    .eq("id", pipelineId)

  return {
    pipeline_id: pipelineId,
    steps_executed: steps.length,
    content_generated: currentContentId,
    next_run_at: nextRunAt.toISOString(),
  }
}

async function executeGenerateContentStep(step: PipelineStep, pipeline: Pipeline) {
  const { data, error } = await supabase.functions.invoke("generate-content", {
    body: {
      type: pipeline.content_type,
      prompt: pipeline.prompt_template,
      options: {
        ...pipeline.generation_config,
        ...step.step_config,
      },
      ai_provider_id: pipeline.ai_provider_id,
    },
  })

  if (error) {
    throw new Error(`Content generation failed: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(`Content generation failed: ${data.error}`)
  }

  return {
    content_id: data.content_id,
    content_url: data.content_url,
    content_type: pipeline.content_type,
  }
}

async function executePostToPlatformStep(step: PipelineStep, pipeline: Pipeline, contentId: string) {
  const { data, error } = await supabase.functions.invoke("post-to-platform", {
    body: {
      content_id: contentId,
      platform: step.step_config.platform,
      account_id: step.step_config.account_id,
      post_config: step.step_config.post_config || {},
    },
  })

  if (error) {
    throw new Error(`Platform posting failed: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(`Platform posting failed: ${data.error}`)
  }

  return {
    post_id: data.post_id,
    platform: step.step_config.platform,
    status: data.status,
  }
}

async function executeSchedulePipelineStep(step: PipelineStep, pipeline: Pipeline) {
  const { data, error } = await supabase.functions.invoke("schedule-pipeline", {
    body: {
      pipeline_id: pipeline.id,
      schedule_config: step.step_config,
    },
  })

  if (error) {
    throw new Error(`Pipeline scheduling failed: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(`Pipeline scheduling failed: ${data.error}`)
  }

  return {
    scheduled_at: data.scheduled_at,
    next_run_at: data.next_run_at,
  }
}

function calculateNextRunTime(cronExpression: string): Date {
  try {
    // Simple cron parsing - add 1 hour for now
    // In production, use a proper cron parser
    return new Date(Date.now() + 60 * 60 * 1000)
  } catch (error) {
    console.warn("Failed to parse cron expression, defaulting to 1 hour:", error)
    return new Date(Date.now() + 60 * 60 * 1000)
  }
}
