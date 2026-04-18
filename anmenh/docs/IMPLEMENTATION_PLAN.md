# Implementation Plan - Phase 6: Hoan Thien Sanctuary

Phase 1-5 da hoan thanh co ban. Audit ngay 2026-04-18 xac dinh con 5 hang muc chua xong.

---

## Trang thai Phase 1-5

| Phase | Mo ta | Trang thai |
|-------|-------|------------|
| 1-2 | Foundation, 4 view chinh | HOAN THANH |
| 3 | Premium UX, Daily Luck, Lich Van Nien | HOAN THANH |
| 4 | Bat Tu, Radar Ngu Hanh, Tuong Hop | HOAN THANH |
| 5 | Dong bo UI, rebranding An Menh | HOAN THANH |

---

## Phase 6: Cac hang muc con lai

### 6.1 Fix & hoan chinh Test Suite [PENDING]

**Muc tieu:** Co baseline test xanh truoc khi them tinh nang moi.

**Viec can lam:**
- [ ] Chay `npm test` kiem tra trang thai hien tai
- [ ] Viet test cho `getDailyLuck` (TC-DL-01 den TC-DL-04) trong `lunar-logic.test.ts`
- [ ] Hoan chinh test con `[ ]` trong `tuong-hop-logic.test.ts`:
  - TC-TH-02, TC-TH-04, TC-TH-06 den TC-TH-14
- [ ] Hoan chinh test con `[ ]` trong `lunar-logic.test.ts`:
  - TC-SL-03 (thang nhuan), TC-CX-05/06/09-13
- [ ] Hoan chinh test con `[ ]` trong `battu-logic.test.ts`:
  - TC-BTU-08/09/10
- [ ] Hoan chinh component tests con `[ ]`:
  - UserContext (TC-UC-01 den TC-UC-11)
  - Home modal flow (TC-HM-03 den TC-HM-11)
  - CanXuong UI colors (TC-CX-UI-03 den TC-CX-UI-10)
  - BatTrach hover, doi gioi tinh (TC-BTR-06/08)
  - Calendar navigation (TC-CAL-02 den TC-CAL-07)
  - TuongHop scores (TC-THP-UI-03/07)
- [ ] Responsive + Dark mode + Animation tests (TC-RSP, TC-DM, TC-ANI) - uu tien thap

**Files anh huong:**
- `src/lib/__tests__/lunar-logic.test.ts`
- `src/lib/__tests__/battu-logic.test.ts`
- `src/lib/__tests__/tuong-hop-logic.test.ts`
- `src/components/pages/__tests__/*.test.tsx`

---

### 6.2 ContentLock Component [PENDING]

**Muc tieu:** Thay the `alert()` bang UI gating that su de tao cam giac "Sanctuary" cao cap.

**Thiet ke:**
- Component `ContentLock` wrap noi dung bi khoa
- Hieu ung blur + overlay gradient tren noi dung
- CTA "Nang cap Premium" voi icon khoa
- Prop: `isLocked: boolean`, `feature: string`

**Viec can lam:**
- [ ] Tao `src/components/common/ContentLock.tsx`
- [ ] Thay the `alert()` trong `CanXuong.tsx`, `TuongHop.tsx`, `BatTrach.tsx` bang `ContentLock`
- [ ] Viet test cho `ContentLock` component

**Files anh huong:**
- `src/components/common/ContentLock.tsx` (moi)
- `src/components/pages/CanXuong.tsx`
- `src/components/pages/TuongHop.tsx`
- `src/components/pages/BatTrach.tsx`

---

### 6.3 Pricing / Subscription Page [PENDING]

**Muc tieu:** Co trang `/pricing` de nguoi dung hieu quyen loi va chuyen doi len Premium.

**Thiet ke:**
- Route: `src/app/pricing/page.tsx`
- 2 goi: Free va Premium (thang/nam)
- Bang so sanh quyen loi ro rang
- CTA "Nang cap ngay" - hien tai chi UI (chua co payment gateway that)
- Zen/Mystical theme nhat quan

**Viec can lam:**
- [ ] Tao `src/app/pricing/page.tsx` + `src/components/pages/Pricing.tsx`
- [ ] Them link den `/pricing` tu `ContentLock` va menu navigation
- [ ] Cap nhat `Layout.tsx` neu can them nav item
- [ ] Viet test co ban cho trang Pricing

