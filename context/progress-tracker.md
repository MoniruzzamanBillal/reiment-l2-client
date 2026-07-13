# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Active feature development (not initial build-out) — core storefront, auth, cart/checkout, vendor/admin dashboards, the AI integration (chat/smart-search/description generation), coupon correctness, and the shop-follow → product-discovery connection are all now built.

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                               | Status                        | Notes                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-ai-integration.md`](specs/01-ai-integration.md)               | ✅ Complete                   | `hooks/useAi.ts`, `stores/useChatStore.ts`, `components/shared/ChatWidget/*`, AI description button on vendor product forms, smart search on `/products` — all delivered per the root `implementationplan.md`.                                |
| [`02-coupon-feature.md`](specs/02-coupon-feature.md)               | ✅ Complete                   | Re-verified against `coupon-implementation-plan.md` (root): `useCouponStore` uses `couponId` (not `cuponId`), checkout calls `/coupon/apply-coupon` and surfaces backend messages verbatim, admin add/update forms have `startDate`/`endDate` via `ControlledInput type="date"` (the doc had gone stale, this row corrects it). |
| [`03-followed-shops-filter.md`](specs/03-followed-shops-filter.md) | ✅ Complete                   | "Only shops I follow" toggle landed on `/products` and `ProductsFilter.tsx`, simultaneously with the backend `shopIds` filter. `yarn build`/`yarn lint` pass; guest view manually verified via Playwright (checkbox correctly absent, no console errors).                                                     |
| [`04-shop-follow-button-state-bug.md`](specs/04-shop-follow-button-state-bug.md) | ✅ Complete                   | Fixed the `TFollowData` type-shape mismatch in `app/(public)/shop/[id]/page.tsx` — the Follow button now correctly derives `isFollowing` from the array `/follow/logged-user-data` actually returns, so it flips to "Unfollow" instead of causing a spurious "already following" error. Frontend-only, single file, `yarn build` passes.           |
| [`05-followed-shops-filter-not-visible-bug.md`](specs/05-followed-shops-filter-not-visible-bug.md) | ✅ Complete                   | Fixed the `user.role` → `user.userRole` field-name bug in `app/(public)/products/page.tsx` (3 call sites) — the "Only shops I follow" checkbox now correctly appears for logged-in customers instead of being permanently invisible. Frontend-only, `yarn build` passes.                        |

## Completed (already implemented)

- Public storefront: home, product catalog (`/products`, search/filter/sort/pagination), product detail (reviews, related products), flash sale, shop listing/detail, product comparison, recently-viewed products, contact page.
- Auth: login, registration, JWT-cookie session (access + refresh), role-gated routing via `middleware.ts`, password reset flow.
- Cart & checkout: cart management, order placement, order-success page, working coupon application at checkout (date-range/usage-limit/per-user rules enforced server-side).
- Follow system: follow/unfollow a shop, customer "Followed Shops" dashboard list, and an opt-in "Only shops I follow" filter on the All Products page.
- Vendor dashboard: shop + product CRUD, AI-assisted description generation.
- Admin dashboard: category/shop/user/coupon CRUD, review/transaction monitoring, analytics.
- AI integration: shopping chat widget (public), smart search, vendor description generation — all via the backend's shared `askOpenRouter` client.
- Data layer: `hooks/useApi.ts` (TanStack Query) generics in active use across every feature; Zustand stores per concern (`useAuthStore`, `useComparisonStore`, `useCouponStore`, `useChatStore`, `useRecentProductsStore`).

## Recent Activity

- Fixed `user.role` → `user.userRole` field-name bug in `app/(public)/products/page.tsx` (spec `05`) — the "Only shops I follow" checkbox was permanently invisible because `TUser.role` is dead/unused; every other call site in the codebase already used `userRole`.
- Fixed `isFollowing` type-shape bug in `app/(public)/shop/[id]/page.tsx` (spec `04`) — Follow button now correctly reflects follow state.
- "Only shops I follow" toggle added to `app/(public)/products/page.tsx` and `components/main/AllProducts/ProductsFilter.tsx` for the followed-shops-filter spec.
- `d8cbe8c` / `6da5ede feat(coupon): added cupon functionality and coupon in checkout` — coupon UI added to checkout; confirmed complete (including the `couponId` fix and admin date-range fields) on re-verification, despite the doc previously saying otherwise.
- `0cf9cb3 feat: nav search popover`
- `43239d3 fix: login api token response, product search debounce`
- `9009ee8 feat: implementation plan` — the AI integration plan (`implementationplan.md`) landed and was subsequently implemented.
- `fd00aff feat: error toast when not logged in user try to add product in cart`
- `6859c02 feat: next migrate`

## Known Gaps / Open Questions

- No automated test suite configured — verification is `yarn lint` + `yarn build` + manual browser check. The followed-shops-filter toggle's logged-in-customer behavior (narrowing results, disabled-when-zero-follows state) could not be exercised end-to-end in this environment — the local sandbox has no network access to the dev database, so no real session/follow data was available. Guest view was verified via Playwright (checkbox correctly hidden, no console errors, no regressions to existing filters); the logged-in-path code was verified by review against the exact pattern `app/(public)/shop/[id]/page.tsx` and the dashboard "Followed Shops" page already use for the same `["loggedUserFollow"]` query key.
- Two breakpoint-naming conventions coexist in `app/globals.css` (`sc-*` and `xsm`/`xmd`/`xlm`/`xlg`) — not unified; match whichever the file you're editing already uses.

## Next Up

Open — driven by whatever feature/fix is requested next. Both the coupon rewrite and the followed-shops filter are now complete; a logged-in-customer smoke test of the new toggle (against a real dev DB) is worth doing before considering it fully done end-to-end.

(End of file)
