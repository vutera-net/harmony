# Implementation Spec — AnMenh

## Tech Stack

**Frontend:**
- Next.js 16 (App Router), React 19
- TailwindCSS v4

**Backend:**
- tRPC (end-to-end type-safe API) — handler tại `/api/trpc/[trpc]`
- NextAuth v4 — Credentials Provider, JWT session

**Database:**
- Prisma v5 — SQLite (dev) / Neon PostgreSQL (prod)

---

## Database Schema (Prisma)

### `User`
- `id` (uuid)
- `email` (unique)
- `passwordHash`
- `createdAt`

### `DestinyProfile`
- `id`, `userId` (FK → User)
- `birthDate` (ISO string)
- `birthTime` (optional)
- `gender`
- `element` — Ngũ hành: Kim / Mộc / Thủy / Hỏa / Thổ
- `zodiac` — Con giáp

### `DailyInsight`
- `id`, `profileId` (FK → DestinyProfile)
- `date` (YYYY-MM-DD)
- `energyScore` (int)
- `doList` (JSON string — array of strings)
- `avoidList` (JSON string — array of strings)
- `luckyColor`
- `isPremium` (boolean, default false)
- **UNIQUE(profileId, date)**

### `HarmonyScore`
- `userId` (unique FK → User)
- `score`, `lastUpdated`

### `Connection`
- `userId`, `friendUserId` (FK → User)
- `status` — `pending` | `accepted` | `rejected`
- `compatibilityScore` (int, optional)
- **UNIQUE(userId, friendUserId)**

### `PremiumReport`
- `userId` (FK → User)
- `reportType` — `love` | `career` | `ai_chat`
- `content` (JSON string)
- `purchasedAt`

---

## tRPC API (appRouter)

```
appRouter
├── auth.login(email, password)
├── auth.register(email, password)
├── profile.createProfile(userId, birthDate, birthTime, gender)
├── profile.getMyProfile(userId)
├── profile.getDailyInsight(userId, date)
├── connection.searchUser(email)
├── connection.addConnection(requesterId, targetId)
└── connection.listConnections(userId)
```

Context được inject: `{ prisma: PrismaClient }`

---

## Insight Generation Logic

```
if insight for (profileId, today) exists:
    return cached insight
else:
    call GPT-4 mini với system prompt chứa DestinyProfile
    → nếu không có OPENAI_API_KEY: return mock insight
    save to DailyInsight
    return new insight
```

---

## Cron Job

`src/app/api/cron/route.ts` — chạy `00:01 UTC` hàng ngày, generate AI insight cho tất cả users. Cấu hình tại `vercel.json`.

---

## Folder Structure

```
src/
├── app/
│   ├── page.tsx              # Login / redirect
│   ├── onboarding/page.tsx   # Tạo Destiny Profile
│   ├── dashboard/page.tsx    # Daily energy, do/avoid, lucky color
│   ├── connections/page.tsx  # Social compatibility
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── trpc/[trpc]/route.ts
│       └── cron/route.ts
├── trpc/                     # React client + TRPCProvider
└── lib/
    ├── api/                  # tRPC routers & context
    ├── auth/                 # NextAuth config
    ├── database/             # Prisma singleton
    └── domain/
        ├── astrology/engine.ts
        ├── astrology/compatibility.ts
        └── ai/insightGenerator.ts
```
