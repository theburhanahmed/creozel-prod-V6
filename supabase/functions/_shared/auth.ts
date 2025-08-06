import { createClient, SupabaseClient, Session, User } from "https://esm.sh/@supabase/supabase-js@2"
import { createResponse } from "./cors.ts"

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 100, // Max requests per window
  HEADERS: {
    REMAINING: 'X-RateLimit-Remaining',
    RESET: 'X-RateLimit-Reset',
    LIMIT: 'X-RateLimit-Limit'
  }
} as const;

// Token refresh configuration
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

type AuthResult = {
  user: User;
  supabase: SupabaseClient;
  headers: HeadersInit;
};

/**
 * Gets the client IP address from the request
 */
function getClientIp(req: Request): string | null {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
}

/**
 * Checks if the token needs to be refreshed
 */
function needsTokenRefresh(exp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return (exp - now) < (TOKEN_REFRESH_THRESHOLD / 1000);
}

/**
 * Refreshes the user's session
 */
async function refreshSession(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session;
}

/**
 * Checks rate limiting for the request
 */
async function checkRateLimit(
  supabase: SupabaseClient, 
  userId: string, 
  endpoint: string, 
  ipAddress: string
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
      p_ip_address: ipAddress,
      p_endpoint: endpoint,
      p_limit: RATE_LIMIT.MAX_REQUESTS,
      p_window_seconds: RATE_LIMIT.WINDOW_MS / 1000
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      // Fail open in case of database errors
      return { allowed: true, headers: {} };
    }

    const remaining = Math.max(0, RATE_LIMIT.MAX_REQUESTS - data.request_count);
    const resetTime = Math.floor((new Date(data.first_request_at).getTime() + RATE_LIMIT.WINDOW_MS) / 1000);

    const headers = {
      [RATE_LIMIT.HEADERS.REMAINING]: remaining.toString(),
      [RATE_LIMIT.HEADERS.RESET]: resetTime.toString(),
      [RATE_LIMIT.HEADERS.LIMIT]: RATE_LIMIT.MAX_REQUESTS.toString()
    };

    return {
      allowed: data.request_count <= RATE_LIMIT.MAX_REQUESTS,
      headers
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open in case of errors
    return { allowed: true, headers: {} };
  }
}

export async function authenticateRequest(req: Request): Promise<AuthResult | Response> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return createResponse({ error: "Server configuration error" }, 500);
    }

    // Create two clients - one with user token, one with service role
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || '' } },
    });

    const serviceSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Get user and session
    const { data: sessionData, error: authError } = await userSupabase.auth.getSession();
    const session = sessionData?.session;
    const user = session?.user;

    if (authError || !user || !session) {
      return createResponse({ error: "Unauthorized" }, 401);
    }

    // Check rate limiting
    const ipAddress = getClientIp(req) || 'unknown';
    const endpoint = new URL(req.url).pathname;
    const { allowed, headers: rateLimitHeaders } = await checkRateLimit(
      serviceSupabase,
      user.id,
      endpoint,
      ipAddress
    );

    if (!allowed) {
      const response = createResponse(
        { error: "Too many requests, please try again later" },
        429
      );
      
      // Add rate limit headers to the response
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    // Check if token needs refresh
    let authToken = req.headers.get("Authorization")?.split(' ')[1];
    let refreshToken = req.headers.get("X-Refresh-Token");
    
    if (session.expires_at && needsTokenRefresh(session.expires_at)) {
      try {
        const { data: { session: newSession } } = await userSupabase.auth.refreshSession();
        if (newSession) {
          authToken = newSession.access_token;
          refreshToken = newSession.refresh_token;
          rateLimitHeaders['X-New-Token'] = authToken || '';
          rateLimitHeaders['X-New-Refresh-Token'] = refreshToken || '';
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Continue with current token if refresh fails
      }
    }

    return {
      user,
      supabase: userSupabase,
      headers: rateLimitHeaders
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return createResponse({ error: "Authentication failed" }, 401);
  }
}
