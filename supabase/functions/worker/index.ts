import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ContentGenerator } from '../../src/lib/generator';
import { ProviderManager } from '../../src/lib/providers';
import { WalletManager } from '../../src/lib/wallet';

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Initialize managers
const providerManager = new ProviderManager(supabase);
const walletManager = new WalletManager(supabase);
const contentGenerator = new ContentGenerator(supabase, providerManager, walletManager);

// Process a single job
async function processJob(jobId: string) {
  console.log(`Processing job: ${jobId}`);
  
  try {
    // Get the job with a FOR UPDATE lock to prevent concurrent processing
    const { data: job, error: jobError } = await supabase.rpc('get_job_for_processing', {
      p_job_id: jobId
    });

    if (jobError || !job) {
      console.error('Error fetching job for processing:', jobError);
      return { success: false, error: jobError };
    }

    console.log(`Processing job ${jobId} with provider: ${job.provider_name}`);
    
    // Process the job
    await contentGenerator.processJob(jobId);
    
    console.log(`Successfully processed job: ${jobId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    
    // Update job status to failed
    await supabase
      .from('jobs')
      .update({ 
        status: 'failed',
        error: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    return { success: false, error };
  }
}

// Main request handler for the worker
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      } 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const { jobId } = await req.json();
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'jobId is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Process the job
    const result = await processJob(jobId);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error?.message || 'Failed to process job' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in worker handler:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

// Database function to get a job for processing with row locking
/*
CREATE OR REPLACE FUNCTION get_job_for_processing(p_job_id UUID)
RETURNS SETOF jobs AS $$
DECLARE
  v_job jobs%ROWTYPE;
BEGIN
  -- Get the job with FOR UPDATE to lock the row
  SELECT * INTO v_job
  FROM jobs
  WHERE id = p_job_id
  FOR UPDATE SKIP LOCKED;  -- Skip if already locked by another process
  
  -- If job not found or not in pending status, return empty
  IF v_job.id IS NULL OR v_job.status != 'pending' THEN
    RETURN;
  END IF;
  
  -- Update job status to processing
  UPDATE jobs
  SET 
    status = 'processing',
    started_at = NOW(),
    updated_at = NOW()
  WHERE id = p_job_id;
  
  -- Return the updated job
  RETURN QUERY SELECT * FROM jobs WHERE id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

// Database trigger to call the worker when a new job is created
/*
-- Create a function to send a webhook
CREATE OR REPLACE FUNCTION notify_new_job()
RETURNS TRIGGER AS $$
BEGIN
  -- Send a webhook to the worker
  PERFORM net.http_post(
    url := 'https://your-worker-url.deno.dev',
    body := jsonb_build_object('jobId', NEW.id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_job_created
AFTER INSERT ON jobs
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION notify_new_job();
*/
