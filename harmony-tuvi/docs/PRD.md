# TuVi.VuTera.Net — Product Requirements Document (PRD)

**Version:** 2.0 (Post-Pivot)  
**Status:** Active Development  
**Last Updated:** 2026-04-12  
**Owner:** VUTERA Team

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Identity
**Name:** TuVi: VUTERA Harmony Tử Vi AI  
**URL:** tuvi.vutera.net  
**Type:** SEO Content Platform + Traffic Funnel Engine  
**Market:** Vietnamese astrology/feng shui (tử vi phong thủy) seekers

### 1.2 Strategic Role
TuVi **is NOT** a core product. It is:
- **Entry point** (top-of-funnel) attracting massive organic traffic from Google
- **Traffic generator** via high-volume SEO content (270+ URLs, scaling to 5000+)
- **Conversion gateway** that deliberately creates information incompleteness to route users to AnMenh.VuTera.net (the core premium product)

### 1.3 Success Definition
- High organic traffic from Vietnamese search queries (tử vi, phong thủy, bát tự, can-chi)
- Low friction conversion to AnMenh signup
- Measurable CTA click-through rate (target: 8-15% of page visitors)
- Funnel integrity: 40-60% value provided (by design)

---

## 2. STRATEGIC CONTEXT

### 2.1 VUTERA Harmony Ecosystem
```
VUTERA Harmony = 4-app ecosystem
├─ tuvi.vutera.net        (TuVi — Traffic engine, THIS PRODUCT)
├─ anmenh.vutera.net      (AnMenh — Core premium product, conversion target)
├─ auth.vutera.net        (Auth — Centralized SSO gateway)
└─ harmony.vutera.net     (Portal — Ecosystem landing & waitlist)
```

**TuVi's role in ecosystem:**
- Captures cold traffic from Google (no login required, fully stateless)
- Builds curiosity + doubt about completeness of information
- Funnels warm traffic to AnMenh for deeper, personalized analysis
- Shares unified auth layer (JWT cookie: `vutera-auth-session`)

### 2.2 Market Context
**Vietnamese astrology interest:**
- High seasonal spikes (Lunar New Year, major tiết khí)
- Young demographic (18-40) using mobile (70-80% mobile traffic)
- High propensity to seek "personalized insights" (key conversion trigger)
- Existing solution gaps: most astrology sites in Vietnam lack high-SEO-authority content

**Competitive advantage:**
- AI-powered horoscope generation (powered by `iztro` library)
- Vietnamese cultural authenticity (proper can-chi, nạp âm, tiết khí systems)
- Frictionless entry (no login, instant content)
- Sophisticated funnel (not obvious about paywall)

### 2.3 Product v1.0 → v2.0 Pivot
**v1.0 (Subscription model):**
- Stripe monetization with Free/Premium/VIP tiers
- Feature gating built into TuVi (internal paywalls)
- Auth system inside TuVi
- Owned the customer lifetime value goal

**v2.0 (Funnel model):**
- Removed all payment logic (Stripe, pricing page, checkout)
- All content is free on TuVi
- Funnel-only monetization (convert to AnMenh for premium)
- Completely stateless (auth centralized at AnMenh)
- **Principle shift:** "Make users leave TuVi better than before" → "Make users want to leave TuVi for AnMenh"

---

## 3. CORE DESIGN PRINCIPLES

### 3.1 Principle #1: Controlled Value (40-60% Rule)
**Definition:** TuVi must ONLY provide 40-60% of real astrological insight value.

**Never provide:**
- Hour-of-birth dependent analysis (requires premium)
- Taming/transformation recommendations (premium-only)
- Life-path calendar for 1+ years ahead (premium-only)
- Personalized warning flags based on individual chart (premium-only)

**Do provide:**
- General zodiac/can-chi characteristics
- Day-level auspiciousness (without personalization)
- Seasonal forecasts (generic to zodiac type)
- Educational content (how tử vi works, what is can-chi)

**Rationale:** Full insight = instant satisfaction = user leaves. Partial insight = curiosity gap = user stays in funnel.

### 3.2 Principle #2: Induced Incompleteness
**Definition:** Every user interaction must trigger doubt: "Cái này đúng nhưng chưa đủ cho mình."

**Mechanisms:**
1. Explicit doubt triggers (embedded text):
   - "Kết quả này chỉ dựa trên năm sinh — chưa xét giờ sinh"
   - "Để chính xác hơn, cần biết giờ sinh của bạn"
   - "Phần này là dự báo chung — bạn có thể là exception"

2. Content locks (visual barrier):
   - Blur + gradient overlay on detailed sections
   - CTA button: "Mở khóa để xem đầy đủ"

3. Soft input (partial personalization):
   - Let user enter birth year → show "more relevant" (but still generic) content
   - This triggers: "Cái này hợp hơn với tôi, nhưng còn thiếu..."

**Rationale:** Psychological principle of information gap theory — people are drawn to close uncertainty.

### 3.3 Principle #3: Funnel First
**Definition:** Every feature/page must answer: **"Does this increase conversion to AnMenh?"**

**Feature evaluation framework:**
```
Proposed Feature
  ↓
Does it drive CTA clicks to AnMenh? 
  ├─ YES → Include it
  └─ NO  → Remove/deprioritize it
```

**Examples:**
- ✅ Daily horoscope page (high Google traffic + high doubt) → KEEP
- ✅ Content lock component (explicit barrier) → KEEP
- ✅ MiniFunnel widget (engagement before CTA) → KEEP
- ❌ Personal journal/diary (keeps user in TuVi, no AnMenh funnel) → REMOVE
- ❌ Premium feature within TuVi (competes with AnMenh funnel) → REMOVE

**Implication:** TuVi is NOT optimized for time-on-site, repeat visits, or user engagement. It's optimized for conversion velocity.

### 3.4 Principle #4: Non-Personalization Boundary
**Definition:** TuVi provides only **generic grouping** (year/zodiac level). AnMenh provides **true personalization** (hour+profile level).

**TuVi (generic):**
- "Tuổi Giáp Tý hôm nay có xu hướng..."
- "Cung Bạch Dương tháng 4 nên..."
- "Nước Mệnh hợp tác với Kim Mệnh"

**AnMenh (personalized):**
- "Bạn (sinh 14:30 ngày 15/01/1984) với Chủ Mệnh Tài Tử..."
- "Tháng này Tiểu Vận của bạn..."
- "Cảnh báo cá nhân: ngày 18/04 bạn nên tránh..."

