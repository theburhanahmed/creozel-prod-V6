-- Migration: Add Pipeline Tables
-- Date: 2025-08-29
-- Description: Creates tables for content pipeline management, OAuth connections, and posting queue
-- Compatible with existing remote database schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pipelines table
CREATE TABLE IF NOT EXISTS public.pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio')),
    ai_provider_id UUID REFERENCES public.ai_providers(id) ON DELETE SET NULL,
    prompt_template TEXT NOT NULL,
    prompt_variables JSONB DEFAULT '{}'::jsonb,
    generation_config JSONB DEFAULT '{}'::jsonb,
    schedule_cron TEXT,
    next_run_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    total_runs INTEGER DEFAULT 0,
    successful_runs INTEGER DEFAULT 0,
    failed_runs INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pipeline_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
    CONSTRAINT pipeline_description_length CHECK (char_length(description) <= 1000),
    CONSTRAINT pipeline_prompt_length CHECK (char_length(prompt_template) >= 1 AND char_length(prompt_template) <= 10000)
);

-- Create pipeline_steps table
CREATE TABLE IF NOT EXISTS public.pipeline_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    step_type TEXT NOT NULL CHECK (step_type IN ('generate-content', 'post-to-platform', 'schedule-pipeline', 'transform-content', 'validate-content')),
    step_order INTEGER NOT NULL CHECK (step_order > 0),
    step_name TEXT NOT NULL,
    step_description TEXT,
    step_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    retry_on_failure BOOLEAN DEFAULT false,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT step_name_length CHECK (char_length(step_name) >= 1 AND char_length(step_name) <= 255),
    CONSTRAINT step_description_length CHECK (char_length(step_description) <= 500),
    CONSTRAINT step_order_unique UNIQUE (pipeline_id, step_order)
);

-- Create oauth_connections table (replacing social_accounts for pipeline-specific connections)
CREATE TABLE IF NOT EXISTS public.oauth_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube')),
    provider_user_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_email TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    additional_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT account_name_length CHECK (char_length(account_name) >= 1 AND char_length(account_name) <= 255),
    CONSTRAINT account_email_valid CHECK (account_email IS NULL OR account_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

-- Create posting_queue table
CREATE TABLE IF NOT EXISTS public.posting_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE SET NULL,
    content_id UUID,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'twitter', 'linkedin', 'tiktok', 'facebook', 'youtube')),
    account_id TEXT NOT NULL,
    post_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'posted', 'failed', 'cancelled')),
    scheduled_for TIMESTAMPTZ NOT NULL,
    posted_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pipeline_history table
CREATE TABLE IF NOT EXISTS public.pipeline_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    step_id UUID REFERENCES public.pipeline_steps(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'skipped')),
    result JSONB,
    error TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create scheduled_jobs table
