import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get user's pipelines
    const { data: pipelines, error: pipelinesError } = await supabaseClient
      .from('content_pipelines')
      .select(`
        *,
        pipeline_content (
          id,
          title,
          content_type,
          platform,
          thumbnail_url,
          engagement_score,
          views,
          likes,
          shares,
          ctr,
          suggestions
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (pipelinesError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch pipelines' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Format the response
    const formattedPipelines = pipelines.map(pipeline => ({
      id: pipeline.id,
      title: pipeline.title,
      description: pipeline.description,
      contentType: pipeline.content_type,
      platforms: pipeline.platforms || [],
      schedule: pipeline.schedule,
      status: pipeline.status,
      stats: {
        posts: pipeline.pipeline_content?.length || 0,
        views: pipeline.total_views || '0',
        engagement: pipeline.avg_engagement || '0%',
        growth: pipeline.growth_rate || '0%'
      },
      lastRun: pipeline.last_run ? new Date(pipeline.last_run).toLocaleDateString() : 'Never',
      nextRun: pipeline.next_run ? new Date(pipeline.next_run).toLocaleDateString() : 'Not scheduled',
      hasInteractiveElements: pipeline.has_interactive_elements || false,
      performanceScore: pipeline.performance_score || 0,
      content: pipeline.pipeline_content?.map(content => ({
        id: content.id,
        title: content.title,
        type: content.content_type,
        platform: content.platform,
        thumbnail: content.thumbnail_url,
        engagement: content.engagement_score > 0.8 ? 'viral' : content.engagement_score > 0.5 ? 'average' : 'low',
        stats: {
          views: content.views?.toString() || '0',
          likes: content.likes?.toString() || '0',
          shares: content.shares?.toString() || '0',
          ctr: content.ctr?.toString() || '0%'
        },
        suggestions: content.suggestions || []
      })) || []
    }))

    return new Response(JSON.stringify({
      pipelines: formattedPipelines
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
