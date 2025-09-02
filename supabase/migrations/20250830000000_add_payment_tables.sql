-- Migration: Add Payment Tables
-- Date: 2025-08-30
-- Description: Creates tables for payment processing, transaction tracking, and purchase history

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT payment_method_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    CONSTRAINT payment_method_code_length CHECK (char_length(code) >= 1 AND char_length(code) <= 50)
);

-- Create transactions table for payment tracking
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL CHECK (currency IN ('USD', 'EUR', 'INR')),
    credit_amount INTEGER NOT NULL CHECK (credit_amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'razorpay')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'canceled', 'refunded')),
    
    -- Stripe specific fields
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    
    -- Razorpay specific fields
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    
    -- Additional metadata
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT transaction_amount_positive CHECK (amount > 0),
    CONSTRAINT transaction_credits_positive CHECK (credit_amount > 0),
    CONSTRAINT transaction_payment_method_valid CHECK (payment_method IN ('stripe', 'razorpay')),
    CONSTRAINT transaction_status_valid CHECK (status IN ('pending', 'completed', 'failed', 'canceled', 'refunded'))
);

-- Create purchase_history table for detailed tracking
CREATE TABLE IF NOT EXISTS public.purchase_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    
    -- Purchase details
    package_name TEXT,
    package_type TEXT CHECK (package_type IN ('starter', 'pro', 'business', 'enterprise', 'custom')),
    credits_purchased INTEGER NOT NULL CHECK (credits_purchased > 0),
    amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid > 0),
    currency TEXT NOT NULL,
    
    -- Payment details
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    
    -- Additional info
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT purchase_credits_positive CHECK (credits_purchased > 0),
    CONSTRAINT purchase_amount_positive CHECK (amount_paid > 0)
);

-- Create payment_webhooks table for webhook tracking
CREATE TABLE IF NOT EXISTS public.payment_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'razorpay')),
    event_type TEXT NOT NULL,
    event_id TEXT,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    
    -- Timestamps
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT webhook_provider_valid CHECK (provider IN ('stripe', 'razorpay'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON public.transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent_id ON public.transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_razorpay_order_id ON public.transactions(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_purchase_history_user_id ON public.purchase_history(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_transaction_id ON public.purchase_history(transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_purchased_at ON public.purchase_history(purchased_at);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_provider ON public.payment_webhooks(provider);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_type ON public.payment_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON public.payment_webhooks(processed);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, code, description, config) VALUES
    ('Stripe', 'stripe', 'Credit and debit card payments via Stripe', '{"supports_currencies": ["USD", "EUR"], "webhook_events": ["payment_intent.succeeded", "payment_intent.payment_failed"]}'),
    ('Razorpay', 'razorpay', 'UPI, cards, and net banking payments for India', '{"supports_currencies": ["INR"], "webhook_events": ["payment.captured", "payment.failed"]}')
ON CONFLICT (code) DO NOTHING;

-- Create RLS policies for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Service role can manage all transactions" ON public.transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for purchase_history table
ALTER TABLE public.purchase_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase history" ON public.purchase_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchase records" ON public.purchase_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all purchase history" ON public.purchase_history
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for payment_methods table
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active payment methods" ON public.payment_methods
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage payment methods" ON public.payment_methods
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for payment_webhooks table
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage webhooks" ON public.payment_webhooks
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_history_updated_at
    BEFORE UPDATE ON public.purchase_history
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to add credits to user wallet
CREATE OR REPLACE FUNCTION public.add_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO current_credits FROM public.users WHERE id = user_id;
    
    -- Add new credits
    UPDATE public.users SET credits = COALESCE(current_credits, 0) + amount WHERE id = user_id;
    
    -- Return new total
    RETURN COALESCE(current_credits, 0) + amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user credits (fallback)
CREATE OR REPLACE FUNCTION public.update_user_credits(user_id UUID, credit_amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO current_credits FROM public.users WHERE id = user_id;
    
    -- Add new credits
    UPDATE public.users SET credits = COALESCE(current_credits, 0) + credit_amount WHERE id = user_id;
    
    -- Return new total
    RETURN COALESCE(current_credits, 0) + credit_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get payment statistics
CREATE OR REPLACE FUNCTION public.get_user_payment_stats(user_id UUID)
RETURNS TABLE(
    total_spent DECIMAL(10,2),
    total_credits INTEGER,
    successful_payments BIGINT,
    failed_payments BIGINT,
    currency TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_spent,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN credit_amount ELSE 0 END), 0) as total_credits,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        COALESCE(MAX(currency), 'USD') as currency
    FROM public.transactions
    WHERE user_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.purchase_history TO authenticated;
GRANT SELECT ON public.payment_methods TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_credits(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_payment_stats(UUID) TO authenticated;

-- Grant service role permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
