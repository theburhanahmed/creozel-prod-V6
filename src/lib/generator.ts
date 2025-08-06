import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { 
  ContentType, 
  Provider, 
  GenerationResult, 
  ProviderConfig,
  AppError,
  ProviderError,
  Job
} from '../types';

// Base interface for all provider implementations
interface ContentProvider {
  generate(prompt: string, config: any): Promise<GenerationResult>;
  estimateCost(prompt: string): number;
}

// OpenAI Provider Implementation
class OpenAIContentProvider implements ContentProvider {
  private config: ProviderConfig;
  
  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async generate(prompt: string, settings: any = {}): Promise<GenerationResult> {
    const model = settings.model || this.config.defaultModel || 'gpt-4';
    const maxTokens = settings.maxTokens || 2048;
    const temperature = settings.temperature ?? 0.7;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ProviderError(
          'openai',
          `API request failed: ${errorData.error?.message || response.statusText}`,
          { status: response.status, error: errorData }
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      const usage = data.usage;
      
      if (!content) {
        throw new ProviderError('openai', 'No content in response', { response: data });
      }

      return {
        success: true,
        content,
        usage: {
          promptTokens: usage?.prompt_tokens,
          completionTokens: usage?.completion_tokens,
          totalTokens: usage?.total_tokens,
          cost: this.estimateCost(prompt, usage?.total_tokens || 0)
        },
        metadata: {
          model,
          finishReason: data.choices[0]?.finish_reason,
          responseId: data.id
        }
      };
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError('openai', error.message, { cause: error });
    }
  }

  estimateCost(prompt: string, tokens?: number): number {
    // Default to 1 token per 4 characters if tokens not provided
    const estimatedTokens = tokens || Math.ceil(prompt.length / 4);
    return estimatedTokens * this.config.costPerToken!;
  }
}

