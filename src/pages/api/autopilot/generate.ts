import type { NextApiRequest, NextApiResponse } from 'next';

// You may want to use your actual Supabase project URL and anon key from env
const SUPABASE_EDGE_URL = process.env.SUPABASE_EDGE_URL || 'https://your-supabase-project-url.supabase.co/functions/v1/generate-content';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Forward the user's auth token (if present)
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  try {
    const response = await fetch(SUPABASE_EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': String(authHeader) } : {}),
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 