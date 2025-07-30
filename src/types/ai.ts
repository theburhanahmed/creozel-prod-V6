export type AIProviderName = 'openai' | 'claude' | 'gemini';

export interface AIProvider {
  id: string; // UUID from Supabase row
  name: AIProviderName;
  model: string; // e.g. 'gpt-4o', 'claude-3-opus', 'gemini-pro'
  content_types: ('text' | 'image' | 'video' | 'audio')[]; // supported content types
  price_per_1k_tokens: number; // USD cents per 1k tokens for text / audio, or approximate tokens for image/video
  price_per_image?: number; // For image generation, USD cents per image if applicable
  price_per_video_min?: number; // For video cost, cents per minute (if appropriate)
  is_default: boolean; // whether selected as default provider for supported types
  profit_margin_percent: number; // admin-set markup percentage to apply on provider cost
  is_active: boolean; // allow toggling provider on/off without deleting row
  created_at: string;
  updated_at: string;
}

export interface GenerationOptions {
  type: 'text' | 'image' | 'video' | 'audio';
  prompt: string;
  providerId?: string; // optional; will be chosen automatically if omitted
  extra?: Record<string, unknown>; // e.g. style, voice, etc.
}

export interface GenerationResponse {
  content: any; // actual content (string/url/base64 etc.)
  usage: {
    tokens?: number;
    credits_charged: number;
    providerId: string;
  };
}
