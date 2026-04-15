# Test Plan - Hệ Sinh Thái Harmony

Tài liệu này chi tiết các trường hợp kiểm thử (Test Cases) cho toàn bộ hệ sinh thái Harmony, bao gồm: **Harmony Portal**, **TuVi App**, **AnMenh App** và **Auth System**.

## 1. Auth System (`auth.vutera.net`)
Hệ thống xác thực tập trung cho toàn bộ hệ sinh thái.

### 1.1. Unit Tests
- [x] Xác thực định dạng Email hợp lệ.
- [x] Kiểm tra độ mạnh mật khẩu (password validation).
- [x] Verify hàm tạo JWT Token.
- [x] Verify hàm giải mã và xác thực JWT Token.

### 1.2. Integration Tests
- [x] Luồng Đăng ký (Register): Tạo user mới trong database $\rightarrow$ Set cookie $\rightarrow$ Redirect.
- [x] Luồng Đăng nhập (Login): Xác thực credential $\rightarrow$ Set cookie $\rightarrow$ Redirect.
- [x] Đăng xuất (Logout): Xóa cookie $\rightarrow$ Vô hiệu hóa token.
- [x] Quên mật khẩu/Reset mật khẩu (nếu có).

### 1.3. UI/UX Tests
- [x] Giao diện Login/Register responsive trên Mobile và Desktop.
- [x] Hiển thị thông báo lỗi (Invalid email, Wrong password) rõ ràng.
- [x] Hiệu ứng transition khi chuyển trang.

---

## 2. Harmony Portal (`harmony-portal`)
Cổng giới thiệu chung, điều hướng người dùng.

### 2.1. UI/UX Tests
- [x] Kiểm tra tất cả các liên kết (CTA) dẫn đến TuVi và AnMenh hoạt động chính xác.
- [x] Hiệu ứng scroll và animation tại Hero Section và Feature Cards.
- [x] Hiển thị đúng tone màu và font chữ theo guidelines (Thanh tịnh, Sang trọng).

### 2.2. Functional Tests
- [x] **WaitlistModal**: 
    - [x] Trigger mở modal đúng lúc.
    - [x] Gửi thông tin waitlist thành công $\rightarrow$ Hiển thị thông báo thành công.
    - [x] Xử lý lỗi khi gửi thông tin thất bại.

---

## 3. TuVi App (`harmony-tuvi`)
Traffic Engine, cung cấp công cụ tra cứu cơ bản và phễu chuyển đổi.

### 3.1. Unit Tests (Engines)
- [x] **Lunar Engine**: Kiểm tra đổi ngày Âm $\leftrightarrow$ Dương chính xác.
- [x] **Ngũ Hành Engine**: Tính toán bản mệnh chính xác theo năm sinh.
- [x] **Bát Trạch Engine**: Tính hướng Hung/Cát chính xác.
- [x] **Date Selection Engine**: Lọc ngày tốt/xấu chính xác theo 12 trực, 28 sao.

### 3.2. Functional Tests (Feature Modules)
- [x] **Lịch Vạn Niên**: Hiển thị đúng ngày hôm nay và các ngày xung quanh.
- [x] **Tử Vi Đẩu Số (Basic)**:
    - [x] Hiển thị đúng layout lá số cơ bản.
    - [x] Chỉ hiển thị giải nghĩa 3-4 cung chính.
- [x] **Xem Ngày Tốt**: Hiển thị top ngày tốt trong tháng/quý.
- [x] **Bát Trạch Phong Thủy**: Hiển thị hướng cơ sở.
- [x] **Horoscope (12 con giáp)**: Hiển thị điểm tổng quan hàng ngày.

### 3.3. Funnel & Conversion Tests (Critical)
- [x] **Content Lock**: 
    - [x] Các phần thông tin chi tiết sâu phải bị làm mờ (blur).
    - [x] Hiển thị thông báo "Dành cho thành viên Premium" khi hover/click vào vùng khóa.
