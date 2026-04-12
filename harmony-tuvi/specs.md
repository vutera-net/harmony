# TUVI.VUTERA.NET — PRODUCT REQUIREMENT DOCUMENT (PRD)

---

# 1. OVERVIEW

## 1.1 Product Name

TuVi: VUTERA Harmony Tử Vi AI (thuộc Harmony Ecosystem - VUTERA)

## 1.2 Product Type

SEO Content Platform + Traffic Engine

## 1.3 Core Role

TuVi KHÔNG phải là sản phẩm chính.

TuVi là:
→ Entry point (top funnel)
→ Traffic generator từ SEO
→ Conversion gateway dẫn user sang AnMenh

---

# 2. POSITIONING

## 2.1 Strategic Position

TuVi tồn tại để:

* Thu hút traffic từ Google (SEO)
* Tạo sự tò mò & thiếu hụt thông tin
* Điều hướng user sang AnMenh (core product)

---

## 2.2 What TuVi IS

* Content-based astrology platform
* High-volume landing pages (daily horoscope, zodiac, age-based content)
* Funnel entry layer

---

## 2.3 What TuVi IS NOT

* Không phải hệ thống phân tích tử vi đầy đủ
* Không phải nơi cung cấp insight cá nhân hóa
* Không phải nơi giữ user lâu dài

---

# 3. CORE PRINCIPLES

## 3.1 Principle #1 — Controlled Value

Chỉ cung cấp:
→ 40% – 60% giá trị thực

KHÔNG bao giờ cung cấp 100%.

---

## 3.2 Principle #2 — Induced Incompleteness

User phải luôn cảm thấy:
→ "Thông tin này đúng nhưng chưa đủ cho mình"

---

## 3.3 Principle #3 — Funnel First

Mọi feature phải trả lời:
→ Có giúp tăng conversion sang AnMenh không?

Nếu không → loại bỏ

---

## 3.4 Principle #4 — Non-Personalization Boundary

TuVi chỉ:

* Chung theo năm sinh / ngày / cung

AnMenh:

* Cá nhân hóa sâu (giờ sinh, profile)

---

# 4. USER FLOW

## 4.1 Standard Flow

User từ Google:
↓
Landing page (article)
↓
Đọc nội dung chung
↓
Gặp "doubt trigger"
↓
Gặp "content lock"
↓
Click CTA
↓
Đi sang AnMenh
↓
Login / Create profile

---

## 4.2 Emotional Flow

1. "Cái này đúng"
2. "Nhưng chưa đủ"
3. "Muốn biết thêm"
4. "Click"

---

# 5. CORE FEATURES

---

## 5.1 Content Pages (SEO)

### Types:

* Tử vi hôm nay
* Tử vi theo tuổi
* Tử vi theo năm sinh
* Tử vi theo cung

---

## 5.2 Partial Insight Engine

Hiển thị:

* Insight chung
* Không đầy đủ
* Có điều kiện

Ví dụ:
"Bạn có xu hướng thuận lợi, tuy nhiên điều này còn phụ thuộc..."

---

## 5.3 Content Lock (CRITICAL FEATURE)

### Purpose:

Ẩn phần giá trị cao

### Behavior:

* Một phần nội dung bị khóa
* Hiển thị CTA mở khóa

### Example:

🔒 Phần dành riêng cho bạn:
• Thời điểm tốt nhất hôm nay
• Cảnh báo cá nhân
→ Tạo hồ sơ để xem

---

## 5.4 CTA System

Dynamic CTA theo context:

Examples:

* "Xem bản cá nhân hóa"
* "Xem chính xác hơn"
* "Mở khóa phần còn lại"

---

## 5.5 Doubt Trigger System

Chèn vào nội dung:

Examples:

* "Kết quả này chỉ mang tính tổng quan"
* "Để chính xác cần giờ sinh"

---

## 5.6 Soft Input (Optional)

Cho phép user:

* chọn năm sinh
* chọn giới tính

→ tăng engagement trước khi login

---

# 6. CONTENT STRUCTURE

Mỗi bài phải follow:

1. Hook (thu hút)
2. Nội dung chung
3. Insight sơ bộ
4. Limitation (chưa cá nhân)
5. Partial insight
6. Content lock
7. CTA → AnMenh
8. Related content

---

# 7. DESIGN PRINCIPLES

## 7.1 Progressive Disclosure

* Không show toàn bộ ngay
* Scroll → reveal
* Click → mở

---

## 7.2 Conversion-driven UI

* CTA xuất hiện nhiều điểm
* Sticky CTA (floating button)

---

## 7.3 Visual Hierarchy

* Phân biệt rõ:

  * Free content
  * Locked content

---

## 7.4 Psychological Design

Tạo cảm giác:

* thiếu
* tò mò
* chưa đủ

---

# 8. DATA & DATABASE

## 8.1 Có cần database không?

### Option 1 — Static Content (Recommended start)

* Không cần DB
* Generate content từ template

---

### Option 2 — Dynamic (Advanced)

DB có thể gồm:

TABLE: horoscope_content

* id
* type (daily, age, zodiac)
* content
* tags
* seo_slug

TABLE: user_input (optional)

* session_id
* birth_year
* gender

---

## 8.2 Tracking (BẮT BUỘC)

* CTA clicks
* Scroll depth
* Conversion rate
* Page exit

---

# 9. INTEGRATION

## 9.1 With AnMenh

* CTA dẫn sang:
  https://anmenh.vutera.net/

* Có thể truyền:

  * birth_year
  * gender

---

## 9.2 With Harmony

* Branding layer
* Triết lý hệ thống

---

# 10. NON-FUNCTIONAL REQUIREMENTS

* SEO optimized (meta, schema, keywords)
* Load nhanh (Core Web Vitals)
* Mobile-first
* Scalable (hàng nghìn pages)

---

# 11. ANTI-PATTERNS (CẦN TRÁNH)

❌ Cung cấp full insight
❌ Cá nhân hóa trong TuVi
❌ UX giữ user quá lâu
❌ Không có CTA rõ ràng
❌ Không có content lock

---

# 12. SUCCESS METRICS

* CTR → AnMenh
* Conversion rate (signup)
* Time to click CTA
* Bounce rate (có kiểm soát)

---

# 13. FUTURE EXTENSIONS

* Daily notification
* Personalized preview (fake)
* AI-generated content scaling
* A/B testing engine

---

# 14. SUMMARY

TuVi là:
→ Traffic Engine

Không phải:
→ Product chính

---

Golden Rule:

"TuVi phải khiến user rời đi"
→ sang AnMenh

---

END.
