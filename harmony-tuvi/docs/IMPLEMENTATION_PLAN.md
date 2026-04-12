# TuVi Implementation Plan — Phases & Checkboxes

**Version:** 2.0  
**Status:** Ready for execution  
**Estimated Timeline:** 8-12 weeks (depending on team size)  
**Last Updated:** 2026-04-12

---

## Overview

6 sequential phases with detailed checkboxes for tracking progress. Each phase builds on the previous one and delivers measurable value.

**Success criteria:** Product launches with:
- 270+ SEO pages (currently deployed)
- 5-position CTA system (all functional)
- Full funnel tracking (GA4 events + attribution)
- AnMenh integration (bridge navigation working)
- Core Web Vitals targets met (LCP < 2.5s, CLS < 0.1)

---

## Phase 1: Foundation & Data Layer

**Duration:** 1-2 weeks  
**Goal:** Build solid data models for can-chi, nạp âm, tiết khí systems.  
**Deliverable:** All lookup tables ready for content generation.

### 1.1 Can-Chi Data Model (10 Heavenly Stems + 12 Earthly Branches)

- [ ] Create `/src/data/can-chi.ts` TypeScript module
  - [ ] Define `CanChiYear` interface with fields: year, canIndex, chiIndex, can, chi, slug, element, animal, polarity, napAm
  - [ ] Populate `CAN_CHI_YEARS` array with all 60 combinations (1924-2044 wrap)
  - [ ] Add helper functions: `getCanChiByYear(year)`, `getCanChiBySlug(slug)`, `getAllCanChiSlugs()`
  - [ ] Add Tuong Sinh (compatible) + Tuong Khac (conflicting) arrays for each zodiac
  - [ ] Add lucky colors, lucky numbers, lucky directions for each can-chi

- [ ] Create `/src/data/ten-thien-can.ts` (Heavenly Stems lookup)
  - [ ] Index, name (Giáp/Ất/Bính...), element, polarity, color, direction
  
- [ ] Create `/src/data/dia-chi.ts` (Earthly Branches lookup)
  - [ ] Index, name (Tý/Sửu/Dần...), animal, element, lucky hours, direction

- [ ] Test can-chi calculations
  - [ ] Unit tests: `(1984-4) % 10 = 0 (Giáp)`, `(1984-4) % 12 = 0 (Tý)` ✓
  - [ ] Verify all 60 slugs are unique and valid

### 1.2 Nạp Âm Ngũ Hành (Five Elements Fate)

- [ ] Create `/src/data/nap-am.ts` lookup table
  - [ ] 30 two-year pairs covering full 60-cycle
  - [ ] Fields: sexagenaryCycle, element (e.g., "Hải Trung Kim"), description, fortune profile
  - [ ] Add `getNapAm(sexagenaryIndex)` function

- [ ] Create `/src/data/ngu-hanh-elements.ts` (element properties)
  - [ ] 5 elements: Mộc (Wood), Hỏa (Fire), Thổ (Earth), Kim (Metal), Thủy (Water)
  - [ ] For each: color, direction, season, lucky numbers, lucky animals
  - [ ] Tuong Sinh (generating) + Tuong Khac (conflicting) relationships

- [ ] Map can stems to elements
  - [ ] Giáp/Ất → Mộc, Bính/Đinh → Hỏa, Mậu/Kỷ → Thổ, Canh/Tân → Kim, Nhâm/Quý → Thủy

### 1.3 Tiết Khí (24 Solar Terms) — 2026-2027

- [ ] Create `/src/data/tiet-khi-2026.ts`
  - [ ] 24 solar terms with dates, solar longitude, Vietnamese name
  - [ ] Format: `{ name: "Tiểu Hàn", date: "2026-01-05", solarLongitude: 285 }`
  
- [ ] Create `/src/data/tiet-khi-2027.ts` (pre-compute)

- [ ] Add helper: `getTietKhi(date: Date)` → returns current/upcoming tiết khí

### 1.4 Lunar Calendar (Pre-computed Static JSON)

- [ ] Create `/src/data/lunar-dates-2024-2028.json`
  - [ ] Pre-compute all lunar dates for 2024-2028 using Hồ Ngọc Đức algorithm
  - [ ] Fields per date: gregorian, lunar, can-chi day, tiết khí, hoang-dao rating
  - [ ] File size: ~200KB (acceptable for ISR caching)

- [ ] Create `/src/lib/lunar-calendar-loader.ts`
  - [ ] Function: `getLunarDate(gregorianDate): LunarDate`
  - [ ] Function: `getNextTietKhi(gregorianDate)` → returns next solar term

