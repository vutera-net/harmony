# CLAUDE.md — TuVi Project Reference

## Project Overview

**Name:** TuVi: VUTERA Harmony Tử Vi AI  
**Type:** SEO Traffic Funnel Engine (NOT a core product)  
**Purpose:** Generate massive organic traffic → funnel to AnMenh.VuTera.net (premium product)  
**Core Principle:** Provide 40-60% value by design → trigger information gap → user clicks CTA

---

## Strategic Context

- **Not a subscription product** (v1.0 was; v2.0 removed all payment logic in April 2026 pivot)
- **Completely stateless** (no user profiles, no login, no database required)
- **Funnel-first** (every feature must drive CTA clicks to AnMenh)
- **Non-personalizing** (generic by can-chi/zodiac; AnMenh does personalization)

---

## Tech Stack

| Layer               | Tech                             | Version        |
| ------------------- | -------------------------------- | -------------- |
| Framework           | Next.js (App Router)             | 16.2.1         |
| UI                  | React + TypeScript               | 19.2.4 + TS 5  |
| Styling             | TailwindCSS 4 + Framer Motion 12 |                |
| Astrology Engine    | `iztro` (Zi Wei Dou Shu)         | 2.5.8          |
| Lunar Calendar      | `amlich`, `lunar-calendar-ts-vi` | 0.0.2          |
| Database (optional) | PostgreSQL/Neon + Prisma         | 7.5.0          |
| Caching             | Upstash Redis                    | @upstash/redis |
| State (Client)      | Zustand                          | 5.0.12         |
| Monitoring          | Sentry                           | 10.x           |
| Analytics           | Google Analytics 4               | window.gtag    |
| PDF Export          | @react-pdf/renderer              | 4.4            |
| UI Primitives       | Radix UI (Dialog, Select, Tabs)  | latest         |
| Icons               | Lucide React                     | latest         |

---

## Project Structure

```
harmony-tuvi/                    ← Project root (Next.js app)
├─ src/                         ← Source code
│  ├─ app/                       ← App Router (Next.js 16)
│  │  ├─ (group-routes)/         ← Grouped route organizers
│  │  ├─ tu-vi/                  ← Tử Vi Đẩu Số pages
│  │  ├─ lich/                   ← Calendar pages
│  │  ├─ phong-thuy/             ← Feng shui pages
│  │  ├─ blog/                   ← Blog with markdown
│  │  ├─ api/                    ← API routes
   │  │  ├─ sitemap.ts              ← Dynamic sitemap (270+ URLs)
   │  │  ├─ robots.ts
   │  │  ├─ layout.tsx              ← Root layout + providers
   │  │  └─ page.tsx                ← Home page
   │  ├─ components/
   │  │  ├─ funnel/                 ← CRITICAL FOLDER
   │  │  │  ├─ AnMenhCTA.tsx        ← 3 variants: banner/inline/card
   │  │  │  ├─ ContentLock.tsx      ← Blurred content + CTA
   │  │  │  ├─ PersonalDoubtTrigger.tsx  ← "chưa đủ" message
   │  │  │  ├─ StickyCTA.tsx        ← Floating bottom button
   │  │  │  ├─ MiniFunnel.tsx       ← 3-state engagement widget
   │  │  │  ├─ EcosystemBanner.tsx
   │  │  │  └─ BridgeTransition.tsx ← Cross-app animation
   │  │  ├─ layout/
   │  │  │  ├─ SiteHeader.tsx
   │  │  │  ├─ SiteFooter.tsx
   │  │  │  └─ Breadcrumb.tsx
   │  │  ├─ common/
   │  │  ├─ forms/
   │  │  └─ charts/
   │  ├─ data/                      ← Static TypeScript data modules
   │  │  ├─ can-chi.ts              ← 60 can-chi combinations
   │  │  ├─ nap-am.ts               ← Five-element fate lookup
   │  │  ├─ ngu-hanh.ts             ← Element properties
   │  │  ├─ sao28.ts                ← Lunar mansions
   │  │  ├─ tiet-khi.ts             ← 24 solar terms
   │  │  ├─ hoang-dao.ts            ← Auspicious hours
   │  │  ├─ festivals.ts
   │  │  ├─ phongthuy/              ← Feng shui data
   │  │  └─ tuvi/                   ← Tử Vi star/palace data
   │  ├─ lib/
   │  │  ├─ engines/                ← Calculation engines
   │  │  │  ├─ lunar-engine.ts      ← Hồ Ngọc Đức algo
   │  │  │  ├─ ngu-hanh-engine.ts
   │  │  │  ├─ tuvi-engine.ts       ← iztro wrapper
   │  │  │  ├─ iztro-adapter.ts
   │  │  │  ├─ tuvi-interpreter.ts
   │  │  │  ├─ bat-trach-engine.ts
   │  │  │  ├─ cuu-cung-engine.ts
   │  │  │  ├─ date-selection-engine.ts
   │  │  │  └─ horoscope-generator.ts
   │  │  ├─ seo/                    ← SEO helpers
   │  │  │  ├─ meta-helpers.ts
   │  │  │  ├─ structured-data.ts   ← Schema generators
   │  │  │  └─ seo-config.ts
   │  │  ├─ urls.ts                 ← APP_URLS constants
   │  │  ├─ hooks/
   │  │  │  └─ useSessionMemory.ts  ← localStorage (birth_year, gender)
   │  │  └─ utils/
   │  ├─ hooks/
   │  └─ styles/
   ├─ public/
   ├─ content/
   │  └─ blog/                      ← Markdown blog posts
   ├─ middleware.ts                 ← Auth cookie reader
   ├─ next.config.ts
   ├─ tsconfig.json
   ├─ tailwind.config.ts
   └─ package.json
```

