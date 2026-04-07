# Hướng Dẫn Chạy Local

Mỗi app là project độc lập — `cd` vào thư mục tương ứng và chạy riêng.

---

## AnMenh (app chính)

### Setup lần đầu

```bash
cd anmenh

# 1. Tạo file .env
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="dev-secret-harmony-local"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""
EOF

# 2. Cài dependencies + auto generate Prisma Client (qua postinstall)
pnpm install

# 3. Tạo SQLite database + seed dữ liệu demo
pnpm db:push
pnpm db:seed
```

### Chạy dev

```bash
cd anmenh && pnpm dev    # http://localhost:3000
```

### Tài khoản demo

| Email | Mật khẩu | Mệnh |
|-------|----------|------|
| `toi@harmony.com` | `123456` | Thủy / Dần |
| `banhop@harmony.com` | `123` | Mộc (tương sinh) |
| `bankhac@harmony.com` | `123` | Hỏa (tương khắc) |

### Reset database

```bash
rm prisma/dev.db
pnpm db:push
pnpm db:seed
```

---

## Landing

```bash
cd landing
pnpm install
pnpm dev    # http://localhost:3000
```

---

## TuVi

```bash
cd tuvi
pnpm install
pnpm dev    # http://localhost:3000
```

---

## Lưu ý

- Không có root-level `pnpm dev` hay Turborepo — mỗi app chạy riêng lẻ.
- `prisma generate` không cần chạy tay — `pnpm install` tự kích hoạt qua `postinstall`.
- `OPENAI_API_KEY` để trống vẫn chạy được (AI insight dùng mock data).
- SQLite chỉ dùng cho dev. Production dùng Neon PostgreSQL.
