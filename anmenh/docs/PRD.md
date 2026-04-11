# Product Requirements Document (PRD)
**Tên sản phẩm:** An Mệnh - Web App Phong Thủy, Tử Vi & Xem Ngày
**Nền tảng:** Web Application (Mobile-first Responsive)

---

## 1. Tổng quan dự án (Project Overview)
**Mục tiêu:** Xây dựng một ứng dụng web hiện đại, kết hợp các yếu tố Tử vi Đông Phương (Bát tự, Cân xương), Phong thủy ứng dụng và Lịch xem ngày tốt xấu. Sản phẩm hướng tới việc mang lại trải nghiệm cá nhân hóa, giao diện trực quan, tính thẩm mỹ cao và dễ sử dụng cho người dùng Việt Nam.

**Vấn đề giải quyết:** Phần lớn các trang web tử vi hiện nay tại Việt Nam có giao diện cũ, nhồi nhét thông tin, khó sử dụng trên thiết bị di động, và thiết kế kém bắt mắt. Ứng dụng này sẽ đơn giản hóa các khái niệm học thuật, trình bày dữ liệu dạng đồ họa trực quan và cải thiện UX.

## 2. Nghiên cứu thị trường & Bối cảnh (Market & Context)
- **Thị trường hiện tại:** Nhu cầu tra cứu tử vi, ngày tốt xấu và phong thủy là rất lớn, đặc biệt vào các dịp lễ tết, khởi sự kinh doanh hay xây dựng.
- **Đối thủ cạnh tranh:** AItuvi (ứng dụng AI), Tuvi.vn, Lịch Ngày Tốt, Huyenbi.net.
- **Phân tích USP (Unique Selling Proposition):** 
  - Thay vì chỉ cung cấp văn bản đơn thuần, ứng dụng sẽ biểu diễn các chỉ số bằng biểu đồ (VD: Radar chart ngũ hành).
  - Áp dụng UI/UX hiện đại: Dark mode vũ trụ hoặc Light mode thiền định (Spiritual UI). Cấu trúc "Progressive Disclosure" (hiển thị thông tin từng bước tránh ngợp dữ liệu).

## 3. Kiến trúc Tính năng (Feature Architecture)

### 3.1. Nhóm tính năng cốt lõi (Core Features)

**A. Tử vi cá nhân & Bát tự (Tứ trụ)**
- Form nhập liệu mượt mà: Tên, Giới tính, Giờ, Ngày, Tháng, Năm sinh (Dương lịch/Âm lịch).
- Sinh lá số Bát Tự (Thiên Can, Địa Chi cho 4 trụ).
- Biểu đồ phân tích rập khuôn Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ đang Khuyết hay Vượng).
- Luận giải cơ bản về tính cách và vận mệnh.

**B. Cân xương đoán số**
- Tính toán "Lượng Chỉ" tự động dựa trên ngày giờ sinh.
- Hiển thị kết quả bằng giao diện trực quan (theo cấp độ số mệnh).
- Đoạn văn bình giải tổng quan về mức độ thuận lợi, tài lộc trong cuộc đời theo kết quả Lượng Chỉ.

**C. Xem ngày tốt xấu & Lịch Vạn Niên**
- Lịch theo thuật toán chuẩn hóa.
- Giao diện lịch biểu, lọc các ngày Hoàng Đạo/Hắc Đạo.
- Xem chi tiết ngày: Giờ đẹp, Can Chi năm tháng ngày.

**D. Phong thủy ứng dụng & Hướng nhà (Bát Trạch)**
- Định vị Cung Phi mệnh quái theo Đông/Tây tứ mệnh.
- La bàn phong thủy tương tác minh họa các hướng tốt / xấu.
- Ứng dụng lời khuyên kê giường ngủ, hướng làm việc.

### 3.2. Tính năng tương tác (Engagement Features)

**E. Bản tin Tử Vi Hàng Ngày (Daily Luck)**
- Bảng tin dashboard cá nhân hóa khi người dùng khai báo hồ sơ.
- Chỉ số Năng lượng, thông điệp trong ngày, con số may mắn, hướng xuất hành tốt.