- [ ] Test lunar conversion
  - [ ] `2026-04-04 (Gregorian) → Mùn 02, Năm 2026 (Lunar)` ✓

### 1.5 Can-Chi Slug Utilities

- [ ] Create `/src/lib/can-chi-slug.ts`
  - [ ] Function: `slugify(canName, chiName)` → "giap-ty"
  - [ ] Function: `deslugify(slug)` → { can: "Giáp", chi: "Tý" }
  - [ ] Function: `isValidCanChiSlug(slug)` → boolean

- [ ] Test slug generation
  - [ ] All 60 slugs are unique, valid, URL-safe

### 1.6 TypeScript Interfaces (Centralized)

- [ ] Create `/src/types/index.ts` with master interface definitions:
  - [ ] `CanChiYear`, `LunarDate`, `TietKhi`, `NapAm`, `NguHanh`
  - [ ] Use everywhere instead of inline interfaces

---

## Phase 2: SEO Infrastructure

**Duration:** 2 weeks  
**Goal:** Build SEO foundation: sitemap, schema, meta generation.  
**Deliverable:** All pages have proper meta, schema, canonical URLs.

### 2.1 URL Taxonomy & Slug Generation

- [ ] Create `/src/lib/url-taxonomy.ts`
  - [ ] Enum: `ContentType = 'daily' | 'annual' | 'age' | 'zodiac' | 'star' | 'phongthuy'`
  - [ ] Function: `buildPageUrl(type, params)` → full URL path
  - [ ] Function: `getAllGeneratableUrls()` → returns array of all 270+ paths

- [ ] Document URL patterns in CLAUDE.md
  - [ ] `/tu-vi-hom-nay/[can-chi]`, `/tu-vi-nam-[YYYY]/[can-chi]`, etc.

### 2.2 Dynamic Sitemap Generation

- [ ] Update `/src/app/sitemap.ts`
  - [ ] Generate all 270+ (or 5000+) URLs with correct metadata
  - [ ] Set `changeFrequency`: daily for horoscope, monthly for annual, static for age
  - [ ] Set `priority`: 0.9 (daily), 0.8 (annual), 0.7 (age), 0.5 (star/phongthuy)
  - [ ] Include last-modified dates (recompute for ISR pages)

- [ ] Test sitemap generation
  - [ ] Run `npm run build` → check `/public/sitemap.xml` exists
  - [ ] Verify all 60 daily horoscope URLs present
  - [ ] Verify at least 3000+ annual URLs present

### 2.3 Schema Markup Generators

- [ ] Create `/src/lib/seo/structured-data.ts`
  - [ ] `generateArticleSchema(page)` — for horoscope pages
    - [ ] Fields: @type, headline, description, datePublished, dateModified, author, inLanguage, image
  
  - [ ] `generateFAQSchema(faqItems)` — for Q&A content
    - [ ] Fields: Question, acceptedAnswer structures
  
  - [ ] `generateBreadcrumbSchema(breadcrumbs)` — for hierarchy
    - [ ] Positions, names, URLs

  - [ ] `generateLocalBusinessSchema()` — optional: for brand credibility

- [ ] Inject schema into layout.tsx or page-specific layouts
  - [ ] Use `<Script strategy="beforeInteractive">` for JSON-LD injection

### 2.4 Meta Tags & OG Image Helpers

- [ ] Create/update `/src/lib/seo/meta-helpers.ts`
  - [ ] `generateMetaTitle(zodiac, contentType, date)` — formula-based
  - [ ] `generateMetaDescription(zodiac, contentType)` — assertion + context + caveat
  - [ ] `generateOpenGraphTags(page)` — og:title, og:description, og:image, og:type
  - [ ] `generateTwitterTags(page)` — twitter:card, twitter:title, twitter:description
  - [ ] `getCanonicalUrl(pathname)` — handle date-parameterized pages

- [ ] Integrate with `generateMetadata()` in page files
  - [ ] Every page exports metadata function
  - [ ] Test: `/tu-vi-hom-nay/giap-ty` has unique title, description, schema

### 2.5 hreflang Implementation

- [ ] Add hreflang links in layout
  - [ ] For Vietnamese: `<link rel="alternate" hreflang="vi" href="https://tuvi.vutera.net/..." />`
  - [ ] Even if Vietnamese-only, signals language explicitly

- [ ] Setup `x-default` for non-translated pages (if future expansion)

