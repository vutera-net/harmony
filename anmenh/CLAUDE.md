# CLAUDE.md - An Menh Project Guide

## Tong quan du an

**Ten san pham:** An Menh - Web App Phong Thuy, Tu Vi & Xem Ngay
**Nen tang:** Web Application (Mobile-first Responsive)
**Muc tieu:** Ung dung web hien dai ket hop Tu vi Dong Phuong (Bat tu, Can xuong), Phong thuy ung dung va Lich xem ngay tot xau. Huong toi trai nghiem ca nhan hoa, giao dien truc quan, tinh tham my cao cho nguoi dung Viet Nam.

---

## Tech Stack

- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Data Persistence:** Local Storage (key: `anmenh_profile`)

---

## Kien truc tinh nang

### Tinh nang cot loi

**A. Tu vi ca nhan & Bat Tu (Tu Tru)**
- Form nhap lieu: Ten, Gioi tinh, Gio, Ngay, Thang, Nam sinh (Duong lich/Am lich)
- Sinh la so Bat Tu (Thien Can, Dia Chi cho 4 tru)
- Bieu do Radar Ngu Hanh (Kim, Moc, Thuy, Hoa, Tho)
- Luan giai co ban tinh cach va van menh

**B. Can xuong doan so**
- Tinh toan "Luong Chi" tu dong dua tren ngay gio sinh
- Hien thi ket qua truc quan (cap do so menh)
- Binh giai tong quan tai loc

**C. Xem ngay tot xau & Lich Van Nien**
- Lich theo thuat toan chuan hoa (Ho Ngoc Duc logic)
- Giao dien lich bieu, loc ngay Hoang Dao/Hac Dao
- Xem chi tiet ngay: Gio dep, Can Chi nam thang ngay

**D. Phong thuy ung dung & Huong nha (Bat Trach)**
- Dinh vi Cung Phi menh quai (Dong/Tay tu menh)
- La ban phong thuy tuong tac (xoay chuan goc phong thuy theo Cung Phi)
- Loi khuyen ke giuong ngu, huong lam viec

**E. Ban tin Tu Vi Hang Ngay (Daily Luck)**
- Dashboard ca nhan hoa
- Chi so Nang luong, thong diep trong ngay, con so may man, huong xuat hanh tot

**F. Xem tuoi tuong hop doi lua**
- Phan tich Menh, Can Chi cua hai nguoi

---

## UI/UX Guidelines

- **Phong cach:** "Mystical Modern" - Dark mode voi anh sang Neon gradient (vu tru/chiem tinh) HOAC "Zen Minimal" - Light mode beige/off-white
- **Typography:** *Inter* + *Playfair Display*
- **Animations:** Micro-animations voi Framer Motion; la ban xoay muot
- **Pattern:** `backdrop-blur-md` tren toan bo cac trang (chuan hoa nhu La Ban Huong Nha)
- **Mau Ngu Hanh:** Kim = xam bac/anh kim (KHONG dung vang/nau de tranh nham voi Tho)
- **Ngay Hac Dao:** Dung tong do nhat (`rose`) de khac biet voi ngay binh thuong
- **Progressive Disclosure:** Hien thi thong tin tung buoc, tranh ngop du lieu

---

## Quy uoc du an

- LocalStorage key: `anmenh_profile`
- Ten du an chinh thuc: **An Menh** (da doi ten tu Harmony TuVi)
- Thuat toan Cung Phi: Ap dung cong thuc mod 9 chuan phong thuy trong `lunar-logic.ts`

---

## Trang thai phat trien

| Giai doan | Mo ta | Trang thai |
|-----------|-------|------------|
| Phase 1 & 2 | Foundation & SEO - Setup Next.js, 4 view chinh | HOAN THANH |
| Phase 3 | Premium UX - Thuat toan lich, Daily Luck, UI Polish | HOAN THANH |
| Phase 4 | Bat Tu module, Radar Ngu Hanh, Xem tuoi tuong hop | HOAN THANH |
| Phase 5 | Review & Polish - Dong bo UI, rebranding An Menh | HOAN THANH |
| Phase 6 | TDD hoan chinh + ContentLock + Pricing UI + SSO | DANG THUC HIEN |

---

## Nhung gi con thieu (Phase 6 - Audit 2026-04-18)

### P0 - Nghiep vu con thieu (Sanctuary chua day du)
- **14 Sao Chinh + 12 Cung Tu Vi Dau So**: Hoan toan chua co. Chi co Bat Tu co ban.
- **Dai Van / Tieu Van**: Chu ky 10 nam chua duoc tinh toan.

### P1 - Ky thuat con thieu
- **ContentLock UI**: Hien tai chi dung `alert()`. Can component gating that su.
- **Pricing / Subscription page**: Chi co flag `FREE/PREMIUM` trong localStorage, khong co paywall UI, khong co trang `/pricing`.
- **SSO that su**: App dang dung localStorage thuan tuy, chua ket noi `auth.vutera.net`.

### P2 - Tests con pending (~40% chua pass)
- Nhieu test case con `[ ]` trong `TEST_PLAN.md` (UserContext, Calendar nav, tuong-hop chi scores, responsive, dark mode, animations).
- `getDailyLuck` (TC-DL-01 den TC-DL-04) chua co test nao.
- Can chay `npm test` de xac nhan trang thai hien tai.

### Thu tu uu tien de implement
1. Chay va fix het test suite (P2 truoc de co baseline)
2. ContentLock component (P1 - unblock paywall UX)
3. Pricing page (P1 - unblock monetization)
4. SSO ket noi auth.vutera.net (P1)
5. 14 Sao Chinh + Dai Van / Tieu Van (P0 - phan nghiep vu lon nhat)