**F. Xem tuổi kết hôn / Đối tác**
- Phân tích đối chiếu Mệnh, Can Chi của hai người.

## 4. Yêu cầu Giao diện & Trải nghiệm Người dùng (UI/UX)
- **Aesthetics (Thẩm mỹ):** 
  - Phong cách "Mystical Modern" (Giao diện tối - Dark mode với các ánh sáng Neon gradient biểu tượng vũ trụ/chiêm tinh).
  - HOẶC "Zen Minimal" (Giao diện sáng - Background beige/off-white, Typography thanh lịch kết hợp font serif cho tiêu đề).
- **Typography:** *Inter* kết hợp *Playfair Display* để tạo điểm nhấn truyền thống nhưng vẫn cao cấp.
- **Animations:** Micro-animations với Framer Motion. Hiệu ứng la bàn xoay mượt màng.

## 5. Yêu cầu Kỹ thuật (Technical Specifications)
- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS.
- **Data Persistence:** Local Storage (User Profile, Custom preferences).

## 6. Lộ trình phát triển (Phased Implementation)
- **Giai đoạn 1 & 2 (Foundation & SEO):** [HOÀN THÀNH] Setup dự án Next.js, tạo 4 view chính, chạy ổn định, kiểm thử tự động.
- **Giai đoạn 3 (Premium UX & Astrological Accuracy):** [HOÀN THÀNH]
  - Thuật toán chuyển đổi lịch chuẩn hóa (Hồ Ngọc Đức logic).
  - Cá nhân hóa người dùng: "Tử vi hàng ngày" (Daily Luck dashboard) tại Trang chủ.
  - UI/UX Polish: Nâng cấp La Bàn Bát Trạch sinh động quay chính xác theo độ, Modal Cân Xương hiện chi tiết giải nghĩa, Lịch có bộ lọc mạnh.
- **Giai đoạn 4 (Phân tích nâng cao):** [HOÀN THÀNH]
  - Xây dựng module Bát Tự phức tạp và biểu đồ Radar Ngũ Hành.
  - Tính năng Xem tuổi tương hợp đôi lứa.
- **Giai đoạn 5 (Review & Polish):** [HOÀN THÀNH]
  - Cập nhật và đồng bộ UI Trang chủ cho hợp lý sau Phase 4.
  - Thay đổi màu Ngũ hành Kim khác biệt với Thổ.
  - Cải thiện Lịch (làm rõ ngày Hắc đạo so với ngày thường).
  - Đồng bộ UI trang Bát tự và Hợp tuổi với Toàn hệ thống.
  - Xác minh lại thuật toán La Bàn Bát Trạch.
- **Giai đoạn 6 (Chuẩn bị Mobile App & Core Fixes):** [TIẾP THEO]
  - Xây dựng hệ thống UI/UX nhận diện: Tạo Logo, ICO cho dự án.
  - Luồng Mobile App (Tải App): Nút "Tải App" bật Modal báo "Đang phát triển", kèm Form đăng ký email (Waitlist) làm Tester nội bộ trên Google Play.
  - Bổ sung nội dung hệ thống: Xây dựng các trang tĩnh "Về chúng tôi", "Điều khoản", "Bảo mật".
  - Bát Tự: Kiểm tra và sửa lỗi thuật toán đổi Can Chi cho Trụ Ngày.
  - Cân Xương: Hiển thị rõ Âm/Dương lịch, format layout chọn Ngày/Tháng/Năm thân thiện với người Việt, thêm validate, fix lỗi độ chính xác cân lượng.
  - Tương Hợp: Label Năm sinh Âm Lịch, sửa UX (xóa input ko về 0 mà về trống), thêm validate năm sinh, auto-toggle giới tính (Người 1 Nam -> Người 2 Nữ).
  - Bát Trạch: Label Năm sinh Âm Lịch, thêm validate năm sinh.
  - Hồ sơ cá nhân (Trang chủ tĩnh): Định hướng năm sinh là Âm lịch, fix bug xóa sạch input phải nhảy về default year thay vì lỗi.