// Stability AI Provider Implementation
class StabilityAIContentProvider implements ContentProvider {
  private config: ProviderConfig;
  
  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async generate(prompt: string, settings: any = {}): Promise<GenerationResult> {
    const model = settings.model || this.config.defaultModel || 'stable-diffusion-xl-1024-v1-0';
    const width = settings.width || 1024;
    const height = settings.height || 1024;
    const steps = settings.steps || 30;

    try {
      const response = await fetch(
        `https://api.stability.ai/v1/generation/${model}/text-to-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height,
            width,
            steps,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new ProviderError(
          'stability',
          `API request failed: ${errorData.message || response.statusText}`,
          { status: response.status, error: errorData }
        );
      }

      const data = await response.json();
      const imageData = data.artifacts?.[0]?.base64;
      
      if (!imageData) {
        throw new ProviderError('stability', 'No image data in response', { response: data });
      }

      return {
        success: true,
        content: `data:image/png;base64,${imageData}`,
        usage: {
          cost: this.estimateCost(prompt)
        },
        metadata: {
          model,
          width,
          height,
          steps,
          seed: data.artifacts?.[0]?.seed
        }
      };
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError('stability', error.message, { cause: error });
    }
  }

  estimateCost(prompt: string): number {
    // Fixed cost per image generation
    return this.config.costPerImage!;
  }
}

// ElevenLabs Provider Implementation
class ElevenLabsContentProvider implements ContentProvider {
  private config: ProviderConfig;
  
  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async generate(text: string, settings: any = {}): Promise<GenerationResult> {
    const voiceId = settings.voiceId || this.config.defaultVoiceId || '21m00Tcm4TlvDq8ikWAM';
    const modelId = settings.modelId || this.config.defaultModelId || 'eleven_monolingual_v1';
    
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey,
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: {
              stability: settings.stability ?? 0.5,
              similarity_boost: settings.similarityBoost ?? 0.5,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ProviderError(
          'elevenlabs',
          `API request failed: ${errorData.detail?.message || response.statusText}`,
          { status: response.status, error: errorData }
        );
      }

      const audioData = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioData).toString('base64');

      return {
        success: true,
        content: `data:audio/mpeg;base64,${base64Audio}`,
        usage: {
          cost: this.estimateCost(text)
        },
        metadata: {
          modelId,
          voiceId,
          characters: text.length
        }
      };
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError('elevenlabs', error.message, { cause: error });
    }
  }

  estimateCost(text: string): number {
    // Cost per character
    return text.length * this.config.costPerCharacter!;
  }
}

// Factory to create the appropriate provider
class ContentGeneratorFactory {
  static createProvider(providerName: string, config: ProviderConfig): ContentProvider {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return new OpenAIContentProvider(config);
      case 'stability':
        return new StabilityAIContentProvider(config);
      case 'elevenlabs':
        return new ElevenLabsContentProvider(config);
      default:
        throw new ProviderError(
          'factory',
          `Unsupported provider: ${providerName}`,
          { providerName }
        );
    }
  }
}

// Main ContentGenerator class
export class ContentGenerator {
  private supabase: SupabaseClient;
  private providerManager: any; // We'll define the ProviderManager type properly
  private walletManager: any;    // We'll define the WalletManager type properly

  constructor(supabase: SupabaseClient, providerManager: any, walletManager: any) {
    this.supabase = supabase;
    this.providerManager = providerManager;
    this.walletManager = walletManager;
  }

  /**
   * Generate content using the specified provider
   */
  async generate(
    jobId: string,
    providerName: string,
    prompt: string,
    settings: any = {}
  ): Promise<GenerationResult> {
    try {
      // Get provider config
      const providerConfig = {
        ...this.providerManager.getProviderConfig(providerName),
        ...settings.providerConfig
      };

      // Create the appropriate provider
      const provider = ContentGeneratorFactory.createProvider(providerName, providerConfig);
      
      // Generate content
      const result = await provider.generate(prompt, settings);
      
      // Update job with result
      await this.updateJobResult(jobId, {
        status: 'completed',
        result: {
          content: result.content,
          metadata: result.metadata
        },
        actual_cost: result.usage?.cost,
        completed_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      // Update job with error
      await this.updateJobResult(jobId, {
        status: 'failed',
        error: error.message,
        completed_at: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Update job with result or error
   */
  private async updateJobResult(jobId: string, updates: Partial<Job>) {
    const { error } = await this.supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId);

    if (error) {
      console.error('Failed to update job result:', error);
      throw new AppError(
        'Failed to update job result',
        500,
        'JOB_UPDATE_ERROR',
        { jobId, error }
      );
    }
  }

  /**
   * Process a job from the queue
   */
  async processJob(jobId: string): Promise<void> {
    // Get job details
    const { data: job, error } = await this.supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND', { jobId });
    }

    try {
      // Update job status to processing
      await this.updateJobResult(jobId, { status: 'processing' });

      // Generate content
      const result = await this.generate(
        jobId,
        job.provider_name,
        job.prompt,
        job.settings
      );

      // If we have a result, confirm the credit deduction
      if (result.success && job.transaction_id) {
        await this.walletManager.confirmDeduction(
          job.transaction_id,
          result.usage?.cost || 0
        );
      }

      // Upload to storage if needed
      if (result.content && result.content.startsWith('data:')) {
        const contentType = result.content.split(';')[0].split(':')[1];
        const fileExt = contentType.split('/')[1];
        const fileName = `${jobId}.${fileExt}`;
        const filePath = `generated/${job.user_id}/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await this.supabase.storage
          .from('generated-content')
          .upload(filePath, Buffer.from(result.content.split(',')[1], 'base64'), {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.error('Failed to upload generated content:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = this.supabase.storage
          .from('generated-content')
          .getPublicUrl(filePath);

        // Update job with storage URL
        await this.updateJobResult(jobId, {
          result: {
            ...job.result,
            url: publicUrl,
            file_path: filePath
          }
        });
      }

    } catch (error) {
      console.error('Error processing job:', error);
      
      // Release reserved credits on failure
      if (job.transaction_id) {
        try {
          await this.walletManager.releaseReservation(job.transaction_id);
        } catch (releaseError) {
          console.error('Failed to release reservation:', releaseError);
        }
      }
      
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}
