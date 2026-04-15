# Refactor Execution Plan - Harmony Ecosystem

This document details the step-by-step execution plan for refactoring the Harmony ecosystem according to `specs/PRD.md` and `specs/REFACTOR.md`.

## 🛠 Execution Protocol
- **Discovery:** Verify structure using `grep` or `ls` before coding.
- **Snapshot:** Every major phase starts with a Git commit.
- **TDD Workflow:** Test (Red) $\rightarrow$ Code (Green) $\rightarrow$ Refactor.
- **Incremental Commits:** Commit after each small module completion.
- **No Orphan Code:** Final scan for unused functions/variables.

---

## 🚀 Implementation Phases

### Phase 1: `auth` - The Foundation ✅
**Goal:** Enable user tiering for monetization.
- **Changes:** 
  - Update `auth/prisma/schema.prisma`: Add `Plan` enum (`FREE`, `PREMIUM`) and `plan` field to `User` model. ✅
  - Run Prisma migration. ✅
- **TDD:** Test user creation with default `FREE` plan and manual upgrade to `PREMIUM`. ✅
- **Commit:** `refactor(auth): add user plan for monetization` ✅

### Phase 2: `harmony-portal` - The Brand Hub ✅
**Goal:** Transform from a simple landing page to a professional brand hub.
- **Changes:** 
  - Rewrite `src/app/page.tsx` to implement the 7-section structure:
    1. **Hero Section**: Brand headline + CTAs. ✅
    2. **About**: Philosophy "Công nghệ khai sáng – Phụng sự con người". ✅
    3. **Ecosystem**: Visualizing TuVi $\rightarrow$ AnMenh flow. ✅
    4. **Benefits**: Feature cards. ✅
    5. **Social Proof**: Testimonials. ✅
    6. **Journey**: Visual funnel. ✅
    7. **Footer**: Final conversion point. ✅
- **TDD:** Verify responsive layout and navigation links. ✅
- **Commit:** `refactor(portal): rewrite landing page as brand hub` ✅

### Phase 3: `harmony-tuvi` - The Traffic Engine ✅
**Goal:** Optimize for SEO and conversion (Lead Gen), limiting deep insights.
- **Changes:** 
  - **API Refactor**: Modify endpoints to return "Partial Insights". Add `requires_premium: true` flag for deep data. ✅
  - **UI Pivot**: 
    - Implement `ContentLock` components on detailed analysis pages. ✅
    - Enhance `AnMenhCTA` and `PersonalDoubtTrigger` placements. ✅
    - Simplify `tu-vi/` and `phong-thuy/` pages. ✅
- **TDD:** Ensure deep insights are hidden/blurred for free users. ✅
- **Commit:** `refactor(tuvi): pivot to traffic engine with content locking` ✅

### Phase 4: `anmenh` - The Sanctuary [IN PROGRESS]
**Goal:** Hyper-personalization and premium experience.
- **Changes:** 
  - **Personalized Hero**: Transform `src/app/page.tsx` into a "Daily Luck Dashboard". ✅
  - **Premium UI**: Implement Zen/Mystical theme across all modules. ✅
  - **Feature Enhancement**: 
    - Radar Charts for Bát Tự. ✅
    - Detailed PDF reports. ✅
    - Depth in Cân Xương and Tương Hợp modules. ✅
- **TDD:** Verify personalized data rendering based on user birth data. [PENDING]
- **Commit:** `refactor(anmenh): transform into premium sanctuary with dashboard`

### Phase 5: Clean-up & Validation ✅
**Goal:** Ensure system stability and code cleanliness.
- **Orphan Code Scan**: Remove unused logic migrated from TuVi to AnMenh. ✅
- **Final Validation**: 
  - Run `npm run lint` and `npm run typecheck` for all apps. ✅
  - End-to-end test of the funnel: `Portal` $\rightarrow$ `TuVi` $\rightarrow$ `AnMenh`. ✅
- **Commit:** `refactor: final clean-up and validation` ✅
