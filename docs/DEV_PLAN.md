## Implementation Plan (Refined & Granular)

This plan breaks down each feature/flow into specific, actionable steps for backend (Edge Functions), service layer, and UI wiring. For ongoing enhancements, see /docs/CONTENT_PIPELINE_ENHANCEMENTS.md.

---

### 1. **Authentication & User Management**
- **Edge Functions:**
  - `/supabase/functions/user-profile` (CRUD user profile)
  - `/supabase/functions/_shared/auth.ts` (auth helpers)
  - `/supabase/functions/team-management` (team CRUD, invites, switching)
- **Frontend Service:**
  - `/src/services/auth/authService.ts` (Supabase Auth, profile, email verification)
  - `/src/services/auth/teamService.ts` (team management)
- **Tasks:**
  - [x] Integrate Supabase Auth (sign up, login, JWT, email verification)
  - [x] Implement role-based access (Owner, Team Member, Admin)
  - [x] Team workspace support (invite, manage, switch)
  - [x] User profile management (get, update)
  - [ ] Add audit logs for user/team actions
  - [ ] Add user deletion/deactivation flow

---

### 2. **Credit & Monetization System**
- **Edge Functions:**
  - `/supabase/functions/manage-credits` (balance, add, deduct)
  - `/supabase/functions/deduct-credits` (deduct on generation/post)
  - `/supabase/functions/create-stripe-customer` (Stripe integration)
  - `/supabase/functions/razorpay-payment` (Razorpay integration)
- **Frontend Service:**
  - `/src/services/payment/stripeService.ts` (credits, payments)
- **Tasks:**
  - [x] Credit deduction on generation/post
  - [x] Stripe & Razorpay top-up
  - [x] Admin credit rules (pricing logic, plan logic)
  - [x] Wallet history & balance
  - [ ] Add credit expiration/bonus logic
  - [ ] Add refund/dispute handling

---

### 3. **AI Content Engine**
- **Edge Functions:**
  - `/supabase/functions/generate-content` (text, image, audio, video)
  - `/supabase/functions/ai-openai`, `/ai-replicate`, `/ai-elevenlabs` (AI providers)
  - `/supabase/functions/repurpose-content` (content conversion)
  - `/supabase/functions/prompt-templates` (prompt config)
- **Frontend Service:**
  - `/src/services/autopilot/autopilotService.ts` (content generation, repurposing)
- **Tasks:**
  - [x] Text, image, audio, video generation (all editors wired to Edge Functions)
  - [x] Repurpose content (convert between formats)
  - [x] Prompt templates per platform/media type
  - [x] Content generation history (query content_generations table)
  - [ ] Add advanced options (model, parameters, style)
  - [ ] Add post-processing (AI suggestions, upscaling, summarization)
  - [ ] Add moderation/plagiarism checks
  - [ ] Add brand/personalization support
  - [ ] See /docs/CONTENT_PIPELINE_ENHANCEMENTS.md for more

---

### 4. **Content Pipelines**
- **Edge Functions:**
  - `/supabase/functions/pipeline-management` (CRUD, targets)
  - `/supabase/functions/run-pipelines` (manual/auto run)
  - `/supabase/functions/schedule-pipeline` (scheduling)
  - `/supabase/functions/pipeline-status` (status, logs)
- **Frontend Service:**
  - `/src/services/autopilot/autopilotService.ts` (pipeline CRUD, run, schedule)
- **Tasks:**
  - [x] Create/edit/delete pipelines
  - [x] Manual & auto run
  - [x] Pipeline status & notifications
  - [ ] Add flexible scheduling (cron, time zones)
  - [ ] Add pipeline templates/cloning
  - [ ] Add analytics/logs dashboard
  - [ ] Add branching, dynamic inputs, webhooks
  - [ ] See /docs/CONTENT_PIPELINE_ENHANCEMENTS.md for more

---

### 5. **Social Media Integrations**
- **Edge Functions:**
  - `/supabase/functions/social-connect` (OAuth2 connect)
  - `/supabase/functions/social-disconnect` (disconnect)
  - `/supabase/functions/post-to-platform` (posting)
  - `/supabase/functions/social-analytics` (analytics)
