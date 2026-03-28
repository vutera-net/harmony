# Product Requirement Document — AnMenh

## Product Name
AnMenh

## Purpose
AnMenh is the identity layer of Harmony.
It stores a user's destiny profile and delivers personalized insights.

## Target User
Vietnamese users interested in astrology, destiny, and daily guidance.

## Core Value
Each user has ONE persistent destiny profile.

---

## Core Features (V1)

### 1. Account System
- Register
- Login
- Session authentication

Fields:
- email
- password (hashed)

---

### 2. Destiny Profile Creation

Input:
- birth_date (required)
- birth_time (optional)
- gender (required)

Output:
- element (ngũ hành)
- zodiac
- destiny summary

Constraint:
Profile creation must take < 30 seconds.

---

### 3. Dashboard

Displays:
- Today's energy score
- Recommended actions
- Avoid actions
- Lucky color

Updated daily.

---

### 4. Daily Insight Engine

System generates daily insight using:
- destiny profile
- current date

One insight per user per day.

---

### 5. Harmony Score (Gamification)

Score increases when:
- user logs in daily
- user reads insight
- user updates profile

---

### 6. Premium Lock (Preparation)

Certain insights marked as:
- locked = premium

No payment required in V1.

---

## Non Goals (V1)

- No AI chat
- No mobile app
- No complex astrology calculations