### 2.6 robots.txt Configuration

- [ ] Create/update `/public/robots.txt`
  - [ ] `User-agent: *`, `Allow: /`
  - [ ] `Disallow: /api/`, `/admin/`, `/_next/`
  - [ ] `Sitemap: https://tuvi.vutera.net/sitemap.xml`
  - [ ] `Crawl-delay: 1`

- [ ] Test robots.txt
  - [ ] Verifiable at `https://tuvi.vutera.net/robots.txt`

### 2.7 Core Web Vitals Baseline

- [ ] Run PageSpeed Insights on 5 representative pages
  - [ ] `/` (home)
  - [ ] `/tu-vi-hom-nay/giap-ty` (daily)
  - [ ] `/tu-vi-nam-2026/giap-ty` (annual)
  - [ ] `/lich/2026/4` (calendar)
  - [ ] `/blog/sample-post` (blog)

- [ ] Document baseline scores in CLAUDE.md
  - [ ] Target: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## Phase 3: Content Engine

**Duration:** 2-3 weeks  
**Goal:** Build templated content generation system for horoscopes.  
**Deliverable:** All 60 daily + 3000+ annual pages auto-generated with fresh content.

### 3.1 Daily Horoscope Template System

- [ ] Create `/src/lib/content/horoscope-template.ts`
  - [ ] Define content blocks: Tổng quan, Tình cảm, Sự nghiệp, Tài chính, Sức khỏe
  - [ ] Each block has 3-5 "outcome" options: Positive, Mixed, Cautious, Neutral
  - [ ] Template includes `[ASSERTION]`, `[EVIDENCE]`, `[CAVEAT]` placeholders

- [ ] Create `/src/lib/content/seeded-rng.ts`
  - [ ] Function: `seededRandom(seed)` → deterministic RNG
  - [ ] Input: can-chi slug + date hash
  - [ ] Output: repeatable selection for same can-chi + date

- [ ] Implement `generateDailyHoroscope(canChiSlug, date)`
  - [ ] Seed = hash(canChiSlug + formatDate(date))
  - [ ] Select outcomes from template based on RNG + seasonal context
  - [ ] Return object: { tongQuan, tinhCam, suNghiep, taiChinh, sucKhoe }

- [ ] Test generation
  - [ ] Same slug + same date → same content ✓ (deterministic)
  - [ ] Different slug → different content ✓
  - [ ] Different date → different content ✓
  - [ ] Content variation for 60+ days without repetition ✓

### 3.2 Annual Forecast Page Template

- [ ] Create `/src/lib/content/annual-forecast-template.ts`
  - [ ] More detailed than daily (5,000+ words)
  - [ ] Sections: Year overview, Career, Love, Finance, Health, Lucky elements, Warnings, Recommendations

- [ ] Generate annual pages via `generateAnnualForecast(canChiSlug, year)`
  - [ ] Similar seeded approach but year-level
  - [ ] More stable (less variation needed within a year)

### 3.3 Birth Year / Age Profile Pages

- [ ] Create `/src/lib/content/age-profile-template.ts`
  - [ ] Profile for each birth year (1920-2010, 90 pages)
  - [ ] Fields: Can-Chi, Nạp Âm, Element, Animal, Lucky numbers, Lucky colors, Lucky directions, Tuong Sinh (compatible), Tuong Khác (conflicting)

- [ ] Implement `generateAgeProfile(year)`
  - [ ] Lookup can-chi, nạp âm data
  - [ ] Format as HTML/JSX for page display

### 3.4 Content Quality Checks

- [ ] Create `/src/lib/content/quality-checks.ts`
  - [ ] Function: `validateHoroscope(content)` → boolean
  - [ ] Checks:
    - [ ] Contains assertion (not wishy-washy)
    - [ ] Contains evidence/explanation (credible)
    - [ ] Contains caveat (triggers doubt)
    - [ ] No false positives (claims that feel obviously wrong)
    - [ ] 200-400 words per section (not too short/long)

- [ ] Add quality check to build process
  - [ ] Warn if any generated horoscope fails validation

### 3.5 Update Page Components to Use Generated Content

- [ ] `/src/app/tu-vi-hom-nay/[can-chi]/page.tsx`
  - [ ] Use `generateDailyHoroscope()` to fetch content
  - [ ] Display using existing layout + components
  - [ ] Add ISR: `revalidate: 86400` (daily refresh)

