-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  first_request_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_request_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON public.rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON public.rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_request_at ON public.rate_limits(last_request_at);

-- Row Level Security
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own rate limits"
  ON public.rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all rate limits"
  ON public.rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_ip_address INET,
  p_endpoint TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_first_request TIMESTAMPTZ;
  v_current_time TIMESTAMPTZ := NOW();
  v_window_start TIMESTAMPTZ := v_current_time - (p_window_seconds * INTERVAL '1 second');
BEGIN
  -- Try to update existing record or insert new one
  INSERT INTO public.rate_limits (user_id, ip_address, endpoint, request_count, first_request_at, last_request_at)
  VALUES (p_user_id, p_ip_address, p_endpoint, 1, v_current_time, v_current_time)
  ON CONFLICT (user_id, endpoint) 
  DO UPDATE SET 
    request_count = CASE 
      WHEN rate_limits.first_request_at < v_window_start THEN 1
      ELSE rate_limits.request_count + 1 
    END,
    first_request_at = CASE 
      WHEN rate_limits.first_request_at < v_window_start THEN v_current_time
      ELSE rate_limits.first_request_at 
    END,
    last_request_at = v_current_time
  RETURNING request_count, first_request_at INTO v_count, v_first_request;

  -- If we're still within the time window and over the limit, return false
  IF v_first_request >= v_window_start AND v_count > p_limit THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
