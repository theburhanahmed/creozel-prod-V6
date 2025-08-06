import { SupabaseClient } from '@supabase/supabase-js';
import { ContentType, Provider, ProviderConfig, AppError } from '../types';
import { createClient } from '@supabase/supabase-js';

// Default provider configurations
const DEFAULT_PROVIDERS: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'openai',
    displayName: 'OpenAI',
    isActive: true,
    contentTypes: ['text', 'image'],
    costPerUnit: 0.00002, // Per token for text, per image for DALL-E
    config: {
      defaultModel: 'gpt-4',
      imageModel: 'dall-e-3',
      maxTokens: 2048,
      temperature: 0.7,
    },
    priority: 1,
  },
  {
    name: 'stability',
    displayName: 'Stability AI',
    isActive: true,
    contentTypes: ['image'],
    costPerUnit: 0.018, // Per image
    config: {
      defaultModel: 'stable-diffusion-xl-1024-v1-0',
      width: 1024,
      height: 1024,
      steps: 30,
    },
    priority: 2,
  },
  {
    name: 'elevenlabs',
    displayName: 'ElevenLabs',
    isActive: true,
    contentTypes: ['audio'],
    costPerUnit: 0.0003, // Per character
    config: {
      defaultVoice: 'Rachel',
      modelId: 'eleven_monolingual_v1',
    },
    priority: 1,
  },
  {
    name: 'replicate',
    displayName: 'Replicate',
    isActive: true,
    contentTypes: ['video', 'audio', 'image'],
    costPerUnit: 0.02, // Approximate per second for video/audio
    config: {
      videoModel: 'stability-ai/sdxl',
      audioModel: 'facebookresearch/musicgen',
    },
    priority: 3,
  },
];

export class ProviderManager {
  private providers: Map<string, Provider> = new Map();
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.initializeProviders();
  }

  private async initializeProviders() {
    try {
      // First, check if we have providers in the database
      const { data: dbProviders, error } = await this.supabase
        .from('providers')
        .select('*');

      if (error) {
        console.error('Error loading providers from database:', error);
        throw error;
      }

      // If no providers in DB, insert the default ones
      if (!dbProviders || dbProviders.length === 0) {
        console.log('Initializing default providers in database...');
        const { data: insertedProviders, error: insertError } = await this.supabase
          .from('providers')
          .insert(DEFAULT_PROVIDERS)
          .select();

        if (insertError) {
          console.error('Error initializing default providers:', insertError);
          throw insertError;
        }

        // Cache the inserted providers
        insertedProviders?.forEach(provider => {
          this.providers.set(provider.name, provider);
        });
      } else {
        // Cache providers from DB
        dbProviders.forEach(provider => {
          this.providers.set(provider.name, provider);
        });
      }
    } catch (error) {
      console.error('Failed to initialize providers:', error);
      // Fallback to in-memory providers if DB fails
      DEFAULT_PROVIDERS.forEach(provider => {
        this.providers.set(provider.name, {
          ...provider,
          id: `fallback-${provider.name}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }
  }

  /**
   * Get the default provider for a specific content type
   * @param contentType The type of content to generate
   * @returns The most suitable provider
   */
  public getDefaultProvider(contentType: ContentType): Provider {
    const providers = Array.from(this.providers.values())
      .filter(p => p.isActive && p.contentTypes.includes(contentType))
      .sort((a, b) => a.priority - b.priority || a.costPerUnit - b.costPerUnit);

    if (providers.length === 0) {
      throw new AppError(
        `No active providers available for content type: ${contentType}`,
        503,
        'NO_PROVIDER_AVAILABLE'
      );
    }

    return providers[0];
  }

  /**
   * Get a specific provider by name
   * @param name The provider's unique name
   * @returns The provider or undefined if not found
   */
  public getProvider(name: string): Provider | undefined {
    return this.providers.get(name);
  }

  /**
   * Estimate the cost of generating content with a specific provider
   * @param provider The provider to use
   * @param prompt The prompt or input for generation
   * @returns Estimated cost in credits
   */
  public estimateCost(provider: Provider, prompt: string): number {
    // Simple estimation based on prompt length and provider type
    // This should be enhanced with actual tokenization for production use
    let estimatedUnits = 0;

    switch (provider.name) {
      case 'openai':
        // Rough estimate: 1 token ~= 4 characters
        estimatedUnits = Math.ceil(prompt.length / 4);
        break;
      case 'stability':
        // Fixed cost per image generation
        estimatedUnits = 1;
        break;
      case 'elevenlabs':
        // Cost per character for TTS
        estimatedUnits = prompt.length;
        break;
      case 'replicate':
        // Fixed base cost for video/audio generation
        estimatedUnits = 1;
        break;
      default:
        // Fallback to prompt length as a rough estimate
        estimatedUnits = prompt.length;
    }

    return Number((estimatedUnits * provider.costPerUnit).toFixed(6));
  }

  /**
   * Get the provider configuration from environment variables
   * @param providerName The provider's name
   * @returns Provider configuration
   */
  public static getProviderConfig(providerName: string): ProviderConfig {
    const envPrefix = `PROVIDER_${providerName.toUpperCase()}_`;
    const config: ProviderConfig = {
      name: providerName,
      apiKey: process.env[`${envPrefix}API_KEY`] || '',
      baseUrl: process.env[`${envPrefix}BASE_URL`],
      defaultModel: process.env[`${envPrefix}DEFAULT_MODEL`],
    };

    // Add any additional provider-specific config from environment
    Object.keys(process.env).forEach(key => {
      if (key.startsWith(envPrefix)) {
        const configKey = key.replace(envPrefix, '').toLowerCase();
        if (!['api_key', 'base_url', 'default_model'].includes(configKey)) {
          // @ts-ignore - Dynamic assignment
          config[configKey] = process.env[key];
        }
      }
    });

    return config;
  }

  /**
   * Get all available providers
   * @returns Array of all providers
   */
  public getAllProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get all providers that support a specific content type
   * @param contentType The content type to filter by
   * @returns Array of matching providers
   */
  public getProvidersByType(contentType: ContentType): Provider[] {
    return Array.from(this.providers.values()).filter(p => 
      p.isActive && p.contentTypes.includes(contentType)
    );
  }

  /**
   * Refresh the provider cache from the database
   */
  public async refreshProviders(): Promise<void> {
    const { data: providers, error } = await this.supabase
      .from('providers')
      .select('*');

    if (error) {
      console.error('Error refreshing providers:', error);
      throw error;
    }

    // Update the cache
    this.providers.clear();
    providers.forEach(provider => {
      this.providers.set(provider.name, provider);
    });
  }
}

// Create a singleton instance
export const providerManager = new ProviderManager(
  createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
);

export default providerManager;
