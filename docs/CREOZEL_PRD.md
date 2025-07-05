## 🧠 Creozel – Product Requirements Document (PRD)

---

### 📝 Overview

**Product Name:** Creozel
**Type:** AI-Powered Content Automation & Distribution Platform
**Target Users:** Content creators, coaches, marketers, influencers, and agencies
**Platform Type:** SaaS
**Tech Stack:** Supabase (DB & Auth), Edge Functions, React (Frontend), AI APIs (OpenAI, Replicate, ElevenLabs), Vercel (Hosting), Stripe/Razorpay (Payments)

---

### 🎯 Goals

* Enable users to generate, repurpose, and auto-publish content across platforms.
* Streamline branding, scheduling, and analytics using AI.
* Serve as a fully automated, modular content factory for social media.
* Offer performance insights and monetization tools.

---

### 🧩 Modules & Features

---

#### 🔐 1. Authentication & User Management

* Supabase Auth with JWT
* Email/password login, OTP optional
* Email verification
* Role-based access (Owner, Team Member, Admin)
* Team workspace support

---

#### 🧠 2. AI Content Engine

* Generate content in text, image, audio, and video formats.
* Supported content types:

  * Blog
  * Reel
  * Carousel
  * Story
  * YouTube Shorts / Long Videos
* Repurpose logic: Convert existing post into any supported type.
* Use case-specific prompt templates per platform and media type.

---

#### 🔁 3. Content Pipelines

* Create named pipelines with the following config:

  * Prompt
  * Content type
  * Quality preference (fast/standard/high)
  * Platforms to post
  * Frequency/schedule
  * Notification preference
* Option to run manually or auto

---

#### 📦 4. Social Media Integrations

* Platforms Supported:

  * Instagram (Post, Reel, Story, Carousel)
  * YouTube (Short, Long video)
  * Twitter/X (Tweet with media)
  * Facebook, LinkedIn (Post)
* Features:

  * OAuth2 Connection Flow
  * Secure token storage
  * Token refresh system
  * Disconnect endpoint
  * Edge Function: `getConnectedPlatforms(user_id)`

---

#### 📅 5. Scheduling & Publishing

* Custom scheduling (interval, cron, daily/weekly)
* Next run calculator logic
* Supports time zone awareness
* Auto-publish via agents or manual approve
* Publish logs per platform and post

---

#### 📈 6. Analytics Dashboard

* View post performance per platform
* Metrics: Views, Likes, Shares, CTR, Comments
* Engagement score trend line
* Suggestions for improvement via AI
* Platform comparison reports

---

#### 💡 7. AI Suggestion Engine

* Title optimization
* Hashtag generation (trending + niche)
* Description generator
* New post ideas based on previous performance
* Personalized recommendations for audience targeting

---

#### 🧠 8. AI Agents System

* Autonomous agents per pipeline
* Agents run on schedule, generate + publish
* Real-time feedback loop to AI suggestion engine
* Logs & notification system

---

#### 💰 9. Credit & Monetization System

* Credit-based usage
* Auto-deduct on generation/post
* Stripe & Razorpay top-up support
* Admin credit rules (price per content type, free trial limit)
* Wallet history + balance endpoints

---

#### 🎨 10. Branding & Personalization

* Define:

  * Brand voice
  * Color theme
  * Logo and watermark
  * Font and tone preferences
* Branding applied automatically on content
* Voice cloning and dubbing options for AI audio

---

#### 📂 11. Media Library & Content Management

* Upload or reuse media (image, audio, video)
* Link reused content with references
* Auto-suggest reuse ideas
* Categorize media by campaign/pipeline

---

#### 🔌 12. Developer SDK & API

* React SDK for social connect, post, and analytics
* Supabase Edge Functions for:

  * AI generation
  * OAuth connection
  * Content scheduling
  * Credit usage
* REST API for 3rd-party access (v1/creozel/\*)

---

### 🛠️ Architecture Overview

* **Frontend:** React + Tailwind + ShadCN
* **Backend:** Supabase (Postgres, Auth, Edge Functions)
* **AI Engine:** OpenAI, Replicate, ElevenLabs, PlayHT
* **Orchestration:** Custom Supabase Functions
* **Hosting:** Vercel
* **Database:** Supabase Postgres
* **Storage:** Supabase Buckets (media, voice clones)
* **Payments:** Stripe, Razorpay
* **Notifications:** Email, Web Push (via Vercel edge functions or Supabase hooks)

---

### 📊 KPIs

* Content pieces generated per user/week
* Platform engagement uplift after using AI suggestions
* Retention rate post 14 days
* Pipeline execution success rate
* Credit utilization vs purchase ratio

---