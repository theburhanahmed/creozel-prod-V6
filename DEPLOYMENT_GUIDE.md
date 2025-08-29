# Supabase Content Generation Pipeline - Deployment Guide

## Prerequisites

1. Node.js 16+ and npm installed
2. Supabase CLI installed (`npm install -g supabase`)
3. A Supabase project (create one at [app.supabase.com](https://app.supabase.com))
4. API keys for AI providers (OpenAI, etc.)

## Deployment Steps

### 1. Prepare Your Environment

Create or update your `.env` file with the following variables:

\`\`\`env
# Supabase
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Providers
OPENAI_API_KEY=your-openai-api-key
STABILITY_API_KEY=your-stability-api-key  # For image generation (optional)
ELEVENLABS_API_KEY=your-elevenlabs-api-key  # For audio generation (optional)

# Logging (optional)
LOG_LEVEL=info  # debug, info, warn, error, critical
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Login to Supabase CLI

\`\`\`bash
npx supabase login
\`\`\`

### 4. Link Your Project

\`\`\`bash
npx supabase link --project-ref your-project-ref
# The project ref is the part of your Supabase URL: https://xyzabc123.supabase.co -> xyzabc123
\`\`\`

### 5. Deploy Database Schema

\`\`\`bash
npx supabase db push
\`\`\`

### 6. Set Secrets

Set each secret individually:

\`\`\`bash
# Supabase secrets
npx supabase secrets set SUPABASE_URL=your-supabase-project-url
npx supabase secrets set SUPABASE_ANON_KEY=your-supabase-anon-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Provider secrets
npx supabase secrets set OPENAI_API_KEY=your-openai-api-key
npx supabase secrets set STABILITY_API_KEY=your-stability-api-key
npx supabase secrets set ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Optional: Set log level
npx supabase secrets set LOG_LEVEL=info
\`\`\`

### 7. Deploy Edge Functions

Deploy each function:

\`\`\`bash
# Deploy content generation endpoint
npx supabase functions deploy content-generation --no-verify-jwt

# Deploy preview endpoint
npx supabase functions deploy preview --no-verify-jwt

# Deploy worker function
npx supabase functions deploy worker --no-verify-jwt
\`\`\`

### 8. Test the Deployment

You can test the API using cURL:

\`\`\`bash
# Generate content
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/content-generation' \
  -H 'Authorization: Bearer your-supabase-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"userId":"test-user-id","contentType":"text","prompt":"Hello, world!"}'

# Check job status (replace JOB_ID from the response above)
curl 'https://your-project-ref.supabase.co/functions/v1/preview/JOB_ID' \
  -H 'Authorization: Bearer your-supabase-anon-key'
\`\`\`

## Post-Deployment

1. **Set up a cron job** (recommended):
   - Set up a cron job to call the worker function every minute to process pending jobs
   - Example using a service like cron-job.org or GitHub Actions

2. **Configure CORS** in your Supabase project:
   - Go to Authentication > URL Configuration
   - Add your application's domain to the "Site URL" and "Redirect URLs"

3. **Monitor your functions**:
   - Check the "Edge Functions" section in your Supabase dashboard
   - Monitor logs and metrics

## Troubleshooting

- **Database connection issues**: Verify your connection string and network settings
- **Function deployment failures**: Check the error logs in the Supabase dashboard
- **Authentication errors**: Ensure you're using the correct API keys and JWT tokens

## Support

For additional help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Migrations](https://supabase.com/docs/guides/database/migrations)
