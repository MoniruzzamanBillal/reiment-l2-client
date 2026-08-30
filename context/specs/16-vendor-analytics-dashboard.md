# 16: Vendor Analytics Dashboard (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends on server spec `12`.

## Goal

A vendor-facing statistics page, mirroring the existing admin one, showing the vendor's own revenue
trend, top products, and order-status breakdown.

## Context

`components/main/(Admin)/Statistics/Statistics.tsx` already renders this pattern for admins (stat
cards + `recharts` bar chart + pie chart, fed by `useFetchData<TAdminStats>(["adminStats"], "/admin/stats")`).
`recharts` is already a dependency. `components/main/(Vendor)/` has no `Statistics` folder and the vendor
dashboard has no route for it today.

## Design

- New `components/main/(Vendor)/Statistics/Statistics.tsx`, structurally mirroring the admin version:
  stat cards (total revenue, total orders, low-stock count), a revenue/orders trend bar chart, and
  either an order-status pie chart or a top-products bar chart, all via `recharts`.
- New type file `components/main/(Vendor)/Statistics/type/vendorStats.type.ts` matching the server's
  `VendorStats` shape.
- Data via `useFetchData<TVendorStats>(["vendorStats"], "/shop/vendor-stats")` — no new hook needed,
  same generic used everywhere else.
- New route `app/(dashboard)/dashboard/vendor/statistics/page.tsx` rendering the component; add a nav
  link in the vendor dashboard sidebar/nav alongside the existing Products/Shop/Orders links.

## Implementation

1. `components/main/(Vendor)/Statistics/type/vendorStats.type.ts`.
2. `components/main/(Vendor)/Statistics/Statistics.tsx`.
3. `app/(dashboard)/dashboard/vendor/statistics/page.tsx`.
4. Add the nav entry to the vendor dashboard's nav/sidebar component.

## Dependencies

Depends on server spec `12` (`GET /shop/vendor-stats`) being implemented first.

## Verify

- Logged in as a vendor, `/dashboard/vendor/statistics` renders real numbers scoped to that vendor's
  shop; a second vendor account sees different numbers.
- `yarn build`/`yarn lint` clean; manual browser check, no console errors.
