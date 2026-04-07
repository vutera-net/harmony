# Sẵn Sàng Go-Live: Hướng dẫn Deploy Đám Mây Mạng Toàn Cầu

Tài liệu này hướng dẫn cách đưa 3 standalone apps lên Vercel và Neon PostgreSQL.

## BƯỚC 1: Ráp Dữ Liệu Lên Neon Serverless DB
1. Nhạc trưởng (Admin) đăng nhập vào [Neon.tech](https://neon.tech), tạo một Project Postgres miễn phí.
2. Copy đường dẫn kết nối URL (chọn loại Pooled connection).
3. Tạo file `.env` trong thư mục `anmenh/`. Dán các giá trị: `DATABASE_URL` (Neon URL), `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://anmenh.vutera.net`, `OPENAI_API_KEY`.
4. Mở Terminal ở folder gốc và đẩy schema:
   ```bash
   cd anmenh && pnpm db:push
   ```

## BƯỚC 2: Rẽ Nhánh Lên Vercel (CD Pipeline)
Tạo **3 Project độc lập** trên Vercel, trỏ chung **1 kho GitHub**:

- **Tiến trình:**
  - Lên Vercel Dashboard, chọn "Import Project" từ nhánh GitHub của `harmony`.
  - Trong lúc cấu hình (Configure Project), kéo thanh **Root Directory** vào đúng folder App tương ứng: 
    - 👉 `landing` (Dự án 1: Landing Page).
    - 👉 `tuvi` (Dự án 2: SEO Blog).
    - 👉 `anmenh` (Dự án 3: Lõi Ứng Dụng).
  - Vercel sẽ tự động phát hiện Framework Next.js.
  - Điền tất cả các Biến Môi Trường (`.env`) vào phần **Environment Variables** cho App số 3 (`anmenh`).
  - Nhờ file `vercel.json` trong `anmenh/`, Vercel tự thiết lập Cron chạy ngầm gọi AI lúc **00:01 sáng mỗi ngày**.

## BƯỚC 3: Đi dây Tên Miền (DNS / Cloudflare)
1. Tại Dashboard Vercel của 3 App, add Domain tương ứng:
   `harmony.vutera.net` | `tuvi.vutera.net` | `anmenh.vutera.net`
2. Lấy dãy IP/CNAME của Vercel sinh ra.
3. Đăng nhập Cloudflare gốc quản lý `vutera.net` -> Mở DNS Records -> Thêm 3 bản ghi CNAME/Proxy hướng tên miền bạn cung cấp vào Vercel.

## BONUS TRICK: Định tuyến vutera.net/harmony
Vì code quản lý `vutera.net` riêng biệt (ngoài Monorepo này), bạn chỉ cần sang code Next.js của vutera gốc và chèn vào `next.config.js`:
```js
module.exports = {
  async redirects() {
    return [
      {
        source: '/harmony',
        destination: 'https://harmony.vutera.net',
        permanent: true,
      },
      {
        source: '/tuvi',
        destination: 'https://tuvi.vutera.net',
        permanent: true,
      }
    ]
  },
}
```
