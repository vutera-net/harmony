# ~~Technical Implementation — Monorepo Architecture~~

> **⚠️ TÀI LIỆU LỖI THỜI — ĐÃ ĐƯỢC THAY THẾ**
>
> Kiến trúc monorepo (Turborepo + pnpm workspaces + shared packages) đã bị bỏ.
> Dự án hiện là **3 standalone Next.js apps** chạy độc lập.
>
> Xem tài liệu mới tại:
> - `SYSTEM_OVERVIEW.md` — Kiến trúc tổng thể hiện tại
> - `CURRENT_CONTEXT.md` — Stack & cấu trúc chi tiết
> - `LOCAL_GUIDE.md` — Hướng dẫn chạy local

---

*Nội dung bên dưới là lịch sử, chỉ giữ lại để tham khảo.*

---

## Selected Tooling (CŨ)
- **Monorepo Manager:** Turborepo
- **Package Manager:** pnpm (workspaces)
- Shared Packages: `packages/api`, `packages/auth`, `packages/database`, `packages/domain`

Tất cả shared packages đã được inline vào `anmenh/src/lib/`.
