# Content Generation Pipeline

A production-grade content generation system built with Supabase Edge Functions, supporting text, image, video, and audio generation via multiple AI providers.

## Features

- 🚀 Multi-provider AI content generation (OpenAI, Stability AI, ElevenLabs, etc.)
- 💳 Credit-based billing system with transaction management
- 🔄 Asynchronous job processing with real-time status updates
- 📊 Comprehensive logging and monitoring
- 🔒 Secure API endpoints with authentication
- 🛠️ Extensible provider architecture

## Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Client App     │     │  Supabase Edge      │     │  AI Providers    │
│  (React)        │────▶│  Functions          │────▶│  (OpenAI, etc.)  │
└─────────────────┘     │  ├─ /api/generate   │     └──────────────────┘
                        │  ├─ /api/preview    │
┌─────────────────┐     │  └─ /api/worker     │     ┌──────────────────┐
│  Supabase       │     └─────────┬───────────┘     │  Storage         │
│  Database       │◀──────────────┘                 │  (Supabase)      │
└─────────────────┘                                └──────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account and project
- API keys for AI providers (OpenAI, Stability AI, ElevenLabs, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd creozel-prod-V6
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```env
   # Supabase
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # AI Providers
   OPENAI_API_KEY=your-openai-api-key
   STABILITY_API_KEY=your-stability-api-key
   ELEVENLABS_API_KEY=your-elevenlabs-api-key
   
   # Optional: Customize logging level
   LOG_LEVEL=info # debug, info, warn, error, critical
   ```

4. Run database migrations:
   ```bash
   # Apply database migrations
   npx supabase db push
   ```

5. Deploy Edge Functions:
   ```bash
   # Login to Supabase CLI if not already logged in
   npx supabase login
   
   # Deploy all functions
   npx supabase functions deploy --all
   ```

## API Reference

### Generate Content

**Endpoint:** `POST /api/generate`

Generate new content using AI.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "contentType": "text", // "text", "image", "audio", "video"
  "prompt": "A beautiful sunset over mountains",
  "settings": {
    // Provider-specific settings
  },
  "providerName": "openai" // Optional
}
```

**Response (202 Accepted):**
```json
{
  "jobId": "job-uuid",
  "status": "accepted",
  "estimatedCost": 0.00042
}
```

### Check Job Status

**Endpoint:** `GET /api/preview/:jobId`

Check the status of a content generation job.

**Response (200 OK):**
```json
{
  "jobId": "job-uuid",
  "status": "completed",
  "contentType": "text",
  "createdAt": "2023-07-20T12:00:00Z",
  "updatedAt": "2023-07-20T12:00:05Z",
  "result": {
    "url": "https://your-supabase-url/storage/v1/object/public/generated-content/user-uuid/job-uuid.txt",
    "metadata": {
      "model": "gpt-4",
      "tokens": 42
    }
  },
  "preview": "The sun was setting behind the mountains, casting..."
}
```

## Database Schema

### Tables

#### jobs
Stores content generation jobs.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to users table |
| provider_id | UUID | Reference to providers table |
| transaction_id | UUID | Reference to transactions table |
| content_type | ENUM | 'text', 'image', 'audio', 'video' |
| status | ENUM | 'pending', 'processing', 'completed', 'failed' |
| prompt | TEXT | User's prompt |
| settings | JSONB | Provider-specific settings |
| result | JSONB | Generated content and metadata |
| error | TEXT | Error message if job failed |
| estimated_cost | DECIMAL | Estimated cost in credits |
| actual_cost | DECIMAL | Actual cost in credits |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| started_at | TIMESTAMPTZ | When processing started |
| completed_at | TIMESTAMPTZ | When job completed/failed |

#### wallets
Tracks user credit balances.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to users table |
| credits_available | DECIMAL | Available credits |
| credits_used | DECIMAL | Total credits used |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### transactions
Records all credit transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| wallet_id | UUID | Reference to wallets table |
| amount | DECIMAL | Transaction amount |
| type | ENUM | 'deposit', 'reservation', 'debit', 'refund', 'release' |
| status | TEXT | Transaction status |
| reference_id | UUID | Reference to related entity |
| metadata | JSONB | Additional metadata |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid request data
- `INSUFFICIENT_CREDITS`: Not enough credits to perform the operation
- `JOB_NOT_FOUND`: The specified job ID was not found
- `PROVIDER_ERROR`: Error from the AI provider
- `INTERNAL_ERROR`: Server error

## Monitoring and Logging

All operations are logged to the `logs` table with the following structure:

- `level`: Log level (debug, info, warn, error, critical)
- `service`: Service name (e.g., 'content-pipeline')
- `message`: Log message
- `job_id`: Associated job ID (if applicable)
- `user_id`: Associated user ID (if applicable)
- `provider`: AI provider name (if applicable)
- `content_type`: Content type (if applicable)
- `error`: Error details (if applicable)
- `metadata`: Additional context
- `timestamp`: Log timestamp

Metrics are recorded to the `metrics` table for monitoring and analytics.

## Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Your Supabase service role key |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `STABILITY_API_KEY` | No | Stability AI API key (for image generation) |
| `ELEVENLABS_API_KEY` | No | ElevenLabs API key (for audio generation) |
| `LOG_LEVEL` | No | Logging level (default: 'info') |

### Deploying to Production

1. Set up a Supabase project if you haven't already
2. Configure environment variables in your deployment environment
3. Run database migrations:
   ```bash
   npx supabase db push
   ```
4. Deploy Edge Functions:
   ```bash
   npx supabase functions deploy --all
   ```
5. Set up a cron job to process pending jobs (if not using Supabase webhooks)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
