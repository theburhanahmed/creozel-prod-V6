// Dev-Rules §API Development: REST API Standards
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { IRepurposeConfig } from '../../types/autopilot';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contentId, config } = req.body as {
      contentId: string;
      config: IRepurposeConfig;
    };

    if (!contentId || !config?.targetPlatforms?.length) {
      return res.status(400).json({ 
        error: 'contentId and config.targetPlatforms are required' 
      });
    }

    // Get the current user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('repurpose-content', {
      body: {
        original_id: contentId,
        target_type: config.targetPlatforms.join(','),
        options: {
          tone: config.tone,
          include_hashtags: config.includeHashtags,
          include_emojis: config.includeEmojis,
        },
      },
    });

    if (error) {
      console.error('Error calling repurpose-content:', error);
      return res.status(500).json({ 
        error: 'Failed to repurpose content',
        details: error.message 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in repurpose API route:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
