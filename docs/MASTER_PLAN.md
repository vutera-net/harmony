# Harmony: Master Project Plan 🚀

> File này lưu trữ toàn bộ lịch sử tiến trình của hệ thống từ lúc khởi tạo đến lúc hoàn thiện hạ tầng. 
> Toàn bộ kiến trúc Monorepo (3 Apps + 4 Packages) đã được hoàn thành.
> `- [x]` là đã hoàn thành.

---

## Giai đoạn 1: Nền Móng Kiến Trúc Monorepo (Hoàn Tất ✅)
- `[x]` Khởi tạo `pnpm workspaces` & `turbo.json`.
- `[x]` Scaffold 3 ứng dụng Next.js (`harmony-web`, `tuvi-web`, `anmenh-web`).
- `[x]` Xây dựng cấu trúc Shared Packages (`api`, `auth`, `database`, `domain`).
- `[x]` Validation: Build song song bằng lệnh `turbo build` thành công.

---

## Giai đoạn 2: Lõi Dữ Liệu & API (Hoàn Tất ✅)
- `[x]` **Database:** Code `schema.prisma` với đầy đủ thực thể (User, Profile, Insight, v.v).
- `[x]` **API Core:** Setup `tRPC` server và Context trong `packages/api`.
- `[x]` **Routers:** Khởi tạo cấu trúc API rẽ nhánh cho Auth và Profile.

---

## Giai đoạn 3: Brand/Trust Layer (Harmony Web) (Hoàn Tất ✅)
- `[x]` Thiết lập phong cách UI `Zen Minimalist`.
- `[x]` Code Landing Page (`/`): Sections Hero, Philosophy, Ecosystem Hub.
- `[x]` Bật `pnpm dev` để verify giao diện The Trust Layer.

---

## Giai đoạn 4: Product/Identity Layer (App An Mệnh) (Hoàn Tất ✅)
- `[x]` **Auth Integration:** Tích hợp `NextAuth` vào `anmenh-web` và `packages/auth`.
- `[x]` **tRPC Provider:** Connect vỏ Frontend AnMệnh vào `packages/api`.
- `[x]` **UI/UX Onboarding:** Luồng tạo Destiny Profile (< 30s) bằng lịch ngày tháng - UI/UX mượt mà thế hệ mới.
- `[x]` **UI/UX Dashboard:** Giao diện hiển thị Daily Energy Score, Do/Avoid List, Lucky Color.
- `[x]` **Social Compatibility:** Giao diện thêm bạn bè và so sánh điểm tương hợp ngũ hành (Luật tính toán Auto-Connect).

---

## Giai đoạn 5: SEO & Traffic Layer (TuVi Web) (Hoàn Tất ✅)
- `[x]` Setup giao diện Static (ISR/SSG) phục vụ SEO.
- `[x]` UI/UX Layout cho Blog bài viết học thuật Tử Vi phương Đông.
- `[x]` Nhúng Dynamic CTA kích thích người dùng chuyển đổi sang An Mệnh: *"Bạn và người ấy có thực sự hợp nhau?"*.

---

## Giai đoạn 6: Thuật Toán & AI (Domain Logic) (Hoàn Tất ✅)
- `[x]` Hoàn thiện Engine tính toán Bát Tự, Mệnh Ngũ hành ở `packages/domain` dựa trên Input ngày tháng năm sinh.
- `[x]` Setup hệ thống tạo Insight mỗi ngày bằng Prompt (gọi OpenAI/Anthropic SDK) để lưu vào DB hàng đêm.

---

## Giai đoạn 7: Vận Hành & Tinh Chỉnh (Deployment) (Hoàn Tất ✅)
- `[x]` Đấu nối với Database thực tế (PostgreSQL via Neon DB).
- `[x]` Khởi tạo file biến môi trường gốc `.env.example`.
- `[x]` Cài đặt Serverless Cronjob cho An Mệnh qua `vercel.json`.
- `[x]` Setup Pipeline CD lên 3 dự án độc lập trên Vercel.
- `[x]` Cài đặt domain/redirect tại máy chủ `vutera.net` (Cloudflare).
