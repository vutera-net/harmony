# Product Requirements Document (PRD) - Hệ Sinh Thái Harmony

**Tên dự án:** Harmony Ecosystem (Lịch Vạn Niên, Tử Vi, Phong Thủy, Mệnh Lý)
**Nền tảng:** Web Application (Mobile-first, Next.js)
**Mô hình chiến lược:** Hub and Spoke / Funnel Pivot (Lò luyện Traffic -> Lõi Chuyển Đổi)

---

## 1. Tổng quan Dự án (Project Overview)

**Mục tiêu hệ sinh thái:** 
Xây dựng một hệ sinh thái cung cấp giải pháp tra cứu phong thủy, tử vi và mệnh lý trực tuyến hiện đại nhất tại Việt Nam. Không gom tất cả vào một nền tảng cồng kềnh, Harmony áp dụng chiến lược **phân tách sản phẩm** nhằm tối ưu hóa phễu khách hàng (Funnel), tách bạch rạch ròi giữa việc "thu hút lượng truy cập tự nhiên" (SEO) và "khai thác giá trị người dùng" (Monetization & Personalization).

**Cấu trúc hệ sinh thái bao gồm 3 phần chính:**
1. **Harmony Landing Page (Trang Chủ Hệ Sinh Thái):** Cổng giới thiệu chung về toàn bộ thương hiệu.
2. **TuVi App (tuvi.vutera.net - Vệ Tinh):** Lò luyện Traffic (Traffic Engine). Dùng làm mồi nhử sạch sẽ, nhẹ nhàng, tối ưu 100% cho Google Bot. Mở cửa miễn phí để hút lead.
3. **AnMenh App (anmenh.vutera.net - Lõi Đóng Gói):** Nền tảng chuyên sâu mang định vị cao cấp (Sanctuary - Cõi Riêng). Cung cấp giải pháp siêu cá nhân hóa, là nơi tập trung các nghiệp vụ tính toán sâu sắc và luồng thương mại hóa (Premium user/Paywall).

---

## 2. Kiến trúc Chiến lược & User Flow (Phễu Chuyển Đổi)

### Định vị Thương hiệu
- **TuVi (Đại Chúng):** Cung cấp thông tin theo dạng "Bảng quảng cáo đèn LED ngoài đường". Nội dung dừng ở mức độ cơ bản (khoảng 60%), đáp ứng search intent xem nhanh của người dùng Google.
- **AnMenh (Độc Bản):** Cung cấp thông tin theo dạng "Két sắt cửa hàng". Nội dung chuyên sâu nhất dành riêng cho cá nhân. Có UI/UX kỳ bí, sang trọng và cá nhân hóa sâu sắc. Tách biệt hẳn với "hàng chợ".

### Hành trình người dùng (User Flow)
1. **Discovery:** Khách hàng tìm kiếm từ khóa trên Google (vd: "xem ngày tốt", "tử vi phương đông") -> Click vào các trang SEO của **TuVi**.
2. **Hook (Tò mò):** Khách hàng nhận được kết quả đủ thỏa mãn nhưng phát hiện ra rằng đây mới chỉ là chỉ dẫn chung.
3. **Trigger:** Các thành tố như `Content Lock` (Làm mờ thông tin chuyên sâu) và `Personal Doubt Trigger` (Gieo rắc sự hoài nghi: "Kết quả này chỉ đúng cho phần đông, muốn xem của riêng bạn...") xuất hiện. Tiện ích `AnMenhCTA` mời gọi họ nhảy sang phần cao cấp hơn.
4. **Transition (Chuyển đổi):** Nhấp qua nút *AnMenh -> Cá nhân hóa*. Hệ thống dùng hiệu ứng **Bridge UI** (ví dụ: *"Đang phân tích dữ liệu riêng của bạn..."*) để tạo cảm giác chuyển tải giá trị.
5. **Monetization & Deep Engagement:** Vào **AnMenh**, trải nghiệm Single Sign-On (SSO) mượt mà giữ nguyên thông tin đăng nhập, đưa người dùng vào Dashboard "Daily Luck", cung cấp Bát tự, Cân xương... Tại đây, người dùng bị thuyết phục hoàn toàn bởi UI/UX cao cấp và tiến hành trả phí.

---

## 3. Product Specifications: Chi tiết Chức Năng (Features)

