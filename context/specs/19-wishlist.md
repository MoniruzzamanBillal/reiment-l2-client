# 19: Wishlist (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends on `reiment-l2-server/context/specs/15-wishlist.md` landing first (needs the `/wishlist/*` endpoints).

## Goal

Let a customer save products for later from the product card, the product detail page, or a dedicated dashboard list — a persisted, cross-device list, distinct from the cart (purchase intent) and from the existing purely-local `useComparisonStore` (ephemeral, `localStorage`-only, max 3 same-category items).

## Context

The "Followed Shops" customer dashboard page (`components/main/(Customer)/FollowedShops/FollowedShops.tsx`) is the template: `useFetchData` for the list, `useDeleteData` for removal, double-unwrap (`(data as any)?.data`), query invalidation plus a manual `refetch()` on success (the codebase's belt-and-suspenders pattern). No heart/save icon exists anywhere on `ProductCard.tsx` or `ProductDetailTop.tsx` today — the only `Heart` icon in the whole `components/` tree is decorative marketing copy in `HeroBanner.tsx`.

## Design

- Server state only (TanStack Query) — no new Zustand store, matching the Followed Shops precedent (a wishlist is inherently server-backed, unlike comparison).
- One shared hook (`hooks/useWishlistToggle.ts`) instead of duplicating the membership-check + add/remove-mutation logic across `ProductCard` and `ProductDetailTop` — both consumers need identical behavior (toggle icon state, optimistic-feeling UX via query invalidation).
- Render the dashboard wishlist page as a **grid of `ProductCard`s**, not a table — this is product content, unlike Followed Shops' shop-row list.

## Implementation

1. `types/index.ts` — add `TWishlistData`, mirroring the existing `TFollowData` shape: `{ id, customerId, productId, product: { id, name, price, productImg, discount, inventoryCount } }`.
2. `hooks/useWishlistToggle.ts` — new hook: `useFetchData<TWishlistData[]>(["loggedUserWishlist"], "/wishlist/logged-user-data")` for membership (`wishlist.some(w => w.productId === id)`), `usePost`/`useDeleteData` for add/remove against `/wishlist/add-wishlist` / `/wishlist/remove-wishlist`, both invalidating `["loggedUserWishlist"]`.
3. `app/(dashboard)/dashboard/customer/wishlist/page.tsx` — 6-line wrapper (mirrors `followed-shops/page.tsx`).
4. `components/main/(Customer)/Wishlist/Wishlist.tsx` — fetches the list, renders `ProductCard` grid, empty-state message when empty.
5. `components/shared/cards/ProductCard.tsx` — add a heart toggle icon (filled/outline) using `useWishlistToggle`.
6. `components/main/ProductDetail/ProductDetailTop.tsx` — same heart toggle, next to the existing "Compare" button.
7. `components/shared/Sidebar/DashboardLinks.tsx` — add `{ name: "Wishlist", path: "/dashboard/customer/wishlist", icon: <Heart .../> }` to `customerLinks` — using a distinct icon rather than the `CiBookmark` all three existing entries currently share.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/15-wishlist.md`.

## Verify

- Log in as a customer, toggle the heart on a product card on `/products` and on a product detail page — icon state updates immediately, dashboard Wishlist page reflects it on next visit/refetch.
- Remove an item from the dashboard Wishlist page — confirm the corresponding card's heart un-fills elsewhere in the app (shared query key invalidation).
- Confirm the heart toggle is hidden or disabled for logged-out visitors / non-customer roles (same guard pattern as the existing Follow button).
