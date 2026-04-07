# Hướng dẫn chạy dự án AnMenh

## Yêu cầu
- Node.js >= 18
- pnpm

## Các bước setup (chạy lần đầu)

### 1. Tạo file `.env`

Tạo file `.env` tại thư mục `anmenh/` với nội dung:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="dev-secret-harmony-local"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""
```

> `OPENAI_API_KEY` để trống vẫn chạy được — AI insight sẽ dùng mock data.

### 2. Cài dependencies + generate Prisma Client

```bash
pnpm install
```

> `postinstall` tự động chạy `prisma generate` — không cần chạy tay.

### 3. Tạo database

```bash
pnpm db:push    # Tạo/sync SQLite schema
pnpm db:seed    # Tạo dữ liệu demo
```

### 4. Chạy dev server

```bash
pnpm dev        # http://localhost:3000
```

---

## Tài khoản demo

| Email | Mật khẩu | Mệnh |
|-------|----------|------|
| `toi@harmony.com` | `123456` | Thủy / Dần |
| `banhop@harmony.com` | `123` | Mộc (tương sinh) |
| `bankhac@harmony.com` | `123` | Hỏa (tương khắc) |

---

## Reset database

Nếu muốn reset dữ liệu về trạng thái ban đầu:

```bash
rm prisma/dev.db
pnpm db:push
pnpm db:seed
```

---

## Lưu ý

- Database mặc định dùng **SQLite** cho dev — file `prisma/dev.db`.
- Khi deploy production, đổi `DATABASE_URL` sang Neon PostgreSQL và sửa `provider = "postgresql"` trong `prisma/schema.prisma`.
