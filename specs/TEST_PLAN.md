# Test Plan - Hệ Sinh Thái Harmony

Tài liệu này chi tiết các trường hợp kiểm thử (Test Cases) cho toàn bộ hệ sinh thái Harmony, bao gồm: **Harmony Portal**, **TuVi App**, **AnMenh App** và **Auth System**.

## 1. Auth System (`auth.vutera.net`)
Hệ thống xác thực tập trung cho toàn bộ hệ sinh thái.

### 1.1. Unit Tests
- [ ] Xác thực định dạng Email hợp lệ.
- [ ] Kiểm tra độ mạnh mật khẩu (password validation).
- [ ] Verify hàm tạo JWT Token.
- [ ] Verify hàm giải mã và xác thực JWT Token.

### 1.2. Integration Tests
- [ ] Luồng Đăng ký (Register): Tạo user mới trong database $\rightarrow$ Set cookie $\rightarrow$ Redirect.
- [ ] Luồng Đăng nhập (Login): Xác thực credential $\rightarrow$ Set cookie $\rightarrow$ Redirect.
- [ ] Đăng xuất (Logout): Xóa cookie $\rightarrow$ Vô hiệu hóa token.
- [ ] Quên mật khẩu/Reset mật khẩu (nếu có).

### 1.3. UI/UX Tests
- [ ] Giao diện Login/Register responsive trên Mobile và Desktop.
- [ ] Hiển thị thông báo lỗi (Invalid email, Wrong password) rõ ràng.
- [ ] Hiệu ứng transition khi chuyển trang.

---

## 2. Harmony Portal (`harmony-portal`)
Cổng giới thiệu chung, điều hướng người dùng.

### 2.1. UI/UX Tests
- [ ] Kiểm tra tất cả các liên kết (CTA) dẫn đến TuVi và AnMenh hoạt động chính xác.
- [ ] Hiệu ứng scroll và animation tại Hero Section và Feature Cards.
- [ ] Hiển thị đúng tone màu và font chữ theo guidelines (Thanh tịnh, Sang trọng).

### 2.2. Functional Tests
- [ ] **WaitlistModal**: 
    - [ ] Trigger mở modal đúng lúc.
    - [ ] Gửi thông tin waitlist thành công $\rightarrow$ Hiển thị thông báo thành công.
    - [ ] Xử lý lỗi khi gửi thông tin thất bại.

---

## 3. TuVi App (`harmony-tuvi`)
Traffic Engine, cung cấp công cụ tra cứu cơ bản và phễu chuyển đổi.

### 3.1. Unit Tests (Engines)
- [ ] **Lunar Engine**: Kiểm tra đổi ngày Âm $\leftrightarrow$ Dương chính xác.
- [ ] **Ngũ Hành Engine**: Tính toán bản mệnh chính xác theo năm sinh.
- [ ] **Bát Trạch Engine**: Tính hướng Hung/Cát chính xác.
- [ ] **Date Selection Engine**: Lọc ngày tốt/xấu chính xác theo 12 trực, 28 sao.

### 3.2. Functional Tests (Feature Modules)
- [ ] **Lịch Vạn Niên**: Hiển thị đúng ngày hôm nay và các ngày xung quanh.
- [ ] **Tử Vi Đẩu Số (Basic)**:
    - [ ] Hiển thị đúng layout lá số cơ bản.
    - [ ] Chỉ hiển thị giải nghĩa 3-4 cung chính.
- [ ] **Xem Ngày Tốt**: Hiển thị top ngày tốt trong tháng/quý.
- [ ] **Bát Trạch Phong Thủy**: Hiển thị hướng cơ sở.
- [ ] **Horoscope (12 con giáp)**: Hiển thị điểm tổng quan hàng ngày.

### 3.3. Funnel & Conversion Tests (Critical)
- [ ] **Content Lock**: 
    - [ ] Các phần thông tin chi tiết sâu phải bị làm mờ (blur).
    - [ ] Hiển thị thông báo "Dành cho thành viên Premium" khi hover/click vào vùng khóa.
