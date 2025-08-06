import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0';
import {
  ContentType,
  ContentGenerationRequest,
  ContentGenerationResponse,
  AppError,
  ValidationError
} from '../../../src/types';
import { ProviderManager } from '../../../src/lib/providers';
import { WalletManager } from '../../../src/lib/wallet';

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

// Maximum request body size (10MB)
const MAX_BODY_SIZE = 10 * 1024 * 1024;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Handle OPTIONS request for CORS preflight
function handleOptions() {
  return new Response('ok', { 
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    } 
  });
}

// Handle POST request to create a new content generation job
async function handlePostRequest(req: Request): Promise<Response> {
  try {
    // Check content type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new ValidationError('Content-Type must be application/json');
    }

    // Read and parse request body
    const body = await req.text();
    if (body.length > MAX_BODY_SIZE) {
      throw new ValidationError(`Request body too large (max ${MAX_BODY_SIZE} bytes)`);
    }

    let request: ContentGenerationRequest;
    try {
      request = JSON.parse(body) as ContentGenerationRequest;
    } catch (e) {
      throw new ValidationError('Invalid JSON payload');
    }

    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      throw validationError;
    }

    // Create a new job in the database
    const job = await createContentJob(request);

    // Return the job ID
    const response: ContentGenerationResponse = {
      jobId: job.id,
      status: 'accepted',
      estimatedCost: job.estimated_cost
    };

    return new Response(JSON.stringify(response), {
      status: 202, // Accepted
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    
    const status = error.statusCode || 500;
    const errorResponse = {
      error: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      ...(error.details && { details: error.details })
    };

    return new Response(JSON.stringify(errorResponse), {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}

// Validate the content generation request
function validateRequest(request: ContentGenerationRequest): AppError | null {
  const { userId, contentType, prompt, settings } = request;
  
  if (!userId) {
    return new ValidationError('User ID is required');
  }

  if (!contentType) {
    return new ValidationError('Content type is required');
  }

  if (!['text', 'image', 'video', 'audio'].includes(contentType)) {
    return new ValidationError(
      'Invalid content type. Must be one of: text, image, video, audio'
    );
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return new ValidationError('Prompt is required and cannot be empty');
  }

  if (prompt.length > 10000) {
    return new ValidationError('Prompt is too long (max 10,000 characters)');
  }

  if (settings && typeof settings !== 'object') {
    return new ValidationError('Settings must be an object');
  }

  return null;
}

// Create a new content generation job
async function createContentJob(
  request: ContentGenerationRequest
): Promise<any> {
  const { userId, contentType, prompt, settings = {}, providerName } = request;
  
  // Get the appropriate provider
  const provider = providerName 
    ? providerManager.getProvider(providerName)
    : providerManager.getDefaultProvider(contentType as ContentType);

  if (!provider) {
    throw new AppError(
      `No provider available for content type: ${contentType}`,
      503,
      'NO_PROVIDER_AVAILABLE'
    );
  }

  // Estimate cost
  const estimatedCost = providerManager.estimateCost(provider, prompt);
  
  // Start a database transaction
  const { data: job, error } = await supabase.rpc('create_content_job', {
    p_user_id: userId,
    p_provider_id: provider.id,
    p_content_type: contentType,
    p_prompt: prompt,
    p_settings: settings,
    p_estimated_cost: estimatedCost
  });

  if (error) {
    console.error('Failed to create content job:', error);
    throw new AppError(
      'Failed to create content job',
      500,
      'JOB_CREATION_FAILED',
      { error: error.message }
    );
  }

  return job;
}

// Main request handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  // Handle POST requests
  if (req.method === 'POST') {
    return handlePostRequest(req);
  }

  // Method not allowed
  return new Response(
    JSON.stringify({ 
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS'] 
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

// Database function to create a content job with transaction
// This should be added to your Supabase database
/*
CREATE OR REPLACE FUNCTION create_content_job(
  p_user_id UUID,
  p_provider_id UUID,
  p_content_type TEXT,
  p_prompt TEXT,
  p_settings JSONB DEFAULT '{}'::jsonb,
  p_estimated_cost DECIMAL(10, 4) DEFAULT 0
)
RETURNS SETOF jobs AS $$
DECLARE
  v_wallet_id UUID;
  v_credits_available DECIMAL(10, 4);
  v_reservation_id UUID;
  v_job_id UUID;
BEGIN
  -- Start transaction
  BEGIN
    -- Get user's wallet with FOR UPDATE to lock the row
    SELECT id, credits_available 
    INTO v_wallet_id, v_credits_available
    FROM wallets 
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    -- Check if wallet exists
    IF v_wallet_id IS NULL THEN
      -- Create wallet if it doesn't exist
      INSERT INTO wallets (user_id, credits_available, credits_used)
      VALUES (p_user_id, 0, 0)
      RETURNING id INTO v_wallet_id;
      
      v_credits_available := 0;
    END IF;
    
    -- Check if user has enough credits
    IF v_credits_available < p_estimated_cost THEN
      RAISE EXCEPTION 'Insufficient credits' 
      USING 
        ERRCODE = 'insufficient_credits',
        DETAIL = json_build_object(
          'available', v_credits_available,
          'required', p_estimated_cost
        )::text;
    END IF;
    
    -- Create reservation transaction
    INSERT INTO transactions (
      wallet_id,
      amount,
      type,
      status,
      metadata
    ) VALUES (
      v_wallet_id,
      p_estimated_cost,
      'reservation',
      'pending',
      jsonb_build_object(
        'description', 'Credit reservation for content generation',
        'reserved_at', NOW()
      )
    )
    RETURNING id INTO v_reservation_id;
    
    -- Update wallet balance
    UPDATE wallets
    SET 
      credits_available = credits_available - p_estimated_cost,
      updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Create the job
    INSERT INTO jobs (
      user_id,
      provider_id,
      transaction_id,
      content_type,
      status,
      prompt,
      settings,
      estimated_cost
    ) VALUES (
      p_user_id,
      p_provider_id,
      v_reservation_id,
      p_content_type,
      'pending',
      p_prompt,
      p_settings,
      p_estimated_cost
    )
    RETURNING * INTO v_job_id;
    
    -- Commit transaction
    COMMIT;
    
    -- Return the created job
    RETURN QUERY SELECT * FROM jobs WHERE id = v_job_id;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback on error
      ROLLBACK;
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/