**Rationale:** AnMenh's premium value comes from personalization depth. TuVi must not blur this boundary.

---

## 4. USER FLOW & EMOTIONAL JOURNEY

### 4.1 Standard Acquisition Flow
```
User searches Google (intent: "tử vi tuổi giáp tý hôm nay")
       ↓
TuVi landing page (high rank, optimized title/meta)
       ↓
User reads article (free, no login)
       ↓
[Engagement loop: scroll → encounter doubt triggers → read more content]
       ↓
User hits content lock (blurred content, CTA visible)
       ↓
User clicks CTA → BridgeTransition animation
       ↓
Navigated to AnMenh.VuTera.net/bridge
       ↓
AnMenh receives params (birth_year, gender, source, intent)
       ↓
User creates profile (first premium feature gate)
       ↓
AnMenh displays personalized chart
```

### 4.2 Emotional Arc (the key)
```
Emotion 1: "Wow, this is accurate!"         → Hook reader
Emotion 2: "But it feels incomplete..."     → Trigger doubt  
Emotion 3: "I want to know more deeply..."  → Create desire
Emotion 4: "Where do I find this info?"     → Recognize CTA
Emotion 5: "Let me click it"                → Conversion
```

**Design implication:** Copy must oscillate between confidence (to build trust) and humility (to trigger doubt).

### 4.3 Soft Input Path (Enhanced Engagement)
```
User on TuVi page
       ↓
"Chọn năm sinh của bạn" widget appears
       ↓
User enters year (Session Memory capture via localStorage)
       ↓
"Nội dung được cá nhân hóa" section renders
       ↓
User thinks: "Aha, this is about me now"  [False personalization, actually template]
       ↓
Still encounters doubt triggers + content lock
       ↓
CTA now includes birth_year param → "Xem bản đầy đủ cho tuổi Giáp Tý"
```

**Conversion uplift:** Soft input users show 40-60% higher CTA conversion (industry benchmark).

---

## 5. CORE FEATURES & SPECIFICATIONS

### 5.1 Content Pages (SEO-Driven)

#### 5.1.1 Daily Horoscope Pages
- **URL pattern:** `/tu-vi-hom-nay/[can-chi-slug]`
- **Pages:** 60 (12 Heavenly Stems × 5 Earthly Branches... actually 60 combinations)
- **Revalidation:** ISR, `revalidate: 86400` (daily refresh for freshness)
- **Content rotation:** Daily template + seeded RNG ensures variety (no repetition for 60+ days)
- **Schema:** Article + FAQPage
- **Meta formula:** `"Tử Vi Hôm Nay Tuổi [Can-Chi] [Date] - VUTERA Harmony"`