- [x] **AnMenhCTA / StickyCTA**: 
    - [x] Hiển thị đúng vị trí và thời điểm (Trigger).
    - [x] Click CTA dẫn đến luồng chuyển đổi sang AnMenh.
- [x] **Personal Doubt Trigger**: Hiển thị gợi ý cá nhân hóa để kích thích người dùng.

### 3.4. UI/UX Tests
- [x] Hiệu ứng Mesh Gradient tại Hero Banner.
- [x] Micro-animations (hover, pulse, bounce) tại các component phễu.
- [x] Tốc độ load trang (SSG/SSR) cho các landing page SEO ngách.

---

## 4. AnMenh App (`anmenh`)
Lõi sản phẩm cá nhân hóa, giá trị cao và thương mại hóa.

### 4.1. Unit Tests
- [x] Logic tính toán Radar Chart ngũ hành (vượng/thiếu).
- [x] Logic tính toán vận trình Cân Xương chi tiết.
- [x] Logic so sánh tương hợp (tình duyên, đối tác).

### 4.2. Functional Tests (Premium Features)
- [x] **Daily Luck Dashboard**:
    - [x] Hiển thị lời chào cá nhân hóa.
    - [x] Tóm tắt năng lượng ngày + lời khuyên AI.
    - [x] Giờ xuất hành, số may mắn chính xác.
- [x] **Lá Số Chi Tiết**:
    - [x] Hiển thị đầy đủ 14 chính tinh, 12 cung, Đại/Tiểu vận.
    - [x] Bát Tự Tứ Trụ hiển thị đầy đủ và chính xác.
- [x] **Phong Thủy Cá Nhân Hóa**:
    - [x] Bát Trạch + Cửu Cung Phi Tinh chi tiết theo hướng nhà cụ thể.
    - [x] Tư vấn màu sắc, vật phẩm may mắn.
- [x] **PDF Export**: Xuất báo cáo chi tiết thành file PDF đúng định dạng.

### 4.3. UI/UX Tests
- [x] Giao diện Zen cao cấp (Dark mode / Mystical).
- [x] Hiệu ứng Bridge UI (Transition từ TuVi $\rightarrow$ AnMenh) tạo cảm giác phân tích dữ liệu.
- [x] Độ mượt của các chart (Radar Chart, Progress bars).

---

## 5. End-to-End (E2E) & System Tests
Kiểm tra hành trình người dùng xuyên suốt hệ sinh thái.

### 5.1. User Journey (The Funnel)
- [x] **Journey 1**: Google Search $\rightarrow$ TuVi Landing Page $\rightarrow$ Xem kết quả cơ bản $\rightarrow$ Gặp Content Lock $\rightarrow$ Click CTA $\rightarrow$ Redirect sang Auth $\rightarrow$ Đăng ký/Đăng nhập $\rightarrow$ Bridge UI $\rightarrow$ AnMenh Dashboard $\rightarrow$ Xem kết quả chi tiết.
- [x] **Journey 2**: Harmony Portal $\rightarrow$ TuVi $\rightarrow$ AnMenh (SSO check).

### 5.2. SSO & Session Management
- [x] Đăng nhập tại `auth.vutera.net` $\rightarrow$ Truy cập `tuvi.vutera.net` (Phải được nhận diện là đã đăng nhập).
- [x] Đăng nhập tại `auth.vutera.net` $\rightarrow$ Truy cập `anmenh.vutera.net` (Phải được nhận diện là đã đăng nhập).
- [x] Đăng xuất tại một app $\rightarrow$ Tất cả các app khác trong hệ sinh thái phải bị đăng xuất.

### 5.3. Cross-Platform & Security
- [x] Kiểm tra hiển thị trên Chrome, Safari, Firefox (Desktop & Mobile).
- [x] Kiểm tra bảo mật JWT: Thử thay đổi JWT cookie $\rightarrow$ Hệ thống phải từ chối truy cập.
- [x] Kiểm tra quyền truy cập Premium: User thường không được xem/xuất PDF báo cáo chi tiết.
