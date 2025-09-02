# Supabase Edge Functions - Pipeline Management

This directory contains Edge Functions for managing content generation pipelines, OAuth connections, and automated job processing.

## Functions Overview

### 1. ai-replicate/index.ts
**Purpose**: Generates video content using Replicate's Stable Video Diffusion API

**Features**:
- Real-time video generation with configurable parameters
- Automatic polling for completion status
- Supabase Storage integration for generated videos
- Support for duration, width, height, fps, and other video parameters

**Usage**:
```typescript
const response = await fetch('/functions/v1/ai-replicate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    type: 'video',
    prompt: 'A cat playing with a ball',
    options: {
      duration: 5,
      width: 1024,
      height: 576,
      fps: 24
    }
  })
})
```

**Environment Variables**:
- `REPLICATE_API_TOKEN`: Your Replicate API key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for storage access

### 2. social-connect/index.ts
**Purpose**: Manages OAuth connections to social media platforms

**Supported Platforms**:
- Instagram (Basic Display API)
- Twitter/X (OAuth 2.0)
- LinkedIn (OAuth 2.0)
- TikTok (OAuth 2.0)
- Google (OAuth 2.0)
- Facebook (OAuth 2.0)

**Features**:
- Secure token exchange and storage
- User profile fetching
- Automatic token refresh handling
- Comprehensive platform metadata storage

**Usage**:
```typescript
const response = await fetch('/functions/v1/social-connect', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    platform: 'instagram',
    code: 'oauth_code_from_callback',
    state: 'base64_encoded_state'
  })
})
```

**Environment Variables**:
- Platform-specific OAuth credentials (e.g., `INSTAGRAM_CLIENT_ID`, `TWITTER_CLIENT_SECRET`)
- `NEXT_PUBLIC_WEBSITE_URL`: Your website URL for OAuth redirects

### 3. run-pipelines/index.ts
**Purpose**: Executes content generation pipelines step by step

**Features**:
- Sequential step execution (generate → post → schedule)
- Comprehensive error handling and retry logic
- Pipeline history tracking
- Integration with other Edge Functions

**Pipeline Steps**:
- `generate-content`: Creates content using AI providers
- `post-to-platform`: Publishes content to social platforms
- `schedule-pipeline`: Manages pipeline scheduling

**Usage**:
```typescript
// Run a specific pipeline
const response = await fetch('/functions/v1/run-pipelines', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ pipelineId: 'uuid' })
})

// Batch processing (automated)
const response = await fetch('/functions/v1/run-pipelines', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 4. job-processor/index.ts
**Purpose**: Processes scheduled jobs and triggers pipeline execution

**Features**:
- Cron-based job scheduling
- Automatic retry with exponential backoff
- Job deactivation after max retries
- User notification system

**Usage**:
```typescript
// Process a specific job
const response = await fetch('/functions/v1/job-processor', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ jobId: 'uuid' })
})

// Batch processing (automated)
const response = await fetch('/functions/v1/job-processor', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## Database Schema

The functions rely on the following tables (created by migration `20250829000000_add_pipeline_tables.sql`):

### Core Tables
- **pipelines**: Main pipeline definitions
- **pipeline_steps**: Individual steps within pipelines
- **pipeline_history**: Execution history and results
- **scheduled_jobs**: Job scheduling and timing

### Integration Tables
- **oauth_connections**: Social media platform connections
- **posting_queue**: Content posting queue management

## Setup Instructions

### 1. Deploy the Migration
```bash
supabase db push
```

### 2. Set Environment Variables
Configure the following environment variables in your Supabase project:

```bash
# Replicate API
REPLICATE_API_TOKEN=your_replicate_token

# OAuth Credentials
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WEBSITE_URL=your_website_url
```

### 3. Deploy Edge Functions
```bash
supabase functions deploy ai-replicate
supabase functions deploy social-connect
supabase functions deploy run-pipelines
supabase functions deploy job-processor
```

### 4. Set Up Storage Bucket
Create a storage bucket for generated content:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('generated-content', 'generated-content', true);
```

## Monitoring and Maintenance

### Pipeline Execution
- Monitor pipeline success/failure rates
- Review execution history in `pipeline_history` table
- Check scheduled job status in `scheduled_jobs` table

### OAuth Connections
- Monitor token expiration dates
- Check connection status in `oauth_connections` table
- Implement token refresh logic for expired tokens

### Job Processing
- Set up monitoring for job processor function
- Configure appropriate retry limits
- Monitor job queue health

## Security Considerations

- All functions use Row Level Security (RLS)
- OAuth tokens are encrypted and stored securely
- Service role keys are used only for internal operations
- User authentication is required for all operations

## Error Handling

Functions implement comprehensive error handling:
- Retry logic with exponential backoff
- Detailed error logging
- User notifications for failures
- Graceful degradation when services are unavailable

## Performance Optimization

- Batch processing for multiple pipelines/jobs
- Efficient database queries with proper indexing
- Rate limiting for external API calls
- Asynchronous processing where possible

## Troubleshooting

### Common Issues
1. **OAuth Connection Failures**: Check platform credentials and redirect URIs
2. **Pipeline Execution Errors**: Verify step configuration and dependencies
3. **Job Processing Delays**: Check cron expressions and timing
4. **Storage Upload Failures**: Verify bucket permissions and service role access

### Debug Mode
Enable detailed logging by setting log level in function environment variables:
```bash
LOG_LEVEL=debug
```

## Support

For issues or questions:
1. Check function logs in Supabase dashboard
2. Review database constraints and RLS policies
3. Verify environment variable configuration
4. Test individual function endpoints