- [ ] `/src/app/tu-vi-nam-[YYYY]/[can-chi]/page.tsx`
  - [ ] Use `generateAnnualForecast()` to fetch content
  - [ ] ISR: `revalidate: 2592000` (monthly refresh)

- [ ] `/src/app/tu-vi-tuoi/[year]/page.tsx`
  - [ ] Use `generateAgeProfile()` to fetch content
  - [ ] ISR: `revalidate: 2592000` (monthly refresh)

### 3.6 Blog Content Expansion

- [ ] Audit existing blog posts in `/content/blog/`
  - [ ] Current: 3 sample posts
  - [ ] Goal: 50+ posts covering major tử vi topics

- [ ] Create blog content plan
  - [ ] Topics: "12 cung hoàng đạo", "ý nghĩa 28 sao", "nạp âm ngũ hành", etc.
  - [ ] SEO keywords per post documented
  - [ ] Internal linking to horoscope pages

- [ ] Write/generate 47 new blog posts (10+ weeks, can be parallelized)
  - [ ] AI-assisted content generation okay (human review required)

### 3.7 Content Caching Strategy

- [ ] Setup Redis caching for expensive computations
  - [ ] Cache horoscope content by can-chi + date
  - [ ] Cache annual forecasts by can-chi + year
  - [ ] TTL: 24 hours (daily refresh aligns with ISR)

- [ ] Test cache hits/misses
  - [ ] First request to daily page: cache miss, compute, store
  - [ ] Second request same day: cache hit, fast response

---

## Phase 4: Funnel Optimization

**Duration:** 2 weeks  
**Goal:** Implement 5-position CTA system + content lock + doubt triggers.  
**Deliverable:** Complete conversion funnel on all pages.

### 4.1 ContentLock Component (CSS-First)

- [ ] Review existing `/src/components/funnel/ContentLock.tsx`
  - [ ] Ensure CSS blur without layout shift
  - [ ] Verify min-height reservation prevents CLS
  - [ ] Test CLS score with PageSpeed

- [ ] Implement blur + gradient overlay pattern
  - [ ] CSS: `filter: blur(4px)`, `pointer-events: none`, `user-select: none`
  - [ ] Gradient: fade-to-white at bottom
  - [ ] Accessibility: `aria-label="Locked content"`

- [ ] Test on mobile
  - [ ] Use fade gradient instead of blur (performance)
  - [ ] Full-width CTA button (56px height)

### 4.2 5-Position CTA Placement System

- [ ] **Position 1: Hero CTA**
  - [ ] Location: After hook + first paragraph
  - [ ] Copy: "Xem chính xác hơn →"
  - [ ] Expected: 15% click rate
  - [ ] Implement in page templates

- [ ] **Position 2: Inline CTA (After Doubt Trigger)**
  - [ ] Location: After first PersonalDoubtTrigger
  - [ ] Copy: "Xem cảnh báo cá nhân →"
  - [ ] Expected: 25% cumulative click rate
  - [ ] Implement in page templates

- [ ] **Position 3: Content Lock Gate (PRIMARY)**
  - [ ] Location: Blurred content section, mid-page
  - [ ] Copy: "🔒 Mở khóa để xem đầy đủ"
  - [ ] Expected: 40% cumulative click rate
  - [ ] Already exists in ContentLock component

- [ ] **Position 4: Sticky Bottom CTA**
  - [ ] Location: Fixed bottom-right, dismiss-able
  - [ ] Show between 30-85% scroll depth
  - [ ] Copy: "Xem bản cá nhân hóa"
  - [ ] Expected: 20% cumulative click rate
  - [ ] Review/enhance StickyCTA component

- [ ] **Position 5: Exit Intent Popup**
  - [ ] Location: Desktop mouse-leave, mobile scroll-up
  - [ ] Copy: "Khoan! Xem cảnh báo quan trọng"
  - [ ] Expected: 5% cumulative click rate
  - [ ] Implement exit-intent detection

- [ ] Create `/src/components/funnel/ExitIntentPopup.tsx` if not exists
  - [ ] Detect: mouseLeave (desktop) + scroll-up velocity (mobile)
  - [ ] Show once per session (respect dismissal)
  - [ ] GA4 event: `tuvi_exit_intent_shown`, `tuvi_exit_intent_click`

### 4.3 Dynamic CTA Text System

- [ ] Create `/src/lib/cta-text-generator.ts`
  - [ ] Input: `{ haseBirthYear, page_context, can_chi }`
  - [ ] Output: contextual CTA copy