CREATE TABLE IF NOT EXISTS public.scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    schedule_cron TEXT NOT NULL,
    next_run TIMESTAMPTZ NOT NULL,
    last_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pipelines_user_id ON public.pipelines(user_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_status ON public.pipelines(status);
CREATE INDEX IF NOT EXISTS idx_pipelines_next_run ON public.pipelines(next_run_at);
CREATE INDEX IF NOT EXISTS idx_pipelines_content_type ON public.pipelines(content_type);

CREATE INDEX IF NOT EXISTS idx_pipeline_steps_pipeline_id ON public.pipeline_steps(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_steps_order ON public.pipeline_steps(pipeline_id, step_order);
CREATE INDEX IF NOT EXISTS idx_pipeline_steps_type ON public.pipeline_steps(step_type);

CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON public.oauth_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_provider ON public.oauth_connections(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_active ON public.oauth_connections(is_active);

CREATE INDEX IF NOT EXISTS idx_posting_queue_user_id ON public.posting_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_posting_queue_status ON public.posting_queue(status);
CREATE INDEX IF NOT EXISTS idx_posting_queue_scheduled ON public.posting_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posting_queue_platform ON public.posting_queue(platform);

CREATE INDEX IF NOT EXISTS idx_pipeline_history_pipeline_id ON public.pipeline_history(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_step_id ON public.pipeline_history(step_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_status ON public.pipeline_history(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_created ON public.pipeline_history(created_at);

CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_pipeline_id ON public.scheduled_jobs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_next_run ON public.scheduled_jobs(next_run);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_active ON public.scheduled_jobs(is_active);

-- Enable Row Level Security
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posting_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pipelines
CREATE POLICY "Users can view their own pipelines" ON public.pipelines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pipelines" ON public.pipelines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pipelines" ON public.pipelines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pipelines" ON public.pipelines
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pipeline_steps
CREATE POLICY "Users can view steps of their own pipelines" ON public.pipeline_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_steps.pipeline_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert steps for their own pipelines" ON public.pipeline_steps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_steps.pipeline_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update steps of their own pipelines" ON public.pipeline_steps
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_steps.pipeline_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete steps of their own pipelines" ON public.pipeline_steps
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_steps.pipeline_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for oauth_connections
CREATE POLICY "Users can view their own OAuth connections" ON public.oauth_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OAuth connections" ON public.oauth_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OAuth connections" ON public.oauth_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OAuth connections" ON public.oauth_connections
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for posting_queue
CREATE POLICY "Users can view their own posting queue items" ON public.posting_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posting queue items" ON public.posting_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posting queue items" ON public.posting_queue
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posting queue items" ON public.posting_queue
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pipeline_history
CREATE POLICY "Users can view history of their own pipelines" ON public.pipeline_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_history.pipeline_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert history for their own pipelines" ON public.pipeline_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pipelines 
            WHERE id = pipeline_history.pipeline_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for scheduled_jobs
CREATE POLICY "Users can view their own scheduled jobs" ON public.scheduled_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled jobs" ON public.scheduled_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled jobs" ON public.scheduled_jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled jobs" ON public.scheduled_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pipelines_updated_at 
    BEFORE UPDATE ON public.pipelines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_steps_updated_at 
    BEFORE UPDATE ON public.pipeline_steps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_connections_updated_at 
    BEFORE UPDATE ON public.oauth_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posting_queue_updated_at 
    BEFORE UPDATE ON public.posting_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_jobs_updated_at 
    BEFORE UPDATE ON public.scheduled_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to calculate execution time for pipeline history
CREATE OR REPLACE FUNCTION calculate_execution_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
        NEW.execution_time_ms = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) * 1000;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_pipeline_history_execution_time 
    BEFORE INSERT OR UPDATE ON public.pipeline_history 
    FOR EACH ROW EXECUTE FUNCTION calculate_execution_time();

-- Create trigger to validate pipeline step order
CREATE OR REPLACE FUNCTION validate_pipeline_step_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if step order is unique within the pipeline
    IF EXISTS (
        SELECT 1 FROM public.pipeline_steps 
        WHERE pipeline_id = NEW.pipeline_id 
        AND step_order = NEW.step_order 
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Step order must be unique within a pipeline';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_pipeline_step_order_trigger 
    BEFORE INSERT OR UPDATE ON public.pipeline_steps 
    FOR EACH ROW EXECUTE FUNCTION validate_pipeline_step_order();

-- Create trigger to update pipeline stats when history is updated
CREATE OR REPLACE FUNCTION update_pipeline_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update pipeline run statistics based on history
    IF TG_OP = 'INSERT' THEN
        -- Increment total runs
        UPDATE public.pipelines 
        SET total_runs = total_runs + 1
        WHERE id = NEW.pipeline_id;
        
        -- Update success/failure counts
        IF NEW.status = 'completed' THEN
            UPDATE public.pipelines 
            SET successful_runs = successful_runs + 1
            WHERE id = NEW.pipeline_id;
        ELSIF NEW.status = 'failed' THEN
            UPDATE public.pipelines 
            SET failed_runs = failed_runs + 1
            WHERE id = NEW.pipeline_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pipeline_stats_trigger 
    AFTER INSERT ON public.pipeline_history 
    FOR EACH ROW EXECUTE FUNCTION update_pipeline_stats();
