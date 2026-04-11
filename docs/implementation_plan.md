# Kế hoạch Triển khai (Implementation Plan) - Hệ Sinh Thái Harmony

Document này đúc kết chi tiết các bước phát triển mã nguồn để hiện thực hóa Hệ Sinh Thái Harmony (gồm TuVi, AnMenh và Harmony Portal) theo chiến lược Hub and Spoke (Lò Luyện Traffic -> Lõi Đóng gói) đã đề ra trong PRD.

## Yêu cầu người dùng (User Review Required)

> [!IMPORTANT]  
> Xin hãy xem qua kế hoạch phân bổ dưới đây. Vì hệ sinh thái bao gồm nhiều Repo/Folder (`tuvi`, `anmenh` và dự kiến thêm `harmony-portal`), kế hoạch này tập trung vào lộ trình thứ tự. Bạn có muốn ưu tiên phát triển dứt điểm bộ tính năng nào trước không (ví dụ: hoàn thiện TuVi Pivot trước, hay làm xong SSO trước)?

## Proposed Changes (Chi tiết triển khai)

___

### 1. Hoàn thiện Ứng dụng TuVi (Traffic Engine v2.0 Pivot)

Hoàn tất việc cắt giảm nội dung thương mại cũ và chuyển biến 100% sang dạng "Phễu".

#### [MODIFY] `tuvi/src/components/common/HoroscopeView.tsx`
- Tái cấu trúc (Restructure): Áp dụng `ContentLock` để chỉ hiển thị Tổng Quan và 1 lĩnh vực ngẫu nhiên. Giấu các lĩnh vực khác để nhử sang AnMenh.

#### [MODIFY] `tuvi/src/components/phongthuy/PhongThuyForm.tsx` & `tuvi/src/components/ngaytot/NgayTotForm.tsx` & `tuvi/src/components/tuvi/TuViChartDisplay.tsx`
- Giới hạn thông tin: Chỉ hiện kết quả chung/Top ngày tốt/Sơ đồ sao cơ bản.
- Áp dụng `ContentLock` và chèn `PersonalDoubtTrigger` vào giữa các section.

#### [DELETE] Thư mục & Files thanh toán/Stripe trong `/tuvi`
- Xóa bỏ triệt để: `src/lib/stripe.ts`, `src/app/api/checkout/`, `src/app/api/subscription/`, `src/data/pricing.ts` và code rác của `pricing.test.ts`.

#### [MODIFY] `tuvi/src/lib/analytics.ts`
- Cài đặt tập trung GA4 Funnel Events: `trackContentView`, `trackCTAClick`, `trackContentLockView`, `trackAnMenhClick`.

___

### 2. Tinh chỉnh Ứng dụng AnMenh (Core Product & Polish)

Hoàn thiện các khiếm khuyết trong luồng trải nghiệm tính toán và chuẩn bị giao diện nhận diện.

#### [MODIFY] `anmenh/src/lib/battu-logic.ts`
- **Sửa lỗi Trụ Ngày**: Cập nhật công thức tính Địa Chi ngày từ `(jd + 9) % 12` thành `(jd + 1) % 12` (theo thuật toán chuẩn Hồ Ngọc Đức).

#### [MODIFY] `anmenh/src/components/pages/CanXuong.tsx`
- **Giao diện thân thiện**: Tối ưu bộ chọn ngày (Âm lịch) để trực quan hơn.
- **Rõ ràng Âm/Dương**: Hiển thị kết quả chuyển đổi sang ngày Dương lịch tương ứng (sử dụng `jdToDate`) ngay khi người dùng chọn ngày Âm lịch.

#### [MODIFY] `anmenh/src/components/pages/TuongHop.tsx`
- **Auto-toggle Giới tính**: Khi chọn giới tính cho Người 1, tự động đảo giới tính cho Người 2 (Nam <-> Nữ) để tăng tốc độ nhập liệu.
- **Labeling**: Nhấn mạnh nhãn "Năm sinh Âm Lịch".

#### [MODIFY] `anmenh/src/components/pages/BatTrach.tsx`
- **Labeling**: Đồng bộ nhãn "Năm sinh Âm Lịch" rõ ràng.

#### [NEW] `anmenh/src/components/WaitlistModal.tsx`
- Xây dựng modal "Tải App - Đang phát triển" với form đăng ký email nhận thông báo (Waitlist).

___

### 3. Cổng Xác Thực Tập Trung - `auth.vutera.net` (Plan B — Shared Cookie)

Xây dựng một ứng dụng độc lập làm **cổng SSO duy nhất** cho toàn hệ sinh thái Vutera (TuVi, AnMenh, Orbit, Flow...). Hiện thực theo Plan B, thiết kế sẵn sàng nâng cấp lên Plan A (OAuth 2.0) khi cần.

