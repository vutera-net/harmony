# Hướng Dẫn Chạy Harmony Monorepo Trên Local

Tôi đã chuẩn bị sẵn môi trường giả lập (Mock Data) bằng SQLite để anh có thể xem ngay thành quả mà không cần cấu hình Postgres phức tạp.

## 1. Chuẩn Bị Dữ Liệu (Đã Thực Hiện)
Tôi đã chạy sẵn các lệnh sau cho anh:
- `pnpm install`: Cài đặt toàn bộ thư viện.
- `pnpm setup:db`: Khởi tạo file database `dev.db` (SQLite).
- `pnpm db:seed`: Gieo hạt dữ liệu giả (Gồm 1 User chính và 2 người bạn để test).

## 2. Cách Chạy Các Ứng Dụng

Anh có thể chạy cùng lúc cả 3 Apps hoặc chạy riêng lẻ từng cái:

### Cách A: Chạy tất cả cùng lúc (Khuyên dùng)
Mở terminal tại thư mục gốc và gõ:
```bash
pnpm dev
```
Hệ thống [Turborepo](https://turbo.build/) sẽ tự động điều phối:
- **Harmony Web (Landing):** `http://localhost:3000`
- **An Mệnh Web (SaaS App):** `http://localhost:3001` (Hoặc 3000 nếu port kia rảnh)
- **Tử Vi Web (SEO Content):** `http://localhost:3002`

### Cách B: Chạy riêng từng App
Nếu máy anh yếu hoặc chỉ muốn tập trung vào 1 phần:
- **Chạy An Mệnh ( Dashboard & Onboarding):**
  ```bash
  pnpm --filter anmenh-web dev
  ```
- **Chạy Harmony Landing:**
  ```bash
  pnpm --filter harmony-web dev
  ```
- **Chạy Tử Vi Blog:**
  ```bash
  pnpm --filter tuvi-web dev
  ```

---

## 3. Các Tài Khoản Dùng Thử (Fake Data)
Tôi đã tạo sẵn trong Database các tài khoản sau để anh test tính năng **Social Compatibility**:

- **User Chính (Của Anh):**
  - Email: `toi@harmony.com`
  - Mệnh: Thủy (Dần)
- **Bạn Tương Sinh (Hợp):**
  - Email: `banhop@harmony.com` (Mệnh Mộc - Thủy sinh Mộc)
- **Bạn Tương Khắc (Khắc):**
  - Email: `bankhac@harmony.com` (Mệnh Hỏa - Thủy khắc Hỏa)

> [!TIP]
> **Thử Nghiệm:**
> Vòng kết nối của anh đã có sẵn 2 người này. Anh hãy vào trang An Mệnh (`localhost:3001/connections`) để xem điểm số 95% và 35% nhảy như thế nào nhé!

---

> [!IMPORTANT]
> **Lưu Ý Khi Chuyển Sang Sản Xuất (Production):**
> Khi anh thực sự muốn đưa lên web, hãy nhớ sửa lại `packages/database/prisma/schema.prisma` phần `provider = "postgresql"` và cung cấp `DATABASE_URL` từ Neon DB nhé!