- [ ] Implement logic:
  - [ ] If birthYear captured: "Xem bản cá nhân hóa cho tuổi Giáp Tý"
  - [ ] If birthYear NOT captured: "Xem dự báo cá nhân hóa"
  - [ ] If phongthuy context: "Tối ưu phong thủy nhà bạn →"
  - [ ] If ngaytot context: "Chọn ngày tốt dành cho bạn →"

### 4.4 PersonalDoubtTrigger Integration

- [ ] Review `/src/components/funnel/PersonalDoubtTrigger.tsx`
  - [ ] Implement `variant="subtle"` (italic footnote)
  - [ ] Implement `variant="prominent"` (amber warning box)

- [ ] Add to page templates
  - [ ] Daily pages: 1-2 prominent triggers
  - [ ] Annual pages: 2-3 subtle + 1 prominent
  - [ ] Spread throughout content (not clustered)

- [ ] Test triggers
  - [ ] Content is readable with subtle variant
  - [ ] Prominent variant doesn't overwhelm

### 4.5 Soft Input Widget Enhancement

- [ ] Review `/src/hooks/useSessionMemory.ts`
  - [ ] localStorage key: `tuvi_session_memory`
  - [ ] Fields: birthYear, birthMonth, birthDay, birthHour, gender, name

- [ ] Implement soft input display logic
  - [ ] Widget appears at ~20% scroll depth
  - [ ] Never appears again if user dismisses
  - [ ] Store state: `{tuvi_session_dismissed: true}`

- [ ] Integrate into all CTA links
  - [ ] Every CTA URL includes `?birthYear=1984&gender=male` if captured
  - [ ] If not captured, URL doesn't include these params

- [ ] Test soft input
  - [ ] User enters birth year
  - [ ] Value persists across pages (via localStorage)
  - [ ] All subsequent CTA links auto-include the param

### 4.6 MiniFunnel Widget Enhancement

- [ ] Review `/src/components/funnel/MiniFunnel.tsx`
  - [ ] State 1: Idle (input + button)
  - [ ] State 2: Loading (2-3 second progress bar animation)
  - [ ] State 3: Result (zodiac info + CTA)

- [ ] Enhance animations
  - [ ] Use Framer Motion for smooth transitions
  - [ ] Progress bar fills over 2-3 seconds (fake loading)
  - [ ] Result fades in smoothly

- [ ] Test on mobile
  - [ ] Responsive input, full-width
  - [ ] No overflow, readable

### 4.7 Mobile-Specific Optimizations

- [ ] ContentLock on mobile
  - [ ] Use fade gradient instead of blur
  - [ ] Full-width CTA button, 56px height
  - [ ] No horizontal scroll

- [ ] Sticky CTA on mobile
  - [ ] Fixed to bottom, respect safe-area-inset-bottom
  - [ ] CSS: `padding-bottom: env(safe-area-inset-bottom)`
  - [ ] Dismissible by scroll (up)

- [ ] Exit intent on mobile
  - [ ] Trigger on scroll-up velocity (not mouse-out)
  - [ ] Less aggressive than desktop

---

## Phase 5: AnMenh Integration & Analytics

**Duration:** 2 weeks  
**Goal:** Full funnel tracking + cross-app navigation.  
**Deliverable:** All CTA clicks tracked, bridge navigation working.

### 5.1 UTM Parameter System

- [ ] Create `/src/lib/utm-builder.ts`
  - [ ] Function: `buildUTMParams(source, medium, campaign)`
  - [ ] Standard format: `utm_source=tuvi&utm_medium=content_lock&utm_campaign=daily-giap-ty-2026-04-12`

- [ ] Inject into all AnMenh URLs
  - [ ] Every CTA link includes UTM params
  - [ ] Test: URLs have proper format in GA4

### 5.2 Session Memory Enhancement

- [ ] Expand `/src/hooks/useSessionMemory.ts`
  - [ ] Fields: birthYear, birthMonth, birthDay, gender, name (optional)
  - [ ] Persistence: localStorage (`tuvi_session_memory`)
  - [ ] Lifetime: permanent until cleared

- [ ] Hook usage
  - [ ] Every page calls `useSessionMemory()` at top
  - [ ] Every CTA reads current values + injects to URL
  - [ ] Forms update values on user input

- [ ] Test persistence
  - [ ] User enters year on daily page
  - [ ] Navigate to annual page
  - [ ] Year is pre-filled in widgets
  - [ ] All CTAs include year param

### 5.3 GA4 Event Tracking (MANDATORY)

- [ ] Create `/src/lib/analytics/events.ts`
  - [ ] Helper functions for all event types

