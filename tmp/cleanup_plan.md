# Codebase Cleanup & Optimization Plan

This document outlines the planned improvements for the Harmony Ecosystem to resolve version inconsistencies, redundancies, and align the codebase with current product strategy.

## 1. Version Synchronization (High Priority)
**Goal**: Standardize the technical stack across all modules to prevent environment-specific bugs.

- [ ] **Upgrade `anmenh`**: Update React to v19 and Next.js to v16.
- [ ] **Upgrade `auth` & `harmony-portal`**: Update Next.js to v16.
- [ ] **Verification**: Run build and tests for all modules to ensure no regressions.

## 2. Shared Library Extraction (Medium Priority)
**Goal**: Eliminate code duplication and centralize ecosystem configurations.

- [ ] **Establish Shared Folder**: Create a root-level `shared/` or `packages/shared/` directory.
- [ ] **Extract Components**: Move `BridgeTransition.tsx` from individual modules to `shared/components`.
- [ ] **Centralize Config**: Move `urls.ts` and common UI primitives (e.g., `ClientOnly.tsx`) to `shared/config`.
- [ ] **Refactor Imports**: Update all modules to import from the shared directory.

## 3. PDF Logic Unification (Medium Priority)
**Goal**: Consistent PDF generation approach across the ecosystem.

- [ ] **Migrate `anmenh`**: Replace `jspdf` and `jspdf-autotable` with `@react-pdf/renderer`.
- [ ] **Dependency Cleanup**: Remove `jspdf` and `jspdf-autotable` from `package.json`.

## 4. Strategic & Technical Refinement (Low Priority)
**Goal**: Align terminology with "Funnel" strategy and improve type safety.

- [ ] **Refactor `harmony-tuvi` APIs**: Rename `requires_premium` and `premium_link` to `requires_upsell` and `cta_link`.
- [ ] **Type Safety**: Replace `any` in `auth/src/lib/jwt-utils.ts` with a `JWTPayload` interface.
- [ ] **Performance**: Implement `useMemo` in `harmony-tuvi` chart display components to optimize concurrent rendering in React 19.

---
**Status**: Plan Mode (Read-Only)
**Constraint**: No implementation changes to be made until this plan is approved.
