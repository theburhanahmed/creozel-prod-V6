SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."add_credits"("user_id" "uuid", "amount" integer, "description" "text" DEFAULT 'Credit purchase'::"text", "reference_id" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Add credits
    UPDATE public.users SET 
        credits = credits + amount,
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (user_id, amount, 'purchase', description, reference_id);
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."add_credits"("user_id" "uuid", "amount" integer, "description" "text", "reference_id" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "credits" integer DEFAULT 100,
    "subscription_tier" "text" DEFAULT 'free'::"text",
    "stripe_customer_id" "text",
    "plan" "text" DEFAULT 'free'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "users_credits_check" CHECK (("credits" >= 0)),
    CONSTRAINT "users_plan_check" CHECK (("plan" = ANY (ARRAY['free'::"text", 'basic'::"text", 'standard'::"text", 'premium'::"text"]))),
    CONSTRAINT "users_subscription_tier_check" CHECK (("subscription_tier" = ANY (ARRAY['free'::"text", 'basic'::"text", 'premium'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_profile"("user_id" "uuid", "user_email" "text", "user_full_name" "text" DEFAULT NULL::"text", "user_avatar_url" "text" DEFAULT NULL::"text") RETURNS "public"."users"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_user public.users;
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, credits, subscription_tier)
    VALUES (user_id, user_email, user_full_name, user_avatar_url, 100, 'free')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        updated_at = NOW()
    RETURNING * INTO new_user;
    
    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN new_user;
END;
$$;


ALTER FUNCTION "public"."create_user_profile"("user_id" "uuid", "user_email" "text", "user_full_name" "text", "user_avatar_url" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."deduct_credits"("user_id" "uuid", "amount" integer, "description" "text" DEFAULT 'Content generation'::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits with row lock
    SELECT credits INTO current_credits 
    FROM public.users 
    WHERE id = user_id 
    FOR UPDATE;
    
    -- Check if user exists
    IF current_credits IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has enough credits
    IF current_credits < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct credits
    UPDATE public.users SET 
        credits = credits - amount,
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (user_id, -amount, 'usage', description);
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."deduct_credits"("user_id" "uuid", "amount" integer, "description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_credits"("user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    user_credits INTEGER;
BEGIN
    SELECT credits INTO user_credits FROM public.users WHERE id = user_id;
    RETURN COALESCE(user_credits, 0);
END;
$$;


ALTER FUNCTION "public"."get_user_credits"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_profile"("user_id" "uuid") RETURNS TABLE("id" "uuid", "email" "text", "full_name" "text", "avatar_url" "text", "credits" integer, "subscription_tier" "text", "stripe_customer_id" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.credits,
        u.subscription_tier,
        u.stripe_customer_id,
        u.created_at,
        u.updated_at
    FROM public.users u
    WHERE u.id = user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_profile"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, credits, subscription_tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        100,
        'free'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        updated_at = NOW();
    
    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_providers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "cost_per_unit" numeric(10,4) DEFAULT 0.01 NOT NULL,
    "unit_type" "text" DEFAULT 'per_request'::"text",
    "is_default" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "margin_percentage" integer DEFAULT 300,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_providers_type_check" CHECK (("type" = ANY (ARRAY['text'::"text", 'image'::"text", 'video'::"text", 'audio'::"text"]))),
    CONSTRAINT "ai_providers_unit_type_check" CHECK (("unit_type" = ANY (ARRAY['per_request'::"text", 'per_token'::"text", 'per_image'::"text", 'per_second'::"text"])))
);


ALTER TABLE "public"."ai_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_generations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "type" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "result" "jsonb",
    "credits_used" integer DEFAULT 0,
    "status" "text" DEFAULT 'pending'::"text",
    "provider" "text",
    "model" "text",
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "content_generations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'failed'::"text"]))),
    CONSTRAINT "content_generations_type_check" CHECK (("type" = ANY (ARRAY['text'::"text", 'image'::"text", 'video'::"text", 'audio'::"text"])))
);


ALTER TABLE "public"."content_generations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_pipelines" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "status" "text" DEFAULT 'active'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "content_pipelines_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'paused'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."content_pipelines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_posts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "content_generation_id" "uuid",
    "platform" "text" NOT NULL,
    "post_id" "text",
    "content" "text" NOT NULL,
    "media_urls" "text"[],
    "scheduled_at" timestamp with time zone,
    "posted_at" timestamp with time zone,
    "status" "text" DEFAULT 'draft'::"text",
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "content_posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'scheduled'::"text", 'posted'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."content_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_transactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "amount" integer NOT NULL,
    "type" "text" NOT NULL,
    "description" "text",
    "reference_id" "text",
    "stripe_payment_intent_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "credit_transactions_type_check" CHECK (("type" = ANY (ARRAY['purchase'::"text", 'usage'::"text", 'refund'::"text", 'bonus'::"text"])))
);


ALTER TABLE "public"."credit_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "message" "text",
    "type" "text" DEFAULT 'info'::"text",
    "read" boolean DEFAULT false,
    "action_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['info'::"text", 'success'::"text", 'warning'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."social_accounts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "account_id" "text" NOT NULL,
    "account_name" "text",
    "access_token" "text",
    "refresh_token" "text",
    "expires_at" timestamp with time zone,
    "token_type" "text" DEFAULT 'Bearer'::"text",
    "scope" "text",
    "profile_info" "jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "social_accounts_platform_check" CHECK (("platform" = ANY (ARRAY['twitter'::"text", 'facebook'::"text", 'instagram'::"text", 'linkedin'::"text", 'tiktok'::"text", 'youtube'::"text", 'google'::"text"])))
);


ALTER TABLE "public"."social_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "notifications_enabled" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT true,
    "auto_post_enabled" boolean DEFAULT false,
    "preferred_ai_model" "text" DEFAULT 'gpt-3.5-turbo'::"text",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "language" "text" DEFAULT 'en'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ai_providers"
    ADD CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_generations"
    ADD CONSTRAINT "content_generations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_pipelines"
    ADD CONSTRAINT "content_pipelines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_posts"
    ADD CONSTRAINT "content_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."social_accounts"
    ADD CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."social_accounts"
    ADD CONSTRAINT "social_accounts_user_id_platform_account_id_key" UNIQUE ("user_id", "platform", "account_id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_stripe_customer_id_key" UNIQUE ("stripe_customer_id");



CREATE INDEX "idx_ai_providers_is_active" ON "public"."ai_providers" USING "btree" ("is_active");



CREATE INDEX "idx_ai_providers_is_default" ON "public"."ai_providers" USING "btree" ("is_default");



CREATE INDEX "idx_ai_providers_type" ON "public"."ai_providers" USING "btree" ("type");



CREATE INDEX "idx_content_generations_created_at" ON "public"."content_generations" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_content_generations_status" ON "public"."content_generations" USING "btree" ("status");



CREATE INDEX "idx_content_generations_type" ON "public"."content_generations" USING "btree" ("type");



CREATE INDEX "idx_content_generations_user_id" ON "public"."content_generations" USING "btree" ("user_id");



CREATE INDEX "idx_content_pipelines_status" ON "public"."content_pipelines" USING "btree" ("status");



CREATE INDEX "idx_content_pipelines_user_id" ON "public"."content_pipelines" USING "btree" ("user_id");



CREATE INDEX "idx_content_posts_platform" ON "public"."content_posts" USING "btree" ("platform");



CREATE INDEX "idx_content_posts_scheduled_at" ON "public"."content_posts" USING "btree" ("scheduled_at");



CREATE INDEX "idx_content_posts_status" ON "public"."content_posts" USING "btree" ("status");



CREATE INDEX "idx_content_posts_user_id" ON "public"."content_posts" USING "btree" ("user_id");



CREATE INDEX "idx_credit_transactions_created_at" ON "public"."credit_transactions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_credit_transactions_type" ON "public"."credit_transactions" USING "btree" ("type");



CREATE INDEX "idx_credit_transactions_user_id" ON "public"."credit_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_notifications_read" ON "public"."notifications" USING "btree" ("read");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_social_accounts_is_active" ON "public"."social_accounts" USING "btree" ("is_active");



CREATE INDEX "idx_social_accounts_platform" ON "public"."social_accounts" USING "btree" ("platform");



CREATE INDEX "idx_social_accounts_user_id" ON "public"."social_accounts" USING "btree" ("user_id");



CREATE INDEX "idx_user_settings_user_id" ON "public"."user_settings" USING "btree" ("user_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_stripe_customer_id" ON "public"."users" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_users_subscription_tier" ON "public"."users" USING "btree" ("subscription_tier");



CREATE OR REPLACE TRIGGER "update_ai_providers_updated_at" BEFORE UPDATE ON "public"."ai_providers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_content_generations_updated_at" BEFORE UPDATE ON "public"."content_generations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_content_pipelines_updated_at" BEFORE UPDATE ON "public"."content_pipelines" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_content_posts_updated_at" BEFORE UPDATE ON "public"."content_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notifications_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_social_accounts_updated_at" BEFORE UPDATE ON "public"."social_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_settings_updated_at" BEFORE UPDATE ON "public"."user_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."content_generations"
    ADD CONSTRAINT "content_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."content_pipelines"
    ADD CONSTRAINT "content_pipelines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."content_posts"
    ADD CONSTRAINT "content_posts_content_generation_id_fkey" FOREIGN KEY ("content_generation_id") REFERENCES "public"."content_generations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."content_posts"
    ADD CONSTRAINT "content_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."social_accounts"
    ADD CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Authenticated users can view ai providers" ON "public"."ai_providers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."credit_transactions" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."users" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can insert own content generations" ON "public"."content_generations" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage own content pipelines" ON "public"."content_pipelines" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage own content posts" ON "public"."content_posts" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage own settings" ON "public"."user_settings" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage own social accounts" ON "public"."social_accounts" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update own content generations" ON "public"."content_generations" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update own notifications" ON "public"."notifications" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can view own content generations" ON "public"."content_generations" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can view own credit transactions" ON "public"."credit_transactions" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can view own notifications" ON "public"."notifications" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING ((("auth"."uid"())::"text" = ("id")::"text"));



ALTER TABLE "public"."content_generations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_pipelines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_credits"("user_id" "uuid", "amount" integer, "description" "text", "reference_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_credits"("user_id" "uuid", "amount" integer, "description" "text", "reference_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_credits"("user_id" "uuid", "amount" integer, "description" "text", "reference_id" "text") TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_profile"("user_id" "uuid", "user_email" "text", "user_full_name" "text", "user_avatar_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_profile"("user_id" "uuid", "user_email" "text", "user_full_name" "text", "user_avatar_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_profile"("user_id" "uuid", "user_email" "text", "user_full_name" "text", "user_avatar_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."deduct_credits"("user_id" "uuid", "amount" integer, "description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."deduct_credits"("user_id" "uuid", "amount" integer, "description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."deduct_credits"("user_id" "uuid", "amount" integer, "description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_credits"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_credits"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_credits"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."ai_providers" TO "anon";
GRANT ALL ON TABLE "public"."ai_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_providers" TO "service_role";



GRANT ALL ON TABLE "public"."content_generations" TO "anon";
GRANT ALL ON TABLE "public"."content_generations" TO "authenticated";
GRANT ALL ON TABLE "public"."content_generations" TO "service_role";



GRANT ALL ON TABLE "public"."content_pipelines" TO "anon";
GRANT ALL ON TABLE "public"."content_pipelines" TO "authenticated";
GRANT ALL ON TABLE "public"."content_pipelines" TO "service_role";



GRANT ALL ON TABLE "public"."content_posts" TO "anon";
GRANT ALL ON TABLE "public"."content_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."content_posts" TO "service_role";



GRANT ALL ON TABLE "public"."credit_transactions" TO "anon";
GRANT ALL ON TABLE "public"."credit_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."social_accounts" TO "anon";
GRANT ALL ON TABLE "public"."social_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."social_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
