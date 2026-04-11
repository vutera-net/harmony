# Walkthrough - Dự Án An Mệnh (Hoàn tất Phase 5)

Ứng dụng **An Mệnh** (tiền thân là Harmony TuVi) đã hoàn thiện toàn bộ hệ sinh thái tính toán phong thủy và tử vi Đông Phương, mang lại trải nghiệm cá nhân hóa sâu sắc theo đúng triết lý "Zen" hiện đại.

## Các tính năng nổi bật đã hoàn thành

### 1. Dashboard "An Mệnh Hàng Ngày" cá nhân hóa
- Ngay khi người dùng khởi tạo hồ sơ (Họ tên, Năm sinh, Giới tính), hệ thống lưu trữ an toàn bằng `LocalStorage` (key: `anmenh_profile`).
- Trang chủ cung cấp "Lời khuyên trong ngày", đánh giá thang điểm "Năng lượng", chỉ định "Hướng xuất hành", "Màu sắc", "Con số", và "Giờ hoàng đạo" dựa trên tuổi thực của người dùng.

### 2. Nâng cấp Engine Lịch Âm & Lịch Vạn Niên
- Ứng dụng tích hợp thuật toán lịch âm chuẩn nhất (Hồ Ngọc Đức logic), tự động xử lý các tháng nhuận, can chi một cách chuẩn xác cho múi giờ Việt Nam.
- Giao diện `Calendar` cho phép lọc nhanh các ngày Hoàng Đạo và Hắc Đạo. Ngày Hắc Đạo được highlight bằng tông màu đỏ nhạt (`rose`) tinh tế để dễ dàng nhận diện.

### 3. Cân Xương Đoán Số Toàn Diện
- Form nhập đầy đủ tương tác nhanh theo Năm/Tháng/Ngày/Giờ Dương Lịch, tự động quy chiếu Can Chi tương ứng.
- Bảng luận giải chia làm 4 cấp độ mệnh (Đại Phú Quý, Thượng Thượng, Bình Hòa, Thử Thách) với các panel Badge mang theme màu độc lập, phân tích chi tiết từ văn phong cổ học.

### 4. La Bàn Bát Trạch Tương Tác
- Sử dụng thuật toán chuẩn xác để tính "Cung Phi" (xác minh công thức Mod 9 chuẩn phong thủy), "Bản Mệnh" (Đông/Tây Tứ Mệnh).
- La bàn ảo được dựng bằng `framer-motion` mượt mà - Trục la bàn xoay chính xác tới vĩ độ của Cung phi, đi kèm các Highlight UI rõ ràng giúp người xem nhận biết hướng đại cát (Sinh Khí) hay hướng kỵ (Tuyệt Mệnh). 

### 5. Tối ưu Giao diện Đa Chế Độ (Light & Dark Mode)
- **Dark Mode (Mystical Modern):** Các background màu nền và glassmorphism ứng dụng sâu rộng tạo nên hệ thống Design System chuyên nghiệp, huyền bí.
- **Light Mode (Zen Minimal):** Tối ưu độ tương phản cao, chữ sắc nét, loại bỏ hiện tượng nhòe hình, mang lại cảm giác thanh lịch và thư thái.

### 6. Lá Số Bát Tự Tứ Trụ & Bản Đồ Radar Ngũ Hành
- **Thuật toán chuyên sâu:** Tính toán Can Chi của Tứ Trụ (Giờ, Ngày, Tháng, Năm sinh). Logic chuyển đổi ngày giờ sát chuẩn (giờ Tý tính từ 23:00).
- **Phân Tích Ngũ Hành:** Biểu đồ Radar sinh động. Màu mệnh Kim được tinh chỉnh sang xám kẽm (`zinc`) để phân biệt rõ ràng với mệnh Thổ.
- **Dụng Thần Cải Vận:** Hệ thống đề xuất các giải pháp cân bằng năng lượng (màu sắc, nghề nghiệp...).

### 7. Xem Tuổi Tương Hợp Đôi Lứa (Nhân Duyên & Đối Tác)
- **Hệ thống đối chiếu đa chiều:** Thiên Can, Địa Chi (Tam Hợp, Tứ Hành Xung) và Bát Trạch Cung Phi (Sinh Khí, Tuyệt Mệnh...).
- **Biểu đồ Kết Quả:** Tiến độ phân tích và điểm số từ 1-100 được trình bày sang trọng, hiển thị "Trời sinh một cặp" nếu đạt trên 80 điểm.

**Kết luận:** Dự án An Mệnh đã hoàn tất lộ trình phát triển với kiến trúc module vững chắc, giao diện Premium và độ chính xác học thuật cao.
