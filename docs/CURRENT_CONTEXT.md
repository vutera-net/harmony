# Technical Architecture Context (Context Load)

> *File này được cố tình tạo ra để các trợ lý AI đọc lướt ở phiên làm việc sau, từ đó khởi tạo lập tức nhận thức hệ thống (AI Context Bootstrapping).*

## 1. Stack & Frameworks
- **Manager:** pnpm workspaces + Turborepo (`turbo.json` format v2 `tasks`).
- **Core Backend:** Node.js, chia ra 4 package `packages/api`, `packages/auth`, `packages/database`, `packages/domain`.
- **Core Frontend:** Next.js 15 (App Router), Tailwind V4. Chia ra 3 App: `harmony-web`, `tuvi-web`, `anmenh-web`.
- **API Engine:** tRPC (Server/React-Query) với `superjson` & Zod.
- **ORM Config:** Prisma (`^5` fix tương thích Monorepo Edge), connect qua Postgres.
- **Authentication:** NextAuth v4 (Credentials Provider chia sẻ cookie chéo domain `.vutera.net`).
- **Domain/AI Logic:** ChatGPT-4 API thông qua cơ chế Fetch Serverless để giữ Edge-friendly. Code gọi AI nén trong `packages/domain/src/ai/insightGenerator.ts`.
- **Cronjob:** Vercel Cronbot chỉ trỏ vào `anmenh-web/src/app/api/cron/route.ts` chạy lúc `00:01` hằng ngày.

## 2. Các ứng dụng (Apps)
1. **`harmony-web`**: Lõi Branding (Landing page tĩnh mộc mạc), thẩm mỹ Dark-Zen. (Đã hoàn thành UI page.tsx).
2. **`tuvi-web`**: Trái tim SEO (Static Site Generation / ISR). Thẩm mỹ Editorial Light Theme (Sử dụng Tailwind Typography Noto Serif). Có component `CtaBanner` rải phễu kéo người xem sang `anmenh-web`.
3. **`anmenh-web`**: Siêu ứng dụng chứa tRPC ReactProvider, NextAuth SessionProvider. Có luồng UI Wizard Onboarding thần tốc 3 bước. Màn hình Dashboard phân tách "Nên Làm" vs "Đừng Làm" bằng Straight-talk AI Insight.

## 3. Work-in-progress / Next Steps
- Cấu hình Social Compatibility (Tương Hợp Bạn Bè) bên mạng lõi An Mệnh.
- Kịch bản Onboarding có thể bổ sung API Lấy/Mua bản báo cáo Premium.
- Scale Cronjob từ chạy 100 users / lần sang Queueing nếu lượng users to hơn.

*Dự án đã dựng đầy đủ dàn giáo, code sẵn logic cốt lõi. Chỉ cần viết thêm UI hoặc mở rộng DB Schema khi cần.*