- [ ] Implement events:

  - [ ] `tuvi_page_view`
    - [ ] Properties: page_path, page_title, can_chi (if applicable), content_type
    - [ ] Fire on page load (GA4 auto fires page_view, this is supplementary)

  - [ ] `tuvi_content_view`
    - [ ] Properties: content_section, can_chi
    - [ ] Fire when content section becomes visible (intersection observer)

  - [ ] `tuvi_cta_click` (PRIMARY METRIC)
    - [ ] Properties: cta_position (hero/inline/lock/sticky/exit), cta_variant, can_chi, birthYear (if captured), scroll_depth, page_path
    - [ ] Fire on every CTA button click
    - [ ] Test: GA4 shows 50+ clicks/hour in analytics

  - [ ] `tuvi_content_lock_view`
    - [ ] Properties: lock_position, can_chi, birthYear (if captured)
    - [ ] Fire when lock component renders

  - [ ] `tuvi_content_lock_interaction`
    - [ ] Properties: action (hovered / zoomed / etc.)
    - [ ] Optional: track if user tries to select blurred text

  - [ ] `tuvi_soft_input_capture`
    - [ ] Properties: input_type (birth_year / gender), value
    - [ ] Fire when user submits soft input form

  - [ ] `tuvi_doubt_trigger_impression`
    - [ ] Properties: trigger_text (hash or ID), variant, page_section
    - [ ] Fire when doubt trigger text scrolls into viewport

  - [ ] `tuvi_scroll_depth`
    - [ ] Properties: depth_threshold (25% / 50% / 75% / 100%), time_to_threshold
    - [ ] Fire as user scrolls to each milestone

  - [ ] `tuvi_anmenh_navigation`
    - [ ] Properties: bridge_animation_played (true/false), destination_url, params_count
    - [ ] Fire when BridgeTransition completes + user navigates away

- [ ] Integrate events into components
  - [ ] AnMenhCTA: fire `tuvi_cta_click` on click
  - [ ] ContentLock: fire `tuvi_content_lock_view` on render
  - [ ] PersonalDoubtTrigger: use intersection observer for `tuvi_doubt_trigger_impression`
  - [ ] Document scroll: use scroll listener for `tuvi_scroll_depth` milestones

- [ ] Test GA4 integration
  - [ ] Go to /tu-vi-hom-nay/giap-ty
  - [ ] Click CTA button
  - [ ] Verify GA4 shows `tuvi_cta_click` event with correct properties

### 5.4 A/B Testing Framework (Client-Side, Stable Bucketing)

- [ ] Create `/src/lib/ab-testing/stable-bucketing.ts`
  - [ ] Function: `getVariant(userId, experimentId, variants)` → returns stable variant
  - [ ] Hash: `hash(userId + experimentId) % variants.length`
  - [ ] Same user always gets same variant (deterministic)
  - [ ] No database needed

- [ ] Implement experiments:
  - [ ] Exp 1: CTA text (action vs. benefit vs. curiosity)
  - [ ] Exp 2: Content lock position (40% vs. 60% scroll)
  - [ ] Exp 3: Doubt trigger variant (subtle vs. prominent frequency)
  - [ ] Exp 4: MiniFunnel animation speed

- [ ] Track experiment assignment
  - [ ] GA4 event: `experiment_assigned` with experiment_id + variant
  - [ ] Include variant in all subsequent events (`ab_variant` dimension)

- [ ] Test A/B framework
  - [ ] Same user across sessions gets same variant ✓
  - [ ] Different users distributed across variants ✓
  - [ ] GA4 shows variants in reports ✓

### 5.5 AnMenh Bridge URL Construction

- [ ] Create `/src/lib/bridge-urls.ts`
  - [ ] Function: `buildAnMenhBridgeUrl(params)`
    - [ ] Input: { source, intent, birthYear, gender, can_chi, customParams }
    - [ ] Output: `https://anmenh.vutera.net/bridge?source=...&intent=...&...`

- [ ] Integrate into all CTA components
  - [ ] AnMenhCTA uses `buildAnMenhBridgeUrl()` on click
  - [ ] Soft input values + scroll depth automatically included

- [ ] Test bridge URL generation
  - [ ] Daily page with soft input captured: URL includes birthYear + gender ✓
  - [ ] Daily page without soft input: URL has default values ✓
  - [ ] UTM params present ✓

### 5.6 BridgeTransition Component Integration

