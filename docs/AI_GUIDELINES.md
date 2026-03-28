# AI Coding Guidelines

## Rules

1. Do NOT invent new database tables.
2. Follow schema exactly.
3. Keep functions small.
4. Prefer server actions over client logic.
5. All business logic must live in /lib/domain.

## Folder Structure

/app
/api
/components
/lib
    /domain
    /services
