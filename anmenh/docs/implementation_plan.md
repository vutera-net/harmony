# Implementation Plan - Phase 6: Core Fixes & Mobile App Prep

Giai đoạn 6 tập trung vào việc chuẩn bị cho phiên bản Mobile App trong tương lai, hoàn thiện hệ thống trang vệ tinh và rà soát/fix các logic cốt lõi về UI/UX và thuật toán.

## Proposed Changes

### 1. Branding & Static Pages
- [ ] Thiết kế và bổ sung các icon/logo cho ứng dụng (`favicon.ico`, `logo.svg`, v.v.).
- [ ] Xây dựng các trang tĩnh: `/about` (Về chúng tôi), `/terms` (Điều khoản), `/privacy` (Bảo mật). Update link vào Navigation/Footer.

### 2. Mobile App Preparation (Waitlist)
- [ ] Xử lý nút "Tải App" ở Navbar (hoặc UI phù hợp). Khi bấm vào sẽ trigger một Modal thông báo "Ứng dụng đang trong quá trình phát triển".
- [ ] Bảng Modal yêu cầu có form điền Email để mời người dùng đăng ký tham gia Test Kín (Closed Beta) trên Google Play. Lưu dữ liệu submit (có thể dùng LocalStorage tạm thời hoặc show toast success).

### 3. Tối ưu UX Input & Form Validation
- [ ] **Global Profile (Setup tại Home)**: Sửa nhãn "Năm sinh (Dương lịch)" thành "Âm lịch". Sửa điều kiện UX khi User xóa trắng input -> input tự động nhảy về năm mặc định (vd: 1990) để tránh lỗi.
- [ ] **Xem Tuổi Tương Hợp (`TuongHop.tsx`)**: 
  - Đổi label Năm sinh -> "Năm sinh (Âm lịch)".
  - Ngăn ngừa UX xấu: Sửa rào cản gõ năm (khi xóa trắng input ko bị ép về số `0`).
  - Thêm Validate năm sinh logic.
  - Liên kết state (Smart Toggle): Dành cho UX nhanh gọn, nếu Người 1 chọn Nam, thì Người 2 auto switch thành Nữ, và ngược lại.
- [ ] **Bát Trạch (`BatTrach.tsx`)**: Đổi nhãn Năm sinh -> "Âm lịch", kiểm tra và báo validation chặt chẽ cho năm sinh.

### 4. Thuật toán Cốt Lõi (Core Logic Fixes)
- [ ] **Cân Xương Đoán Số (`CanXuong.tsx` & `can-xuong-logic.ts`)**: 
  - Đổi thứ tự Layout: Sắp xếp theo format Ngày -> Tháng -> Năm cho thuận mắt người Việt.
  - Làm rõ nhãn đang là Âm lịch hay Dương lịch. Update logic cho đúng với input (nếu nhập Âm lịch xử lý Âm lịch).
  - Bổ sung Validate input ngày hợp lệ (ngày ko quá 31, tuỳ thuộc tháng...).
  - Audit & Fix thuật toán: Check lại bảng cân lượng của Tháng/Ngày/Giờ trong thư viện để đảm bảo độ chuẩn xác tối đa so với nguyên bản dân gian.
- [ ] **Bát Tự Tứ Trụ (`BatTu.tsx` & `battu-logic.ts`)**: Audit, kiểm tra chuyên sâu thuật toán đổi Can Chi của Trụ Ngày đang bị sai lệch (liên quan đến Julian Date convert hoặc Timezone offset). Đảm bảo xuất Can và Chi ngày hiển thị chuẩn 100%.

## User Review Required
> [!IMPORTANT]
> - Về mặt thuật toán Bát Tự (Trụ Ngày) và Cân Xương, sẽ cần đi sâu vào mã nguồn phần thuật toán. Khả năng cao do sai lệch Timezone hoặc bảng trọng số array index bị xô lệch gây ra sai sót, việc này sẽ được xử lý cẩn thận.
> - Form thu thập Email cho Google Play Close Beta hiện tại sẽ lưu Offline LocalStorage hay bạn có Backend rồi? Tạm thời mình sẽ làm UI và Mock func cho form này nhé.