- **Frontend Service:**
  - `/src/services/social/socialService.ts`
- **Tasks:**
  - [x] OAuth2 connection flow (per platform: IG, FB, X, LI, YT, TikTok)
  - [x] Token storage & refresh (initial implementation)
  - [x] Get connected platforms (UI + backend wired)
  - [x] Post to social platforms (UI + backend endpoints ready)
  - [x] Fetch analytics/insights per platform (scaffolded)
  - [x] Error handling, retry, and logs (basic, see enhancements)
  - [x] See /docs/CONTENT_PIPELINE_ENHANCEMENTS.md for further enhancements

---

### 6. **Scheduling & Publishing**
- **Edge Functions:**
  - `/supabase/functions/schedule-pipeline` (scheduling)
  - `/supabase/functions/run-pipelines` (publishing)
- **Frontend Service:**
  - `/src/services/autopilot/autopilotService.ts`
- **Tasks:**
  - [ ] Custom scheduling (interval, cron, timezone)
  - [ ] Auto/manual publishing
  - [ ] Publish logs & notifications
  - [ ] Add calendar view for scheduled posts
  - [ ] Add bulk scheduling/import

---

### 7. **Media Library & Content Management**
- **Edge Functions:**
  - (To be implemented: media upload, reuse, categorization)
- **Frontend Service:**
  - `/src/services/media/mediaService.ts`
- **Tasks:**
  - [ ] Upload/reuse media (images, audio, video)
  - [ ] Link/reference content to media
  - [ ] Auto-suggest reuse ideas
  - [ ] Categorize/tag media
  - [ ] Add search, filter, and bulk actions

---

### 8. **Branding & Personalization**
- **Edge Functions:**
  - (To be implemented: branding settings, voice cloning, etc.)
- **Frontend Service:**
  - `/src/services/settings/brandingService.ts` (if not present, to be created)
- **Tasks:**
  - [ ] Brand voice, color, logo, font, tone
  - [ ] Voice cloning & dubbing
  - [ ] Brand asset management
  - [ ] Brand guidelines enforcement

---

### 9. **Analytics Dashboard**
- **Edge Functions:**
  - `/supabase/functions/social-analytics`
- **Frontend Service:**
  - `/src/services/social/socialService.ts` or `/src/services/analytics/analyticsService.ts`
- **Tasks:**
  - [ ] Fetch & display post performance (per platform)
  - [ ] Engagement score trends
  - [ ] AI suggestions for improvement
  - [ ] Platform comparison reports
  - [ ] Add custom analytics widgets

---

### 10. **AI Suggestion Engine**
- **Edge Functions:**
  - (To be implemented: title optimization, hashtag generation, description generator, new post ideas, audience recommendations)
- **Frontend Service:**
  - `/src/services/autopilot/autopilotService.ts`
- **Tasks:**
  - [ ] Title optimization (AI-powered)
  - [ ] Hashtag generation
  - [ ] Description generator
  - [ ] New post ideas
  - [ ] Personalized audience recommendations
  - [ ] Integrate with content editors and pipelines

---

### 11. **AI Agents System**
- **Edge Functions:**
  - (To be implemented: agent scheduling, feedback loop, logs)
- **Frontend Service:**
  - `/src/services/autopilot/autopilotService.ts`
- **Tasks:**
  - [ ] Autonomous agents per pipeline
  - [ ] Real-time feedback loop
  - [ ] Logs & notifications
  - [ ] Agent performance analytics

---

### 12. **Developer SDK & API**
- **Edge Functions:**
  - (To be implemented: REST endpoints for 3rd-party access)
- **Frontend Service:**
  - `/src/services/sdk/sdkService.ts` (if needed)
- **Tasks:**
  - [ ] React SDK for social connect, post, analytics
  - [ ] REST API endpoints for all major features
  - [ ] API documentation & examples

---

**For ongoing and future enhancements, see:**
- `/docs/CONTENT_PIPELINE_ENHANCEMENTS.md` (detailed roadmap for content generation & pipelines)
