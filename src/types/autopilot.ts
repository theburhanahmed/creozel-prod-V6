// Dev-Rules §Code Standards: TypeScript Rules
export type TPlatform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';

export interface IRepurposeConfig {
  targetPlatforms: TPlatform[];
  tone?: 'professional' | 'casual' | 'humorous';
  maxLength?: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

export interface IRepurposedContent {
  id: string;
  originalContentId: string;
  platform: TPlatform;
  content: string;
  mediaUrls?: string[];
  status: 'pending' | 'generated' | 'failed';
  createdAt: string;
}

export interface IPublishPayload {
  contentId: string;
  platforms: TPlatform[];
  scheduleFor?: string;
  metadata?: Record<string, unknown>;
}
