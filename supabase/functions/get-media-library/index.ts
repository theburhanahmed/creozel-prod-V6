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

    // Get user's media items
    const { data: mediaItems, error: mediaError } = await supabaseClient
      .from('media_library')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (mediaError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch media items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Format the response
    const formattedMedia = mediaItems.map(item => ({
      id: item.id,
      title: item.title,
      type: item.media_type,
      url: item.file_url,
      thumbnail: item.thumbnail_url || item.file_url,
      size: item.file_size,
      duration: item.duration,
      dimensions: item.dimensions,
      created: new Date(item.created_at).toLocaleDateString(),
      published: item.is_published || false
    }))

    return new Response(JSON.stringify({
      mediaItems: formattedMedia
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