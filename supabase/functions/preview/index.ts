import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Handle GET request to get job status and preview
async function handleGetRequest(req: Request): Promise<Response> {
  try {
    // Extract job ID from URL
    const url = new URL(req.url);
    const jobId = url.pathname.split('/').pop();
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    }

    // Get the job from the database
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return new Response(
        JSON.stringify({ 
          error: 'Job not found',
          code: 'JOB_NOT_FOUND'
        }),
        { 
          status: 404,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    }

    // Prepare the response based on job status
    const response: any = {
      jobId: job.id,
      status: job.status,
      contentType: job.content_type,
      createdAt: job.created_at,
      updatedAt: job.updated_at
    };

    // Add additional fields based on status
    switch (job.status) {
      case 'completed':
        response.result = {
          url: job.result?.url,
          metadata: {
            ...job.result?.metadata,
            // Add any additional metadata you want to expose
          }
        };
        break;
      
      case 'failed':
        response.error = job.error;
        break;
      
      case 'processing':
        response.startedAt = job.started_at;
        response.progress = job.progress; // If you have progress tracking
        break;
      
      case 'pending':
        // No additional fields needed
        break;
    }

    // If the content is small, include a preview
    if (job.status === 'completed' && job.result?.content) {
      // Only include a preview for text content
      if (job.content_type === 'text' && job.result.content.length <= 1000) {
        response.preview = job.result.content.substring(0, 500); // First 500 chars
      }
      // For images/audio/video, we just return the URL
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // Cache for 60 seconds
        }
      }
    );

  } catch (error) {
    console.error('Error in preview endpoint:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
}

// Main request handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    });
  }

  // Handle GET requests
  if (req.method === 'GET') {
    return handleGetRequest(req);
  }

  // Method not allowed
  return new Response(
    JSON.stringify({ 
      error: 'Method not allowed',
      allowed: ['GET', 'OPTIONS'] 
    }),
    { 
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
});
