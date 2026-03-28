# Implementation Spec — AnMenh

## Tech Stack
**Frontend:**
- Next.js (App Router)
- TailwindCSS

**Backend:**
- Next.js API routes / Server Actions

**Database:**
- PostgreSQL (via Prisma / Drizzle)

**Auth:**
- JWT session

---

## Database Schema

### `users`
- `id` (uuid)
- `email`
- `password_hash`
- `created_at`

---

### `destiny_profiles`
- `id`
- `user_id` (FK)
- `birth_date`
- `birth_time`
- `gender`
- `element`
- `zodiac`
- `created_at`

---

### `daily_insights`
- `id`
- `profile_id` (FK)
- `date`
- `energy_score`
- `do_list` (json - arrays of modern strings)
- `avoid_list` (json - arrays of modern strings)
- `lucky_color`
- `is_premium` (boolean)

**UNIQUE(profile_id, date)**

---

### `harmony_scores`
- `user_id` (FK)
- `score`
- `last_updated`

---

### `connections` (For V1.5 Social Compatibility)
- `id`
- `user_id` (FK)
- `friend_user_id` (FK)
- `status` (pending, accepted)
- `compatibility_score`
- `created_at`

---

### `premium_reports` (For V1.5 A-la-carte)
- `id`
- `user_id` (FK)
- `report_type` (love, career, ai_chat)
- `content` (json)
- `purchased_at`

---

## API & Server Actions Endpoints

**Auth:**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Profile:**
- `POST /api/profile/create`
- `GET /api/profile/me`

**Insights:**
- `GET /api/insight/today`

**Social (V1.5):**
- `POST /api/connections/request`
- `GET /api/connections/list`

---

## Insight Generation Logic

**Pseudo:**
```python
if insight for today exists:
    return cached insight
else:
    # Use AI with strict system prompt to ensure modern, "straight-talk" tone
    generate insight template based on DestinyProfile + Current Transits
    save to daily_insights
    return new insight
```
