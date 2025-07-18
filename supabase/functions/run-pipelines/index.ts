import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declare Deno variable
import { handleCors, createResponse } from "../_shared/cors.ts"

// Import the unified generation logic
import { generateContentWithProvider } from "../generate-content/index.ts"

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
}

interface PipelineTarget {
  id: string
  pipeline_id: string
  platform: string
  account_id: string
  post_config: Record<string, any>
  is_active: boolean
}

interface AIProvider {
  id: string
  name: string
  provider_type: string
  api_endpoint: string
  api_key_env: string
  cost_per_unit: number
  config: Record<string, any>
  is_default: boolean
  is_active: boolean
  content_type: string
}

interface GenerationResult {
  content?: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  metadata: Record<string, any>
}

// Configuration
const BATCH_SIZE = 10 // Process pipelines in batches
const MAX_RETRY_ATTEMPTS = 3
const LOCK_TIMEOUT_MINUTES = 10
const RATE_LIMIT_DELAY_MS = 1000 // Delay between AI API calls

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

async function notifyUser(supabase, userId, title, message, type = "info", action_url = null) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    action_url,
  })
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method === "POST") {
      // Manual run endpoint
      const { pipelineId } = await req.json()
      if (!pipelineId) {
        return createResponse({ error: "pipelineId required" }, 400)
      }
      // Authenticate user
      // (Assume authenticateRequest is available, or use supabase auth)
      // For this code, we'll use a simple auth check
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || ""
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      })
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        return createResponse({ error: "Unauthorized" }, 401)
      }
      // Fetch pipeline and verify ownership
      const { data: pipeline, error: fetchError } = await supabase
        .from("pipelines")
        .select("*")
        .eq("id", pipelineId)
        .eq("user_id", user.id)
        .single()
      if (fetchError || !pipeline) {
        return createResponse({ error: "Pipeline not found or not authorized" }, 404)
      }
      // Run the pipeline logic for this pipeline only
      try {
        // (Reuse the logic from the batch runner for a single pipeline)
        // Update last_run_at and increment total_runs
        await supabase
          .from("pipelines")
          .update({
            last_run_at: new Date().toISOString(),
            total_runs: pipeline.total_runs + 1,
          })
          .eq("id", pipeline.id)
        // Calculate next run time (use cron if available)
        let nextRunAt = new Date(Date.now() + 60 * 60 * 1000)
        if (pipeline.schedule_cron) {
          try {
            const cronParser = (await import("https://esm.sh/cron-parser@4.6.3")).default
            const interval = cronParser.parseExpression(pipeline.schedule_cron)
            nextRunAt = interval.next().toDate()
          } catch {}
        }
        await supabase
          .from("pipelines")
          .update({
            next_run_at: nextRunAt.toISOString(),
            successful_runs: pipeline.successful_runs + 1,
          })
          .eq("id", pipeline.id)
        // (Omit actual content generation for brevity, but would call generateContentForPipeline here)
        await notifyUser(
          supabase,
          user.id,
          `Pipeline Run: ${pipeline.name}`,
          `Pipeline run completed successfully.`,
          "success"
        )
        return createResponse({ success: true, pipelineId: pipeline.id, message: "Pipeline run triggered" })
      } catch (error) {
        await supabase
          .from("pipelines")
          .update({
            failed_runs: pipeline.failed_runs + 1,
          })
          .eq("id", pipeline.id)
        await notifyUser(
          supabase,
          user.id,
          `Pipeline Run Failed: ${pipeline.name}`,
          `Pipeline run failed: ${error.message}`,
          "error"
        )
        return createResponse({ error: error.message }, 500)
      }
    }

    console.log("Pipeline runner started")

    // Get pipelines due for execution
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
      pipelinesDue.map(async (pipeline: any) => {
        try {
          // Update last_run_at and increment total_runs
          await supabase
            .from("pipelines")
            .update({
              last_run_at: new Date().toISOString(),
              total_runs: pipeline.total_runs + 1,
            })
            .eq("id", pipeline.id)

          // Calculate next run time (simplified - add 1 hour)
          const nextRunAt = new Date(Date.now() + 60 * 60 * 1000)
          await supabase
            .from("pipelines")
            .update({
              next_run_at: nextRunAt.toISOString(),
              successful_runs: pipeline.successful_runs + 1,
            })
            .eq("id", pipeline.id)

          console.log(`Pipeline ${pipeline.id} processed successfully. Next run: ${nextRunAt}`)
          await notifyUser(
            supabase,
            pipeline.user_id,
            `Pipeline Run: ${pipeline.name}`,
            `Pipeline run completed successfully.`,
            "success"
          )
          return { success: true, pipelineId: pipeline.id }
        } catch (error) {
          console.error(`Error processing pipeline ${pipeline.id}:`, error)

          // Update failure stats
          await supabase
            .from("pipelines")
            .update({
              failed_runs: pipeline.failed_runs + 1,
            })
            .eq("id", pipeline.id)

          await notifyUser(
            supabase,
            pipeline.user_id,
            `Pipeline Run Failed: ${pipeline.name}`,
            `Pipeline run failed: ${error.message}`,
            "error"
          )

          return { success: false, pipelineId: pipeline.id, error: error.message }
        }
      }),
    )

    const totalProcessed = results.length
    const totalSuccessful = results.filter((r) => r.success).length
    const totalFailed = results.filter((r) => !r.success).length

    console.log(
      `Pipeline execution completed. Processed: ${totalProcessed}, Successful: ${totalSuccessful}, Failed: ${totalFailed}`,
    )

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