- [ ] Verify `/src/components/funnel/BridgeTransition.tsx` exists + works
  - [ ] Shows 4 messages over 2.5 seconds
  - [ ] Auto-navigates after animation completes
  - [ ] Can be triggered from any CTA button click

- [ ] Integrate into CTA handlers
  - [ ] On CTA click: show BridgeTransition
  - [ ] After animation: navigate to AnMenh URL
  - [ ] Test: smooth handoff with animation

- [ ] Test on mobile
  - [ ] Animation plays at full viewport
  - [ ] Navigation completes without layout shift

### 5.7 Attribution Tracking

- [ ] Setup UTM parameters for all CTA variants
  - [ ] utm_source: always `tuvi`
  - [ ] utm_medium: `hero` / `inline` / `content_lock` / `sticky` / `exit_intent`
  - [ ] utm_campaign: `daily-giap-ty-2026-04-12` (page-specific)

- [ ] Setup AnMenh side (coordinate with AnMenh team)
  - [ ] AnMenh reads UTM params from URL
  - [ ] AnMenh stores utm_source + utm_medium in user profile
  - [ ] AnMenh reports back: "X% of signups came from tuvi_content_lock"

- [ ] Build attribution dashboard
  - [ ] GA4: Conversions by utm_medium (which CTA position converts best?)
  - [ ] Track: `tuvi_cta_click` → `tuvi_anmenh_navigation` → AnMenh signup rate

---

## Phase 6: Performance & Scale

**Duration:** 2 weeks (can overlap with Phase 5)  
**Goal:** Hit performance targets, prepare for 5000+ URLs.  
**Deliverable:** LCP < 2.5s, CLS < 0.1, sitemap scales to 5000+ URLs.

### 6.1 ISR Revalidation Tuning

- [ ] Update page `revalidate` values
  - [ ] Daily pages: `revalidate: 86400` (24 hours)
  - [ ] Annual pages: `revalidate: 2592000` (30 days)
  - [ ] Age pages: `revalidate: 2592000` (30 days)
  - [ ] Blog posts: `revalidate: 604800` (7 days)
  - [ ] Star-palace pages: static (no revalidation needed)

- [ ] Test ISR behavior
  - [ ] Deploy page
  - [ ] Wait 1 minute, request page → should be cached (fast)
  - [ ] Modify content in data source
  - [ ] After revalidate TTL expires, next request regenerates page

### 6.2 Image Optimization

- [ ] Audit all images in pages
  - [ ] Replace PNG horoscope icons with SVG (smaller, scalable)
  - [ ] Compress hero images to WebP
  - [ ] Set explicit width/height on all images (prevent CLS)

- [ ] Use `next/image` component
  - [ ] All images via `<Image>` not `<img>`
  - [ ] Specify width, height, alt
  - [ ] Test: images lazy-load below fold

- [ ] Optimize zodiac/can-chi icons
  - [ ] Create SVG icon set (~12 zodiac + 60 can-chi icons)
  - [ ] Inline or sprite for best performance
  - [ ] Test: icons load instantly, no layout shift

### 6.3 Font Optimization

- [ ] Subset Vietnamese fonts
  - [ ] Include diacritics (á, à, ả, ã, ạ, etc.)
  - [ ] Fonts: Geist Sans (primary), serif fallback
  - [ ] Preload critical font weights

- [ ] Preload fonts in layout
  - [ ] CSS: `<link rel="preload" as="font" href="/fonts/geist-sans-latin-vietnamese.woff2">`
  - [ ] Test: Text appears immediately (no FOIT)

### 6.4 Core Web Vitals Optimization

- [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] Profiling: identify LCP element on each page type
  - [ ] Typical: h1 hero + first paragraph
  - [ ] Optimize: async load non-critical scripts, defer heavy components
  - [ ] Test: LCP under 2.5s on all 5 representative pages

- [ ] CLS (Cumulative Layout Shift) < 0.1
  - [ ] Reserve space for content lock: `min-height: 200px`
  - [ ] Reserve space for sticky CTA: account for fixed positioning
  - [ ] Reserve space for ads (none currently, but future-proof)
  - [ ] Test: PageSpeed Insights shows CLS 0.0-0.05

- [ ] INP (Interaction to Next Paint) < 200ms
  - [ ] Optimize CTA button click handlers
  - [ ] Defer analytics until after paint
  - [ ] Remove any sync heavy computation from event handlers
  - [ ] Test: Button clicks register instantly

- [ ] Run PageSpeed Insights on production
  - [ ] Target: 90+ Lighthouse score (mobile)
  - [ ] Identify remaining bottlenecks, iterate

