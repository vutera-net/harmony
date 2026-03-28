# Harmony Platform – System Overview

## Vision
Harmony is a trust-based ecosystem that combines the ancient philosophical depth of Eastern astrology (TuVi, BaZi) with modern AI. It provides users with a persistent destiny profile, high-end content, and deeply personalized social and life guidance.

## Architecture Philosophy
**ONE MONOREPO — ONE BACKEND — MULTI APPS**

The entire Harmony source code is managed under a single Monorepo (Turborepo + pnpm workspaces) to guarantee type safety, code reusability across platforms, and strict separation of presentation layers from core business domain logic.

```
harmony/
│
├── apps/
│   ├── harmony-web   ⭐ Landing (Brand / Trust Layer)
│   ├── tuvi-web      ⭐ SEO / Content (Traffic Acquisition Layer)
│   └── anmenh-web    ⭐ Web App (Product / Identity Layer)
│
├── packages/
│   ├── api           ⭐ Shared API (Harmony Core Backend Engine)
│   ├── domain        ⭐ Business logic (Astrology engines, Rules)
│   ├── database      ⭐ Schemas & DB clients (Prisma/Drizzle)
│   └── auth          ⭐ Unified session & identity management
```

## 1. Apps Breakdown

### 1.1 `harmony-web` (The Trust Layer)
- **Role:** The corporate homepage and primary brand anchor.
- **Focus:** Articulating the philosophy behind Harmony, building user trust, showcasing the methodology (AI + Astrology), and acting as the gateway to the ecosystem.
- **Tech Focus:** High-visual fidelity, animations (Framer Motion), static generation.

### 1.2 `tuvi-web` (The Traffic Layer)
- **Role:** High-volume SEO engine publishing articles on horoscopes, compatibility, and astrology education.
- **Focus:** Capturing zero-intent/low-intent organic search traffic.
- **Tech Focus:** Extreme performance, Incremental Static Regeneration (ISR). Does NOT require authentication to view. Converts readers via emotional CTAs.

### 1.3 `anmenh-web` (The Product Layer)
- **Role:** The secure, personalized dashboard where a user engages with their Destiny Profile.
- **Focus:** Daily energy scores, social compatibility loops, a-la-carte premium reports.
- **Tech Focus:** Highly interactive (React state), heavily heavily authenticated, fetching dynamic data per user.

## 2. Packages Breakdown (The Core)

Rather than burying the API in `anmenh-web`, all intelligence lives in the Shared Layer:

- **`packages/api`**: Exposes the Harmony Core routes (e.g., tRPC routers) to all 3 front-end apps.
- **`packages/domain`**: Houses the strict calculations—destiny mapping, compatibility formulas, avoiding duplicated logic.
- **`packages/database`**: Single source of truth for PostgreSQL migrations and types.
- **`packages/auth`**: Ensures a user logged into `anmenh-web` can seamlessly have their identity recognized across subdomains (if required).
