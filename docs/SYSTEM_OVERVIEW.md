# Harmony Platform – System Overview

## Vision
Harmony is a trust-based ecosystem that combines the ancient philosophical depth of Eastern astrology (TuVi, BaZi) with modern AI. It provides users with a persistent destiny profile, high-end content, and deeply personalized social and life guidance.

## Architecture Philosophy
**ONE REPO — THREE STANDALONE APPS**

Mỗi app là một Next.js project độc lập, không chia sẻ packages. Business logic và domain code được inline trực tiếp vào từng app (hiện tại chủ yếu trong `anmenh`).

```
harmony/
│
├── landing/    ⭐ Landing (Brand / Trust Layer)       → harmony.vutera.net
├── tuvi/       ⭐ SEO / Content (Traffic Layer)       → tuvi.vutera.net
└── anmenh/     ⭐ Web App (Product / Identity Layer)  → anmenh.vutera.net
```

Mỗi app có `package.json`, `node_modules/`, `prisma/` riêng.

---

## 1. Apps Breakdown

### 1.1 `landing/` (The Trust Layer)
- **Role:** Corporate homepage and primary brand anchor.
- **Focus:** Philosophy, trust-building, gateway to the ecosystem.
- **Tech:** Static/minimal Next.js, animations, dark-zen aesthetic.

### 1.2 `tuvi/` (The Traffic Layer)
- **Role:** High-volume SEO engine — horoscopes, compatibility, astrology education.
- **Focus:** Zero-intent organic traffic capture, ISR for performance.
- **Tech:** Next.js with ISR, no auth required. CTA banners funneling to `anmenh`.

### 1.3 `anmenh/` (The Product Layer)
- **Role:** Secure, personalized dashboard for Destiny Profile engagement.
- **Focus:** Daily energy scores, social compatibility, premium reports.
- **Tech:** Next.js App Router, NextAuth, tRPC, Prisma SQLite (dev) / Neon PostgreSQL (prod).

---

## 2. AnMenh Internal Structure (The Core)

Business logic previously in `packages/` is now inlined inside `anmenh/src/lib/`:

```
anmenh/src/lib/
├── api/
│   ├── index.ts          # tRPC appRouter
│   ├── trpc.ts           # tRPC context & init
│   └── routers/
│       ├── auth.ts
│       ├── profile.ts
│       └── connection.ts
├── auth/
│   └── index.ts          # NextAuth config
├── database/
│   └── index.ts          # Prisma client singleton
└── domain/
    ├── astrology/
    │   ├── engine.ts     # calculateZodiac, calculateElement
    │   └── compatibility.ts  # Ngũ hành compatibility matrix
    └── ai/
        └── insightGenerator.ts  # GPT-4 mini, mock fallback
```

---

## 3. Data Flow

```
User browser
  → NextAuth session (JWT, cookie domain: .vutera.net)
  → tRPC React Query client (/api/trpc/[trpc])
  → tRPC router (src/lib/api/routers/)
  → Domain logic (src/lib/domain/)
  → Prisma (src/lib/database/)
  → SQLite (dev) / Neon PostgreSQL (prod)
```
