// Social Media Integration Service
// Handles all API calls to Supabase Edge Functions for social media integrations

import { supabase } from '../../../supabase/client';

export const socialService = {
  // Connect a social account (OAuth2)
  async connect(platform: string, code: string, state: string) {
    // Calls the social-connect Edge Function
    const { data, error } = await supabase.functions.invoke('social-connect', {
      body: { platform, code, state },
    });
    if (error) throw error;
    return data;
  },

  // Disconnect a social account
  async disconnect(platform: string) {
    const { data, error } = await supabase.functions.invoke('social-disconnect', {
      body: { platform },
    });
    if (error) throw error;
    return data;
  },

  // Get all connected platforms for the current user
  async getConnectedPlatforms() {
    const { data, error } = await supabase.functions.invoke('social-connect', {
      body: { action: 'list' },
    });
    if (error) throw error;
    return data;
  },

  // Post content to a social platform
  async postToPlatform(platform: string, content: any) {
    const { data, error } = await supabase.functions.invoke('post-to-platform', {
      body: { platform, ...content },
    });
    if (error) throw error;
    return data;
  },

  // Fetch analytics for a platform
  async fetchAnalytics(platform: string, params: any = {}) {
    const { data, error } = await supabase.functions.invoke('social-analytics', {
      body: { platform, ...params },
    });
    if (error) throw error;
    return data;
  },
};

// Utility to build Facebook OAuth2 URL
export function getFacebookOAuthUrl(userId: string, redirectUri: string) {
  // VITE_FACEBOOK_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'email,public_profile',
    auth_type: 'rerequest',
  });
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

// Utility to build LinkedIn OAuth2 URL
export function getLinkedInOAuthUrl(userId: string, redirectUri: string) {
  // VITE_LINKEDIN_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'r_liteprofile r_emailaddress w_member_social',
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

// Utility to build Google OAuth2 URL
export function getGoogleOAuthUrl(userId: string, redirectUri: string) {
  // VITE_GOOGLE_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Utility to build Twitter/X OAuth2 URL (PKCE)
export function getTwitterOAuthUrl(userId: string, redirectUri: string, codeChallenge: string) {
  // VITE_TWITTER_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'tweet.read tweet.write users.read offline.access',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

// Utility to build YouTube OAuth2 URL (uses Google OAuth2)
export function getYouTubeOAuthUrl(userId: string, redirectUri: string) {
  // VITE_GOOGLE_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Utility to build Instagram OAuth2 URL
export function getInstagramOAuthUrl(userId: string, redirectUri: string) {
  // VITE_INSTAGRAM_CLIENT_ID must be set in your Vite environment
  const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'user_profile,user_media',
  });
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

// Utility to build TikTok OAuth2 URL
export function getTikTokOAuthUrl(userId: string, redirectUri: string) {
  // VITE_TIKTOK_CLIENT_KEY must be set in your Vite environment
  const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY;
  const state = btoa(JSON.stringify({ userId }));
  const params = new URLSearchParams({
    client_key: clientKey,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'user.info.basic,video.list,video.upload',
  });
  return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;
} 