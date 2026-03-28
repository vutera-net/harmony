# Technical Implementation — Monorepo Architecture

## Selected Tooling
- **Monorepo Manager:** Turborepo
- **Package Manager:** pnpm (workspaces)
- **Framework:** Next.js (App Router for all 3 apps)
- **Shared API Engine:** tRPC (End-to-end type safety)
- **Typing:** TypeScript (Strict mode enabled everywhere)

---

## 1. Directory Structure Details

### `apps/harmony-web`
- **Deployment URL:** `harmony.vutera.net` (Nhận redirect từ `vutera.net/harmony`)
- **Vai trò:** Brand Landing Page.
- Mostly static assets, `.tsx` components with `framer-motion` for complex scroll-animations. High focus on Core Web Vitals.

### `apps/tuvi-web`
- **Deployment URL:** `tuvi.vutera.net`
- **Vai trò:** SEO / Traffic Engine.
- Focus on ISR (Incremental Static Regeneration). Pulls content (Articles) from CMS or Database via `packages/api`.

### `apps/anmenh-web`
- **Deployment URL:** `anmenh.vutera.net`
- **Vai trò:** Protected SaaS Dashboard.
- Focus on Server Components + Server Actions. Consumes user-specific routes from `packages/api` requiring auth tokens.

---

## 2. Shared Packages (The Core)

### `packages/api`
- Core engine sử dụng **tRPC**. 
- Toàn bộ logic Backend (Query, Mutation) nằm tại đây. Các ứng dụng Next.js (như `anmenh-web` hay `tuvi-web`) sẽ import `appRouter` từ package này để lấy dữ liệu với 100% Type-safety mà không cần khai báo lại TypeScript interface.

### `packages/database`
- Setup **Prisma** hoặc **Drizzle ORM**.
- Đảm bảo singleton pattern cho DB client trong môi trường serverless (Vercel) để tránh cạn kiệt Connection Pool.

### `packages/domain`
- Các hàm TypeScript thuần tuý về nghiệp vụ (ví dụ: Thuật toán Bát tự, Ngũ hành, logic tính điểm tương hợp). Đảm bảo mọi App đều dùng chung một bộ quy tắc.

### `packages/auth`
- Common Auth configuration (Sử dụng NextAuth.js / Auth.js hoặc Lucia).
- **Lưu ý về Cookie:** Để Session có thể chia sẻ chéo giữa các ứng dụng được deploy trên `*.vutera.net` (nếu cần), Cookie của hệ thống Auth phải được thiết lập domain là `.vutera.net`.

---

## 3. Infrastructure & Deployment (Vercel)

- **Chiến lược Domain:**
  - Cả 3 ứng dụng sẽ được triển khai thành 3 dự án hoàn toàn độc lập trên Vercel, chia sẻ mã nguồn chung nhưng liên kết vào 3 Subdomain riêng biệt: `harmony.vutera.net`, `tuvi.vutera.net`, và `anmenh.vutera.net`. Cơ chế này đem lại sự cô lập hoàn hảo và tận dụng sức mạnh máy chủ độc lập của từng cái.
  - Về mặt SEO Branding: Lượng truy cập đi và đến từ hệ sinh thái chính sẽ được xử lý qua 1 cơ chế **Redirect HTTP 301** hoặc **302** rất đơn giản từ hệ thống web mẹ `vutera.net/harmony` trỏ sang `harmony.vutera.net`. Cách tiếp cận này loại bỏ toàn bộ 100% rủi ro cấu hình Reverse Proxy phức tạp.
