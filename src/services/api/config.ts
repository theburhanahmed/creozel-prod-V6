/**
 * API Configuration
 * Replace these endpoint URLs with your actual backend endpoints
 */
// Base API URL - replace with your API base URL
export const API_BASE_URL = 'https://your-api-base-url.com/api';
// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`
};
// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile/update`,
  CHANGE_PASSWORD: `${API_BASE_URL}/user/password/change`
};
// Content generation endpoints
export const CONTENT_ENDPOINTS = {
  TEXT_GENERATION: `${API_BASE_URL}/content/generate/text`,
  IMAGE_GENERATION: `${API_BASE_URL}/content/generate/image`,
  AUDIO_GENERATION: `${API_BASE_URL}/content/generate/audio`,
  VIDEO_GENERATION: `${API_BASE_URL}/content/generate/video`
};
// Autopilot pipeline endpoints
export const AUTOPILOT_ENDPOINTS = {
  LIST_PIPELINES: `${API_BASE_URL}/autopilot/pipelines`,
  GET_PIPELINE: `${API_BASE_URL}/autopilot/pipelines/:id`,
  CREATE_PIPELINE: `${API_BASE_URL}/autopilot/pipelines`,
  UPDATE_PIPELINE: `${API_BASE_URL}/autopilot/pipelines/:id`,
  DELETE_PIPELINE: `${API_BASE_URL}/autopilot/pipelines/:id`,
  TOGGLE_PIPELINE_STATUS: `${API_BASE_URL}/autopilot/pipelines/:id/toggle`,
  GENERATE_CONTENT: `${API_BASE_URL}/autopilot/generate`,
  CONTENT_IDEAS: `${API_BASE_URL}/autopilot/content-ideas`
};
// Media endpoints
export const MEDIA_ENDPOINTS = {
  LIST_MEDIA: `${API_BASE_URL}/media`,
  UPLOAD_MEDIA: `${API_BASE_URL}/media/upload`,
  DELETE_MEDIA: `${API_BASE_URL}/media/:id`,
  GET_MEDIA_DETAILS: `${API_BASE_URL}/media/:id`,
  UPDATE_MEDIA: `${API_BASE_URL}/media/:id`,
  SEARCH_MEDIA: `${API_BASE_URL}/media/search`
};
// Social media account endpoints
export const SOCIAL_ENDPOINTS = {
  LIST_ACCOUNTS: `${API_BASE_URL}/social/accounts`,
  CONNECT_ACCOUNT: `${API_BASE_URL}/social/accounts/connect`,
  DISCONNECT_ACCOUNT: `${API_BASE_URL}/social/accounts/:id/disconnect`,
  GET_ACCOUNT_DETAILS: `${API_BASE_URL}/social/accounts/:id`,
  PUBLISH_CONTENT: `${API_BASE_URL}/social/publish`,
  SCHEDULED_POSTS: `${API_BASE_URL}/social/scheduled`
};
// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
  DASHBOARD_STATS: `${API_BASE_URL}/analytics/dashboard`,
  CONTENT_PERFORMANCE: `${API_BASE_URL}/analytics/content/:id`,
  SOCIAL_ENGAGEMENT: `${API_BASE_URL}/analytics/social`,
  AUDIENCE_INSIGHTS: `${API_BASE_URL}/analytics/audience`
};
// Stripe payment endpoints
export const PAYMENT_ENDPOINTS = {
  PLANS: `${API_BASE_URL}/payments/plans`,
  SUBSCRIBE: `${API_BASE_URL}/payments/subscribe`,
  BILLING_PORTAL: `${API_BASE_URL}/payments/billing-portal`,
  PAYMENT_METHODS: `${API_BASE_URL}/payments/methods`,
  INVOICES: `${API_BASE_URL}/payments/invoices`
};
// Environment-specific configurations
export const ENV_CONFIG = {
  SUPABASE_URL: 'https://your-supabase-project-url.supabase.co',
  SUPABASE_ANON_KEY: 'your-supabase-anon-key',
  STRIPE_PUBLIC_KEY: 'your-stripe-public-key'
};