**Luồng hoạt động:**
```
User → auth.vutera.net (Login/Register UI)
            ↓ Thành công → Sign JWT(userId, email, ...)
            ↓ Set httpOnly Cookie(domain=.vutera.net)
tuvi.vutera.net / anmenh.vutera.net / orbit.vutera.net
            → Middleware đọc cookie → verify JWT_SECRET → inject user vào request
```

#### [NEW] App `auth/` — `auth.vutera.net`
- **Stack:** Next.js 15 (App Router) + Auth.js v5 + Prisma + Neon (shared DB)
- **Trang Login/Register:** UI tối giản, thiết kế "Vutera Identity" — thống nhất thương hiệu, form đăng nhập bằng Email+Password và Google OAuth
- **JWT Configuration:** Issue signed JWT với `JWT_SECRET` dùng chung. Cookie được set với:
  ```javascript
  { httpOnly: true, secure: true, sameSite: 'lax', domain: '.vutera.net', path: '/' }
  ```
- **Các route cần có:**
  - `GET /login` — trang đăng nhập
  - `GET /register` — trang đăng ký
  - `POST /api/auth/session` — API trả về session info (dùng cho các app con gọi nếu cần server-side)
  - `POST /api/auth/logout` — xóa cookie trên tất cả subdomain

#### [NEW] `shared/auth-middleware.ts` (hoặc pattern nhân bản vào mỗi app)
- Mỗi app (TuVi, AnMenh) có một `middleware.ts` đọc cookie `vutera_auth` và verify JWT
- Inject `user` vào `Request` headers (`x-user-id`, `x-user-email`) để dùng trong route handlers
- Nếu cookie expired/invalid → redirect về `auth.vutera.net/login?redirect=<current_url>`

#### [NEW] Component `BridgeTransition.tsx` (trong `tuvi`)
- Overlay loading với hiệu ứng "Đang kết nối..." khi chuyển từ TuVi → AnMenh
- Tự động redirect sau 1.5-2 giây

___

### 4. Xây dựng Harmony Portal (Hub) — `harmony-portal/`

Trang chủ điều hướng hệ sinh thái, deploy tại `harmony.vutera.net` (hoặc root `vutera.net`).

#### [NEW] App `harmony-portal/` — `harmony.vutera.net`
- **Stack:** Next.js 15, TailwindCSS, Framer Motion
- **Thiết kế:** Two-column split (TuVi - Miễn phí / AnMenh - Cao cấp)
- **CTA Mobile:** Tích hợp `WaitlistModal` để thu thập email trước khi app ra mắt

___

### 5. Lộ trình nâng cấp Plan A (Tương lai)

> [!NOTE]
> Không triển khai ngay. Chỉ là tài liệu định hướng kỹ thuật.

Khi hệ sinh thái cần phân quyền chi tiết per-app (ví dụ: Orbit có scope riêng, Flow không truy cập user data của Harmony), sẽ nâng `auth.vutera.net` lên:
- **OAuth 2.0 Authorization Code + PKCE**
- Mỗi app đăng ký `client_id` + `client_secret` riêng
- Standard callback: `tuvi.vutera.net/api/auth/callback?code=...`


Trident (cổng thông tin thứ 3) giới thiệu cho cả hệ sinh thái.

#### [NEW] Khởi tạo folder `harmony-portal/` (Landing Page)
- Setup một Next.js App gọn nhẹ với TailwindCSS & Framer Motion.
- Trang chủ (One-page tĩnh): Giới thiệu triết lý Harmony, trỏ Link đi 2 nhánh (Một nhánh xem công cụ miễn phí tại TuVi, Một nhánh xem giải pháp cao cấp tại AnMenh).
- Deploy dưới subdomain hoặc root domain (tùy vào quyết định kiến trúc DNS của bạn).

## Verification Plan

### Automated Tests
- Chạy toàn bộ Test Suites của `tuvi` (sau khi xóa Stripe) để đảm bảo không gãy đổ dependencies.
- Update hoặc xóa skip đối với các test cũ.

### Manual Verification
- Test chạy Local: Đóng giả luồng người dùng mới tinh -> Vào TuVi -> Xem bài viết bị mờ `Content Lock` -> Bấm sang AnMenh -> Xem màn hình Bridge UI Loading -> Đăng nhập AnMenh xem báo cáo Bát Tự.
- Test chia sẻ Cookie: Đăng nhập sẵn trên TuVi, nhảy sang tab AnMenh kiểm tra xem có auto ngậm login (session) không.
