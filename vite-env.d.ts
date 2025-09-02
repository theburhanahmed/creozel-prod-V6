/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FACEBOOK_CLIENT_ID: string
  readonly VITE_LINKEDIN_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_TWITTER_CLIENT_ID: string
  readonly VITE_TIKTOK_CLIENT_KEY: string
  readonly VITE_INSTAGRAM_CLIENT_ID: string
  readonly VITE_WEBSITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
