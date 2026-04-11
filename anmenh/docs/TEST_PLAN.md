# TEST_PLAN.md - An Mệnh

Tài liệu kiểm thử toàn diện cho ứng dụng An Mệnh.
Mỗi test case có checkbox `[ ]` để theo dõi tiến độ.

---

## Mục lục

1. [Unit Tests - lunar-logic.ts](#1-unit-tests---lunar-logicts)
2. [Unit Tests - battu-logic.ts](#2-unit-tests---battu-logicts)
3. [Unit Tests - tuong-hop-logic.ts](#3-unit-tests---tuong-hop-logicts)
4. [Integration Tests - UserContext](#4-integration-tests---usercontext)
5. [Component Tests - Trang Chủ (Home)](#5-component-tests---trang-chủ-home)
6. [Component Tests - Cân Xương](#6-component-tests---cân-xương)
7. [Component Tests - Bát Trạch](#7-component-tests---bát-trạch)
8. [Component Tests - Lịch Vạn Niên](#8-component-tests---lịch-vạn-niên)
9. [Component Tests - Bát Tự Tứ Trụ](#9-component-tests---bát-tự-tứ-trụ)
10. [Component Tests - Xem Hợp Tuổi](#10-component-tests---xem-hợp-tuổi)
11. [UI / E2E Tests - Luồng người dùng](#11-ui--e2e-tests---luồng-người-dùng)
12. [UI Tests - Responsive & Theme](#12-ui-tests---responsive--theme)

---

## 1. Unit Tests - `lunar-logic.ts`

### 1.1 `jdFromDate` - Chuyển đổi Julian Day Number

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-JD-01 | Ngày chuẩn: 1/1/2000 | JD = 2451545 |
| - | [x] TC-JD-02 | Ngày trước lịch Gregorian: 1/10/1582 (chuyển tiếp Julian/Gregorian) | JD < 2299161 → dùng nhánh Julian |
| - | [x] TC-JD-03 | Ngày cuối tháng: 28/2/2000 (năm nhuận) | JD hợp lệ |
| - | [x] TC-JD-04 | Ngày cuối tháng: 28/2/1900 (không nhuận) | JD hợp lệ, khác TC-JD-03 |
| - | [x] TC-JD-05 | 15/7/1954 (ngày test chuẩn Ho Ngoc Duc) | So sánh với kết quả tham chiếu |

### 1.2 `solarToLunar` - Chuyển đổi Dương lịch → Âm lịch

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-SL-01 | 1/1/2024 (tết 2024) | Âm lịch 20/11/Quý Mão |
| - | [x] TC-SL-02 | 10/2/2024 (Mồng 1 Tết) | Âm lịch 1/1/Giáp Thìn, isLeap = false |
| - | [ ] TC-SL-03 | Ngày trong tháng nhuận (tháng nhuận 2023) | isLeap = true |
| - | [x] TC-SL-04 | 31/12/2000 | canChi trả về đúng "Canh Thìn" |
| - | [x] TC-SL-05 | Ngày đầu năm âm lịch: âm lịch khác dương lịch | month không bị âm, year nhất quán |
| - | [x] TC-SL-06 | 1/1/1900 (biên thấp) | Không throw error |

### 1.3 `getYearCanChi`, `getYearCan`, `getYearChi`

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-CC-01 | Năm 2024 | "Giáp Thìn" |
| - | [x] TC-CC-02 | Năm 1990 | "Canh Ngọ" |
| - | [x] TC-CC-03 | Năm 2000 | "Canh Thìn" |
| - | [x] TC-CC-04 | Năm 1924 (60 năm trước 1984) | Cùng Can Chi với năm 1984 |
| - | [x] TC-CC-05 | `getYearCan(2024)` | "Giáp" |
| - | [x] TC-CC-06 | `getYearChi(2024)` | "Thìn" |
| - | [x] TC-CC-07 | Chu kỳ 60 năm: `getYearCanChi(x) === getYearCanChi(x+60)` | True với mọi x |

### 1.4 `calculateCanXuong` - Cân Xương Đoán Số

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-CX-01 | Năm nằm trong bảng YEAR_WEIGHTS (VD: 1984 "Giáp Tý") | yW = 1.2 |
| - | [x] TC-CX-02 | Năm không có trong YEAR_WEIGHTS | yW fallback = 1.0 |
| - | [x] TC-CX-03 | Tháng 1 (index 0) | mW = 0.6 |
| - | [x] TC-CX-04 | Tháng 12 (index 11) | mW = 0.5 |
| - | [ ] TC-CX-05 | Ngày 1 (index 0) | dW = 0.5 |
| - | [ ] TC-CX-06 | Ngày 30 (index 29) | dW = 0.6 |
| - | [x] TC-CX-07 | Ngày 31 (vượt mảng) | safeDay clamp → không crash |
| - | [x] TC-CX-08 | Kết quả total >= 6.0 | level = "excellent", title = "Đại Phú Quý Số" |
| - | [ ] TC-CX-09 | Kết quả total trong [5.0, 6.0) | level = "excellent", title = "Thượng Thượng Số" |
| - | [ ] TC-CX-10 | Kết quả total trong [4.5, 5.0) | level = "good" |
| - | [ ] TC-CX-11 | Kết quả total trong [4.0, 4.5) | level = "good" |
| - | [ ] TC-CX-12 | Kết quả total trong [3.5, 4.0) | level = "neutral" |
| - | [ ] TC-CX-13 | Kết quả total trong [3.0, 3.5) | level = "neutral" |
| - | [x] TC-CX-14 | Kết quả total < 3.0 | level = "challenging" |
| - | [x] TC-CX-15 | `total.toFixed(1)` luôn có 1 chữ số thập phân | "4.5", "6.0", không phải "4.50" |
| - | [x] TC-CX-16 | `chiVal = Math.round((total - luong) * 10)` cân bằng làm tròn | 4.15 → luong=4, chi=2 (không phải 1) |

### 1.5 `calculateBatTrach` - Cung Phi & Bát Trạch

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-BT-01 | Nam sinh 1984 | Cung "Đoài", Tây Tứ Mệnh |
| - | [x] TC-BT-02 | Nữ sinh 1984 | Cung khác với nam 1984 |
| - | [x] TC-BT-03 | Nam sinh 1990 | Cung "Khảm", Đông Tứ Mệnh |
| - | [x] TC-BT-04 | Cung Phi mod 9 không bao giờ = 5 | Đảm bảo không có cung 5 |
| - | [x] TC-BT-05 | Tất cả 8 Cung Phi đều có compassDeg hợp lệ [0, 360) | Pass với toàn bộ CUNG_DATA |
| - | [x] TC-BT-06 | sinhKhi/thienY/dienNien/phucVi là 4 hướng tốt | Không trùng với 4 hướng xấu |
| - | [x] TC-BT-07 | Tổng 8 hướng = đủ 8 hướng la bàn | Không thiếu, không trùng |

### 1.6 `getDailyLuck` - Tử Vi Hàng Ngày

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [ ] TC-DL-01 | birthYear hợp lệ + ngày bất kỳ | Trả về object đầy đủ (energy, message, luckyColor, luckyDirection, luckyHour, luckyNumbers) |
| - | [ ] TC-DL-02 | `energy` luôn trong [1, 5] | Không có giá trị 0 hoặc > 5 |
| - | [ ] TC-DL-03 | `luckyNumbers` là mảng số nguyên dương | Không có số âm hay 0 |
| - | [ ] TC-DL-04 | Cùng birthYear + cùng ngày → cùng kết quả | Deterministic (không dùng Math.random không seed) |

---

## 2. Unit Tests - `battu-logic.ts`

### 2.1 `calculateBatTu` - Bát Tự Tứ Trụ

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-BTU-01 | Giờ 23:30 → ngày hôm sau | Trụ Giờ tính theo ngày +1 |
| - | [x] TC-BTU-02 | Giờ 22:59 → cùng ngày | Trụ Giờ tính theo ngày gốc |
| - | [x] TC-BTU-03 | Tất cả 4 trụ đều có `canHanh` và `chiHanh` hợp lệ | Thuộc {"Kim","Mộc","Thủy","Hỏa","Thổ"} |
| - | [x] TC-BTU-04 | Tổng `nguHanhCount` = 8 | Kim+Mộc+Thủy+Hỏa+Thổ = 8 |
| - | [x] TC-BTU-05 | Tổng `nguHanhPercent` ≈ 100% | Sai số < 0.1% do float |
| - | [x] TC-BTU-06 | Ngũ hành xuất hiện 0 lần | Có trong mảng `khuyet` |
| - | [x] TC-BTU-07 | Ngũ hành xuất hiện >= 2 lần | Có trong mảng `vuong` |
| - | [ ] TC-BTU-08 | Ngày 1/1/2000 giờ Tý | So sánh Trụ Năm, Tháng, Ngày, Giờ với tài liệu tham chiếu |
| - | [ ] TC-BTU-09 | `rawHour >= 23` → `rawHour - 24` | hourChiIdx không âm (normHourChiIdx + 12 nếu cần) |
| - | [ ] TC-BTU-10 | Can của Trụ Giờ phụ thuộc Can của Trụ Ngày | `hourCanIdx = ((dayCanIdx % 5) * 2 + normHourChiIdx) % 10` đúng |

### 2.2 Bảng tra cứu `CAN_HANH` / `CHI_HANH`

| # | Test Case | Expected |
|---|-----------|----------|
| - | [x] TC-MAP-01 | CAN_HANH có đủ 10 Thiên Can | Không thiếu, không trùng key |
| - | [x] TC-MAP-02 | CHI_HANH có đủ 12 Địa Chi | Không thiếu, không trùng key |
| - | [x] TC-MAP-03 | Mỗi Can/Chi ánh xạ đúng Ngũ Hành | Giáp→Mộc, Bính→Hỏa, Mậu→Thổ, Canh→Kim, Nhâm→Thủy |

---

## 3. Unit Tests - `tuong-hop-logic.ts`

### 3.1 Điểm Thiên Can (`canScore`)

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [x] TC-TH-01 | Giáp (1984) + Kỷ (1989): Thiên Can Hợp | canScore = 20, canText = "Tương Hợp" |
| - | [ ] TC-TH-02 | Giáp + Mậu: Thiên Can Khắc | canScore = 2, canText = "Tương Khắc" |
| - | [x] TC-TH-03 | Giáp + Bính: Bình Hòa | canScore = 10, canText = "Bình Hòa" |
| - | [ ] TC-TH-04 | Tất cả 5 cặp Thiên Can Hợp | canScore = 20 (Giáp-Kỷ, Ất-Canh, Bính-Tân, Đinh-Nhâm, Mậu-Quý) |
| - | [x] TC-TH-05 | Đối xứng: can1 khắc can2 ↔ can2 khắc can1 | Cả hai chiều đều cho canScore = 2 |

### 3.2 Điểm Địa Chi (`chiScore`)

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [ ] TC-TH-06 | Dần + Ngọ: Tam Hợp | chiScore = 40, chiText = "Tam Hợp" |
| - | [ ] TC-TH-07 | Tý + Sửu: Lục Hợp | chiScore = 40, chiText = "Lục Hợp" |
| - | [ ] TC-TH-08 | Tý + Ngọ: Lục Xung | chiScore = 0, chiText = "Lục Xung" |
| - | [ ] TC-TH-09 | Chi không thuộc bộ nào | chiScore = 15, chiText = "Bình Hòa" |
| - | [ ] TC-TH-10 | Tất cả 4 bộ Tam Hợp | Đều cho chiScore = 40 |
| - | [ ] TC-TH-11 | Tất cả 6 cặp Lục Xung | Đều cho chiScore = 0 |

### 3.3 Điểm Cung Phi (`cungScore`)

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| - | [ ] TC-TH-12 | Cùng cung (VD: Càn + Càn) | cungText = "Phục Vị", cungScore = 25 |
| - | [ ] TC-TH-13 | Càn + Đoài: Sinh Khí | cungScore = 40 |
| - | [ ] TC-TH-14 | Càn + Ly: Tuyệt Mệnh | cungScore = 0 |
| - | [x] TC-TH-15 | Ma trận 8×8 đối xứng | `cungMatrix[A][B].score === cungMatrix[B][A].score` |

### 3.4 Điểm Tổng & Kết Luận

| # | Test Case | totalScore | Expected |
|---|-----------|------------|----------|
| - | [x] TC-TH-16 | >= 80 | interpretation chứa "Trời Sinh Một Cặp" |
| - | [x] TC-TH-17 | [60, 80) | interpretation chứa "Tương hợp rất tốt" |
| - | [x] TC-TH-18 | [40, 60) | interpretation chứa "trung bình" |
| - | [x] TC-TH-19 | < 40 | interpretation chứa "xung khắc" |
| - | [x] TC-TH-20 | `totalScore = canScore + chiScore + cungScore` | Luôn đúng, max lý thuyết = 100 |

---

## 4. Integration Tests - UserContext

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [ ] TC-UC-01 | Lưu hồ sơ mới | `localStorage.getItem("anmenh_profile")` có đúng dữ liệu |
| - | [ ] TC-UC-02 | Đọc lại hồ sơ sau reload | profile được hydrate đúng từ localStorage |
| - | [ ] TC-UC-03 | Xóa hồ sơ | `localStorage.getItem("anmenh_profile")` = null, profile = null |
| - | [ ] TC-UC-04 | Migration: có key cũ "harmony_tuvi_profile_v2" | Tự động migrate sang "anmenh_profile", xóa key cũ |
| - | [ ] TC-UC-05 | Migration: có key cũ "harmony_tuvi_profile" | Tương tự TC-UC-04 |
| - | [ ] TC-UC-06 | Migration: có key cũ "tuvi_profile" | Tương tự TC-UC-04 |
| - | [ ] TC-UC-07 | localStorage corrupt (JSON lỗi) | Không crash, profile = null |
| - | [ ] TC-UC-08 | Profile cũ không có `birthYear` nhưng có `birthDate` | `birthYear` được suy ra từ `birthDate` |
| - | [ ] TC-UC-09 | `saveProfile` tự đồng bộ `birthDate = {birthYear}-01-01` | birthDate luôn nhất quán |
| - | [ ] TC-UC-10 | `clearProfile` xóa luôn tất cả OLD_KEYS | Không còn key cũ nào trong localStorage |
| - | [ ] TC-UC-11 | `useUser()` ngoài Provider | Throw error "useUser must be used within UserProvider" |

---

## 5. Component Tests - Trang Chủ (Home)

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-HM-01 | Render khi chưa có profile | Hiển thị button "Tạo hồ sơ", không hiển thị Daily Luck Dashboard |
| - | [x] TC-HM-02 | Render khi có profile | Hiển thị "Chào, [tên]", hiển thị Daily Luck Dashboard |
| - | [ ] TC-HM-03 | Nhấn "Tạo hồ sơ" | Modal setup mở ra |
| - | [ ] TC-HM-04 | Nhấn vào nút Edit3 (khi có profile) | Modal setup mở ra với dữ liệu profile hiện tại |
| - | [ ] TC-HM-05 | Nhập tên rỗng | Nút "Bắt đầu" bị disabled |
| - | [ ] TC-HM-06 | Nhập năm sinh < 1900 | Nút "Bắt đầu" bị disabled |
| - | [ ] TC-HM-07 | Nhập năm sinh > 2020 | Nút "Bắt đầu" bị disabled |
| - | [ ] TC-HM-08 | Nhập hợp lệ rồi nhấn "Bắt đầu" | Modal đóng, hiển thị "Chào, [tên]", Daily Luck xuất hiện |
| - | [ ] TC-HM-09 | Nhấn "Xóa hồ sơ" | Về trạng thái không có profile, Daily Luck ẩn |
| - | [ ] TC-HM-10 | Click ngoài vùng modal | Modal đóng |
| - | [ ] TC-HM-11 | Khi nhập năm hợp lệ trong modal | Hiển thị Can Chi tương ứng (VD: "Năm 1990 • Canh Ngọ") |
| - | [x] TC-HM-12 | Daily Luck: 5 ô Năng lượng hiển thị đúng số ô sáng | energy = 3 → 3 ô sáng, 2 ô tối |
| - | [x] TC-HM-13 | 5 Feature Card điều hướng đúng | Calendar→/calendar, CanXuong→/can-xuong, BatTrach→/bat-trach, BatTu→/bat-tu, TuongHop→/tuong-hop |

---

## 6. Component Tests - Cân Xương

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-CX-UI-01 | Render trang | Form nhập liệu và placeholder kết quả hiển thị đúng |
| - | [x] TC-CX-UI-02 | Có profile → tự điền năm sinh | Input năm = profile.birthYear |
| - | [ ] TC-CX-UI-03 | Tháng 2, năm 2000 (nhuận) | Dropdown ngày có tối đa 29 ngày |
| - | [ ] TC-CX-UI-04 | Tháng 2, năm 1900 (không nhuận) | Dropdown ngày có tối đa 28 ngày |
| - | [x] TC-CX-UI-05 | Nhấn "Luận Giải Vận Mệnh" | Kết quả xuất hiện với Lượng Chỉ, mệnh cách, bình giải |
| - | [ ] TC-CX-UI-06 | Kết quả level = "excellent" | Viền và nền màu amber |
| - | [ ] TC-CX-UI-07 | Kết quả level = "good" | Viền và nền màu green |
| - | [ ] TC-CX-UI-08 | Kết quả level = "neutral" | Viền và nền màu blue |
| - | [ ] TC-CX-UI-09 | Kết quả level = "challenging" | Viền và nền màu stone/xám |
| - | [ ] TC-CX-UI-10 | Thay đổi thông tin, tính lại | Kết quả cũ được thay bằng kết quả mới (animation exit/enter) |

---

## 7. Component Tests - Bát Trạch

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-BTR-01 | Render trang | Form nhập năm, giới tính; la bàn chờ |
| - | [x] TC-BTR-02 | Có profile → tự điền | Năm và giới tính từ profile |
| - | [x] TC-BTR-03 | Nhấn "Tính Cung Mệnh" | Hiển thị Cung Phi, Đông/Tây Tứ Mệnh, 8 hướng |
| - | [x] TC-BTR-04 | Hướng tốt (4 hướng) | Hiển thị icon CheckCircle màu green |
| - | [x] TC-BTR-05 | Hướng xấu (4 hướng) | Hiển thị icon XCircle màu red |
| - | [ ] TC-BTR-06 | Hover vào hướng trên la bàn | La bàn xoay tới góc của hướng đó |
| - | [x] TC-BTR-07 | compassDeg từ kết quả | La bàn xoay đúng góc theo Cung Phi |
| - | [ ] TC-BTR-08 | Đổi giới tính, tính lại | Cung Phi thay đổi tương ứng |

---

## 8. Component Tests - Lịch Vạn Niên

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-CAL-01 | Render trang | Hiển thị lịch tháng hiện tại |
| - | [ ] TC-CAL-02 | Điều hướng sang tháng tiếp theo | Tháng tăng 1, năm không đổi |
| - | [ ] TC-CAL-03 | Điều hướng sang tháng trước | Tháng giảm 1 |
| - | [ ] TC-CAL-04 | Điều hướng từ tháng 1 sang tháng trước | Tháng = 12, năm - 1 |
| - | [ ] TC-CAL-05 | Điều hướng từ tháng 12 sang tháng sau | Tháng = 1, năm + 1 |
| - | [ ] TC-CAL-06 | Số ngày tháng 2 năm nhuận | 29 ô ngày |
| - | [ ] TC-CAL-07 | Số ngày tháng 2 năm không nhuận | 28 ô ngày |
| - | [x] TC-CAL-08 | Ngày Hoàng Đạo | Ô ngày có style nổi bật (tông amber/vàng) |
| - | [x] TC-CAL-09 | Ngày Hắc Đạo | Ô ngày có tông rose/đỏ nhạt, rõ ràng khác ngày bình thường |
| - | [x] TC-CAL-10 | Ngày bình thường | Không có style đặc biệt |
| - | [x] TC-CAL-11 | Click vào ngày | Modal chi tiết hiển thị Can Chi ngày, giờ đẹp |
| - | [x] TC-CAL-12 | Ngày hôm nay | Được đánh dấu/highlight khác các ngày khác |
| - | [x] TC-CAL-13 | Ngày đầu tuần | Hiển thị đúng thứ (T2 = cột 1 theo lịch VN) |

---

## 9. Component Tests - Bát Tự Tứ Trụ

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-BTU-UI-01 | Render trang | Form nhập ngày giờ sinh |
| - | [x] TC-BTU-UI-02 | Nhập ngày giờ và nhấn tính | 4 Trụ hiển thị với Can Chi |
| - | [x] TC-BTU-UI-03 | Radar Chart hiển thị | 5 trục Ngũ Hành với giá trị percent |
| - | [x] TC-BTU-UI-04 | Màu Kim | Xám bạc/ánh kim (KHÔNG phải vàng/nâu) |
| - | [x] TC-BTU-UI-05 | Màu Thổ | Vàng/nâu amber, khác biệt với Kim |
| - | [x] TC-BTU-UI-06 | Ngũ Hành khuyết (count = 0) | Tag "Khuyết [hanh]" hiển thị |
| - | [x] TC-BTU-UI-07 | Ngũ Hành vượng (count >= 2) | Tag "Vượng [hanh]" hiển thị |
| - | [ ] TC-BTU-UI-08 | Giờ 23:30 | Trụ Ngày hiển thị ngày hôm sau |
| - | [ ] TC-BTU-UI-09 | Style `backdrop-blur-md` | Card có hiệu ứng blur nhất quán với BatTrach |

---

## 10. Component Tests - Xem Hợp Tuổi

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [x] TC-THP-UI-01 | Render trang | Form 2 người: năm sinh + giới tính |
| - | [x] TC-THP-UI-02 | Điền đủ 2 người, nhấn tính | Hiển thị điểm Can, Chi, Cung và Tổng điểm |
| - | [ ] TC-THP-UI-03 | Tổng điểm >= 80 | Hiển thị kết quả màu amber/"vàng son" |
| - | [x] TC-THP-UI-04 | Tổng điểm < 40 | Hiển thị kết quả màu tối/xám |
| - | [x] TC-THP-UI-05 | Thanh progress điểm | Rộng tỷ lệ = totalScore/100 × 100% |
| - | [x] TC-THP-UI-06 | Can Chi của hai năm | Hiển thị đúng (VD: "Giáp Tý + Kỷ Tỵ") |
| - | [ ] TC-THP-UI-07 | Style `backdrop-blur-md` | Nhất quán với BatTu, BatTrach |

---

## 11. UI / E2E Tests - Luồng người dùng

### Luồng 1: Tạo hồ sơ lần đầu và xem Daily Luck

| # | Bước | Expected |
|---|------|----------|
| - | [x] TC-E2E-01 | Mở trang chủ lần đầu (không có localStorage) | Không có profile, thấy lời mời tạo hồ sơ |
| - | [x] TC-E2E-02 | Nhấn "Tạo hồ sơ" | Modal xuất hiện với animation |
| - | [x] TC-E2E-03 | Nhập tên "Nguyễn Văn An", năm 1990, giới tính Nam | Hiện "Năm 1990 • Canh Ngọ" |
| - | [x] TC-E2E-04 | Nhấn "Bắt đầu" | Modal đóng, Daily Luck Dashboard xuất hiện với tên "Nguyễn Văn An" |
| - | [x] TC-E2E-05 | Reload trang | Profile được giữ, Daily Luck vẫn hiển thị |

### Luồng 2: Xem Cân Xương đầy đủ

| # | Bước | Expected |
|---|------|----------|
| - | [x] TC-E2E-06 | Từ trang chủ, nhấn vào "Cân Xương Đoán Số" | Điều hướng sang /can-xuong |
| - | [x] TC-E2E-07 | Năm sinh tự điền từ profile | Đúng năm profile |
| - | [ ] TC-E2E-08 | Chọn tháng 3, ngày 15, giờ Ngọ | Các dropdown chọn đúng |
| - | [x] TC-E2E-09 | Nhấn "Luận Giải Vận Mệnh" | Kết quả hiện ra với animation |
| - | [x] TC-E2E-10 | Kiểm tra kết quả hiển thị đầy đủ | Có: vòng tròn Lượng Chỉ, tên mệnh cách, câu ngắn, đoạn bình giải, footer nhỏ |

### Luồng 3: Xem Bát Trạch

| # | Bước | Expected |
|---|------|----------|
| - | [x] TC-E2E-11 | Mở /bat-trach | Form tự điền từ profile |
| - | [x] TC-E2E-12 | Nhấn tính | La bàn xoay đến đúng góc Cung Phi |
| - | [ ] TC-E2E-13 | Hover từng hướng | La bàn xoay tới hướng tương ứng |
| - | [x] TC-E2E-14 | Kết quả có đủ 8 hướng với icon | 4 hướng xanh (tốt), 4 hướng đỏ (xấu) |

### Luồng 4: Xem Hợp Tuổi

| # | Bước | Expected |
|---|------|----------|
| - | [x] TC-E2E-15 | Mở /tuong-hop | Form 2 người |
| - | [ ] TC-E2E-16 | Nhập Nam 1990 + Nữ 1992 | Can Chi hiển thị đúng: "Canh Ngọ" + "Nhâm Thân" |
| - | [x] TC-E2E-17 | Nhấn tính | 3 dòng điểm (Can, Chi, Cung) + tổng điểm + kết luận |

---

## 12. UI Tests - Responsive & Theme

### 12.1 Responsive (Mobile-first)

| # | Test Case | Viewport | Expected |
|---|-----------|----------|----------|
| - | [ ] TC-RSP-01 | Trang chủ | 375px (iPhone SE) | Hero, Feature Cards hiển thị đúng, không tràn |
| - | [ ] TC-RSP-02 | Feature Cards | 375px | Grid 1 cột, không tràn ngang |
| - | [ ] TC-RSP-03 | Daily Luck Dashboard | 375px | Grid 2 cột (2×2), không bị cắt |
| - | [ ] TC-RSP-04 | Cân Xương | 375px | Form và kết quả xếp dọc, đọc được |
| - | [ ] TC-RSP-05 | Bát Trạch - la bàn | 375px | La bàn không bị cắt |
| - | [ ] TC-RSP-06 | Trang Chủ | 768px (tablet) | Feature Cards 2 cột |
| - | [x] TC-RSP-07 | Trang Chủ | 1440px (desktop) | Feature Cards 4 cột/hàng, cân đối |
| - | [ ] TC-RSP-08 | Modal hồ sơ | 375px | Modal full màn hình hoặc có padding đủ |

### 12.2 Dark Mode / Light Mode

| # | Test Case | Mode | Expected |
|---|-----------|------|----------|
| - | [ ] TC-DM-01 | Chữ trên nền sáng | Light | Tương phản đủ (không bị mờ) |
| - | [ ] TC-DM-02 | Chữ trên nền tối | Dark | Tương phản đủ (không bị mờ) |
| - | [ ] TC-DM-03 | Tag Ngũ Hành | Dark | Chữ và nền đủ tương phản, không bị chìm |
| - | [ ] TC-DM-04 | Form input | Dark | Placeholder và giá trị đọc rõ |
| - | [ ] TC-DM-05 | La bàn Bát Trạch | Dark | Vẽ rõ, không bị mất viền |
| - | [ ] TC-DM-06 | Radar Chart | Dark | Các trục và nhãn hiển thị rõ |
| - | [ ] TC-DM-07 | Chuyển đổi Light↔Dark | Cả hai | Không flash, transition mượt |

### 12.3 Animations & Interactions

| # | Test Case | Mô tả | Expected |
|---|-----------|-------|----------|
| - | [ ] TC-ANI-01 | Trang chủ load | Fade in từ dưới lên (opacity 0→1, y 20→0) |
| - | [ ] TC-ANI-02 | Modal mở | Scale 0.9→1, opacity 0→1 |
| - | [ ] TC-ANI-03 | Modal đóng | Scale 1→0.9, opacity 1→0 (AnimatePresence) |
| - | [ ] TC-ANI-04 | Kết quả Cân Xương xuất hiện | Scale 0.95→1, opacity 0→1 |
| - | [ ] TC-ANI-05 | Feature Card hover | Lift lên (-translate-y-1), border amber hiện |
| - | [ ] TC-ANI-06 | La bàn xoay | Transition smooth, không giật |
| - | [ ] TC-ANI-07 | Daily Luck Dashboard | Delay 0.3s, fade in sau Hero |

---

## Ghi chú

- **Ưu tiên cao:** TC-JD, TC-SL, TC-CC, TC-BT (các thuật toán cốt lõi) — lỗi ở đây ảnh hưởng toàn bộ ứng dụng.
- **Ưu tiên trung bình:** TC-UC, TC-E2E — ảnh hưởng trải nghiệm người dùng trực tiếp.
- **Ưu tiên thấp:** TC-ANI, TC-DM — ảnh hưởng thẩm mỹ, không block chức năng.
- Các test case thuật toán nên dùng **Jest** + so sánh với tài liệu tham chiếu Hồ Ngọc Đức.
- Các component test nên dùng **React Testing Library**.
- Các E2E test nên dùng **Playwright** hoặc **Cypress**.