### 6.5 Sitemap Index for 5000+ URLs

- [ ] Create sitemap index structure
  - [ ] `/sitemap.xml` (index)
  - [ ] `/sitemap-daily.xml` (60 daily pages)
  - [ ] `/sitemap-annual.xml` (3000+ annual pages)
  - [ ] `/sitemap-age.xml` (90 age pages)
  - [ ] `/sitemap-star.xml` (168 star-palace pages)
  - [ ] `/sitemap-blog.xml` (50+ blog posts)

- [ ] Each sitemap max 50,000 entries (Google limit)
- [ ] Update `/public/robots.txt`:
  ```
  Sitemap: https://tuvi.vutera.net/sitemap.xml
  ```

- [ ] Submit sitemaps to Google Search Console
  - [ ] Monitor crawl stats, index rate

### 6.6 Hub-and-Spoke Internal Linking Automation

- [ ] Create linking strategy
  - [ ] Daily page links to: annual page, age page, related zodiac pages
  - [ ] Annual page links to: daily page, age page, star-palace pages
  - [ ] Age page links to: annual, daily, feng shui pages

- [ ] Implement link generation
  - [ ] Create `/src/lib/internal-linking.ts`
  - [ ] Function: `getRelatedPages(pageType, params)` → returns related page URLs
  - [ ] Inject links at bottom of content ("Xem thêm" section)

- [ ] Test linking
  - [ ] Daily page has 3-5 related links ✓
  - [ ] Links are correct + canonical ✓
  - [ ] No 404 links ✓

### 6.7 AI Content Scaling Preparation

- [ ] Document content generation system for future AI use
  - [ ] Current: seeded RNG + templates
  - [ ] Future: LLM-enhanced horoscope generation
  - [ ] Prepare: prompts, quality gates, guardrails

- [ ] Create content generation checklist
  - [ ] Input validation (can-chi must be valid)
  - [ ] Output quality checks (must pass validation function)
  - [ ] Freshness checks (no repetition across 60 days)

- [ ] Estimate cost/complexity for AI scaling
  - [ ] If using Claude API: ~$0.01 per horoscope × 60 × 365 = $219/year (minimal)
  - [ ] If using open-source LLM: self-hosted cost

### 6.8 Performance Monitoring Setup

- [ ] Setup continuous monitoring
  - [ ] Google PageSpeed Insights API (weekly check)
  - [ ] Google Analytics: Real User Monitoring (RUM) for LCP/CLS/INP
  - [ ] Sentry: Performance profiling for slow endpoints

- [ ] Create alerting
  - [ ] LCP > 3s on any page → alert
  - [ ] CLS > 0.1 → alert
  - [ ] 404 error rate spike → alert

- [ ] Document in runbook
  - [ ] How to respond to performance alerts
  - [ ] Who to notify

---

## Completion Checklist

- [ ] **Phase 1 complete:** All data models tested, can-chi/nạp âm/tiết khí lookup working
- [ ] **Phase 2 complete:** 270+ pages have unique meta/schema, sitemap valid, Core Web Vitals baseline measured
- [ ] **Phase 3 complete:** Daily/annual/age horoscope pages auto-generated, content quality passes validation
- [ ] **Phase 4 complete:** 5-position CTA system functional, content locks rendering, doubt triggers visible, soft input capturing
- [ ] **Phase 5 complete:** GA4 events firing correctly, UTM params in all URLs, A/B testing framework ready, AnMenh bridge navigation working
- [ ] **Phase 6 complete:** LCP < 2.5s, CLS < 0.1, INP < 200ms on representative pages, sitemap scales to 5000+, hub-and-spoke linking implemented

---

## Success Metrics (Post-Launch)

- [ ] **Organic traffic:** 500K+ monthly users (from 50K baseline)
- [ ] **CTA click-through rate:** 8-15% of page visitors
- [ ] **AnMenh conversion rate:** 5-10% of CTA clickers
- [ ] **Time to first CTA click:** < 2 minutes median
- [ ] **Content lock interaction:** 30%+ of visitors
- [ ] **Soft input capture:** 20-30% of visitors
- [ ] **Core Web Vitals:** LCP < 2.5s, CLS < 0.1, INP < 200ms on 95%+ of pages
- [ ] **Bounce rate:** 35-45% (acceptable — some bounces expected)

---

**Document Version:** 2.0  
**Last Updated:** 2026-04-12  
**Owner:** TuVi Development Team
