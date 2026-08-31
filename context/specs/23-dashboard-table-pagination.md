# 23: Dashboard Table Pagination

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Pairs with
`reiment-l2-server/context/specs/19-list-endpoint-pagination.md` — **land the server spec first (or in the
same PR)**, since this spec depends on the `meta.totalItems` field that spec adds to each response.

## Goal

Add `page`/`limit` query params and pagination UI to every vendor/admin/customer dashboard table that
currently fetches its full list in one request, using the exact pattern already proven in
`components/main/AllProducts/AllProducts.tsx` (the one place in the app that already paginates
correctly) — not the unused `GenericTableComponent`/`TablePagination`/`usePagination` system flagged as
dead code in `context/specs/15-folder-structure-dashboard-restructure.md` (decision: keep this a
minimal, low-risk diff on each table's existing hand-rolled `<table>` markup, not a rewrite onto
TanStack Table).

## Context

Audit (triggered by the vendor product table rendering every row with no pagination) found that **every**
dashboard table in the app — vendor, admin, and customer — fetches its endpoint with no query params and
renders the full array, with no page-number/load-more UI. `AllProducts.tsx` is the only correct reference:
it keeps a `page` state, builds the URL via `buildUrl(endpoint, { page, limit, ...filters })`, includes
`page` in the React Query key, reads `meta.totalItems` off the response (a sibling of `data`, single
unwrap — see below), and renders a shadcn `<Pagination>` block.

## Response-shape this depends on

Today, e.g. `Products.tsx` (vendor) does a **single** unwrap: `(productData as any)?.data ?? []`, because
`product.service.ts`'s `getVendorProduct` currently returns a plain array — the server envelope is
`{ success, message, data: [...] }`, and `lib/api.ts`'s `apiGet` already strips one layer (`axiosInstance`
response `{ data: response.data }` → `apiGet` returns `response.data`), so `productData.data` is already
the array.

Server spec `19` makes each converted endpoint return a flat envelope, `{ success, message, data: [...],
meta: { totalItems, page, limit } }` — `meta` is a **sibling** of `data`, not nested inside it (this was
fixed at the `sendResponse.ts` level alongside spec 19, correcting a bug in the two pre-existing paginated
endpoints that used to nest `meta` inside `data`). So the unwrap for every table converted by this spec
stays a **single** unwrap, same shape as today, just with `meta` now also available:

```ts
const rows = (result as any)?.data ?? [];
const totalItems = (result as any)?.meta?.totalItems ?? 0;
```

`AllProducts.tsx` and `NotificationBell.tsx` were both updated to this shape already (they're the two
existing consumers of paginated endpoints) — copy their current code as the reference, don't copy any
older double-unwrap (`.data.data`) version if you find one in history.

## Pattern to apply to each table (copy from `AllProducts.tsx`)

```tsx
const LIMIT = 10; // consistent dashboard default; AllProducts.tsx uses 9 for its 3-col grid, not relevant here

const [page, setPage] = useState(1);

const url = buildUrl("/product/get-vendor-product/" + shopId, { page, limit: LIMIT });

const { data: productData, isLoading } = useFetchData<TVendorProduct[]>(
  ["vendorProducts", shopId ?? "", String(page)], // include page in the query key
  url,
  { enabled: !!shopId },
);

const products: TVendorProduct[] = (productData as any)?.data ?? [];
const totalItems: number = (productData as any)?.meta?.totalItems ?? 0;
const totalPages = Math.ceil(totalItems / LIMIT);
```

Then render the same `<Pagination>` block `AllProducts.tsx` uses (`components/ui/pagination`), below the
existing `<table>`, gated on `totalPages > 1`:

```tsx
{totalPages > 1 && (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} />
      </PaginationItem>
      {Array.from({ length: totalPages }).map((_, ind) => (
        <PaginationItem key={ind}>
          <PaginationLink href="#" isActive={page === ind + 1} onClick={(e) => { e.preventDefault(); setPage(ind + 1); }}>
            {ind + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }} />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}
```

The `<table>`/`<tbody>` markup itself, loading/error/empty states, and every action (update/delete/block/
duplicate/etc.) stay exactly as they are today — only the fetch (URL + query key + unwrap) and the added
`<Pagination>` footer change.

## Tables to convert

| Component | Endpoint | Current unwrap | New unwrap (single unwrap, `meta` is a sibling of `data`) |
|---|---|---|---|
| `components/main/(Vendor)/Products/Products.tsx` | `GET /product/get-vendor-product/:id` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Vendor)/OrderHistory/OrderHistory.tsx` | `GET /order/vendorShop-order-history` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Vendor)/MonitorReviews/MonitorReviews.tsx` | `GET /review/getVendorProductReviews` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Admin)/ManageUser/ManageUser.tsx` | `GET /user/all-user` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Admin)/ManageShop/ManageShop.tsx` | `GET /shop/all-shop-data` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Admin)/Coupon/Coupon.tsx` | `GET /coupon/all-coupon` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Admin)/MonitorReview/MonitorReview.tsx` | `GET /review/all-review` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Admin)/MonitorTransaction/MonitorTransaction.tsx` | `GET /order/all-transaction` | `.data` | `.data` + `.meta.totalItems` |
| `components/main/(Customer)/OrderHistory/OrderHistory.tsx` | `GET /order/user-order-history` | `.data` | `.data` + `.meta.totalItems` |

Each row: add `page` state + `buildUrl` + updated query key + the `<Pagination>` block per the pattern
above, and switch the unwrap on both the row array and the (new) `meta.totalItems`.

## Not converted in this pass (matches server spec 19's exclusions)

- `components/main/(Admin)/Categories/Categories.tsx` (`GET /category/all-category`) — lookup-table
  sized, server spec 19 leaves this endpoint unpaginated.
- `components/main/(Customer)/FollowedShops/FollowedShops.tsx` (`GET /follow/logged-user-data`) and
  `components/main/(Customer)/Wishlist/Wishlist.tsx` (`GET /wishlist/logged-user-data`) — both endpoints
  are also used elsewhere for full-list membership checks (`AllProducts.tsx`'s followed-shops filter,
  `useWishlistToggle.ts`'s heart-icon state) and are deliberately staying unpaginated per server spec 19 —
  do not add `page`/`limit` params to these two calls, the server won't honor them differently anyway.
- `components/shared/Navbar/NotificationBell.tsx` (`GET /notification/my-notifications`) — the backend
  already paginates this one; the dropdown just never sends `page`/`limit` and relies on `max-h-80
  overflow-y-auto` to visually cap it. Low priority (it's a capped dropdown, not a growing table) — leave
  as-is unless the user asks for it separately, since adding real page controls to a notification dropdown
  is a different UX shape (e.g. "load more") than the `<Pagination>` block used elsewhere here.

## Verify

- `yarn lint` / `yarn build` clean.
- For each converted table: manually log in as the relevant role, confirm the table renders page 1,
  confirm clicking a page number fetches and renders different rows, confirm the "Showing X of Y" /
  pagination controls only appear when `totalPages > 1`.
- Confirm every existing action per table (update/delete/duplicate/block/unblock/export/etc.) still works
  unchanged after the fetch/unwrap change.
- Confirm `Wishlist.tsx`, `FollowedShops.tsx`, `Categories.tsx`, and `NotificationBell.tsx` are untouched
  and still work exactly as before.
- `context/progress-tracker.md` updated when this spec starts and completes.