### 3.1. Harmony Landing Page (Portal)
- Giao diện Splash / Hero Section giới thiệu hệ sinh thái công nghệ tâm linh.
- Navigation/Ecosystem Banner đồng bộ: Điều hướng mượt mà giữa *Harmony <-> TuVi <-> AnMenh*.
- Giới thiệu triết lý sản phẩm, liên kết hỗ trợ, điều khoản dịch vụ chung.

### 3.2. TuVi App (Traffic Engine v2.0)
Được tối ưu về tốc độ (Core Web Vitals). Không tích hợp cổng thanh toán để tránh gây nặng nề hệ thống.
- **6 Động Cơ Cơ Bản (Partial Insight Tools):**
  1. *Lunar Engine:* Đổi lịch Âm-Dương.
  2. *Ngũ Hành Engine:* Tính toán bản mệnh cơ bản.
  3. *Tử Vi Đẩu Số:* Hiển thị layout lá số (12 cung, vòng sao cơ bản) nhưng **khóa** giải nghĩa sâu từng cung.
  4. *Xem Ngày Tốt:* Lịch 12 trực, 28 sao (Chỉ hiển thị top 3-5 ngày tốt nhất, **khóa** toàn bộ phần còn lại).
  5. *Bát Trạch Phong Thủy:* Tính hướng Hung Cát cơ sở, **khóa** phần bố cục nội thất.
  6. *Horoscope:* Tử vi hàng ngày 12 con giáp (Hiển thị điểm tổng quan, **khóa** chi tiết sự nghiệp/tài lộc...).
- **Funnel Mechanics (Biện pháp Chuyển đổi):**
  - *Ecosystem Banner:* Banner nổi gắn đỉnh trang.
  - *Content Lock:* Component gradient làm mờ thông tin chưa mở khóa.
  - *Sticky CTA:* Nút neo góc phải mời gọi cá nhân hóa.
- **Auth (Lưu lá số):** Tính năng User cơ bản, chỉ dùng để lưu trữ dữ liệu (email/password) mà không có Billing.

### 3.3. AnMenh App (Core Personalized Product)
Ứng dụng có UI/UX cao cấp (Mystical Modern hoặc Zen Minimal). Dùng dữ liệu đầu vào (Ngày giờ sinh chi tiết v.v.) để render trang phân tích cá nhân.
- **Daily Luck Dashboard:** Bảng tin hiển thị năng lượng cá nhân hằng ngày, thông điệp cá nhân, giờ xuất hành, số may mắn.
- **Bát Tự Đỉnh Cao:** Lập tứ trụ Tứ trụ can chi. Biểu diễn Radar Chart ngũ hành (thiếu/vượng) một cách trực quan, khác biệt so với thị trường chữ viết nhàm chán.
- **Cân Xương Đoán Số:** Áp dụng thuật toán Lượng Chỉ độ chính xác cao. Đính kèm dự báo vận trình chi tiết và giải nghĩa dễ hiểu.
- **Xem Ngày & La Bàn Bát Trạch:** La bàn xoay trực quan bằng animation (Framer Motion). Lọc ngày Hợi/Hắc đạo cá nhân hóa theo tuổi.
- **Chấm Điểm Tương Hợp (Xem Tuổi):** Phân tích hợp tuổi kết hôn, làm ăn, đối chiếu sâu Mệnh – Can – Chi hai người, tự động tính toán từ input.

---

## 4. Yêu cầu Kỹ thuật (Technical Specs)

- **Frontend:** Next.js (App Router), React 19, TypeScript. 
  - TuVi: Sử dụng cực sâu SSG / SSR để tạo hàng nghìn Landing Page SEO ngách (ví dụ: `tu-vi/ty/nam-2026`).
