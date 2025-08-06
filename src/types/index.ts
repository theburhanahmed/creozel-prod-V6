// Core types for the content creation pipeline

export type ContentType = 'text' | 'image' | 'video' | 'audio';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface Wallet {
  id: string;
  userId: string;
  creditsAvailable: number;
  creditsUsed: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'deposit' | 'reservation' | 'debit' | 'refund' | 'release';
  status: 'pending' | 'completed' | 'failed';
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider {
  id: string;
  name: string; // Unique identifier (e.g., 'openai', 'stability')
  displayName: string;
  isActive: boolean;
  contentTypes: ContentType[];
  costPerUnit: number;
  config: Record<string, any>;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  userId: string;
  providerId?: string;
  transactionId?: string;
  contentType: ContentType;
  status: JobStatus;
  prompt: string;
  settings: Record<string, any>;
  result?: {
    url?: string;
    content?: any;
    metadata?: Record<string, any>;
  };
  error?: string;
  estimatedCost?: number;
  actualCost?: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metric {
  id: string;
  metricType: string;
  jobId?: string;
  userId?: string;
  providerId?: string;
  contentType?: ContentType;
  value: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ContentGenerationRequest {
  userId: string;
  contentType: ContentType;
  prompt: string;
  settings?: Record<string, any>;
  providerName?: string; // Optional override for provider selection
}

export interface ContentGenerationResponse {
  jobId: string;
  status: 'accepted' | 'failed';
  message?: string;
  estimatedCost?: number;
}

export interface ProviderConfig {
  name: string;
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  maxRetries?: number;
  timeout?: number;
  // Provider-specific configuration
  [key: string]: any;
}

export interface GenerationResult {
  success: boolean;
  content?: any;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost: number;
  };
  metadata?: Record<string, any>;
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(available: number, required: number) {
    super(
      `Insufficient credits. Available: ${available}, Required: ${required}`,
      402,
      'INSUFFICIENT_CREDITS',
      { available, required }
    );
  }
}

export class ProviderError extends AppError {
  constructor(provider: string, message: string, details?: any) {
    super(`[${provider}] ${message}`, 502, 'PROVIDER_ERROR', details);
  }
}

// Utility types
export type AsyncResult<T> = Promise<{ data: T; error: null } | { data: null; error: AppError }>;

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
