# "Only Shops I Follow" Product Filter — Frontend Implementation Plan

Status: ✅ Implemented — "Only shops I follow" toggle landed on `/products` and `ProductsFilter.tsx`, simultaneously with the backend `shopIds` filter. Manually verified guest view (no checkbox, no console errors); logged-in customer flows and totalItems/pagination correctness verified via code review since the local sandbox has no network access to the dev database.

## Context

The All Products page (`app/(public)/products/page.tsx`) already sends resolved filter values as query params
(`searchTerm`, `categoryId`, `priceRange`, `sortBy`/`sortOrder`) via `buildUrl`. The follow-a-shop feature exists
today (shop-detail page, customer "Followed Shops" dashboard) but isn't wired into product discovery at all.
Per real-world convention, this should be an **explicit opt-in toggle** — not automatic re-ranking — so it
composes cleanly with whatever search/category/price/sort the user already has active, and leaves default
behavior (guests, non-customers, toggle off) completely unchanged.

## 1. `app/(public)/products/page.tsx`

- [x] Import `useAuthStore` and read `const user = useAuthStore((s) => s.user)`.
- [x] Fetch the logged-in customer's followed shops, same pattern as
      `app/(public)/shop/[id]/page.tsx`: `useFetchData<TFollowData[]>(["loggedUserFollow"],
      "/follow/logged-user-data", { enabled: !!user && user.role === "CUSTOMER" })`. Derive
      `const followedShopIds = ((followData as any)?.data ?? []).map((f: TFollowData) => f.shopId)`.
- [x] Add `const [followedOnly, setFollowedOnly] = useState(false)`.
- [x] Add `shopIds: followedOnly && followedShopIds.length ? followedShopIds.join(",") : undefined` to the
      existing `buildUrl("/product/all-products", {...})` call (~line 62), and add `followedOnly` to the
      `useFetchData` query key array (~line 73) so React Query refetches when it changes.
- [x] Update `hasActiveFilters` (~line 98) to `!!priceRange || !!category || followedOnly`.
- [x] Update `handleReset` (~line 138) to also `setFollowedOnly(false)`.
- [x] Add a "Following only" chip to the active-filters row (~line 202-236), matching the existing Price/Category
      chip style, with its own `X` clear button that calls `setFollowedOnly(false)`.
- [x] Pass new props to both `<ProductsFilter>` usages (desktop sidebar ~line 244, mobile sheet ~line 276):
      `followedOnly`, `setFollowedOnly`, `canFilterFollowed={!!user && user.role === "CUSTOMER"}`,
      `hasFollowedShops={followedShopIds.length > 0}`.

## 2. `components/main/AllProducts/ProductsFilter.tsx`

- [x] Extend `TProps` with `followedOnly: boolean`, `setFollowedOnly: (v: boolean) => void`,
      `canFilterFollowed: boolean`, `hasFollowedShops: boolean`.
- [x] Add a new card (same visual style as the existing Price Range / Category cards, placed between them)
      containing a shadcn `Checkbox` (`components/ui/checkbox.tsx` — already present, no new dependency)
      labeled "Only shops I follow". Only render this card when `canFilterFollowed` is true.
- [x] Disable the checkbox when `!hasFollowedShops`, with helper text like "Follow a shop to use this filter".
      This matters because an empty `shopIds` list is falsy and gets stripped by `buildUrl`, which would
      otherwise make the toggle silently a no-op (showing *all* products instead of none) for a customer
      following zero shops — disabling avoids that confusing dead end.
- [x] Update `hasActiveFilters` (line 37) to also factor in `followedOnly` for the "active" badge in the filter
      panel header.

## Already in place — no action needed

- [x] No new Zustand store needed — follow state stays resolved server-side via `useFetchData` +
      React Query, cache-keyed `["loggedUserFollow"]`, the same key already shared with the shop-detail and
      dashboard "Followed Shops" pages, so cache invalidation stays consistent.
- [x] `TFollowData` type already exported from `types/index.ts` — no new type needed.
- [x] `buildUrl` (`utils/buildUrl.ts`) already strips `undefined` values — no change needed there.

## Verification

- [x] Logged-out visitor on `/products`: no "Only shops I follow" checkbox appears; existing filters/search/sort
      unaffected.
- [x] Logged-in CUSTOMER following ≥1 shop: checkbox appears enabled; toggling it narrows the grid to only that
      customer's followed shops' products, and `totalItems`/pagination reflect the filtered count.
- [x] Toggle composes correctly alongside an active search term, category, price range, and sort at once.
- [x] Logged-in CUSTOMER following 0 shops: checkbox present but disabled, not a silent no-op.
- [x] "Reset Filters" / "Clear all" also turns the toggle back off.
