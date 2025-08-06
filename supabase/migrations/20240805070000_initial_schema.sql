-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Wallets table to track user credits
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credits_available DECIMAL(10, 4) NOT NULL DEFAULT 0,
    credits_used DECIMAL(10, 4) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_credits CHECK (credits_available >= 0)
);

-- Unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);

-- Transactions table to track all credit movements
CREATE TYPE transaction_type AS ENUM ('deposit', 'reservation', 'debit', 'refund', 'release');

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10, 4) NOT NULL,
    type transaction_type NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reference_id UUID,  -- For linking related transactions
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Providers table to manage AI service providers
CREATE TYPE content_type AS ENUM ('text', 'image', 'video', 'audio');

CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,  -- e.g., 'openai', 'stability', 'elevenlabs'
    display_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    content_types content_type[] NOT NULL,
    cost_per_unit DECIMAL(10, 8) NOT NULL,  -- Cost per token/unit
    config JSONB NOT NULL DEFAULT '{}'::jsonb,  -- Provider-specific configuration
    priority INT NOT NULL DEFAULT 1,  -- Lower number = higher priority
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_provider_name UNIQUE (name)
);

-- Jobs table to track content generation requests
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    content_type content_type NOT NULL,
    status job_status NOT NULL DEFAULT 'pending',
    prompt TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB,  -- Store the generated content URL and metadata
    error TEXT,
    estimated_cost DECIMAL(10, 4),
    actual_cost DECIMAL(10, 4),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Metrics table for monitoring and analytics
CREATE TABLE IF NOT EXISTS public.metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL,  -- e.g., 'job_duration', 'credit_usage', 'error_rate'
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    content_type content_type,
    value NUMERIC NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON public.jobs(created_at);
CREATE INDEX IF NOT EXISTS metrics_created_at_idx ON public.metrics(created_at);

-- RLS Policies for Supabase Auth integration
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Wallet policies
CREATE POLICY "Users can view their own wallet" 
ON public.wallets FOR SELECT 
USING (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.wallets 
    WHERE wallets.id = transactions.wallet_id 
    AND wallets.user_id = auth.uid()
));

-- Job policies
CREATE POLICY "Users can manage their own jobs" 
ON public.jobs 
FOR ALL 
USING (auth.uid() = user_id);

-- Metrics policies (admin only)
CREATE POLICY "Admins can view all metrics" 
ON public.metrics FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
));

-- Helper function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_wallets_updated_at
BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create a wallet for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (user_id, credits_available, credits_used)
    VALUES (NEW.id, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to estimate job cost (can be called from the Edge Function)
CREATE OR REPLACE FUNCTION public.estimate_job_cost(
    p_provider_id UUID,
    p_prompt TEXT
) 
RETURNS DECIMAL(10, 4) AS $$
DECLARE
    v_cost_per_unit DECIMAL(10, 8);
    v_estimated_units INT;
    v_estimated_cost DECIMAL(10, 4);
BEGIN
    -- Get cost per unit from provider
    SELECT cost_per_unit INTO v_cost_per_unit
    FROM public.providers
    WHERE id = p_provider_id
    AND is_active = true;
    
    IF v_cost_per_unit IS NULL THEN
        RAISE EXCEPTION 'Provider not found or inactive';
    END IF;
    
    -- Simple estimation: 1 unit per 4 characters in prompt
    -- This should be replaced with actual tokenization logic in the Edge Function
    v_estimated_units := GREATEST(1, LENGTH(TRIM(p_prompt)) / 4);
    
    -- Calculate estimated cost
    v_estimated_cost := v_estimated_units * v_cost_per_unit;
    
    RETURN v_estimated_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
