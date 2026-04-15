# Refactor Specification - Harmony Ecosystem

This document outlines the refactoring plan to align the current codebase with the new strategic direction: **Harmony Landing Page (Hub) $\rightarrow$ TuVi App (Traffic Engine) $\rightarrow$ AnMenh App (Sanctuary)**.

## 1. Audit: Affected Modules & Files

### 1.1. `harmony-portal` (Harmony Landing Page)
- **Current State:** Minimal landing page with a waitlist modal.
- **Target State:** Brand Hub.
- **Affected Files:**
  - `src/app/page.tsx`: Complete rewrite to implement the new structure (Hero, About, Ecosystem, etc.).
  - `src/components/common/WaitlistModal.tsx`: Repurpose or move to specific conversion points.

### 1.2. `harmony-tuvi` (TuVi App)
- **Current State:** Comprehensive tool with both basic and some deep features.
- **Target State:** Traffic Engine (SEO-focused, light, high conversion).
- **Affected Files/Modules:**
  - `src/app/api/`: Review all endpoints. Ensure they provide "basic" insights. Deep analysis should be delegated to AnMenh.
  - `src/components/funnel/`: Enhance and standardize `AnMenhCTA`, `ContentLock`, `StickyCTA` to drive traffic to AnMenh.
  - `src/lib/engines/`: Identify "deep" logic that belongs in the Sanctuary.
  - `src/app/tu-vi/`, `src/app/phong-thuy/`: Simplify pages to show "Partial Insights" and use `ContentLock` for the rest.

### 1.3. `anmenh` (AnMenh App)
- **Current State:** High-value tools but needs better "Sanctuary" positioning and monetization.
- **Target State:** Hyper-personalized Premium Sanctuary.
- **Affected Files/Modules:**
  - `src/app/page.tsx`: Transform into a "Daily Luck Dashboard" (Personalized Hero).
  - `src/app/tu-vi/`, `src/app/bat-trach/`, etc.: Enhance with deep analysis, Radar Charts, and PDF exports.
  - `src/components/`: Implement a "Premium" design system (Zen/Mystical).
  - New: Implement Paywall/Pricing integration.

### 1.4. `auth` (SSO Service)
- **Current State:** Basic authentication and user management.
- **Target State:** Centralized Identity & Entitlement Provider.
- **Affected Files:**
  - `prisma/schema.prisma`: Add fields for user tiers (e.g., `plan: 'FREE' | 'PREMIUM'`, `subscriptionEndDate`).

---

## 2. Impact Analysis

### 2.1. Breaking Changes
- **SEO/URLs:** Moving deep features from `harmony-tuvi` to `anmenh` will change URLs. 
  - *Mitigation:* Implement 301 redirects in `harmony-tuvi`'s `next.config.ts` or middleware.
- **API:** If third-party apps or other internal services rely on `harmony-tuvi`'s deep APIs, they will break.
  - *Mitigation:* Keep existing endpoints but return "limited" data and a `requires_premium: true` flag, pointing to AnMenh.

### 2.2. Database Migration
- **Schema Change:** Adding `plan` to the User model.
  - *Migration:* Standard Prisma migration. Default all existing users to `FREE`.

---

## 3. Refactor Plan

### 3.1. Keep (Preserve)
- **Auth Core:** The SSO logic and shared cookie mechanism (`.vutera.net`).
- **TuVi SEO Pages:** The structure of `tu-vi-hom-nay`, `tu-vi-nam-[year]`, and `blog` to maintain organic traffic.
- **Calculation Engines:** The core lunar/astrological logic (can be shared via a library or duplicated if lightweight).

### 3.2. Modify (Update)
- **`harmony-portal` $\rightarrow$ Brand Hub:**
  - Implement the 7-section structure from `specs/IDEA.md`.
  - Focus on "Awareness" and high-level brand positioning.
- **`harmony-tuvi` $\rightarrow$ Traffic Engine:**
  - **Logic:** Strip deep interpretations. Return "Basic" results.
  - **UI:** Implement "Partial Insight" views with `ContentLock`.
  - **Funnel:** Maximize `AnMenhCTA` visibility.
- **`anmenh` $\rightarrow$ Sanctuary:**
  - **UI/UX:** Shift to "Zen/Mystical" theme.
  - **Features:** Add hyper-personalized Dashboard.
  - **Monetization:** Integrate the paywall and pricing tiers.

### 3.3. Delete (Remove)
- **Redundant Premium Logic in TuVi:** Remove any complex PDF generation or deep analysis that should be exclusive to AnMenh.
- **Duplicate Auth Logic:** Ensure NO app handles its own auth; all must redirect to `auth.vutera.net`.