- [ ] **AnMenhCTA / StickyCTA**: 
    - [ ] Hiển thị đúng vị trí và thời điểm (Trigger).
    - [ ] Click CTA dẫn đến luồng chuyển đổi sang AnMenh.
- [ ] **Personal Doubt Trigger**: Hiển thị gợi ý cá nhân hóa để kích thích người dùng.

### 3.4. UI/UX Tests
- [ ] Hiệu ứng Mesh Gradient tại Hero Banner.
- [ ] Micro-animations (hover, pulse, bounce) tại các component phễu.
- [ ] Tốc độ load trang (SSG/SSR) cho các landing page SEO ngách.

---

## 4. AnMenh App (`anmenh`)
Lõi sản phẩm cá nhân hóa, giá trị cao và thương mại hóa.

### 4.1. Unit Tests
- [ ] Logic tính toán Radar Chart ngũ hành (vượng/thiếu).
- [ ] Logic tính toán vận trình Cân Xương chi tiết.
- [ ] Logic so sánh tương hợp (tình duyên, đối tác).

### 4.2. Functional Tests (Premium Features)
- [ ] **Daily Luck Dashboard**:
    - [ ] Hiển thị lời chào cá nhân hóa.
    - [ ] Tóm tắt năng lượng ngày + lời khuyên AI.
    - [ ] Giờ xuất hành, số may mắn chính xác.
- [ ] **Lá Số Chi Tiết**:
    - [ ] Hiển thị đầy đủ 14 chính tinh, 12 cung, Đại/Tiểu vận.
    - [ ] Bát Tự Tứ Trụ hiển thị đầy đủ và chính xác.
- [ ] **Phong Thủy Cá Nhân Hóa**:
    - [ ] Bát Trạch + Cửu Cung Phi Tinh chi tiết theo hướng nhà cụ thể.
    - [ ] Tư vấn màu sắc, vật phẩm may mắn.
- [ ] **PDF Export**: Xuất báo cáo chi tiết thành file PDF đúng định dạng.

### 4.3. UI/UX Tests
- [ ] Giao diện Zen cao cấp (Dark mode / Mystical).
- [ ] Hiệu ứng Bridge UI (Transition từ TuVi $\rightarrow$ AnMenh) tạo cảm giác phân tích dữ liệu.
- [ ] Độ mượt của các chart (Radar Chart, Progress bars).

---

## 5. End-to-End (E2E) & System Tests
Kiểm tra hành trình người dùng xuyên suốt hệ sinh thái.

### 5.1. User Journey (The Funnel)
- [ ] **Journey 1**: Google Search $\rightarrow$ TuVi Landing Page $\rightarrow$ Xem kết quả cơ bản $\rightarrow$ Gặp Content Lock $\rightarrow$ Click CTA $\rightarrow$ Redirect sang Auth $\rightarrow$ Đăng ký/Đăng nhập $\rightarrow$ Bridge UI $\rightarrow$ AnMenh Dashboard $\rightarrow$ Xem kết quả chi tiết.
- [ ] **Journey 2**: Harmony Portal $\rightarrow$ TuVi $\rightarrow$ AnMenh (SSO check).

### 5.2. SSO & Session Management
- [ ] Đăng nhập tại `auth.vutera.net` $\rightarrow$ Truy cập `tuvi.vutera.net` (Phải được nhận diện là đã đăng nhập).
- [ ] Đăng nhập tại `auth.vutera.net` $\rightarrow$ Truy cập `anmenh.vutera.net` (Phải được nhận diện là đã đăng nhập).
- [ ] Đăng xuất tại một app $\rightarrow$ Tất cả các app khác trong hệ sinh thái phải bị đăng xuất.

### 5.3. Cross-Platform & Security
- [ ] Kiểm tra hiển thị trên Chrome, Safari, Firefox (Desktop & Mobile).
- [ ] Kiểm tra bảo mật JWT: Thử thay đổi JWT cookie $\rightarrow$ Hệ thống phải từ chối truy cập.
- [ ] Kiểm tra quyền truy cập Premium: User thường không được xem/xuất PDF báo cáo chi tiết.
