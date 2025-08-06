import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { 
  AppError, 
  Job, 
  Provider, 
  ContentType,
  JobStatus
} from '../types';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogContext {
  [key: string]: any;
  jobId?: string;
  userId?: string;
  provider?: string;
  contentType?: ContentType;
  error?: Error | AppError;
}

interface MetricData {
  name: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export class Logger {
  private supabase: SupabaseClient;
  private serviceName: string;
  private logLevel: LogLevel;
  private static instance: Logger;

  private constructor(supabase: SupabaseClient, serviceName: string, logLevel: LogLevel = 'info') {
    this.supabase = supabase;
    this.serviceName = serviceName;
    this.logLevel = logLevel;
  }

  static getInstance(supabase: SupabaseClient, serviceName: string = 'content-pipeline', logLevel: LogLevel = 'info'): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(supabase, serviceName, logLevel);
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      critical: 4
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatError(error: Error | AppError | unknown): {
    message: string;
    stack?: string;
    code?: string;
    details?: any;
  } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack
      };
    }
    return {
      message: String(error)
    };
  }

  private async logToDatabase(level: LogLevel, message: string, context: LogContext = {}) {
    try {
      const { jobId, userId, provider, contentType, error, ...rest } = context;
      
      const logEntry = {
        level,
        service: this.serviceName,
        message,
        job_id: jobId,
        user_id: userId,
        provider,
        content_type: contentType,
        error: error ? this.formatError(error) : null,
        metadata: rest,
        timestamp: new Date().toISOString()
      };

      const { error: dbError } = await this.supabase
        .from('logs')
        .insert(logEntry);

      if (dbError) {
        console.error('Failed to write log to database:', dbError);
      }
    } catch (error) {
      console.error('Error in logToDatabase:', error);
    }
  }

  debug(message: string, context: LogContext = {}) {
    if (!this.shouldLog('debug')) return;
    
    console.debug(`[DEBUG] ${message}`, context);
    this.logToDatabase('debug', message, context);
  }

  info(message: string, context: LogContext = {}) {
    if (!this.shouldLog('info')) return;
    
    console.info(`[INFO] ${message}`, context);
    this.logToDatabase('info', message, context);
  }

  warn(message: string, context: LogContext = {}) {
    if (!this.shouldLog('warn')) return;
    
    console.warn(`[WARN] ${message}`, context);
    this.logToDatabase('warn', message, context);
  }

  error(message: string, error?: Error | AppError, context: LogContext = {}) {
    if (!this.shouldLog('error')) return;
    
    const errorContext = error ? { ...context, error } : context;
    console.error(`[ERROR] ${message}`, errorContext);
    this.logToDatabase('error', message, errorContext);
  }

  critical(message: string, error?: Error | AppError, context: LogContext = {}) {
    console.error(`[CRITICAL] ${message}`, { ...context, error });
    this.logToDatabase('critical', message, { ...context, error });
    
    // Here you could add additional alerting (e.g., email, Slack, etc.)
    // this.sendAlert(message, { ...context, error });
  }

  async recordMetric(metricData: MetricData) {
    try {
      const { name, value, metadata, timestamp } = metricData;
      
      const metric = {
        name,
        value,
        metadata: metadata || {},
        timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
        service: this.serviceName
      };

      const { error } = await this.supabase
        .from('metrics')
        .insert(metric);

      if (error) {
        console.error('Failed to record metric:', error);
      }
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  }

  // Job-specific logging helpers
  logJobStart(job: Job) {
    this.info(`Starting job: ${job.id}`, {
      jobId: job.id,
      userId: job.user_id,
      provider: job.provider_id,
      contentType: job.content_type,
      status: job.status
    });
    
    this.recordMetric({
      name: 'job_started',
      value: 1,
      metadata: {
        content_type: job.content_type,
        provider: job.provider_id,
        estimated_cost: job.estimated_cost
      }
    });
  }

  logJobCompletion(job: Job, durationMs: number) {
    this.info(`Completed job: ${job.id} in ${durationMs}ms`, {
      jobId: job.id,
      userId: job.user_id,
      provider: job.provider_id,
      contentType: job.content_type,
      status: job.status,
      durationMs
    });
    
    this.recordMetric({
      name: 'job_completed',
      value: 1,
      metadata: {
        content_type: job.content_type,
        provider: job.provider_id,
        duration_ms: durationMs,
        actual_cost: job.actual_cost,
        estimated_cost: job.estimated_cost
      }
    });
  }

  logJobError(job: Job, error: Error | AppError, context: Record<string, any> = {}) {
    this.error(`Job failed: ${job.id}`, error, {
      jobId: job.id,
      userId: job.user_id,
      provider: job.provider_id,
      contentType: job.content_type,
      status: job.status,
      ...context
    });
    
    this.recordMetric({
      name: 'job_failed',
      value: 1,
      metadata: {
        content_type: job.content_type,
        provider: job.provider_id,
        error: error instanceof Error ? error.message : String(error),
        error_code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
        ...context
      }
    });
  }

  logProviderCall(provider: string, method: string, durationMs: number, success: boolean, error?: Error) {
    const level = success ? 'info' : 'error';
    const message = `Provider ${provider}.${method} ${success ? 'succeeded' : 'failed'} in ${durationMs}ms`;
    
    if (success) {
      this.info(message, { provider, method, durationMs });
    } else {
      this.error(message, error, { provider, method, durationMs });
    }
    
    this.recordMetric({
      name: `provider_${method}_${success ? 'success' : 'failure'}`,
      value: durationMs,
      metadata: {
        provider,
        method,
        success,
        error: error ? error.message : undefined
      }
    });
  }
}

// Helper function to measure execution time
// eslint-disable-next-line @typescript-eslint/ban-types
export function withTiming<T extends Function>(
  fn: T,
  logger: Logger,
  name: string,
  context: Record<string, any> = {}
): T {
  return async function (this: any, ...args: any[]) {
    const start = Date.now();
    try {
      const result = await fn.apply(this, args);
      const duration = Date.now() - start;
      logger.info(`${name} completed in ${duration}ms`, {
        ...context,
        durationMs: duration,
        success: true
      });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`${name} failed after ${duration}ms`, error, {
        ...context,
        durationMs: duration,
        success: false
      });
      throw error;
    }
  } as unknown as T;
}

// Helper function to create a retryable operation
export function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    logger?: Logger;
    operationName?: string;
    context?: Record<string, any>;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    logger,
    operationName = 'operation',
    context = {},
    shouldRetry = () => true
  } = options;

  let retries = 0;
  
  const attempt = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries <= maxRetries && shouldRetry(error)) {
        const waitTime = delayMs * Math.pow(2, retries - 1); // Exponential backoff
        
        logger?.warn(`Retry ${retries}/${maxRetries} for ${operationName} after error`, {
          ...context,
          error: error instanceof Error ? error.message : String(error),
          retryAttempt: retries,
          waitTimeMs: waitTime
        });
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return attempt();
      }
      
      throw error;
    }
  };
  
  return attempt();
}
