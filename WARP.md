# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Creozel is a production-grade content generation system built with React frontend and Supabase Edge Functions backend. It supports text, image, video, and audio generation via multiple AI providers (OpenAI, Stability AI, ElevenLabs) with a credit-based billing system.

## Common Development Commands

### Frontend Development
```bash
# Install dependencies 
npm install

# Start development server (if build script exists in package.json)
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

### Supabase Edge Functions Development
```bash
# Start local Supabase development environment
npx supabase start

# Deploy all Edge Functions
./scripts/deploy_all_edge_functions.sh

# Deploy specific function
npx supabase functions deploy content-generation

# Apply database migrations
npx supabase db push

# View function logs
npx supabase functions logs content-generation

# Stop local environment
npx supabase stop
```

### Testing
```bash
# Run all tests (when test scripts exist)
npm run test

# Run tests with coverage
npm run test:coverage

# Run single test file
npm run test -- path/to/test.spec.ts
```

### Deployment
```bash
# Full deployment (includes migrations, secrets, and functions)
./scripts/deploy.sh

# Quick function-only deployment
./scripts/deploy_all_edge_functions.sh
```

## Architecture Overview

### System Architecture
```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  React App      │     │  Supabase Edge      │     │  AI Providers    │
│  (Vite/TS)      │────▶│  Functions          │────▶│  (OpenAI, etc.)  │
└─────────────────┘     │  ├─ content-generation  │  └──────────────────┘
                        │  ├─ preview         │