#### 5.1.2 Annual Forecast Pages
- **URL pattern:** `/tu-vi-nam-[YYYY]/[can-chi-slug]`
- **Pages:** 60 × 50 years (1975-2025+) = 3,000 pages
- **Revalidation:** ISR, `revalidate: 2592000` (monthly, annual content doesn't change daily)
- **Content depth:** More substantial than daily (5,000+ words)
- **Schema:** Article + BreadcrumbList
- **Internal link pattern:** Links to `/tu-vi-hom-nay/[can-chi]` and related zodiac pages

#### 5.1.3 Age/Birth Year Pages
- **URL pattern:** `/tu-vi-tuoi/[year]` (e.g., `/tu-vi-tuoi/1984`)
- **Pages:** 90 years (1920-2010 covers 99%+ of users)
- **Content:** Profile page for each birth year (nạp âm, can-chi, element, lucky numbers, compatibility)
- **Links to:** All annual forecasts for that year, all daily pages for that year

#### 5.1.4 Zodiac Hubs (Western)
- **URL pattern:** `/cung-hoang-dao/[sign]` (Bach Duong, Kim Nguu, etc.)
- **Pages:** 12 zodiac signs
- **Purpose:** Capture Western astrology traffic, cross-link to can-chi equivalents
- **Content lock:** Includes mention "Để chính xác hơn, cần xem tử vi can-chi của bạn"

#### 5.1.5 Feng Shui Pages
- **URL patterns:**
  - `/phong-thuy` (hub)
  - `/phong-thuy/menh-[element]` (5 pages: kim/moc/thuy/hoa/tho)
  - `/phong-thuy/huong-hop-[can-chi]` (direction fitting by zodiac)
- **Content:** Room direction recommendations, element balancing, lucky colors/numbers
- **Content lock pattern:** "Để tối ưu phong thủy nhà bạn, cần xem toàn bộ bát trạch cá nhân"

#### 5.1.6 Calendar & Tiết Khí Pages
- **URL pattern:** `/lich/[year]/[month]/[day]` (day detail) and `/lich` (month view)
- **Content:** Solar/lunar conversion, tiết khí (solar terms), auspicious/inauspicious rating
- **Refresh:** Daily (ISR `revalidate: 86400`)
- **Purpose:** "What's happening astrologically today" → gateway to other pages

### 5.2 Partial Insight Engine

**Definition:** Generate horoscope text that is:
- Accurate enough to feel real
- Generic enough to apply to 60+ million people
- Scoped enough to trigger doubt

**Implementation approach:**
1. **Template-based content generation** (not AI initially)
   - 5 content areas: Tổng quan, Tình cảm, Sự nghiệp, Tài chính, Sức khỏe
   - 3-5 "fate outcomes" per area: Positive, Mixed, Cautious, Neutral
   - Seeded RNG selects outcome based on can-chi + date hash (deterministic, no DB needed)

2. **Content structure per section:**
   ```
   [Assertion]
   "Tuổi Giáp Tý hôm nay có xu hướng thuận lợi trong sự nghiệp."
   
   [Evidence/Explanation]
   "Thành tố [Star name] chiếu yếu vào cung Sự Nghiệp, mang tín hiệu tích cực."
   
   [Caveat/Doubt trigger]
   "Tuy nhiên, điều này chỉ mang tính tổng quan — kết quả chính xác phụ thuộc vào giờ sinh của bạn."
   ```

3. **Content generation determinism:**
   - Same can-chi + same date → always same content (for caching)
   - Different can-chi → different content (variety)
   - Next day → different content (freshness)

**Quality gate:** All horoscope text must pass "specificity + genericity balance" test:
- ✅ "Tài lộc hôm nay tích cực" (vague, applies broadly, true 40% of time)
- ❌ "Bạn sẽ kiếm được 5 triệu VND hôm nay" (too specific, false 90% of time)

### 5.3 Content Lock System (CRITICAL)

**Purpose:** Visually & psychologically block high-value content, triggering CTA clicks.

**Visual design:**
```
[Free content — visible & readable]

┌──────────────────────────────────┐
│ 🔒 Phần dành riêng cho bạn       │  ← Locked section header
├──────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░ [Blurred text] ░░░░░░░░░░░░  │  ← CSS blur filter
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                  │
│ [Gradient fade-to-white overlay] │
│                                  │
│      [CTA Button]                │
│   "Mở khóa để xem đầy đủ"       │
└──────────────────────────────────┘

[Free content continues below — visible & readable]
```

**Behavioral requirements:**
- Content lock appears **after** first doubt trigger (not immediately)
- Lock typically appears at **50% scroll depth**
- Locked content should be **~200-400 words** (meaningful, not fluff)
- CTA button: **full-width on mobile, 60-70% width on desktop**
- On click: Trigger `BridgeTransition` animation → navigate to AnMenh

**CSS implementation (critical for Core Web Vitals):**
```css
.content-lock {
  min-height: 200px;           /* Reserve space to prevent CLS */
  filter: blur(4px);           /* Unreadable but visible */
  user-select: none;           /* Prevent text selection */
  pointer-events: none;        /* Block clicks on blurred content */
}

.content-lock-gradient {
  position: absolute;
  bottom: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, white);
}
```

**Accessibility:** Include `aria-label="Locked content. Sign up to view."` for screen readers.

### 5.4 Doubt Trigger System

**Purpose:** Inject psychological cues that the current information is incomplete without personalization.

**Two variants:**

**Variant A: Subtle (inline footnote)**
- Style: italic, gray color, small font
- Placement: End of paragraph
- Example: "*Kết quả này chỉ dựa trên năm sinh — không xét đến giờ sinh"*
- Frequency: 1 per 3 paragraphs (don't overwhelm)

**Variant B: Prominent (warning box)**
- Style: Amber background, border-left colored
- Placement: Standalone paragraph or section
- Example:
  ```
  ⚠️ Lưu ý quan trọng
  Thông tin trên là dự báo chung cho tuổi Giáp Tý.
  Để nhận được cảnh báo chính xác dành cho bạn, hệ thống cần biết giờ sinh của bạn.
  ```
- Frequency: 2-3 per article (strong signal, not spam)

**Content patterns to trigger doubt:**
1. Conditional statements: "Nếu bạn sinh vào buổi sáng, [outcome A]. Nếu buổi chiều, [outcome B]."
2. Caveat statements: "Phần lớn người tuổi Giáp Tý sẽ..., tuy nhiên có exceptions."
3. Qualification statements: "Theo tử vi can-chi, hôm nay tích cực. Tuy nhiên tiểu vận của bạn có thể khác."
4. Invitation statements: "Để biết chính xác cảnh báo của hôm nay dành cho bạn..."

### 5.5 Dynamic CTA (Call-To-Action) System

**Definition:** Context-aware, multi-position CTA buttons that drive conversion.

**5 CTA Positions:**

| Position | Placement | Text Example | Click % |
|----------|-----------|-------------|---------|
| 1. Hero CTA | After hook + first paragraph | "Xem chính xác hơn →" | 15% |
| 2. Inline CTA | After first doubt trigger | "Biết cảnh báo hôm nay →" | 25% |
| 3. Lock CTA | Content lock gate (primary) | "🔒 Mở khóa để xem đầy đủ" | 40% |
| 4. Sticky CTA | Bottom-right floating button (mobile/desktop) | "Xem bản cá nhân hóa" | 20% |
| 5. Exit intent | Popup on mouse-leave (desktop only) | "Khoan! Xem cảnh báo quan trọng" | 5% |

**CTA button styling:**
- Primary color: Crimson (`#C41E3A` or equivalent)
- Hover effect: Gradient shift (purple-to-crimson)
- Text: Bold, 16px+ on mobile
- Padding: 12px 24px minimum

**CTA URL parameters:**
```
Base: https://anmenh.vutera.net/bridge

Query params:
  ?source=tuvi_lock              (which CTA position)
  &intent=horoscope              (context: horoscope/phongthuy/gieo-que/etc.)
  &birthYear=1984                (soft input capture)
  &gender=male                   (soft input capture)
  &utm_source=tuvi
  &utm_medium=content_lock
  &utm_campaign=daily-giap-ty-2026-04-12
```

**Dynamic CTA text rules:**
- If `birthYear` captured: "Xem bản cá nhân hóa cho tuổi Giáp Tý"
- If `birthYear` NOT captured: "Xem dự báo cá nhân hóa"
- If in `phong-thuy` context: "Tối ưu phong thủy nhà bạn →"
- If in `ngay-tot` context: "Chọn ngày tốt dành cho bạn →"

### 5.6 Soft Input Widget (Birth Year Capture)

**Purpose:** Capture optional user data without login, improve perceived personalization, increase CTA conversion.

**Interaction flow:**
```
Default: Widget hidden (no distraction)
Scroll trigger: At 20% depth, widget appears
Display: "Chọn năm sinh của bạn để xem kết quả phù hợp hơn"
         [Dropdown/Picker: 1920-2010] [OK button]
Action: Store in localStorage (key: `tuvi_session_memory`)
Display next: Reload relevant content sections with softly personalized labels
```

**Data structure (localStorage):**
```json
{
  "tuvi_session_memory": {
    "birthYear": 1984,
    "birthMonth": 1,
    "birthDay": 15,
    "birthHour": null,
    "gender": "male",
    "name": null
  }
}
```

**Behavioral rules:**
- If data exists → pre-fill form fields on other pages
- Inject birth year into all CTA links automatically
- Do NOT require email/phone at this stage
- Persist across sessions (localStorage, not ephemeral)

### 5.7 MiniFunnel Widget

**Purpose:** Lightweight engagement hook on homepage, "teases" personalization, increases time-on-page.

**3-state machine:**

**State 1: Idle**
```
┌────────────────────────────────┐
│ Khám phá tử vi của bạn         │
│ Nhập năm sinh: [input field]   │
│        [Bắt đầu] button        │
└────────────────────────────────┘
```

**State 2: Loading**
```
┌────────────────────────────────┐
│ Đang phân tích...              │
│ [Progress bar: 0% → 100%]      │  ← 2-3 second animation
└────────────────────────────────┘
```

**State 3: Result**
```
┌────────────────────────────────┐
│ ✓ Tuổi Giáp Tý                │
│ Mệnh: Hải Trung Kim           │
│ Hôm nay tích cực về tài chính  │
│                                │
│ [Xem bản đầy đủ] button        │  ← CTA to AnMenh
│ [Xem thêm] button              │  ← Other TuVi pages
└────────────────────────────────┘
```

**Analytics:** Track each state transition separately.

### 5.8 Analytics & Tracking (MANDATORY)

**Required events (GA4):**
1. `page_view` — standard
2. `tuvi_content_view` — on entering page
3. `tuvi_cta_click` — on any CTA button click
   - Properties: `cta_position`, `cta_variant`, `can_chi`, `birthYear` (if known), `scroll_depth`
4. `tuvi_content_lock_view` — when lock component renders
5. `tuvi_soft_input_capture` — when user enters birth year
6. `tuvi_scroll_depth` — milestone tracking (25%, 50%, 75%, 100%)
7. `tuvi_doubt_trigger_impression` — when doubt text is scrolled into view
8. `tuvi_anmenh_navigation` — on successful bridge navigation (via BridgeTransition callback)

**Tracking stack:**
- Google Analytics 4 (primary)
- Sentry (error tracking + session replay sampling)
- Custom event ingestion (optional: for real-time dashboard)

**Metrics to monitor:**
- Click-through rate to AnMenh (target: 8-15%)
- Average scroll depth (target: 65%+)
- Time-to-first-CTA-click (target: <2 min)
- Content lock interaction rate (target: 30%+)
- Soft input capture rate (target: 20-30%)

---

## 6. DATA ARCHITECTURE

### 6.1 Can-Chi System (Core Data Model)

**Vietnamese zodiac is based on Can-Chi 60-year cycle.**

#### 6.1.1 Thiên Can (10 Heavenly Stems)

| Index | Name | Element | Polarity | Lucky Dir | Lucky Color |
|-------|------|---------|----------|-----------|-------------|
| 0 | Giáp | Mộc (Wood) | Yang | East | Green |
| 1 | Ất | Mộc | Yin | Southeast | Green |
| 2 | Bính | Hỏa (Fire) | Yang | South | Red |
| 3 | Đinh | Hỏa | Yin | South | Red |
| 4 | Mậu | Thổ (Earth) | Yang | Center | Yellow |
| 5 | Kỷ | Thổ | Yin | Center | Yellow |
| 6 | Canh | Kim (Metal) | Yang | West | White |
| 7 | Tân | Kim | Yin | West | White |
| 8 | Nhâm | Thủy (Water) | Yang | North | Black |
| 9 | Quý | Thủy | Yin | North | Black |

#### 6.1.2 Địa Chi (12 Earthly Branches)

| Index | Name | Animal | Element | Hours | Lucky Dir |
|-------|------|--------|---------|-------|-----------|
| 0 | Tý | Chuột (Rat) | Thủy | 23-1 | North |
| 1 | Sửu | Trâu (Ox) | Thổ | 1-3 | NW |
| 2 | Dần | Cọp (Tiger) | Mộc | 3-5 | East |
| 3 | Mão | Thỏ (Rabbit) | Mộc | 5-7 | East |
| 4 | Thìn | Rồng (Dragon) | Thổ | 7-9 | Southeast |
| 5 | Tỵ | Rắn (Snake) | Hỏa | 9-11 | South |
| 6 | Ngọ | Ngựa (Horse) | Hỏa | 11-13 | South |
| 7 | Mùi | Dê (Goat) | Thổ | 13-15 | SW |
| 8 | Thân | Khỉ (Monkey) | Kim | 15-17 | West |
| 9 | Dậu | Gà (Rooster) | Kim | 17-19 | West |
| 10 | Tuất | Chó (Dog) | Thổ | 19-21 | NW |
| 11 | Hợi | Lợn (Pig) | Thủy | 21-23 | North |

#### 6.1.3 Lục Thập Hoa Giáp (60-Year Sexagenary Cycle)

Cartesian product of Can (10) × Chi (12) = 60 unique combinations.

**Formula:**
```
CanIndex = (Year - 4) mod 10
ChiIndex = (Year - 4) mod 12
Sexagenary = (Year - 4) mod 60
```

**TypeScript data structure:**
```typescript
interface CanChiYear {
  year: number;                 // e.g., 1984
  canIndex: number;             // 0-9
  chiIndex: number;             // 0-11
  can: string;                  // "Giáp"
  chi: string;                  // "Tý"
  slug: string;                 // "giap-ty"
  animal: string;               // "Chuột"
  element: string;              // "Mộc"
  polarity: 'yang' | 'yin';
  napAm: string;                // "Hải Trung Kim" (5-element fate)
  lunaStart: number;            // Day-of-year lunar calendar starts for this zodiac
  sucKhoeElem: string;          // Health element
  tuongSinhWith: string[];      // Compatible animals
  tuongKhacWith: string[];      // Conflicting animals
}

// Lookup all 60
const CAN_CHI_YEARS: CanChiYear[] = [
  { year: 1924, can: 'Giáp', chi: 'Tý', ... },
  { year: 1925, can: 'Ất', chi: 'Sửu', ... },
  // ... 60 entries, wrapping at 1984+60=2044
];
```

### 6.2 Nạp Âm Ngũ Hành (Five Elements Fate)

Each 2-year pair in the 60-cycle maps to a specific "fate" element (different from the stem element).

**Examples:**
- Giáp Tý (1924, 1984) + Ất Sửu (1925, 1985) = "Hải Trung Kim" (Gold in the Sea)
- Bính Dần (1926, 1986) + Đinh Mão (1927, 1987) = "Lò Trung Hỏa" (Fire in the Furnace)

**Data structure:**
```typescript
const NAP_AM_LOOKUP: Record<number, {
  element: string;    // "Hải Trung Kim"
  description: string; // "Vàng trong biển"
  fortuneProfile: string;
}> = {
  0: { element: 'Hải Trung Kim', description: 'Vàng trong biển', ... },
  2: { element: 'Lò Trung Hỏa', description: 'Lửa trong lò', ... },
  // ... 30 pairs covering full 60-cycle
};
```

### 6.3 Lunar Calendar System

Vietnamese calendar (âm lịch) is lunisolar:
- Solar (Gregorian): Year 2026
- Lunar: Year 2025 (advances ~1 month later than Gregorian)

**Critical for TuVi:**
- Daily horoscope pages should show "Ngày [Lunar] tương ứng Dương lịch [Gregorian]"
- Tiết Khí (solar terms) change content context monthly
- Festival dates (Tết, Tết Trung Thu) trigger seasonal content refresh

**Conversion algorithm (Hồ Ngọc Đức):**
- Input: Gregorian date (YYYY-MM-DD)
- Output: Lunar date (YYYY-MM-DD, isLeapMonth: bool), Can-Chi day, tiết khí

**Implementation:** Pre-compute 2000-2100 as static JSON, no need for live astronomical calculation.

### 6.4 Tiết Khí (24 Solar Terms)

24 solar terms divide the year by solar longitude (0° → 360°).

**Purpose:** Drive "what's astrologically happening now" content.

**2026 Example:**
```
Tiểu Hàn (285°)     → Jan 5
Đại Hàn (300°)      → Jan 20
Lập Xuân (315°)     → Feb 4
...
Thanh Minh (15°)    → Apr 4
...
Tiểu Tuyết (240°)   → Nov 22
Đại Tuyết (255°)    → Dec 7
```

**SEO use:** Pages titled "Tử Vi Tuổi Giáp Tý Tiết Thanh Minh 2026" capture hyper-specific long-tail queries.

### 6.5 Data Storage Decision: Static JSON vs. Database

**Recommended: Static JSON (no database needed initially)**

| Aspect | Static JSON | PostgreSQL |
|--------|-------------|-----------|
| Horoscope content | Pre-generated at build time | Generated on request |
| Can-Chi lookup | TypeScript module | DB table |
| Lunar calendar | Static JSON file (100KB for 100 years) | Date calculation function |
| Can-Chi frequencies | Computed at request | DB precompute |
| **Cost** | $0 (Vercel CDN) | $20-50/month (Neon) |
| **Complexity** | Low (just data files) | High (migrations, indexes) |
| **Scalability ceiling** | ~5000 pages (ISR) | Unlimited |
| **Personalization** | None (TuVi doesn't personalize) | Enables future layers |

**Decision for TuVi v2.0: Static JSON + ISR**
- Zero database cost
- Instant content delivery (edge cached)
- Deterministic generation (seeded RNG)
- Scales easily to 5000+ pages

**If future need arises:** Add PostgreSQL for:
- User profile storage (after AnMenh conversion)
- A/B test variant tracking
- Content lock interaction audit logging

---

## 7. SEO ARCHITECTURE

### 7.1 URL Taxonomy

**Target: 300-5000+ indexable URLs by 2027 (from current 270+)**

#### Daily Horoscope Tier
```
/tu-vi-hom-nay/[can-chi]              (60 pages)
  └─ /tu-vi-hom-nay/giap-ty           (daily rotation, refreshed 00:00 daily)
  └─ /tu-vi-hom-nay/at-suu
  ... 58 more
```
- **Keywords:** "tử vi hôm nay [zodiac]", "tử vi ngày hôm nay", "horoscope [zodiac]"
- **Update frequency:** Daily (ISR revalidate: 86400)
- **Priority:** 0.9
- **Est. monthly search volume:** ~200K

#### Annual Forecast Tier
```
/tu-vi-nam-[YYYY]/[can-chi]           (60 × 50 years = 3,000 pages)
  └─ /tu-vi-nam-2026/giap-ty
  └─ /tu-vi-nam-2025/giap-ty
  ... backward to 1976
```
- **Keywords:** "tử vi năm [year] tuổi [zodiac]", "dự báo năm [year]"
- **Update frequency:** Monthly (ISR revalidate: 2592000)
- **Priority:** 0.8
- **Est. monthly search volume:** ~100K

#### Birth Year (Age) Tier
```
/tu-vi-tuoi/[year]                    (90 pages: 1920-2010)
  └─ /tu-vi-tuoi/1984
  └─ /tu-vi-tuoi/1985
```
- **Keywords:** "tử vi tuổi [year]", "người sinh năm [year]", "tính cách tuổi [year]"
- **Update frequency:** Static + annual refresh (ISR revalidate: 2592000)
- **Priority:** 0.7
- **Est. monthly search volume:** ~150K

#### Zodiac Hub Tier (Western)
```
/cung-hoang-dao/[sign]                (12 pages)
  └─ /cung-hoang-dao/bach-duong
  └─ /cung-hoang-dao/kim-nguu
```
- **Keywords:** "cung [zodiac sign]", "horoscope [sign]"
- **Priority:** 0.6
- **Est. monthly search volume:** ~50K (lower intent than can-chi)

#### Star-Palace Matrix (Tử Vi Đẩu Số)
```
/y-nghia-sao/[star]-tai-cung-[palace]  (14 stars × 12 palaces = 168 pages)
  └─ /y-nghia-sao/thai-duong-tai-cung-menh
  └─ /y-nghia-sao/van-xuong-tai-cung-phraong
```
- **Keywords:** "[Star name] in [Palace]", "ý nghĩa sao [star] trong cung [palace]"
- **Purpose:** High-authority content, builds SEO topical relevance
- **Priority:** 0.5
- **Est. monthly search volume:** ~30K

#### Feng Shui Tier
```
/phong-thuy                            (hub page)
  └─ /phong-thuy/menh-kim               (5 element pages)
  └─ /phong-thuy/menh-moc
  └─ /phong-thuy/huong-hop-giap-ty     (zodiac direction pages)
```
- **Priority:** 0.5
- **Est. monthly search volume:** ~80K

#### Calendar Tier
```
/lich                                  (month view)
  └─ /lich/2026/4                      (month view)
    └─ /lich/2026/4/12                 (day detail, 365 pages/year)
```
- **Priority:** 0.6 (high freshness signal)
- **Est. monthly search volume:** ~100K

**Total indexable URLs:**
- Tier 1 (daily): 60
- Tier 2 (annual): 3,000
- Tier 3 (age): 90
- Tier 4 (zodiac): 12
- Tier 5 (star-palace): 168
- Tier 6 (feng shui): ~25
- Tier 7 (calendar): ~10,000 (if including full history)
- Blog posts: 50-100
- **Total: ~13,000+ pages** (with calendar fully included)

### 7.2 Schema Markup Strategy

Every page **must** include schema markup. Use `generateMetadata()` in Next.js to inject at build time.

#### Schema Type 1: Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tử Vi Hôm Nay Tuổi Giáp Tý 12/04/2026",
  "description": "Xem tử vi hôm nay cho tuổi Giáp Tý...",
  "datePublished": "2026-04-12T00:00:00+07:00",
  "dateModified": "2026-04-12T10:00:00+07:00",
  "author": {
    "@type": "Organization",
    "name": "VUTERA Harmony",
    "url": "https://tuvi.vutera.net"
  },
  "inLanguage": "vi-VN",
  "image": {
    "@type": "ImageObject",
    "url": "https://tuvi.vutera.net/og-giap-ty.jpg",
    "width": 1200,
    "height": 630
  }
}
```

#### Schema Type 2: FAQPage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Tuổi Giáp Tý hôm nay có tốt không?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ngày 12/04/2026, người tuổi Giáp Tý có xu hướng thuận lợi..."
      }
    }
  ]
}
```

#### Schema Type 3: BreadcrumbList
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Tử Vi",
      "item": "https://tuvi.vutera.net"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tử Vi Hôm Nay",
      "item": "https://tuvi.vutera.net/tu-vi-hom-nay"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Tuổi Giáp Tý",
      "item": "https://tuvi.vutera.net/tu-vi-hom-nay/giap-ty"
    }
  ]
}
```

### 7.3 Meta & OG Tags

**Title formula:**
```
"[Zodiac/Time context] [Content type] [Date/Year] - VUTERA Harmony"