- **Styling & Animations:** TailwindCSS 4, Framer Motion (cho AnMenh để tạo cảm giác trơn tru, micro-animations chuyên nghiệp).
- **Backend & Database:** PostgreSQL (Neon Serverless) để lưu account, kết nối Prisma ORM. **Database được chia sẻ duy nhất** cho toàn hệ sinh thái (1 Neon instance, nhiều bảng phân prefix theo app).
- **Caching:** Upstash Redis.
- **Auth & SSO — Kiến Trúc Tập Trung (`auth.vutera.net`):**
  - Một ứng dụng riêng biệt tại `auth.vutera.net` (Next.js + Auth.js v5 + Prisma) đóng vai trò là **cổng xác thực duy nhất** của toàn bộ hệ sinh thái Vutera (bao gồm Harmony, Orbit, Flow và các sản phẩm tương lai).
  - **Phương án hiện tại (Plan B — Shared Cookie):** `auth.vutera.net` issue JWT và lưu vào Cookie tại root domain `.vutera.net`. Tất cả app con (TuVi, AnMenh, Orbit...) đọc cookie này và verify JWT với cùng một `JWT_SECRET` chung.
  - **Lộ trình nâng cấp (Plan A — OAuth 2.0 PKCE):** Khi hệ sinh thái mở rộng và cần phân quyền per-app, sẽ nâng `auth.vutera.net` thành Authorization Server đầy đủ. Mỗi app đăng ký `client_id` riêng và thực hiện Authorization Code Flow chuẩn.

```
Mô hình hiện tại (Plan B — Shared Cookie):

User → auth.vutera.net (đăng nhập/đăng ký)
            ↓ Set Cookie(.vutera.net, JWT)
tuvi.vutera.net    ──┐
anmenh.vutera.net  ──┤→ Đọc cookie → verify JWT_SECRET → Nhận diện user
orbit.vutera.net   ──┘
```

---


## 5. Yêu Cầu Giao Diện (UI/UX Guidelines)
- **Hệ thống Harmony chung:** Footer và Banner Header phải dệt nên cảm giác liên kết ("Hệ sinh thái Harmony").
- **Màu sắc:** 
  - TuVi: Có thể sáng, nhanh, Minimal nhằm mục đích đọc tin nhanh, thao tác tiện gọn.
  - AnMenh: Gradient tối, Neo-ambient (Dark mode / Mystical) cho cảm giác trang nghiêm, bí ẩn, hoặc Beige thiền định.
- **Progressive Disclosure:** Tuyệt đối không nhồi nhét ngập ngụa chữ như web tử vi truyền thống. Thông tin được chia tab, sử dụng biểu đồ, tooltip thay vì để tường chữ.

---

## 6. Lộ Trình Phát Triển Hệ Sinh Thái (Roadmap)

- **Phase 1: Ổn định và Pivot TuVi v2.0 ✅:** Xóa bỏ hoàn toàn code Stripe/Pricing cũ khỏi TuVi. Hoàn thiện việc áp dụng Content Lock và CTA Funnel vào các module có sẵn.
- **Phase 2: Cải thiện Core Feature trên AnMenh ✅:** Sửa lỗi Bát Tự (Trụ Ngày), nâng cấp UX Cân Xương, Tương Hợp, Bát Trạch. Xây dựng WaitlistModal cho Mobile App.
- **Phase 3: Cổng Xác Thực Tập Trung `auth.vutera.net` (Đang triển khai):**
  - Khởi tạo Next.js app tại `auth/` folder, deploy lên `auth.vutera.net`.
  - Xây dựng trang Login/Register tối giản, đẹp, cấu hình Auth.js v5 với Prisma + Neon.
  - Cấu hình JWT cookie domain-wide `.vutera.net`.
  - Xóa bỏ auth riêng lẻ trong TuVi (nếu có), thay bằng verify JWT từ cookie chung.
  - Xây dựng `BridgeTransition` overlay (cầu nối UX từ TuVi → AnMenh).
- **Phase 4: Harmony Portal (Hub Landing Page):**
  - Khởi tạo `harmony-portal/` app tại `harmony.vutera.net` (hoặc `vutera.net`).
  - Trang chủ one-page điều hướng toàn hệ sinh thái, tích hợp WaitlistModal cho Mobile.
- **Phase 5 (Tương lai): AnMenh Thương mại hóa & Nâng cấp OAuth:**
  - Kích hoạt Pricing Model trên AnMenh (Gói lẻ 1 lần hoặc định kỳ cao cấp).
  - Nâng cấp `auth.vutera.net` lên OAuth 2.0 Authorization Server đầy đủ khi hệ sinh thái cần phân quyền per-app.

---
*(PRD này sẽ đóng vai trò là kim chỉ nam cho sự phát triển của toàn bộ Hệ sinh thái Harmony từ thiết kế UI/UX đến kiến trúc hệ thống.)*

