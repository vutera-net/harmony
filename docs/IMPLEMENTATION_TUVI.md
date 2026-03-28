# Implementation Spec — TuVi

## Stack
Next.js static generation (SSG)

---

## Database

### articles
id
slug
title
content
category
seo_keywords
created_at

---

## Routes

/tu-vi-hang-ngay
/menh-kim-la-gi
/tuoi-thin-1988

---

## Rendering

Use static generation with revalidation.

revalidate = 86400 (daily)

---

## CTA Component

Reusable component:

<ArticleCTA />

Props:
- destination_url
- message