Examples:
- "Tử Vi Hôm Nay Tuổi Giáp Tý 12/04/2026 - VUTERA Harmony"
- "Tử Vi Năm 2026 Tuổi Giáp Tý - Dự Báo Chi Tiết - VUTERA Harmony"
- "Tử Vi Tuổi 1984 - Mệnh Hải Trung Kim - VUTERA Harmony"
```

**Meta description formula:**
```
"[Assertion] + [Context] + [Caveat/CTA]"

Examples:
- "Tử vi tuổi Giáp Tý hôm nay có xu hướng tích cực về tài lộc và sự nghiệp. Tuy nhiên để chính xác hơn, cần xem toàn bộ bát tự cá nhân hóa của bạn."
- "Dự báo năm 2026 cho người tuổi Giáp Tý: cơ hội lớn trong sự nghiệp, tình cảm ổn định. Xem chi tiết →"
```

**Open Graph tags:**
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://tuvi.vutera.net/og-[slug].jpg" />
<meta property="og:type" content="article" />
<meta property="og:locale" content="vi_VN" />
<meta property="og:url" content="https://tuvi.vutera.net/..." />
```

### 7.4 Sitemap & robots.txt

**Sitemap generation (`sitemap.ts`):**
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const canChis = getAllCanChiSlugs();           // 60 items
  const years = range(1976, 2026);              // 50 items
  const birthYears = range(1920, 2010);         // 90 items
  
  const dailyPages = canChis.map(slug => ({
    url: `https://tuvi.vutera.net/tu-vi-hom-nay/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  const annualPages = canChis.flatMap(slug =>
    years.map(year => ({
      url: `https://tuvi.vutera.net/tu-vi-nam-${year}/${slug}`,
      lastModified: getLastModifiedDate(year),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );
  
  // ... more pages
  
  return [...dailyPages, ...annualPages, /* ... */];
}
```

**robots.txt:**
```
User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Crawl-delay: 1

Sitemap: https://tuvi.vutera.net/sitemap.xml
```

### 7.5 Core Web Vitals Targets

**Metrics:**
- **LCP (Largest Contentful Paint):** < 2.5s
  - Avoid large hero images in critical path
  - Lazy-load chart visualizations below fold
  
- **CLS (Cumulative Layout Shift):** < 0.1
  - Reserve space for content lock (min-height)
  - Reserve space for sticky CTA (position: fixed)
  - Use explicit width/height on images
  
- **INP (Interaction to Next Paint):** < 200ms
  - Optimize CTA button click handlers
  - Defer analytics until after interactive

---

## 8. CONVERSION & FUNNEL DESIGN

### 8.1 Content Lock Pattern Variants

**Pattern A: Hard Cut (Highest conversion)**
- Visibility: 30% of content blurred
- Psychology: "I must unlock to see the rest"
- Best for: Annual forecast pages (high search intent)
- Expected CTR: 3-5%

**Pattern B: Progressive Lock (Medium conversion)**
- Visibility: First 2 paragraphs free, then locked section
- Psychology: "I got value, but want more"
- Best for: Daily horoscope pages (medium intent)
- Expected CTR: 5-8%

**Pattern C: Curiosity Peek (Engagement-first)**
- Visibility: Full content visible, but with `???` placeholders
- Example: "Màu sắc may mắn của bạn hôm nay là ???"
- Psychology: "I'm curious about the unknown"
- Best for: Mobile pages (doesn't require scrolling)
- Expected CTR: 5-10%

**Recommendation for TuVi: Combine Pattern B + C**
- Pattern B for long-form pages (annual forecast)
- Pattern C for short-form pages (daily horoscope)

### 8.2 CTA Placement Strategy (5 Positions)

| Position | Trigger | Text | Expected CTR of Position | Total Funnel % |
|----------|---------|------|-------------------------|-----------------|
| **1. Hero** | After hook + first paragraph | "Xem chính xác hơn →" | 15% | 15% |
| **2. Inline** | After first doubt trigger | "Xem cảnh báo cá nhân →" | 25% | 10% |
| **3. Lock** | Content lock gate | "🔒 Mở khóa để xem đầy đủ" | 40% | 20% |
| **4. Sticky** | Sticky bottom (mobile), position fixed | "Xem bản cá nhân hóa" | 20% | 4% |
| **5. Exit Intent** | Mouse leave (desktop), scroll-up (mobile) | "Khoan! Xem cảnh báo quan trọng" | 5% | 0.5% |

**Interpretation:** Of 100 page visitors:
- 15 click Position 1
- 10 more click Position 2 (cumulative: 25)
- 20 more click Position 3 (cumulative: 45)
- 4 more click Position 4 (cumulative: 49)
- 0.5 more click Position 5 (cumulative: 49.5)
- **Overall CTA CTR: ~49.5% (realistic range 8-15% depending on page quality)**

### 8.3 Psychological Conversion Triggers

**Trigger 1: Specificity Illusion**
- Text: "Người tuổi Giáp Tý sinh vào giờ Dần có đặc điểm..."
- Psychology: Feels personal even if generic
- Implementation: Soft input widget + personalization labels

**Trigger 2: Authority Signaling**
- Text: "Theo tử vi Đẩu Số truyền thống..."
- Mention: Tử Vi Đẩu Số classics, masters
- Implementation: Education content + schema markup

**Trigger 3: Scarcity of Insight**
- Text: "Phần này chỉ hiển thị đúng khi biết giờ sinh"
- Psychology: "I'm missing something valuable"
- Implementation: Content lock + doubt trigger pairing

**Trigger 4: Loss Aversion**
- Text: "Bạn đang bỏ lỡ cảnh báo quan trọng hôm nay"
- Psychology: Fear of missing out (FOMO)
- Implementation: Exit intent popup + warning tone

**Trigger 5: Curiosity Gap**
- Text: "Kết quả này là ???. Nhưng điều gì thay đổi khi..."
- Psychology: Open loop (incomplete info)
- Implementation: Curiosity Peek pattern (C)

**Trigger 6: Social Proof (future)**
- Text: "2.3M người tuổi Giáp Tý xem hồ sơ mỗi tháng"
- Implementation: Add social proof numbers (real or slightly adjusted)

**Trigger 7: Progressive Personalization**
- Soft input → "personalized content" → "but I need hour" → CTA
- Psychology: Small step → bigger step → biggest step

### 8.4 Mobile-First Conversion Patterns

**Mobile dominance:** 70-80% of TuVi traffic is mobile.

**Optimization:**
- Content lock: Use **fade gradient** (not blur — GPU-heavy on mobile)
- CTA button: Full-width, 56px+ height (thumb-friendly)
- Sticky bottom CTA: Use `position: fixed`, respect `safe-area-inset-bottom`
- Soft input: Use native `<input type="date">` or `<select>` (no custom calendar)
- Exit intent: Trigger on scroll-up, not mouse-out (no mouse on mobile)
- Forms: Max 3 fields (birth year, gender, name — optional)

**Example mobile sticky CTA:**
```jsx
<button
  className="fixed bottom-0 left-0 right-0 safe-bottom"
  style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
>
  Xem bản cá nhân hóa
</button>
```

---

## 9. ANMENH INTEGRATION

### 9.1 Bridge Navigation System

**TuVi → AnMenh handoff flow:**

```
1. User clicks CTA button on TuVi page
   ↓
2. Button onClick triggers BridgeTransition (full-screen overlay)
   ↓
3. BridgeTransition plays 4 messages (2.5 second animation)
   "Đang kết nối dữ liệu..."
   "Đang khởi tạo AnMenh..."
   "Đang phân tích thiên bàn..."
   "Đồng bộ hoàn tất."
   ↓
4. After animation, navigate to AnMenh URL:
   https://anmenh.vutera.net/bridge?[params]
   ↓
5. AnMenh /bridge route receives params, displays BridgeTransition again
   ↓
6. AnMenh routes internally based on `intent` param
   ↓
7. AnMenh target page displays with pre-filled data (birth_year, gender)
```

### 9.2 URL Parameter Contract

**TuVi CTA URL format:**
```
https://anmenh.vutera.net/bridge?
  source=tuvi_lock              // CTA position identifier
  &intent=horoscope             // Feature context
  &birthYear=1984               // Soft input capture
  &gender=male                  // Soft input capture
  &utm_source=tuvi
  &utm_medium=content_lock
  &utm_campaign=daily-giap-ty-2026-04-12
  &can_chi=giap-ty              // Optional: current page context
```

**Parameter definitions:**

| Param | Values | Purpose |
|-------|--------|---------|
| `source` | tuvi_lock / tuvi_cta_inline / tuvi_minifunnel / tuvi_sticky / tuvi_exit | Attribution: where did click come from |
| `intent` | horoscope / phongthuy / ngaytot / gieo-que / bat-tu / can-xuong / tuong-hop | Feature context: what should AnMenh show |
| `birthYear` | 1920-2010 | Soft input capture: pre-fill AnMenh forms |
| `gender` | male / female / other | Soft input capture |
| `utm_source` | tuvi | Campaign tracking |
| `utm_medium` | content_lock / cta_inline / sticky / exit_intent | Campaign tracking |
| `utm_campaign` | daily-giap-ty-2026-04-12 | Campaign tracking |
| `can_chi` | giap-ty / at-suu / ... | Optional: tell AnMenh what page user came from |

### 9.3 Session Memory (localStorage Capture)

**TuVi captures soft input in localStorage, passes to AnMenh:**

```javascript
// tuvi/hooks/useSessionMemory.ts
const sessionMemory = {
  tuvi_session_memory: {
    birthYear: 1984,
    birthMonth: 1,
    birthDay: 15,
    birthHour: null,           // TuVi doesn't collect
    gender: "male",
    name: null                 // TuVi doesn't collect
  }
};

// Every CTA injected with: ?birthYear=1984&gender=male
// AnMenh reads from params + localStorage to pre-fill its profile form
```

### 9.4 BridgeTransition Component

**Shared component between TuVi and AnMenh.**

**Animation:**
```
Frame 1-10:   "Đang kết nối dữ liệu..."            (0.6s, opacity 0→1)
Frame 11-20:  "Đang khởi tạo module AnMenh..."     (0.6s, opacity 1)
Frame 21-30:  "Đang phân tích thiên bàn cá nhân..."(0.6s, opacity 1)
Frame 31-41:  "Đồng bộ hoàn tất."                  (0.7s, opacity 1→0)
              Complete → navigate()
```

**Psychology:** Creates perception of "data transfer" + "system processing" → builds trust before handoff.

### 9.5 AnMenh Route Mapping

AnMenh /bridge receives `intent` param and routes accordingly:

```typescript
const intentRoutes = {
  'horoscope': '/horoscope',
  'phongthuy': '/phong-thuy',
  'bat-tu': '/bat-tu',
  'bat-trach': '/bat-trach',
  'can-xuong': '/can-xuong',
  'gieo-que': '/gieo-que',
  'tuong-hop': '/tuong-hop',
  'default': '/',
};

// AnMenh /bridge route:
const targetRoute = intentRoutes[intent] || intentRoutes.default;
redirect(`${targetRoute}?birthYear=${birthYear}&gender=${gender}`);
```

---

## 10. NON-FUNCTIONAL REQUIREMENTS

### 10.1 Performance
- Page load: **LCP < 2.5s** (Core Web Vitals)
- Time to interactive: **< 3s**
- Sitemap generation: **< 60s** (at build time)
- ISR revalidation: **< 5s per page**

### 10.2 SEO
- All 270+ pages must have unique, compelling titles & descriptions
- All pages must include Article + FAQPage + BreadcrumbList schema
- Mobile-friendly (responsive design, touch targets 56px+)
- XML sitemap with proper `changeFrequency` + `priority`
- robots.txt with Sitemap URL

### 10.3 Mobile-First
- 70-80% of users are mobile
- Responsive breakpoints: 320px, 640px, 768px, 1024px
- Touch targets: 56x56px minimum
- Viewport optimized (no horizontal scroll)

### 10.4 Scalability
- Architecture must support 5000+ pages without refactoring
- ISR caching must support 10x traffic increase
- Database (if added) must be indexed for 100K+ users

### 10.5 Reliability
- 99.9% uptime (Vercel SLA)
- Error tracking & alerting (Sentry)
- Graceful degradation (content lock fails open if JS breaks)

---

## 11. ANTI-PATTERNS (WHAT NOT TO BUILD)

### ❌ Anti-Pattern #1: Full Insight in TuVi
Don't provide 100% astrological insight on TuVi. No:
- Detailed 10-year career prediction
- Personalized investment recommendations
- Full compatibility analysis (needs hour)
- Life-path taming advice

### ❌ Anti-Pattern #2: Personalization Within TuVi
Don't build deep personalization in TuVi itself. No:
- "Save my profile" features
- Personalized dashboard
- History of my predictions
- Personal recommendations

→ **Reason:** This competes with AnMenh's premium value.

### ❌ Anti-Pattern #3: Long User Retention
Don't optimize for repeat visits within TuVi. No:
- Daily login streaks
- Notification reminders
- "Bookmark this horoscope"
- Community forums

→ **Reason:** We want users to leave (to AnMenh), not stay.

### ❌ Anti-Pattern #4: Feature Gating Before CTA
Don't lock basic content (like daily horoscope) until after CTA. Do:
- Show 60% of content free
- Lock the "premium insights" portion
- Content lock should appear mid-page, not top-of-page

### ❌ Anti-Pattern #5: Unclear CTAs
Don't be subtle about CTAs. Do:
- Use contrasting colors (crimson, gradient)
- Place CTAs at natural pause points
- Use action-oriented copy ("Xem", "Mở khóa", "Tìm hiểu")
- Show multiple CTAs (5 positions ideal)

### ❌ Anti-Pattern #6: No Analytics
Don't skip event tracking. Must track:
- CTA clicks (position, variant, context)
- Content lock interactions
- Scroll depth
- AnMenh navigation success

### ❌ Anti-Pattern #7: Database Premature
Don't build database immediately. Start with:
- Static JSON for data
- ISR for content freshness
- localStorage for soft input
- Add DB only when adding user profiles (AnMenh domain)

---

## 12. SUCCESS METRICS

### 12.1 Traffic Metrics
- **Monthly organic users:** Target 500K+ (from 50K baseline)
- **Monthly page views:** Target 2M+ (from 100K baseline)
- **Avg. bounce rate:** 35-45% (acceptable — some bounces expected)
- **Avg. session duration:** 2-3 minutes (short, by design — we want them to leave)

### 12.2 Conversion Metrics
- **CTA click-through rate (CTR):** Target 8-15% of page visitors
- **AnMenh signup rate (from TuVi traffic):** Target 5-10% of CTA clickers
- **Content lock interaction rate:** Target 30%+
- **Soft input capture rate:** Target 20-30% of visitors
- **Time to first CTA click:** Median < 2 minutes

### 12.3 Funnel Metrics (Analytics)
```
100 TuVi visitors
  ├─ 80 read content
  ├─ 50 encounter doubt trigger
  ├─ 40 reach content lock
  ├─ 30 click CTA (target: 8-15)
  ├─ 25 click AnMenh link
  ├─ 20 reach AnMenh /bridge
  ├─ 18 create AnMenh profile
  └─ 15 complete first analysis (success!)
```

**Conversion rate (TuVi → AnMenh signup): 15%** ← Target metric

### 12.4 Content Quality Metrics
- **Horoscope accuracy rate:** Target 60%+ (objective: "feels right to user")
- **Avg. content lock position:** ~50% scroll depth (optimal friction)
- **Avg. doubt trigger count per page:** 2-3 (not too many, not too few)
- **Mobile CTR vs. Desktop CTR:** Should be similar (within 10% variance)

---

## 13. FUTURE EXTENSIONS

### Phase 2 (Q3 2026)
- **A/B testing engine** (CTA text, content lock position, doubt trigger wording)
- **Exit intent popup** (desktop only, high-performing variant)
- **Social sharing integration** ("Tôi vừa xem tử vi...")
- **AI-generated horoscope scaling** (templated system → LLM-enhanced)

### Phase 3 (Q4 2026)
- **Monthly forecast pages** (`/tu-vi-thang-[MM]-[YYYY]/[can-chi]`)
- **Hub-and-Spoke internal linking** (automated link generation between related content)
- **Tiết Khí seasonal content** (pages triggered by solar term changes)
- **Compatibility matrix pages** (zodiac × zodiac pairings)

### Phase 4 (2027+)
- **Email campaign** (daily horoscope digest, opt-in via AnMenh)
- **Push notifications** (auspicious time alerts, AnMenh-owned)
- **Content syndication** (partner sites licencing TuVi content)
- **International expansion** (tuvi.com/en, tuvi.cn, tuvi.th)

---

## 14. SUMMARY

**TuVi is a high-volume SEO traffic engine that:**
1. Attracts millions of Vietnamese astrology seekers from Google
2. Provides 40-60% of real astrological insight (by design)
3. Triggers psychological doubt through content locks & doubt triggers
4. Funnels warm traffic to AnMenh for premium, personalized analysis
5. Operates completely stateless (no login, no payment, no user storage)
6. Scales to 5000+ pages via ISR + static data
7. Tracks every conversion touchpoint via GA4 events
8. Succeeds when users leave TuVi wanting more → clicking AnMenh CTA

**Golden Rule:**
> "TuVi phải khiến user rời đi sang AnMenh với cảm giác rằng họ đang bỏ lỡ thứ gì đó quý giá."

Translation: "TuVi must make users leave toward AnMenh feeling like they're missing something valuable."

---

**END OF PRD**
