-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio')),
  ai_provider_id UUID REFERENCES ai_providers(id),
  prompt_template TEXT NOT NULL,
  prompt_variables JSONB DEFAULT '{}',
  generation_config JSONB DEFAULT '{}',
  schedule_cron TEXT,
  next_run_at TIMESTAMP WITH TIME ZONE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  failed_runs INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pipeline_steps table
CREATE TABLE IF NOT EXISTS pipeline_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('generate-content', 'post-to-platform', 'schedule-pipeline', 'webhook', 'delay')),
  step_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pipeline_id, step_order)
);

-- Create oauth_connections table (enhanced version)
CREATE TABLE IF NOT EXISTS oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'facebook', 'instagram', 'twitter', 'x', 'linkedin', 'tiktok', 'youtube')),
  provider_user_id TEXT NOT NULL,
  account_name TEXT,
  account_email TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  is_active BOOLEAN DEFAULT true,
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider, provider_user_id)
);

-- Create posting_queue table
CREATE TABLE IF NOT EXISTS posting_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content_generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_id TEXT NOT NULL,
  post_data JSONB NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  posted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'posted', 'failed', 'cancelled')),
  error_message TEXT,
  post_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_jobs table
CREATE TABLE IF NOT EXISTS scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL DEFAULT 'pipeline_execution',
  schedule_cron TEXT NOT NULL,
  next_run TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  job_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pipeline_history table
CREATE TABLE IF NOT EXISTS pipeline_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  execution_id UUID DEFAULT gen_random_uuid(),
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  steps_completed INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  error_message TEXT,
  execution_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pipelines_user_id ON pipelines(user_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_next_run_at ON pipelines(next_run_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_pipeline_steps_pipeline_id ON pipeline_steps(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_provider ON oauth_connections(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_posting_queue_status ON posting_queue(status);
CREATE INDEX IF NOT EXISTS idx_posting_queue_scheduled_for ON posting_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_next_run ON scheduled_jobs(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_pipeline_history_pipeline_id ON pipeline_history(pipeline_id);

-- Enable Row Level Security (RLS)
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posting_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pipelines
CREATE POLICY "Users can view their own pipelines" ON pipelines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pipelines" ON pipelines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pipelines" ON pipelines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pipelines" ON pipelines
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pipeline_steps
CREATE POLICY "Users can view their pipeline steps" ON pipeline_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = pipeline_steps.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their pipeline steps" ON pipeline_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = pipeline_steps.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

-- RLS Policies for oauth_connections
CREATE POLICY "Users can view their own oauth connections" ON oauth_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own oauth connections" ON oauth_connections
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for posting_queue
CREATE POLICY "Users can view their own posting queue" ON posting_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own posting queue" ON posting_queue
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for scheduled_jobs
CREATE POLICY "Users can view their own scheduled jobs" ON scheduled_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own scheduled jobs" ON scheduled_jobs
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for pipeline_history
CREATE POLICY "Users can view their own pipeline history" ON pipeline_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage pipeline history" ON pipeline_history
  FOR ALL USING (auth.role() = 'service_role');

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_steps_updated_at BEFORE UPDATE ON pipeline_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_connections_updated_at BEFORE UPDATE ON oauth_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posting_queue_updated_at BEFORE UPDATE ON posting_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_jobs_updated_at BEFORE UPDATE ON scheduled_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
