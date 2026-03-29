# 🎬 Demo Setup Guide

Hướng dẫn thiết lập và chạy demo toàn bộ tính năng Harmony.

---

## 📋 Yêu cầu

- Node.js 22+
- pnpm 8.15.0+
- PostgreSQL (hoặc Neon serverless)
- OpenAI API key (tùy chọn - có fallback mock data)

---

## 🚀 Bước 1: Thiết lập Environment Variables

### Copy file .env mẫu:

```bash
# File .env đã được tạo sẵn, kiểm tra tại:
# /home/linh/Projects/vutera.net/harmony/.env

# Nếu chưa có, tạo mới với nội dung:
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:example@localhost/5432/harmony_demo"
NEXTAUTH_SECRET="your_super_secret_string_here_32_chars"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-proj-xxxxx"
CRON_SECRET="your_cron_secret"
EOF
```

### Điều chỉnh cho máy local của bạn:

- **DATABASE_URL**: Thay bằng connection string Postgres của bạn
  - Local: `postgresql://postgres:password@localhost:5432/harmony_demo`
  - Neon: `postgresql://user:password@ep-xxx.neon.tech/harmony?sslmode=require`

- **NEXTAUTH_SECRET**: Generate bằng:
  ```bash
  openssl rand -base64 32
  ```

- **OPENAI_API_KEY**: (Tùy chọn)
  - Nếu không set, insights sẽ dùng mock data
  - Lấy từ: https://platform.openai.com/api-keys

- **CRON_SECRET**: Bất kỳ string ngẫu nhiên, ví dụ: `demo_secret_123`

---

## 🗄️ Bước 2: Khởi tạo Database

### Push Prisma schema:

```bash
pnpm --filter database db:push
```

Hoặc:

```bash
cd packages/database && pnpm db:push
```

### Seed fake data (5 users + profiles + insights):

```bash
pnpm --filter database seed
```

Output sẽ là:

```
✅ Created 5 users
✅ Created 5 destiny profiles
✅ Created 5 daily insights
✅ Created 4 connections
✅ Created 5 harmony scores

Demo credentials:
  - linh@harmony.test / password
  - an@harmony.test / password
  - hoa@harmony.test / password
  - duc@harmony.test / password
  - mai@harmony.test / password
```

---

## 🎯 Bước 3: Chạy Development Server

```bash
pnpm dev
```

Mỗi app sẽ chạy trên port khác nhau. Xem output để biết port nào.

**Thường:**
- **harmony-web** (Landing): http://localhost:3000
- **anmenh-web** (App chính): http://localhost:3001
- **tuvi-web** (Blog): http://localhost:3002

---

## 🧪 Demo Credentials

**Email Test:**
```
linh@harmony.test
an@harmony.test
hoa@harmony.test
duc@harmony.test
mai@harmony.test
```

**Password:** `password` (plain text, chỉ cho demo)

⚠️ **Lưu ý về Password:**
- Seed script hiện lưu password plain text (KHÔNG an toàn cho production)
- Để test login, bạn cần:

**Option 1: Set password qua SQL**
```sql
-- Mở database client (psql, DBeaver, etc)
-- Thực hiện:
UPDATE "User" SET "passwordHash" = 'password' WHERE email = 'linh@harmony.test';
```

**Option 2: Sửa seed script (Dev only)**
```typescript
// Ở seed.ts, thêm:
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash('password', 10);

// Rồi:
passwordHash: hashedPassword,
```

---

## 🎪 Chức năng có thể Demo

### ✅ 1. Đăng ký & Đăng nhập
- Truy cập `/auth/register` → Tạo account mới
- Hoặc `/auth/login` → Đăng nhập bằng credentials mẫu

### ✅ 2. Onboarding Wizard
- Sau lần đầu login → Tự động redirect `/onboarding`
- 4 bước:
  1. Chào (click "Bắt đầu")
  2. Ngày sinh + giờ sinh (tùy)
  3. Chọn giới tính (Nam/Nữ)
  4. Loading ~ 3s → Redirect `/dashboard`

### ✅ 3. Dashboard with Daily Insights
- Hiển thị **năng lượng hôm nay** (từ database seed)
- **Danh sách "Nên Làm"** (AI sinh, hoặc mock)
- **Danh sách "Đừng Làm"** (AI sinh, hoặc mock)
- **Màu may mắn** (hôm nay)

