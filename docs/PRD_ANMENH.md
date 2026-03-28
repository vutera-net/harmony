# Product Requirement Document — AnMenh

## Product Name
AnMenh

## Purpose
AnMenh is the identity layer of Harmony.
It stores a user's destiny profile and delivers highly personalized, modern insights based on Eastern astrology.

## Target User
Vietnamese Millennials and Gen Z interested in self-discovery, spiritual wellness, and daily guidance.

## Core Value
Each user has **ONE** persistent destiny profile.
Provide insights in a modern, "straight-talk" tone (phong cách trực diện, dễ hiểu, tránh từ ngữ Hán Việt phức tạp).

---

## Core Features (V1)

### 1. Account System
- Register & Login (Email/Password)
- Session authentication

Fields:
- email
- password_hash

---

### 2. Destiny Profile Creation
Input:
- birth_date (required)
- birth_time (optional)
- gender (required)

Output:
- element (ngũ hành)
- zodiac (con giáp)
- destiny summary (tổng quan vận mệnh)

Constraint: Profile creation must take < 30 seconds.

---

### 3. Dashboard
Displays the daily personal energy:
- Today's Energy Score (Điểm năng lượng)
- Recommended Actions (Nên làm - e.g., "Tập trung làm việc một mình")
- Avoid Actions (Tránh làm - e.g., "Tranh cãi với sếp")
- Lucky Color (Màu cứu rỗi tâm trạng)

*Updated daily via AI using the modern tone.*

---

### 4. Daily Insight Engine
System generates daily insight using:
- User's Destiny Profile
- Current Date & Planetary/Lunar transits

*One customized insight per user per day.*

---

### 5. Harmony Score (Gamification)
Score increases when:
- User logs in daily
- User reads insight
- User updates profile

---

## Strategic Features (V1.5 / V2)

### 1. Social Compatibility (Tương Hợp)
- User can add friends via a share link.
- Compare Destiny Profiles to see compatibility in Love, Work, and Friendship.
- **Goal:** Drive viral growth (invite loops).

### 2. A-La-Carte Monetization (Pay-per-report)
- Premium insights are sold individually using "Harmony Coins" or direct payments.
- Example: "Báo cáo tương hợp tình duyên chuyên sâu" or "Hỏi AI một câu về sự nghiệp".

---

## Non Goals (V1)
- No complex traditional astrology charts (Keep it simple for Gen Z).
- No mobile app (Web MVP first).
- No subscription model (Freemium + a-la-carte later).