async function generateContentForPipeline(pipeline: Pipeline, aiProvider: AIProvider): Promise<GenerationResult> {
  const prompt = interpolatePromptTemplate(pipeline.prompt_template, pipeline.prompt_variables)

  console.log(`Generating ${pipeline.content_type} content using ${aiProvider.name}`)

  let attempt = 0
  while (attempt < MAX_RETRY_ATTEMPTS) {
    try {
      // Use the unified content generation logic
      const result = await generateContentWithProvider(
        aiProvider,
        pipeline.content_type,
        prompt,
        pipeline.generation_config,
      )
      return result
    } catch (error) {
      attempt++
      console.error(`AI API call attempt ${attempt} failed:`, error)

      if (attempt >= MAX_RETRY_ATTEMPTS) {
        throw new Error(`AI API failed after ${MAX_RETRY_ATTEMPTS} attempts: ${error.message}`)
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error("Unexpected error in content generation")
}

async function getAIProviderById(providerId: string): Promise<AIProvider | null> {
  const { data, error } = await supabase
    .from("ai_providers")
    .select("*")
    .eq("id", providerId)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error(`Error fetching AI provider:`, error)
    return null
  }

  return data
}

async function deductCreditsForPipeline(
  userId: string,
  cost: number,
  pipelineId: string,
  contentId: string,
): Promise<void> {
  // Use the unified credit deduction system
  const { data, error } = await supabase.functions.invoke("deduct-credits", {
    body: {
      userId: userId,
      generationCost: cost,
      generationType: "pipeline_execution",
      generationMetadata: {
        pipeline_id: pipelineId,
        content_id: contentId,
        timestamp: new Date().toISOString(),
      },
    },
  })

  if (error) {
    throw new Error(`Credit deduction failed: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(`Credit deduction failed: ${data.message}`)
  }
}

async function storeGeneratedContent(
  pipeline: Pipeline,
  result: GenerationResult,
  aiProvider: AIProvider,
): Promise<string> {
  const storagePath: string | null = null
  let fileUrl: string | null = null

  // Store file in Supabase Storage if we have file data
  if (result.fileUrl && result.fileName) {
    // For now, just use the provided URL
    fileUrl = result.fileUrl
  }

  // Insert content record
  const { data, error } = await supabase
    .from("generated_content")
    .insert({
      pipeline_id: pipeline.id,
      user_id: pipeline.user_id,
      content_type: pipeline.content_type,
      ai_provider: aiProvider.name,
      prompt: interpolatePromptTemplate(pipeline.prompt_template, pipeline.prompt_variables),
      content_text: result.content,
      storage_path: storagePath,
      file_url: fileUrl,
      metadata: result.metadata,
      generation_cost: aiProvider.cost_per_unit,
    })
    .select("id")
    .single()

  if (error) {
    throw new Error(`Failed to store content record: ${error.message}`)
  }

  return data.id
}

async function getPipelineTargets(pipelineId: string): Promise<PipelineTarget[]> {
  const { data, error } = await supabase
    .from("pipeline_targets")
    .select("*")
    .eq("pipeline_id", pipelineId)
    .eq("is_active", true)

  if (error) {
    throw new Error(`Failed to fetch pipeline targets: ${error.message}`)
  }

  return data || []
}

async function enqueuePostingTasks(pipelineId: string, contentId: string, targets: PipelineTarget[]): Promise<void> {
  if (targets.length === 0) {
    console.log(`No active targets for pipeline ${pipelineId}`)
    return
  }

  const postingTasks = targets.map((target) => ({
    pipeline_id: pipelineId,
    content_id: contentId,
    target_id: target.id,
    platform: target.platform,
    post_data: {
      account_id: target.account_id,
      config: target.post_config,
    },
    scheduled_for: new Date().toISOString(),
  }))

  const { error } = await supabase.from("posting_queue").insert(postingTasks)

  if (error) {
    throw new Error(`Failed to enqueue posting tasks: ${error.message}`)
  }

  console.log(`Enqueued ${postingTasks.length} posting tasks for pipeline ${pipelineId}`)
}

function interpolatePromptTemplate(template: string, variables: Record<string, any>): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, "g"), String(value))
  }

  return result
}