---

## Core Design Principles

### Principle #1: Controlled Value (40-60% Rule)

Provide ONLY 40-60% of real astrological insight. Never provide:

- Hour-based analysis (AnMenh-only)
- Personalized warnings
- Multi-year life paths
- Taming recommendations

### Principle #2: Induced Incompleteness

Every page must trigger: "Đúng nhưng chưa đủ cho mình."

Tools:

- **Doubt triggers** (italic footnotes + amber warning boxes)
- **Content locks** (blurred sections + CTA)
- **Soft input** (let user enter year → show "personalized" but still generic content)

### Principle #3: Funnel First

Every feature answers: "Does this drive CTA clicks to AnMenh?"

- ✅ Daily horoscope → KEEP
- ✅ Content lock → KEEP
- ❌ User journal → REMOVE (keeps user in TuVi)
- ❌ Internal premium tier → REMOVE (competes with AnMenh)

### Principle #4: Non-Personalization Boundary

TuVi = generic (year/zodiac level)  
AnMenh = personalized (hour + profile level)

Do NOT build:

- "Save my profile"
- "Personalized dashboard"
- "My predictions history"

---

## Funnel Component Inventory

**CRITICAL FOLDER:** `/src/components/funnel/`

| Component                | Purpose                        | File                     | Variants                |
| ------------------------ | ------------------------------ | ------------------------ | ----------------------- |
| **AnMenhCTA**            | Context-aware CTA button       | AnMenhCTA.tsx            | banner / inline / card  |
| **ContentLock**          | Blurred content + overlay CTA  | ContentLock.tsx          | blur / fade / hard-cut  |
| **PersonalDoubtTrigger** | "chưa đủ" psychology text      | PersonalDoubtTrigger.tsx | subtle / prominent      |
| **StickyCTA**            | Floating bottom-right button   | StickyCTA.tsx            | dismiss-able            |
| **MiniFunnel**           | 3-state engagement widget      | MiniFunnel.tsx           | idle / loading / result |
| **EcosystemBanner**      | Top banner announcing Harmony  | EcosystemBanner.tsx      | dismiss-able            |
| **BridgeTransition**     | Cross-app navigation animation | BridgeTransition.tsx     | auto-play               |

**Key props patterns:**

```tsx
// AnMenhCTA
<AnMenhCTA
  variant="banner" | "inline" | "card"
  intent="horoscope" | "phongthuy" | "ngaytot" | "gieo-que"
  birthYear={1984}           // Optional
  gender="male" | "female"   // Optional
/>

// ContentLock
<ContentLock>
  <div>locked content here</div>
  <AnMenhCTA variant="card" intent="horoscope" />
</ContentLock>

// PersonalDoubtTrigger
<PersonalDoubtTrigger
  variant="subtle" | "prominent"
  text="Kết quả này chỉ dựa trên năm sinh..."
/>
```

