import { assert, assertEquals, assertRejects } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { authenticateRequest } from "../functions/_shared/auth.ts";
import { createClient, SupabaseClient, AuthError } from "https://esm.sh/@supabase/supabase-js@2";
import { Session, User } from "https://esm.sh/@supabase/supabase-js@2";

// Mock Supabase client with rate limit controls
let mockRequestCount = 1;
let mockShouldExceedLimit = false;
let mockRpcError: Error | null = null;

// Create mock session and user objects
const mockUser: User = {
  id: 'test-user',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const createMockSession = (expiresInSeconds = 3600): Session => ({
  access_token: 'test-token',
  refresh_token: 'test-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  expires_in: expiresInSeconds,
  token_type: 'bearer',
  user: mockUser,
});

const mockSession = createMockSession();

const mockSupabase = {
  auth: {
    getUser: () => Promise.resolve({
      data: { user: mockUser },
      error: null,
    }),
    refreshSession: () => Promise.resolve({
      data: {
        session: createMockSession(7200),
      },
      error: null,
    }),
    getSession: () => Promise.resolve({
      data: { 
        session: mockSession,
      },
      error: null,
    }),
  },
  rpc: (fn: string, params: any) => {
    if (mockRpcError) {
      return Promise.resolve({ 
        data: null, 
        error: mockRpcError 
      });
    }
    
    const now = new Date();
    return Promise.resolve({
      data: { 
        request_count: mockShouldExceedLimit ? 101 : mockRequestCount++,
        first_request_at: new Date(now.getTime() - 10000).toISOString()
      },
      error: null
    });
  }
} as unknown as SupabaseClient;

// Mock environment variables
Deno.env.set("SUPABASE_URL", "https://test.supabase.co");
Deno.env.set("SUPABASE_ANON_KEY", "test-anon-key");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key");

// Helper function to create a test request
function createTestRequest(headers: Record<string, string> = {}) {
  const defaultHeaders = {
    'Authorization': 'Bearer test-token',
    'x-forwarded-for': '192.168.1.1',
    ...headers
  };
  
  const url = 'https://example.com/api/test';
  return new Request(url, { headers: defaultHeaders });
}

Deno.test("authenticateRequest - successful authentication", async () => {
  const request = new Request("https://example.com/api/test", {
    headers: {
      "Authorization": "Bearer test-token",
      "x-forwarded-for": "192.168.1.1"
    }
  });

  const result = await authenticateRequest(request);
  
  // Check if result is AuthResult (not a Response)
  if ('user' in result) {
    assertEquals(result.user.id, 'test-user');
    assert(result.headers);
  } else {
    assert(false, 'Expected AuthResult but got Response');
  }
});

Deno.test("authenticateRequest - missing authorization header", async () => {
  const request = new Request("https://example.com/api/test");
  const result = await authenticateRequest(request);
  
  // Should return a 401 Response
  if (result instanceof Response) {
    assertEquals(result.status, 401);
  } else {
    assert(false, 'Expected Response but got AuthResult');
  }
});

Deno.test("needsTokenRefresh - returns true when token is about to expire", () => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 60; // 1 minute from now
  
  // Mock Date.now to return a time just before the threshold
  const originalDateNow = Date.now;
  globalThis.Date.now = () => (expiresAt - 4 * 60) * 1000; // 4 minutes before expiry
  
  try {
    // @ts-ignore - accessing private function for testing
    const result = needsTokenRefresh(expiresAt);
    assertEquals(result, true);
  } finally {
    // Restore original Date.now
    globalThis.Date.now = originalDateNow;
  }
});

Deno.test("getClientIp - extracts IP from x-forwarded-for header", () => {
  const request = new Request("https://example.com", {
    headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" }
  });
  
  // @ts-ignore - accessing private function for testing
  const ip = getClientIp(request);
  assertEquals(ip, "192.168.1.1");
});

// Rate limiting tests
Deno.test("checkRateLimit - allows request under rate limit", async () => {
  mockRequestCount = 1;
  mockShouldExceedLimit = false;
  
  const request = createTestRequest();
  const result = await authenticateRequest(request);
  
  if ('user' in result) {
    assertEquals(result.user.id, 'test-user');
    assert(result.headers);
    assertEquals(parseInt(result.headers['X-RateLimit-Remaining']), 99); // 100 - 1
  } else {
    assert(false, 'Expected successful authentication');
  }
});

Deno.test("checkRateLimit - blocks request over rate limit", async () => {
  mockShouldExceedLimit = true;
  
  const request = createTestRequest();
  const result = await authenticateRequest(request);
  
  if (result instanceof Response) {
    assertEquals(result.status, 429);
    const body = await result.json();
    assertEquals(body.error, "Too many requests, please try again later");
  } else {
    assert(false, 'Expected rate limit error response');
  }
});

Deno.test("checkRateLimit - includes rate limit headers in response", async () => {
  mockRequestCount = 42;
  mockShouldExceedLimit = false;
  
  const request = createTestRequest();
  const result = await authenticateRequest(request);
  
  if ('headers' in result) {
    const headers = result.headers as Record<string, string>;
    assertEquals(headers['X-RateLimit-Limit'], '100');
    assertEquals(parseInt(headers['X-RateLimit-Remaining']), 100 - mockRequestCount);
    assert('X-RateLimit-Reset' in headers);
  } else {
    assert(false, 'Expected headers in successful response');
  }
});

Deno.test("checkRateLimit - fails open on database error", async () => {
  // Save original error
  const originalConsoleError = console.error;
  console.error = () => {}; // Suppress error logs for test
  
  try {
    mockRpcError = new Error('Database connection failed');
    
    const request = createTestRequest();
    const result = await authenticateRequest(request);
    
    // Should still allow the request to proceed on error (fail open)
    assert('user' in result, 'Expected request to be allowed on database error');
  } finally {
    // Restore original error handler
    console.error = originalConsoleError;
    mockRpcError = null;
  }
});

// Token refresh tests
Deno.test("token refresh - issues new tokens when expiring soon", async () => {
  const request = createTestRequest();
  
  // Create an expiring session (1 minute from now)
  const expiringSession = createMockSession(60);
  
  // Override getSession to return expiring session
  const originalGetSession = mockSupabase.auth.getSession;
  mockSupabase.auth.getSession = () => Promise.resolve({
    data: { session: expiringSession },
    error: null,
  });
  
  try {
    const result = await authenticateRequest(request);
    
    if ('headers' in result) {
      const headers = result.headers as Record<string, string>;
      assert(headers['X-New-Token'], 'Expected new access token in headers');
      assert(headers['X-New-Refresh-Token'], 'Expected new refresh token in headers');
    } else {
      assert(false, 'Expected new tokens in response headers');
    }
  } finally {
    // Restore original implementation
    mockSupabase.auth.getSession = originalGetSession;
  }
});

// Run tests with: deno test --allow-net --allow-env --allow-read --allow-write supabase/tests/auth.test.ts
