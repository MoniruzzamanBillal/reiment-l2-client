# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Active feature development (not initial build-out) — core storefront, auth, cart/checkout, vendor/admin dashboards, and the AI integration (chat/smart-search/description generation) are already built; coupon correctness and the shop-follow → product-discovery connection are in-flight.

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                               | Status                        | Notes                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-ai-integration.md`](specs/01-ai-integration.md)               | ✅ Complete                   | `hooks/useAi.ts`, `stores/useChatStore.ts`, `components/shared/ChatWidget/*`, AI description button on vendor product forms, smart search on `/products` — all delivered per the root `implementationplan.md`.                                |
| [`02-coupon-feature.md`](specs/02-coupon-feature.md)               | ⛔ Not started                | Depends on the backend plan (`reiment-l2-server/coupon-implementation-plan.md`) landing first. Today the discount is never actually applied in production due to a `cuponId`/`couponId` spelling mismatch — don't build on top of this state. |
| [`03-followed-shops-filter.md`](specs/03-followed-shops-filter.md) | 📝 Planned, awaiting approval | Plan docs written in both repos (`followed-shops-filter-implementation-plan.md`); user is reviewing before implementation starts. Depends on the backend plan landing first (adds the `shopIds` product filter).                              |

## Completed (already implemented)

- Public storefront: home, product catalog (`/products`, search/filter/sort/pagination), product detail (reviews, related products), flash sale, shop listing/detail, product comparison, recently-viewed products, contact page.
- Auth: login, registration, JWT-cookie session (access + refresh), role-gated routing via `middleware.ts`, password reset flow.
- Cart & checkout: cart management, order placement, order-success page (coupon _application_ is currently non-functional in production — see the coupon spec).
- Follow system: follow/unfollow a shop, customer "Followed Shops" dashboard list.
- Vendor dashboard: shop + product CRUD, AI-assisted description generation.
- Admin dashboard: category/shop/user/coupon CRUD, review/transaction monitoring, analytics.
- AI integration: shopping chat widget (public), smart search, vendor description generation — all via the backend's shared `askOpenRouter` client.
- Data layer: `hooks/useApi.ts` (TanStack Query) generics in active use across every feature; Zustand stores per concern (`useAuthStore`, `useComparisonStore`, `useCouponStore`, `useChatStore`, `useRecentProductsStore`).

## Recent Activity (from `git log`)

- `d8cbe8c` / `6da5ede feat(coupon): added cupon functionality and coupon in checkout` — coupon UI added to checkout, but the backend spelling mismatch means the discount doesn't actually apply yet (see `context/specs/02-coupon-feature.md`).
- `0cf9cb3 feat: nav search popover`
- `43239d3 fix: login api token response, product search debounce`
- `9009ee8 feat: implementation plan` — the AI integration plan (`implementationplan.md`) landed and was subsequently implemented.
- `fd00aff feat: error toast when not logged in user try to add product in cart`
- `6859c02 feat: next migrate`

## Known Gaps / Open Questions

- No automated test suite configured — verification is `yarn lint` + `yarn build` + manual browser check.
- Coupon discount is not actually applied in production today (`cuponId`/`couponId` mismatch) — see `coupon-implementation-plan.md` (root) and `context/specs/02-coupon-feature.md`.
- The follow-a-shop feature isn't yet connected to product discovery on `/products` — see `followed-shops-filter-implementation-plan.md` (root) and `context/specs/03-followed-shops-filter.md`.
- Two breakpoint-naming conventions coexist in `app/globals.css` (`sc-*` and `xsm`/`xmd`/`xlm`/`xlg`) — not unified; match whichever the file you're editing already uses.

## Next Up

Open — driven by whatever feature/fix is requested next. The followed-shops filter is the most likely next implementation once the user approves the reviewed plan.

(End of file)
