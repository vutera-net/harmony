# Harmony Monorepo — CLAUDE.md

## Tổng quan dự án

**Harmony** là hệ sinh thái SaaS thiên văn số học Việt Nam, gồm 3 ứng dụng Next.js chạy trên 1 monorepo duy nhất.

- `harmony.vutera.net` — Landing page & branding (Dark-Zen)
- `anmenh.vutera.net` — Sản phẩm SaaS chính (dashboard cá nhân, AI insight, tương hợp bạn bè)
- `tuvi.vutera.net` — SEO engine & traffic funnel (blog tử vi, astrology content)

**Triết lý kiến trúc:** ONE MONOREPO — ONE BACKEND — MULTI APPS

---

## Stack & Tooling

| Layer | Công nghệ |
|-------|-----------|
| Cấu trúc | 3 app độc lập (không monorepo) |
| Frontend | Next.js 16 (App Router), TypeScript, TailwindCSS v4 |
| API | tRPC + Zod + SuperJSON + @tanstack/react-query |
| ORM | Prisma v5 — SQLite (dev) / Neon PostgreSQL (prod) |
| Auth | NextAuth v4 — Credentials Provider, JWT, cross-domain cookie `.vutera.net` |
| AI | OpenAI GPT-4 mini — serverless-friendly via native `fetch` |
| Deploy | Vercel (3 projects riêng, 1 GitHub repo) |

### QUAN TRỌNG: Next.js phiên bản này có breaking changes

Trước khi viết bất kỳ code Next.js nào, **đọc docs tại `node_modules/next/dist/docs/`**. Đừng dùng API/convention từ training data — chúng có thể đã bị deprecated.

---

## Cấu trúc thư mục

```
harmony/
├── landing/            # Landing page tĩnh (harmony.vutera.net)
├── anmenh/             # SaaS core (auth, dashboard, onboarding)
│   ├── src/
│   │   ├── app/        # Next.js App Router pages & API routes
│   │   ├── trpc/       # tRPC client provider
│   │   └── lib/        # Backend logic (inlined từ packages cũ)
│   │       ├── api/    # tRPC routers & context
│   │       ├── auth/   # NextAuth config
│   │       ├── database/ # Prisma client
│   │       └── domain/ # Business logic (astrology, AI)
│   └── prisma/         # Schema & seed
├── tuvi/               # SEO blog (tuvi.vutera.net)
└── docs/               # Tài liệu kiến trúc & PRD
```

---

## Các lệnh thường dùng

Mỗi app chạy độc lập, `cd` vào thư mục tương ứng:

```bash
# Landing
cd landing && pnpm dev            # http://localhost:3000

# AnMenh
cd anmenh && pnpm dev             # http://localhost:3000
cd anmenh && pnpm db:push         # Prisma db push (tạo/sync schema)
cd anmenh && pnpm db:seed         # Seed dữ liệu demo

# TuVi
cd tuvi && pnpm dev               # http://localhost:3000

# Format toàn bộ (từ root)
pnpm format
```

**Demo accounts:**
- `toi@harmony.com` — Mệnh Thủy, Dần
- `banhop@harmony.com` — Mệnh Mộc (tương sinh)
- `bankhac@harmony.com` — Mệnh Hỏa (tương khắc)

---

## Database Schema (Prisma)

Các bảng chính:
- **User** — `id`, `email`, `passwordHash`
- **DestinyProfile** — `birthDate`, `element` (Kim/Mộc/Thủy/Hỏa/Thổ), `zodiac`
- **DailyInsight** — `energyScore`, `doList`, `avoidList`, `luckyColor`, `isPremium`
- **HarmonyScore** — điểm gamification
- **Connection** — bạn bè + `compatibilityScore`, `status` (pending/accepted/rejected)
- **PremiumReport** — báo cáo mua (love/career/ai_chat)

**Quy tắc:** KHÔNG tự ý thêm bảng mới. Nếu cần mở rộng schema, hỏi trước.

---

## tRPC API Structure

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

## Domain Logic (`packages/domain`)

- `astrology/engine.ts` — `calculateZodiac()`, `calculateElement()`, `generateDestinyCore()`
- `astrology/compatibility.ts` — Ma trận tương sinh/tương khắc ngũ hành (scores: 95/75/60/35)
- `ai/insightGenerator.ts` — GPT-4 mini, fallback mock khi không có API key

---

## Environment Variables

Copy `.env.example` → `.env` tại 3 nơi: root, `packages/database/`, `apps/anmenh-web/`

```
DATABASE_URL=          # Neon PostgreSQL (hoặc SQLite file cho dev)
NEXTAUTH_SECRET=       # openssl rand -base64 32
NEXTAUTH_URL=          # https://anmenh.vutera.net (prod) / http://localhost:3001 (dev)
OPENAI_API_KEY=        # sk-proj-...
CRON_SECRET=           # random secret cho Vercel cron
```

---

## Cron Job

`apps/anmenh-web/src/app/api/cron/route.ts` — chạy lúc `00:01 UTC` hằng ngày, generate AI insight cho tất cả users. Config tại `apps/anmenh-web/vercel.json`.

---

## Quy tắc code

1. **KHÔNG tự ý thêm bảng DB** — tuân thủ schema hiện có.
2. **Business logic chỉ trong `packages/domain`** — không viết logic tử vi/AI ở trong apps.
3. **Ưu tiên Server Actions/Server Components** — tránh fetch client-side khi không cần.
4. **Hàm nhỏ, đơn mục đích** — không viết hàm làm nhiều việc.
5. **Validate bằng Zod tại API boundary** — không validate thủ công.
6. **Không thêm error handling giả** — chỉ handle lỗi thực sự có thể xảy ra.
7. **Đọc `node_modules/next/dist/docs/` trước khi dùng Next.js API** — có breaking changes.

---

## Trạng thái hiện tại (2026-04)

Dàn giáo đã hoàn chỉnh. Tất cả 7 phases đã done:
- Monorepo infrastructure
- Database & API core
- Cả 3 apps (UI cơ bản)
- Domain logic & AI integration
- Deployment setup

**Next steps đang cần làm:**
- Hoàn thiện Social Compatibility UI (tương hợp bạn bè trong `anmenh-web`)
- Onboarding flow mua báo cáo Premium
- Scale cron job sang queue nếu users tăng

---

## Tài liệu chi tiết

Xem thêm tại `docs/`:
- `SYSTEM_OVERVIEW.md` — Kiến trúc tổng thể
- `IMPLEMENTATION_ANMENH.md` — Spec chi tiết app AnMenh
- `IMPLEMENTATION_TUVI.md` — Spec chi tiết app TuVi
- `SHARED_DOMAIN_MODEL.md` — ERD & domain model
- `LOCAL_GUIDE.md` — Hướng dẫn dev local
- `DEPLOYMENT_GUIDE.md` — Deploy lên Vercel + Neon
