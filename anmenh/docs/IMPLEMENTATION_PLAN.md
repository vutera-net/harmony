# Implementation Plan - Phase 5: Tinh chinh & Dong bo

Phase 4 da hoan thanh viec xay dung module Bat Tu Tu Tru va Xem Tuoi Tuong Hop.

## Proposed Changes

### 1. Dong bo Giao Dien & Trai Nghiem (UI/UX Sync) - [HOAN THANH]
- [x] **Mau Ngu Hanh**: Doi mau cua menh Kim sang xam bac/anh kim (tranh nham lan mau vang/nau cua Tho). Chinh sua tai `RadarChart.tsx` va `BatTu.tsx`.
- [x] **Lich Van Nien (`calendar/page.tsx`)**: Doi mau hoac style ngay Hac Dao (vi du tong do nhat `rose`) de khac biet hoan toan voi ngay binh thuong.
- [x] **Trang Chu (`Home.tsx`)**: Dua tinh nang Bat Tu va Xem Tuoi Hop vao UI menu/Dashboard chinh.
- [x] **Layouting Bat Tu & Hop Tuoi (`BatTu.tsx`, `TuongHop.tsx`)**: Tieu chuan hoa phong cach `backdrop-blur-md` tren toan bo cac trang de nhin tinh te het nhu La Ban Huong Nha.
- [x] **Can bang tuong phan**: Fix loi mo chu o Light mode va cac the Ngu hanh o Dark mode.

### 2. Thuat toan La Ban Bat Trach - [HOAN THANH]
- [x] Sua loi toan hoc tinh **Cung Phi** trong `lunar-logic.ts` (ap dung cong thuc mod 9 chuan phong thuy).
- [x] Dam bao la ban xoay chuan goc phong thuy theo Cung Phi moi.

### 3. Toi uu He Thong & Nhan Hieu - [HOAN THANH]
- [x] Rebranding du an tu Harmony TuVi sang **An Menh**.
- [x] Cap nhat toan bo LocalStorage key sang `anmenh_profile`.
- [x] Dong bo cac tep `.agent/` theo nhan hieu moi.
