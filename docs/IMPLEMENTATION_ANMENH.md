# Implementation Spec — AnMenh

## Tech Stack

Frontend:
- Next.js (App Router)
- TailwindCSS

Backend:
- Next.js API routes

Database:
- PostgreSQL

Auth:
- JWT session

---

## Database Schema

### users
id (uuid)
email
password_hash
created_at

---

### destiny_profiles
id
user_id
birth_date
birth_time
gender
element
zodiac
created_at

---

### daily_insights
id
profile_id
date
energy_score
do_list (json)
avoid_list (json)
lucky_color
is_premium (boolean)

UNIQUE(profile_id, date)

---

### harmony_scores
user_id
score
last_updated

---

## API Endpoints

POST /api/auth/register
POST /api/auth/login

POST /api/profile/create
GET  /api/profile/me

GET  /api/insight/today

POST /api/score/update

---

## Insight Generation Logic

Pseudo:

if insight for today exists:
    return cached insight
else:
    generate insight template
    save
    return