### ✅ 4. Kết Nối Bạn Bè & Tương Hợp
- Click "Vòng Tròn Sinh Khắc"
- Tìm bạn bè theo email (ví dụ: `an@harmony.test`)
- Click "Chạm Để Kết Nối"
- Xem danh sách bạn bè + **điểm tương hợp realtime**
- Tương Sinh (95%), Tương Khắc (35%), Bình Hòa (60-75%)

### ✅ 5. Blog Tử Vi
- Truy cập `/tuvi-web`
- Xem 3 bài viết mẫu (SSG optimized)
- Bài viết có CTA "Khám Phá An Mệnh" → Dẫn sang anmenh-web

### ✅ 6. Cron Job AI Insights (Manual Test)
```bash
# Terminal 1: Chạy dev server
pnpm dev

# Terminal 2: Trigger cron (replace với port của anmenh-web)
curl "http://localhost:3001/api/cron?secret=your_cron_secret"
```

Response:
```json
{ "success": true, "generatedInsights": 5 }
```

---

## 🔧 Troubleshooting

### ❌ Error: "Unexpected end of JSON input" (Prisma)
**Nguyên nhân:** DATABASE_URL sai hoặc database chưa tồn tại
```bash
# Fix:
# 1. Kiểm tra DATABASE_URL trong .env
# 2. Tạo database trước:
createdb harmony_demo

# 3. Thử lại:
pnpm --filter database db:push
```

### ❌ Error: "Cannot find module 'tsx'"
**Nguyên nhân:** Dependency chưa install
```bash
pnpm install
```

### ❌ Error: "NEXTAUTH_SECRET missing"
**Nguyên nhân:** File .env chưa được setup
```bash
# Generate secret:
openssl rand -base64 32

# Copy vào .env
NEXTAUTH_SECRET="<output-từ-trên>"
```

### ❌ Login không được (password sai)
**Nguyên nhân:** Password không set trong database
```sql
-- Cách nhanh nhất (dev only):
UPDATE "User" SET "passwordHash" = 'password' WHERE email = 'linh@harmony.test';
```

### ❌ Cron job không gọi được OpenAI
**✓ Hoàn toàn bình thường!** - Sẽ fallback về mock data. Để có AI insights thật, set `OPENAI_API_KEY`.

---

## 📊 Database Schema (Sau Seed)

```
User (5 users)
├── Emails: linh@, an@, hoa@, duc@, mai@harmony.test
├── DestinyProfile (5)
│   ├── Element: Kim, Mộc, Thủy, Hỏa, Thổ
│   ├── Zodiac: 12 con giáp
│   └── DailyInsight (5 hôm nay)
│       ├── energyScore: 68-92
│       ├── doList: ["...", "..."]
│       ├── avoidList: ["...", "..."]
│       └── luckyColor: "Vàng", "Xanh", etc
├── Connection (4 kết nối)
│   └── status: "accepted"
└── HarmonyScore (5)
```

---

## 🚨 Lưu ý trước Production

- [ ] **Đổi NEXTAUTH_SECRET** (tạo mới)
- [ ] **Implement bcrypt** cho password hashing
- [ ] **Đổi DATABASE_URL** sang production DB
- [ ] **Set OPENAI_API_KEY** (nếu muốn AI insights)
- [ ] **Cấu hình CRON_SECRET** cho Vercel Cron
- [ ] **Test toàn bộ flow:** auth → profile → insights → connections
- [ ] **Chạy `pnpm build`** để verify production build

---

## 📚 Tài liệu thêm

- Architecture: `/docs/SYSTEM_OVERVIEW.md`
- Implementation: `/docs/IMPLEMENTATION_*.md`
- Test Plan: `/docs/TEST_PLAN.md`

---

**Chúc bạn demo vui vẻ! 🚀**

Nếu gặp vấn đề, check:
1. `.env` setup đúng
2. `pnpm install` → dependency cài đủ
3. `pnpm --filter database db:push` → database schema OK
4. `pnpm --filter database seed` → fake data OK
5. `pnpm dev` → server chạy OK
