# 03: Followed Shops Product Filter

Status: 📝 Planned, awaiting user review/approval. Full checklist lives in root `followed-shops-filter-implementation-plan.md` (this repo) and the matching backend doc in `reiment-l2-server` — this is a condensed summary, not a replacement for either.

## Goal

Connect the existing follow-a-shop feature to product discovery on the All Products page via an **explicit opt-in filter toggle** — not automatic re-ranking of search results, not a separate feed. This matches real-world convention (Etsy/Shopee-style): silently re-ranking by follow-status breaks the meaning of whatever sort/filter the user already has active.

## Design

- Depends on the backend adding a `shopIds` filter to `GET /product/all-products` (see the backend plan) — the client resolves which shops the logged-in customer follows via the existing `GET /follow/logged-user-data` endpoint and passes their IDs through as a new query param, the same way `categoryId`/`priceRange` already work.
- No new Zustand store — follow state stays resolved via `useFetchData` + React Query, cache-keyed `["loggedUserFollow"]`, the same key already shared with the shop-detail and "Followed Shops" dashboard pages.
- A customer following zero shops must see the checkbox **disabled** (with helper text), not a silent no-op — an empty `shopIds` list is falsy and gets stripped by `buildUrl`, which would otherwise show all products instead of none.

## Implementation

**`app/(public)/products/page.tsx`:**
- Read `user` from `useAuthStore`; fetch `followedShopIds` via `useFetchData<TFollowData[]>(["loggedUserFollow"], "/follow/logged-user-data", { enabled: !!user && user.role === "CUSTOMER" })`.
- Add `followedOnly` state; add `shopIds` to the `buildUrl(...)` call and the `useFetchData` query key; fold `followedOnly` into `hasActiveFilters` and `handleReset`; add a "Following only" chip to the active-filters row.
- Pass `followedOnly`, `setFollowedOnly`, `canFilterFollowed`, `hasFollowedShops` to both `<ProductsFilter>` usages (desktop sidebar + mobile sheet).

**`components/main/AllProducts/ProductsFilter.tsx`:**
- Extend `TProps`; add a `Checkbox` card ("Only shops I follow"), rendered only when `canFilterFollowed`, disabled when `!hasFollowedShops`; fold into `hasActiveFilters`.

## Dependencies

Backend: `shopIds` filter branch in `product.service.ts`'s `getAllProducts` (plus the `totalItems` count-consistency fix noted in that plan) and the `product.controller.ts` `pick(...)` array update.

## Verify

- Logged-out visitor: no checkbox, existing filters unaffected.
- Customer following ≥1 shop: checkbox enabled, narrows grid, `totalItems`/pagination correct, composes with search/category/price/sort.
- Customer following 0 shops: checkbox present but disabled.
- "Reset Filters" also turns the toggle off.
