# Kế hoạch Triển khai Chi tiết - Hệ Sinh Thái Harmony

Tài liệu này là bản lộ trình chi tiết để hoàn thiện hệ sinh thái Harmony, chuyển đổi từ các bản MVP sang sản phẩm hoàn chỉnh, tập trung vào luồng chuyển đổi (Funnel) từ TuVi sang AnMenh thông qua cổng xác thực tập trung.

## 🟢 Giai đoạn 1: Hoàn thiện Cổng Xác thực Tập trung (`auth.vutera.net`)
Mục tiêu: Xây dựng hệ thống Identity bền vững, bảo mật và đầy đủ tính năng cho toàn bộ ecosystem.

### 1.0. Điều hướng Trang chủ (`/`)
- [x] Triển khai logic điều hướng: 
    - Chưa login $\rightarrow$ `/login`
    - Đã login $\rightarrow$ `/profile`
- [x] Ưu tiên xử lý `callbackUrl` để đảm bảo luồng chuyển hướng từ các app vệ tinh.

### 1.1. Mở rộng Phương thức Đăng nhập
- [x] Cấu hình Facebook OAuth Provider trong `src/lib/auth.ts`.
- [x] Cấu hình Zalo OAuth Provider trong `src/lib/auth.ts`.
- [x] Cập nhật UI `LoginForm.tsx` để tích hợp nút Đăng nhập Facebook và Zalo.
- [x] Kiểm tra luồng callback và tạo user tự động từ các Provider phổ biến.

### 1.2. Quản lý Mật khẩu & Bảo mật
- [x] Thiết kế luồng "Quên mật khẩu" (Forgot Password):
    - [x] Tạo API gửi email reset token.
    - [x] Xây dựng trang nhập mã/link reset mật khẩu.
    - [x] API cập nhật mật khẩu mới vào Database.
- [x] Triển khai Xác thực Email (Email Verification):
    - [x] Gửi mail xác nhận sau khi đăng ký.
    - [x] Middleware chặn truy cập các tính năng cao cấp nếu email chưa verify.

### 1.3. Quản lý Tài khoản (User Profile)
- [ ] Xây dựng trang Profile cá nhân:
    - [x] Cho phép thay đổi tên hiển thị, email.
    - [x] Chức năng thay đổi mật khẩu.
    - [ ] Nút Xóa tài khoản (Delete Account).

---

## 🟡 Giai đoạn 2: Tối ưu hóa TuVi (Traffic Engine)
Mục tiêu: Tối đa hóa SEO và tỷ lệ chuyển đổi (Conversion Rate) sang AnMenh.

### 2.1. Hệ thống SEO Landing Pages (Scale)
- [ ] Xây dựng cấu trúc Dynamic Routes cho các ngách SEO:
    - [ ] `/tu-vi/[con-giap]/[nam]`: Trang tử vi năm chi tiết cho từng tuổi.
    - [ ] `/xem-ngay/[thang]/[nam]`: Trang tổng hợp ngày tốt tháng.
- [ ] Tối ưu Metadata động (Title, Description) cho từng trang để leo Top Google.

### 2.2. Nâng cấp Phễu Chuyển đổi (Funnel Polish)
- [ ] Tinh chỉnh `ContentLock`: Thêm các câu trigger đánh vào tâm lý (Personal Doubt Trigger) linh hoạt theo từng module.
- [ ] Tối ưu `AnMenhCTA`: Thử nghiệm A/B testing cho vị trí và nội dung nút gọi hành động.
- [ ] Hoàn thiện GA4 Event Tracking: Theo dõi chi tiết tỷ lệ click từ `ContentLock` -> `Login` -> `AnMenh`.

---

## 🔵 Giai đoạn 3: Phát triển Chuyên sâu AnMenh (Core Product)
Mục tiêu: Tạo ra giá trị "Premium" thực sự để người dùng sẵn sàng trả phí.

### 3.1. Dashboard Năng Lượng Hằng Ngày (Daily Luck)
- [ ] Xây dựng giao diện Dashboard cá nhân hóa.
- [ ] Thuật toán tính điểm may mắn hằng ngày dựa trên Bát Tự.
- [ ] Hiển thị: Giờ xuất hành, Số may mắn, Màu sắc tương sinh trong ngày.

### 3.2. Nâng cấp Trực quan hóa Dữ liệu (Data Viz)
- [ ] Bát Tự: Thay thế bảng chữ bằng **Radar Chart** thể hiện độ vượng/suy của Ngũ Hành.
- [ ] Bát Trạch: Triển khai La bàn xoay 360 độ bằng Framer Motion để xác định hướng nhà.
- [ ] Tương Hợp: Xây dựng biểu đồ đối chiếu Mệnh - Can - Chi giữa hai người.

### 3.3. Hệ thống Thông báo & Gắn kết
- [ ] Tích hợp thông báo nhắc nhở xem vận hạn hằng ngày.
- [ ] Hoàn thiện `WaitlistModal` và hệ thống thu thập email cho phiên bản Mobile App.

---

## 🟣 Giai đoạn 4: Hoàn thiện Trải nghiệm Kết nối (Bridge & UX)
Mục tiêu: Xóa bỏ ranh giới giữa các ứng dụng, tạo cảm giác một hệ sinh thái duy nhất.

### 4.1. Tối ưu luồng Bridge Transition
- [ ] Nâng cấp hiệu ứng loading khi chuyển từ TuVi sang AnMenh (tạo cảm giác "đang phân tích dữ liệu cá nhân").
- [ ] Xử lý mượt mà trường hợp User chưa login: `TuVi CTA` -> `Auth Login` -> `Redirect back to AnMenh`.

### 4.2. Đồng bộ hóa UI/UX (Design System)
- [ ] Xây dựng bộ Shared Component (Header/Footer) dùng chung cho cả 3 app.
- [ ] Đồng bộ hóa bảng màu (Color Palette) giữa Harmony Portal, TuVi và AnMenh.

---

## 🔴 Giai đoạn 5: Thương mại hóa & Scale (Future)
Mục tiêu: Tạo doanh thu và nâng cấp kiến trúc kỹ thuật.

### 5.1. Triển khai Paywall (Monetization)
- [ ] Tích hợp cổng thanh toán (Stripe/ZaloPay/Momo) cho AnMenh.
- [ ] Thiết lập các gói Premium: Gói xem chi tiết 1 lần hoặc Gói hội viên năm.
- [ ] Logic phân quyền: Mở khóa toàn bộ nội dung chuyên sâu khi có Subscription.

### 5.2. Nâng cấp Kiến trúc Auth (Plan A)
- [ ] Chuyển đổi từ Shared Cookie sang **OAuth 2.0 PKCE**.
- [ ] Cấu hình `client_id` riêng cho TuVi, AnMenh, Orbit...
- [ ] Triển khai phân quyền chi tiết (Scopes) cho từng ứng dụng trong hệ sinh thái.

---

## ✅ Kế hoạch Kiểm thử (Verification)
- [ ] **Luồng SSO**: Đăng nhập tại `auth` -> Truy cập `tuvi` -> Truy cập `anmenh` (không được yêu cầu login lại).
- [ ] **Luồng Funnel**: `TuVi` -> `Content Lock` -> `Login` -> `Bridge UI` -> `AnMenh Dashboard`.
- [ ] **SEO Check**: Kiểm tra tốc độ tải trang (Lighthouse) và tính đúng đắn của Metadata trên các trang dynamic.
- [ ] **Security Check**: Kiểm tra JWT expiration, secure cookie và phân quyền API.