**Files anh huong:**
- `src/app/pricing/page.tsx` (moi)
- `src/components/pages/Pricing.tsx` (moi)
- `src/components/Layout.tsx`

---

### 6.4 SSO - Ket noi auth.vutera.net [PENDING]

**Muc tieu:** Thay the localStorage-only bang xac thuc that su voi `auth.vutera.net`.

**Kien truc (theo PRD.md - Plan B Shared Cookie):**
- Doc JWT cookie tu domain `.vutera.net`
- Verify JWT_SECRET chung
- Fallback ve localStorage neu chua dang nhap (anonymous mode)
- SSO redirect: neu chua login -> `auth.vutera.net/login?redirect=anmenh.vutera.net`

**Viec can lam:**
- [ ] Cap nhat `src/lib/middleware.ts` de doc va verify JWT cookie
- [ ] Cap nhat `src/context/UserContext.tsx`:
  - Uu tien du lieu tu JWT (name, plan, birthData)
  - Fallback localStorage cho anonymous user
- [ ] Them env vars: `NEXT_PUBLIC_AUTH_URL`, `JWT_SECRET`
- [ ] Them `src/app/api/auth/session/route.ts` de expose session info
- [ ] Test voi mock JWT

**Files anh huong:**
- `src/lib/middleware.ts`
- `src/context/UserContext.tsx`
- `src/app/api/auth/session/route.ts` (moi)
- `.env.local` (them env vars)

---

### 6.5 Tu Vi Dau So - 14 Sao Chinh + Dai Van / Tieu Van [PENDING]

**Muc tieu:** Day du nghiep vu Tu Vi Dau So cho trai nghiem Sanctuary that su.

**Phan nghiep vu lon nhat, nen chia nho:**

#### 6.5a - 14 Sao Chinh & Phoi Cung
- 14 chinh tinh: Tu Phu, Thien Co, Thai Duong, Vu Khuc, Thien Dong, Liem Trinh, Thien Phu, Thai Am, Tham Lang, Cu Mon, Thien Tuong, Thien Luong, That Sat, Pha Quan
- Tinh toa do phoi cung (cung 1-12) theo nam sinh am lich va gioi tinh
- Hien thi la so 12 cung tren grid

#### 6.5b - Giai nghia 12 Cung
- Ten 12 cung: Menh, Huynh De, Phu Mau, Phuc Duc, Dien Trach, Quan Loc, No Boc, Thien Di, Tat Ach, Tai Bach, Tu Tuc, Phu The
- Giai nghia co ban moi cung dua tren sao chinh toa lac

#### 6.5c - Dai Van / Tieu Van
- Dai Van: 10 nam/ky, tinh bat dau tu tuoi bao nhieu theo menh
- Tieu Van: hang nam, tinh theo nam sinh va nam hien tai
- Hien thi timeline/ky

**Viec can lam:**
- [ ] Tao `src/lib/tuvi-dau-so-logic.ts` voi cac ham tinh chinh tinh
- [ ] Cap nhat hoac tao moi `src/components/pages/TuVi.tsx` voi la so day du
- [ ] Tao component `LaSo12Cung.tsx` de render grid 12 cung
- [ ] Tao `DaiTieuVan.tsx` component
- [ ] Viet tests day du cho `tuvi-dau-so-logic.ts`

**Files anh huong:**
- `src/lib/tuvi-dau-so-logic.ts` (moi)
- `src/components/pages/TuVi.tsx` (nang cap lon)
- `src/components/TuVi/LaSo12Cung.tsx` (moi)
- `src/components/TuVi/DaiTieuVan.tsx` (moi)
- `src/lib/__tests__/tuvi-dau-so-logic.test.ts` (moi)

---

## Thu tu thuc hien de xuat

```
6.1 Tests  →  6.2 ContentLock  →  6.3 Pricing  →  6.4 SSO  →  6.5 Tu Vi Dau So
(baseline)    (unblock UX)        (monetization)   (auth)       (core feature)
```

Moi buoc commit rieng. Khong bat dau buoc tiep theo khi buoc truoc chua xanh test.