┌─────────────────┐     │  ├─ worker          │     ┌──────────────────┐
│  Supabase       │     │  └─ ...24 functions │     │  Storage         │
│  PostgreSQL     │◀────└─────────────────────┘     │  (Supabase)      │
└─────────────────┘                                └──────────────────┘
```

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router v6 with feature-based routing
- **State Management**: React Context (AuthContext) + local component state
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: Custom component library with Lucide React icons

### Backend Architecture
- **Edge Functions**: 27 Supabase Edge Functions for various operations
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage for generated content
- **Rate Limiting**: Custom implementation with IP and user-based limits

### Key Edge Functions
- `content-generation`: Main content creation endpoint
- `preview`: Job status checking and content retrieval  
- `worker`: Background job processing
- `ai-openai`, `ai-elevenlabs`, `ai-replicate`: Provider-specific handlers
- `manage-credits`: Credit system management
- `pipeline-management`: Autopilot pipeline operations

## Development Standards (from creozel-dev-rules.md)

### Code Quality Requirements
- **No `any` types** - Use explicit TypeScript types
- **No `console.log`** in production - Use proper logging
- **Maximum function length**: 50 lines
- **Maximum file length**: 300 lines
- **Cyclomatic complexity**: Maximum 10

### Component Structure
```typescript
interface ComponentProps {
  // Explicit prop types required
  user: User;
  onAction: (id: string) => void;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({ 
  user, 
  onAction, 
  className = '' 
}) => {
  // Implementation with proper TypeScript
};
```

### Error Handling Pattern
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## Database Schema (Key Tables)

### Core Tables
- **jobs**: Content generation jobs with status tracking
- **wallets**: User credit balances and transaction history
- **transactions**: Credit transactions (deposit, debit, refund, etc.)
- **providers**: AI provider configurations
- **logs**: Comprehensive logging for all operations
- **metrics**: Performance and usage analytics

### Authentication Tables (Supabase Auth)
- **auth.users**: User accounts with metadata
- **auth.sessions**: Active user sessions

## API Endpoints

### Content Generation Flow
1. `POST /functions/v1/content-generation` - Create generation job
2. `GET /functions/v1/preview/:jobId` - Check job status
3. `POST /functions/v1/worker` - Process pending jobs (background)

### Request/Response Format
```typescript
// Generation Request
interface ContentGenerationRequest {
  userId: string;
  contentType: 'text' | 'image' | 'audio' | 'video';
  prompt: string;
  settings?: Record<string, unknown>;
  providerName?: string;
}

// Standard API Response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: { pagination?: PaginationMeta };
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

## Authentication Flow

### User Authentication
- **Method**: Supabase Auth with email/password
- **Session Management**: JWT tokens with automatic refresh
- **Frontend**: AuthContext provides `user`, `isAuthenticated`, `loading`
- **Backend**: `_shared/auth.ts` handles authentication in Edge Functions

### Rate Limiting
- **User-based**: 100 requests per minute per user
- **IP-based**: Additional IP-based limits  
- **Headers**: Standard rate limit headers in responses

### Protected Routes
- All app routes wrapped in `<AuthGuard>` component
- Public routes: `/auth/login`, `/auth/register`
- Auto-redirect: `/` → `/dashboard` (authenticated) or `/auth/login`

## Feature-Based Frontend Architecture

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard widgets
│   ├── content/         # Content creation components
│   ├── autopilot/       # Pipeline automation components
│   └── layout/          # Layout components (Sidebar, Topbar)
├── contexts/            # React contexts (AuthContext)
├── pages/               # Route-level page components
│   ├── auth/           # Login/Register pages
│   ├── content/        # Content editor pages
│   ├── autopilot/      # Pipeline management pages
│   └── credits/        # Credit management pages
└── types/              # TypeScript type definitions
```

### Component Organization
- **Feature-based modules**: Each major feature has its own component directory
- **Shared components**: Reusable UI elements in `/components/ui/`
- **Page components**: Route-level components in `/pages/`
- **Context providers**: Global state management in `/contexts/`

## Environment Configuration

### Required Environment Variables
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key  
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers
OPENAI_API_KEY=your-openai-key
STABILITY_API_KEY=your-stability-key  # Optional
ELEVENLABS_API_KEY=your-elevenlabs-key  # Optional

# Development
LOG_LEVEL=info  # debug, info, warn, error, critical
```

### Local Development Setup
```bash
# 1. Install dependencies
npm install

# 2. Install Supabase CLI
npm install -g supabase

# 3. Start local Supabase
npx supabase start

# 4. Apply migrations
npx supabase db push

# 5. Deploy functions locally
npx supabase functions deploy --all
```

## Deployment Process

### Production Deployment
```bash
# 1. Login and link project
npx supabase login
npx supabase link --project-ref your-project-ref

# 2. Set secrets
npx supabase secrets set OPENAI_API_KEY=your-key
# ... set other secrets

# 3. Deploy everything
./scripts/deploy.sh
```

### Function-Only Deployment
```bash
# Deploy all functions
./scripts/deploy_all_edge_functions.sh

# Deploy specific function
npx supabase functions deploy function-name
```

## Content Generation Pipeline

### Job Processing Flow
1. **Job Creation**: User submits content request via `/content-generation`
2. **Credit Validation**: System checks user credits and creates transaction
3. **Job Queuing**: Job stored in `jobs` table with `pending` status
4. **Background Processing**: Worker function processes jobs asynchronously
5. **Content Generation**: Appropriate AI provider generates content
6. **Storage**: Generated content saved to Supabase Storage
7. **Completion**: Job status updated with result URL and metadata

### Provider Management
- **Provider Selection**: Automatic based on content type or explicit selection
- **Cost Estimation**: Pre-calculation of credit costs
- **Error Handling**: Graceful fallback and retry logic
- **Logging**: Comprehensive logging for debugging and monitoring

## Key Architectural Patterns

### Edge Functions Shared Code
- **Auth**: Centralized authentication in `_shared/auth.ts`
- **CORS**: Standardized CORS handling in `_shared/cors.ts` 
- **Rate Limiting**: User and IP-based limits in `_shared/rate-limit.ts`
- **Validation**: Input validation utilities in `_shared/validation.ts`

### Credit System
- **Wallet Management**: Credit balances tracked per user
- **Transaction Types**: deposit, reservation, debit, refund, release
- **Cost Estimation**: Provider-specific cost calculation
- **Atomic Operations**: Database transactions ensure consistency

### Error Handling Strategy
- **Standardized Errors**: Custom error classes with codes and status
- **Client-Server**: Consistent error format across API endpoints
- **Logging**: All errors logged with context for debugging
- **User Experience**: User-friendly error messages in frontend

## File and Component Naming

### Naming Conventions
- **Files**: kebab-case (`user-profile.component.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)  
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types**: PascalCase with prefix (`IUserProfile`, `TApiResponse`)

### File Organization
- **Feature modules**: Group related components, hooks, and services
- **Index files**: Use index.ts files for clean imports
- **Type definitions**: Co-locate types with components when feature-specific
