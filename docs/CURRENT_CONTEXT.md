# Technical Architecture Context

> *File này dành cho AI đọc để bootstrap context nhanh ở đầu mỗi phiên làm việc.*

## 1. Stack & Frameworks

- **Cấu trúc:** 3 standalone Next.js apps (không monorepo, không Turborepo)
- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict
- **Styling:** TailwindCSS v4
- **API:** tRPC + Zod + SuperJSON + @tanstack/react-query
- **ORM:** Prisma v5 — SQLite (dev) / Neon PostgreSQL (prod)
- **Auth:** NextAuth v4 — Credentials Provider, JWT, cross-domain cookie `.vutera.net`
- **AI:** GPT-4 mini qua native `fetch` (serverless-friendly). Mock fallback khi không có API key.
- **Deploy:** Vercel (3 projects riêng trỏ cùng 1 GitHub repo)

## 2. Các ứng dụng

| App | Thư mục | URL | Vai trò |
|-----|---------|-----|---------|
| Landing | `landing/` | `harmony.vutera.net` | Branding, dark-zen static |
| AnMenh | `anmenh/` | `anmenh.vutera.net` | SaaS core — auth, dashboard, onboarding |
| TuVi | `tuvi/` | `tuvi.vutera.net` | SEO blog, traffic funnel |

## 3. AnMenh — cấu trúc nội bộ

```
anmenh/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Login/redirect
│   │   ├── onboarding/       # Tạo Destiny Profile
│   │   ├── dashboard/        # Daily energy, do/avoid list
│   │   ├── connections/      # Social compatibility
│   │   └── api/
│   │       ├── auth/[...nextauth]/   # NextAuth handler
│   │       ├── trpc/[trpc]/          # tRPC handler
│   │       └── cron/                 # Daily insight generator
│   ├── trpc/                 # tRPC React client + provider
│   └── lib/                  # Backend logic (inlined)
│       ├── api/              # tRPC routers & context
│       ├── auth/             # NextAuth config
│       ├── database/         # Prisma client singleton
│       └── domain/           # Astrology engine, AI, compatibility
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db                # SQLite (dev only, gitignored)
└── .env                      # Local env (gitignored)
```

## 4. Work-in-progress / Next Steps

- Hoàn thiện Social Compatibility UI (tương hợp bạn bè trong `anmenh`)
- Onboarding flow mua báo cáo Premium
- Scale cron job sang queue khi users tăng

*Dàn giáo đầy đủ, logic cốt lõi đã có. Chỉ cần thêm UI hoặc mở rộng schema khi cần.*
