# 08: Frontend Testing (Unit + E2E)

Status: 📝 Planned, awaiting user review/approval. No code changed yet.

## Goal

Add an automated test suite to a project that currently has none — `package.json` has no `test` script and `find` for `*.test.*`/`*.spec.*` returns nothing. This is the single highest-signal addition for a mid-level junior application: it demonstrates the ability to write testable code and verify behavior beyond "it worked when I clicked it."

## Context

Nothing here is a rewrite — the goal is to test the app as it already exists, not restructure it to be "more testable" first. Highest-value targets, in order of effort vs. signal:

- `hooks/useApi.ts` — the shared generics (`useFetchData`, `usePost`, `usePatch`, `useDeleteData`) every feature depends on; a regression here breaks everything silently.
- `stores/useCouponStore.ts`, `stores/useAuthStore.ts` — pure Zustand logic, no rendering needed, cheapest tests to write.
- 2-3 component tests for flows with real business logic: cart quantity/coupon application, the follow/unfollow button state (the exact bug fixed in spec `06` — a regression test here would have caught it).
- E2E: guest browse → add to cart → login-gated checkout; vendor login → add product; follow → unfollow a shop (spec `06`'s "Verify" section is effectively an unwritten E2E test already).

## Design

- **Unit/component**: Vitest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`). Vitest over Jest because it shares Vite's config style and is faster to wire into a Next.js + TypeScript project with minimal config; mock `axiosInstance` at the module boundary rather than mocking React Query itself, so hook behavior (loading/error/success states, double-unwrap shape) is actually exercised.
- **E2E**: Playwright, reusing this environment's `webapp-testing` skill pattern (`scripts/with_server.py` for server lifecycle + `sync_playwright()` scripts) as the template for how tests are structured and run, rather than inventing a new harness.
- Tests live colocated or under a `__tests__/`/`e2e/` convention — match whichever the repo settles on in the first PR; not prescribed further here since no test convention exists yet to be consistent with.

## Implementation

1. Add dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` (or `happy-dom`), `@playwright/test`.
2. `vitest.config.ts` (or extend `next.config.ts`'s test config) — jsdom environment, path aliases matching `tsconfig.json`.
3. Unit tests: `hooks/useApi.ts` generics (mock `axiosInstance`), `stores/useCouponStore.ts`, `stores/useAuthStore.ts`.
4. Component tests: cart item + coupon application flow, shop-detail follow/unfollow button (`app/(public)/shop/[id]/page.tsx`).
5. Playwright E2E specs: guest-to-checkout, vendor-add-product, follow-unfollow-shop — run against `yarn dev` locally (not the Vercel deployment) via a server-lifecycle helper matching `scripts/with_server.py`'s pattern.
6. `package.json` — add `"test": "vitest run"` and `"test:e2e": "playwright test"` scripts, replacing the current absence of any test script.

## Dependencies

None for unit/component tests. E2E tests need the dev server running locally, so they depend on nothing else landing first but do need real (or seeded) auth/product data to exercise login-gated flows — worth deciding whether to seed a fixed test account/product via the server's Prisma seed, or accept that some E2E specs are skipped without one.

## Verify

- `yarn test` runs the unit/component suite and passes.
- `yarn test:e2e` runs the Playwright suite against a local dev server and passes.
- Deliberately breaking something (e.g. reverting spec `06`'s fix) makes the corresponding test fail, proving the tests actually exercise the behavior rather than being trivially green.
