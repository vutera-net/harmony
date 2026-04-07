# AI Coding Guidelines

## Rules

1. Do NOT invent new database tables — follow schema exactly.
2. Business logic chỉ trong `src/lib/domain/` — không viết logic tử vi/AI ở nơi khác.
3. Keep functions small, single-purpose.
4. Prefer Server Components / Server Actions — tránh client-side fetch khi không cần.
5. Validate bằng Zod tại API boundary — không validate thủ công.
6. Không thêm error handling giả — chỉ handle lỗi thực sự có thể xảy ra.
7. Đọc `node_modules/next/dist/docs/` trước khi dùng Next.js API — có breaking changes.

## Folder Structure (AnMenh)

```
src/
├── app/          # Next.js App Router pages & API routes
├── trpc/         # tRPC React client & provider
└── lib/
    ├── api/      # tRPC routers & context
    ├── auth/     # NextAuth config
    ├── database/ # Prisma client singleton
    └── domain/   # Business logic (astrology, AI) — chỉ được viết ở đây
```