---

## Existing Calculation Engines

All in `/src/lib/engines/`:

| Engine               | Purpose                                                  | File                     | Key exports                                        |
| -------------------- | -------------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| **Lunar**            | Solar↔Lunar conversion, Can-Chi, Hoang Dao, 28 Sao, Truc | lunar-engine.ts          | `convertToLunar()`, `getCanChi()`, `getHoangDao()` |
| **Ngu Hanh**         | Element lookup from year                                 | ngu-hanh-engine.ts       | `getNguHanh()`, `getNapAm()`                       |
| **TuVi**             | Bát Tự chart generation via iztro                        | tuvi-engine.ts           | `generateChart()`, `getStars()`                    |
| **iztro Adapter**    | Wraps iztro library                                      | iztro-adapter.ts         | `iztroToVN()`                                      |
| **TuVi Interpreter** | Chart text generation                                    | tuvi-interpreter.ts      | `interpretChart()`                                 |
| **Bat Trach**        | 8-palace feng shui                                       | bat-trach-engine.ts      | `calculateBatTrach()`                              |
| **Cuu Cung**         | Flying star (Phi Tinh)                                   | cuu-cung-engine.ts       | `calculateCuuCung()`                               |
| **Date Selection**   | Auspicious day finder                                    | date-selection-engine.ts | `findAuspiciousDates()`                            |
| **Horoscope Gen**    | Daily horoscope for zodiac                               | horoscope-generator.ts   | `generateHoroscope()`                              |

---

## SEO Infrastructure

### Sitemap

**File:** `/src/app/sitemap.ts`  
**Output:** 270+ URLs, organized by frequency/priority

### Meta Helpers

**File:** `/src/lib/seo/meta-helpers.ts`

Key functions:

- `generateMetaTitle()` — consistent title formula
- `generateMetaDescription()` — hook + context + caveat formula
- `getCanonicalUrl()`
- `generateOpenGraphTags()`
- `generateTwitterTags()`

### Structured Data

**File:** `/src/lib/seo/structured-data.ts`

Generators:

- `generateArticleSchema()` — for horoscope pages
- `generateFAQSchema()` — for FAQ-style content
- `generateBreadcrumbSchema()` — for hierarchy

---

## Data Layer

### Static Lookup Tables

All in `/src/data/`:

**Can-Chi:** `/data/can-chi.ts`

```ts
interface CanChiYear {
  year: number;
  can: string;
  chi: string;
  slug: string;
  element: string;
  animal: string;
  napAm: string;
  // ...
}

export const CAN_CHI_YEARS: CanChiYear[] = [
  /* 60 entries */
];
```

**Nạp Âm:** `/data/nap-am.ts` — 30 two-year fate types
**Ngũ Hành:** `/data/ngu-hanh.ts` — Element properties, directions, lucky numbers

### Blog Content

**Location:** `/content/blog/` (markdown files)  
**Format:** Gray-matter front matter + markdown body

```markdown
---
title: "12 Cung Hoàng Đạo năm 2026"
excerpt: "Dự báo chi tiết..."
date: "2026-04-12"
category: "horoscope"
tags: ["zodiac", "2026"]
---

# Content here...
```

---

## AnMenh Integration

### URL & Parameter Contract

**Base:** `https://anmenh.vutera.net/bridge`

**Params:**

- `source=tuvi_lock` — CTA position (lock/inline/sticky/exit/hero)
- `intent=horoscope` — Feature context (horoscope/phongthuy/ngaytot/bat-tu/etc.)
- `birthYear=1984` — Soft input capture
- `gender=male` — Soft input capture
- `utm_source=tuvi`, `utm_medium=content_lock`, `utm_campaign=daily-giap-ty-2026-04-12`

### Session Memory (localStorage)

**Key:** `tuvi_session_memory`

```json
{
  "birthYear": 1984,
  "birthMonth": 1,
  "birthDay": 15,
  "birthHour": null,
  "gender": "male",
  "name": null
}
```

**Hook:** `useSessionMemory()` — read/write this localStorage object

### BridgeTransition Animation

**Shared component** between tuvi and anmenh.  
**Animation:** 4 messages over 2.5 seconds, then navigate.

