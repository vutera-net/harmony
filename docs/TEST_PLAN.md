# Harmony Monorepo: Kế hoạch Kiểm thử (Test Plan) 🧪

Tài liệu này xác định chiến lược, phạm vi và các kịch bản kiểm thử nền tảng Harmony để đảm bảo tính ổn định của hệ thống Monorepo, tính chính xác của thuật toán và trải nghiệm người dùng liền mạch.

---

## 1. Mục tiêu Kiểm thử
- Xác minh tính năng xác thực (Auth) hoạt động xuyên suốt các Sub-domain.
- Đảm bảo các thuật toán Bát tự/Ngũ hành trong `packages/domain` tính toán chính xác 100%.
- Kiểm tra tính ổn định của luồng gọi AI (OpenAI) và cơ chế lưu trữ Insight hằng ngày.
- Đảm bảo hiệu suất SEO và Static Generation của TuVi Web.

---

## 2. Kịch bản Kiểm thử Chức năng (Functional Testing)

### 2.1. Lớp Định danh & Bản sắc (An Mệnh Web)
| ID | Tính năng | Kịch bản Kiểm thử | Kết quả Kỳ vọng |
|:---|:---|:---|:---|
| ANM-01 | **Auth** | Đăng ký/Đăng nhập bằng Email & Password. | User ID được tạo trong DB, Session được lưu vào Cookie `.vutera.net`. |
| ANM-02 | **Wizard** | Nhập ngày sinh (15/05/1998), Giờ sinh (10:00), Giới tính (Nam). | Hệ thống tự động đẩy ra Mệnh: **Thủy** và Tuổi: **Dần**. |
| ANM-03 | **Dashboard** | Kiểm tra hiển thị điểm Năng lượng và danh sách Nên/Không nên làm. | Dữ liệu được fetch từ `DailyInsight` table tương ứng với ngày hiện tại. |
| ANM-04 | **Social** | Tìm bạn bằng email `banhop@harmony.com` và kết nối. | Hiển thị điểm tương hợp (95%) và Messenger Sinh/Khắc chính xác. |

### 2.2. Lớp SEO & Nội dung (TuVi Web)
| ID | Tính năng | Kịch bản Kiểm thử | Kết quả Kỳ vọng |
|:---|:---|:---|:---|
| TUV-01 | **Static Gen** | Truy cập `/bai-viet/sao-thai-duong-trong-tu-vi`. | Trang hiển thị ngay lập tức (SSG), không có trễ tải Client-side. |
| TUV-02 | **SEO Meta** | Kiểm tra thẻ `<title>` và `<meta description>` bằng Page Source. | Metadata chứa đúng từ khóa của bài viết và thương hiệu Harmony. |
| TUV-03 | **Conversion** | Click vào Banner "Lập bản đồ An Mệnh". | Trình duyệt chuyển hướng đúng sang `anmenh.vutera.net/onboarding`. |

---

## 3. Kiểm thử Logic Thuật đoán (Domain Testing)
*Vị trí: `packages/domain`*

- **Test Case 1 (Zodiac):** Nhập năm 1992 -> Phải trả về "Thân". Nhập 2000 -> Phải trả về "Thìn".
- **Test Case 2 (Element):** Kiểm tra tính nhất quán của Ngũ hành Nạp âm theo năm sinh (Bảng Can Chi).
- **Test Case 3 (Compatibility):**
    - `Kim` + `Thủy` -> **Tương Sinh** (Score > 90%).
    - `Hỏa` + `Thủy` -> **Tương Khắc** (Score < 40%).
    - `Mộc` + `Mộc` -> **Bình Hòa** (Score ~ 70%).

---

## 4. Kiểm thử Tích hợp & Hạ tầng (Integration & Infra)

- **tRPC Type Safety:**
    - Thử thay đổi Schema ở `packages/database`.
    - Kiểm tra xem VS Code có báo đỏ (Red squiggly) ở `apps/anmenh-web` do sai kiểu dữ liệu không.
- **Cron Job (AI Automation):**
    - Trigger thủ công Endpoint `/api/cron`.
    - Kiểm tra bảng `DailyInsight` để xác nhận record mới được chèn với dữ liệu JSON từ OpenAI.
- **Cross-App Communication:**
    - Đăng nhập ở `anmenh-web`.
    - Chuyển sang `harmony-web`, kiểm tra xem Session có còn hiệu lực không (Single Sign-On).

---

## 5. Danh sách Kiểm tra trước khi Release (Pre-release Checklist)
- `[ ]` Chạy `pnpm build` từ thư mục gốc (Kiểm tra lỗi Type/Lint toàn hệ thống).
- `[ ]` Kiểm tra `.env` trên Vercel đã có đủ `DATABASE_URL` và `OPENAI_API_KEY`.
- `[ ]` Chuyển Prisma Provider về `postgresql` (nếu đang ở `sqlite` local).
- `[ ]` Kiểm tra Responsive UI trên iPhone/Android simulator cho màn hình Dashboard.

---

> [!TIP]
> **Khuyến nghị:** Sử dụng **Playwright** hoặc **Cypress** để tự động hóa luồng "Đăng ký -> Onboarding -> Xem Dashboard" để tránh lỗi hồi quy (Regression) trong tương lai.