Creates psychology of "data transfer" → builds trust before handoff.

---

## Analytics Events (GA4)

All events must have properties:

- `page_path`
- `can_chi` (if applicable)
- `birthYear` (if soft input captured)
- `scroll_depth` (for CTAs)

Key events:

- `tuvi_cta_click` — CTA button click
- `tuvi_content_lock_view` — lock component renders
- `tuvi_soft_input_capture` — user enters birth year
- `tuvi_doubt_trigger_impression` — doubt text scrolled into view
- `tuvi_anmenh_navigation` — successful bridge navigation

---

## Anti-Patterns (DO NOT BUILD)

❌ **Full horoscope insight** in TuVi (40-60% rule violation)  
❌ **Personalization** within TuVi (AnMenh's domain)  
❌ **Long user retention features** (daily streaks, notifications, forums)  
❌ **Early content lock** (should appear mid-page, not top)  
❌ **Unclear CTAs** (must be obvious, high contrast, multiple positions)  
❌ **No analytics** (every CTA/lock must track)  
❌ **Premature database** (start static JSON + ISR)

---

## Coding Conventions

### TypeScript

- Use strict mode (tsconfig.json: `"strict": true`)
- Interface > Type for object shapes
- Avoid `any`; use `unknown` if needed

### React

- Use hooks (no class components)
- Memoize expensive renders (useMemo, useCallback)
- Server Components by default (Next.js 16 App Router)

### Styling

- TailwindCSS utility-first
- Use `@apply` for reusable patterns
- CSS custom properties for theme (colors: `--color-primary`, `--color-secondary`)

### File Organization

- Colocate related files (component + styles + tests in same folder)
- Use barrel exports (`index.ts`) for public APIs
- No nested folders > 3 levels deep

---

## Testing Approach

**Framework:** Jest + React Testing Library  
**Current:** 182+ tests  
**Coverage target:** 70%+

**Test patterns:**

- Unit: Engines (`lunar-engine.test.ts`)
- Component: Funnel components (`AnMenhCTA.test.tsx`)
- Integration: Page routes (`/tu-vi/[congiap]/page.test.tsx`)

**Run tests:**

```bash
npm test
npm test -- --coverage
```

---

## Performance Checklist

- [ ] LCP < 2.5s (hero must load fast)
- [ ] CLS < 0.1 (reserve space for content lock, sticky CTA)
- [ ] INP < 200ms (CTA buttons must respond instantly)
- [ ] No layout shifts on content lock reveal
- [ ] Images use `next/image` with explicit width/height
- [ ] Font subsets include Vietnamese diacritics
- [ ] ISR revalidation: daily=86400s, annual=2592000s

---

## Deployment

**Host:** Vercel  
**Branch:** main (auto-deploy on push)  
**Env vars:** See `.env.local` (API keys, AnMenh URL, etc.)

**Build:**

```bash
npm run build
```

**Cron jobs (Vercel):**

- Daily horoscope refresh: `/api/cron/daily-horoscope` at 00:00 UTC+7

---

## Key Metrics to Monitor

| Metric                   | Target        | Tool               |
| ------------------------ | ------------- | ------------------ |
| Organic users/month      | 500K+         | GA4                |
| CTA CTR                  | 8-15%         | GA4 event          |
| Soft input capture       | 20-30%        | GA4 event          |
| Content lock interaction | 30%+          | GA4 event          |
| AnMenh signup rate       | 5-10% of CTAs | AnMenh dashboard   |
| LCP (Core Web Vitals)    | < 2.5s        | PageSpeed Insights |
| Bounce rate              | 35-45%        | GA4                |

---

## Quick Links

- **Product Strategy:** `harmony-tuvi/specs.md`
- **Full PRD:** `harmony-tuvi/docs/PRD.md`
- **Implementation Plan:** `harmony-tuvi/docs/IMPLEMENTATION_PLAN.md`
- **Funnel Components:** `harmony-tuvi/src/components/funnel/`
- **Engines:** `harmony-tuvi/src/lib/engines/`
- **Data:** `harmony-tuvi/src/data/`
- **Codebase (v1 reference):** `tuvi/`

---

**Last Updated:** 2026-04-13  
**Status:** Active Development (v2.0)
