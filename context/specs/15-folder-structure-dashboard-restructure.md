# 15: Folder Structure Restructure — Dashboard

Status: ⛔ Not started. Planning document only — no code changes yet. Same ground rules as `14-folder-structure-public-restructure.md`: **pure file relocation / extraction, no behavior changes**. Read that doc's "Constraints" and "Folder structure notes" sections first — they apply here unchanged and aren't repeated in full below.

**Depends on spec 14's Phase 0** (shared `config/`, `constants/`, `providers/`, `lib/` moves) already being done — every dashboard page imports at least one of `axiosInstance`, `roles.ts`, or `envConfig.ts`.

## Why

Every route under `app/(dashboard)/dashboard/` (22 pages) keeps its full JSX/logic inline in `page.tsx` — the only precedent for the reference's `components/main/<Group>/<Feature>/` convention is `components/main/AdminDashboard/AdminStatCard.tsx`, a single sub-widget used by `statistics/page.tsx`. This spec extracts every dashboard page into a properly grouped component tree.

## Explicitly out of scope (found during investigation — flag for a future spec, don't act on now)

Five add/update route pairs **duplicate their form fields** independently rather than sharing one component (add uses a local Zod schema + `usePost`; update uses valueless RHF + `usePatch`, no schema reuse):

- Categories: `add-category` vs `update-category/[id]`
- Coupons: `add-coupon` vs `update-coupon/[id]`
- Vendor products: `add-products` vs `update-products/[id]` (heaviest — ~90% duplicated, incl. AI description button, image handling)
- Vendor shop: `add-shop` vs `update-shop/[id]`

The reference project's own `Room/form/{CreateUpdateRoom,RoomForm}.tsx` pattern suggests consolidating these into one shared form (a `mode`/`defaultValues` prop driving create vs. edit) — but merging two independently-written forms is a logic change with real regression risk (different validation approaches, subtly different field handling), not a folder move. This spec keeps each pair as two separate files, just relocated. Consolidating them is a good candidate for a dedicated future spec once this restructure is verified stable.

Also found, unrelated to any live route — **flag for the user to decide disposition, not resolved by this spec**:

- `components/shared/table/*` (8 files, ~1004 ln: `GenericTableComponent`, `TableContent`, `TableFilter`, `TablePagination`, `TableSearch`, `TableToolbar`, `TableActionMenu`, `createRowSelectionColumn`) — no `app/` page imports any of them; every dashboard list today is a hand-rolled `<table>`. Dead scaffolding, likely built for a TanStack-Table redesign that was never wired up.
- `components/common/GenericTable.tsx` — zero importers anywhere.
- `components/shared/Modal/*` (`BaseModal`, `FormActionButtons`, `ModalActionButtons`) — only consumer is `components/main/ControlledInputImplement/`, itself unrouted.
- `components/main/ControlledInputImplement/` — not imported by any `app/` route; looks like scratch/demo code predating the real dashboard build.

Options when this is decided: leave in place untouched (out of scope either way), or delete as dead code. Not part of this restructure regardless — don't move or delete during this spec's execution without separate sign-off, since "is this really dead" deserves its own check, not a side effect of a folder-structure pass.

---

## Target grouping

```
components/main/
  (Admin)/
    Categories/        (list + add + update — 3 routes)
    Coupon/             (list + add + update — 3 routes)
    ManageShop/
    ManageUser/
    MonitorReview/
    MonitorTransaction/
    Statistics/         (absorbs existing AdminDashboard/AdminStatCard.tsx)
  (Vendor)/
    Products/           (add + update + manage — 3 routes)
    Shop/               (add + update + manage — 3 routes)
    MonitorReviews/
    OrderHistory/
  (Customer)/
    FollowedShops/
    OrderHistory/
  Dashboard/            (landing/profile view — role-agnostic)
  UpdateProfile/         (shared across all roles, not nested under a role group)
```

`components/main/AdminDashboard/` is retired once `AdminStatCard.tsx` moves into `(Admin)/Statistics/`.

## Per-feature mapping

### Admin

| Routes                                                                          | Current                                                                                                                                    | New                                                                                                                                                | Action                                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `categories`, `categories/add-category`, `categories/update-category/[id]`      | inline (103/63/76 ln); `add-category` has local `addCategorySchema` (Zod) + `TAddCategoryForm`; `update-category` has no schema, plain RHF | `(Admin)/Categories/Categories.tsx`; `(Admin)/Categories/form/{AddCategory,UpdateCategory}.tsx`; `(Admin)/Categories/schema/addCategory.schema.ts` | EXTRACT (kept as 2 separate form files — see "out of scope") |
| `manage-coupon`, `manage-coupon/add-coupon`, `manage-coupon/update-coupon/[id]` | inline (103/79/94 ln); `add-coupon` has local `addCouponSchema` (5-field, `.refine`)                                                       | `(Admin)/Coupon/Coupon.tsx`; `(Admin)/Coupon/form/{AddCoupon,UpdateCoupon}.tsx`; `(Admin)/Coupon/schema/addCoupon.schema.ts`                       | EXTRACT                                                      |
| `manage-shop`                                                                   | inline (124 ln), block/unblock via 2× `usePatch`, 2 inline `AlertDialog`s                                                                  | `(Admin)/ManageShop/ManageShop.tsx`                                                                                                                | EXTRACT                                                      |
| `manage-user`                                                                   | inline (126 ln), same block/unblock shape as manage-shop                                                                                   | `(Admin)/ManageUser/ManageUser.tsx`                                                                                                                | EXTRACT                                                      |
| `monitor-review`                                                                | inline (67 ln), read-only table, local `TAdminReview` type                                                                                 | `(Admin)/MonitorReview/MonitorReview.tsx` + `type/adminReview.type.ts`                                                                             | EXTRACT                                                      |
| `monitor-transaction`                                                           | inline (55 ln), read-only table, local `TTransaction` type                                                                                 | `(Admin)/MonitorTransaction/MonitorTransaction.tsx` + `type/transaction.type.ts`                                                                   | EXTRACT                                                      |
| `statistics`                                                                    | inline (137 ln, recharts Bar/Pie) + `components/main/AdminDashboard/AdminStatCard.tsx`                                                     | `(Admin)/Statistics/Statistics.tsx` + `(Admin)/Statistics/AdminStatCard.tsx`                                                                       | EXTRACT + MOVE                                               |

### Vendor

| Routes                                                    | Current                                                                                                                                                                                                                        | New                                                                                                                                          | Action                                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `add-products`, `update-products/[id]`, `manage-products` | inline (208/243/216 ln); both add/update use plain RHF (no Zod), `react-select` Controller, AI description button, TipTap editor; update also has `useEffect`+`reset` populate + discount<price check; local `TCategoryOption` | `(Vendor)/Products/Products.tsx` (manage); `(Vendor)/Products/form/{AddProduct,UpdateProduct}.tsx`; `(Vendor)/Products/type/product.type.ts` | EXTRACT (2 separate form files — heaviest duplication in the app, see "out of scope") |
| `add-shop`, `update-shop/[id]`, `manage-shop`             | inline (74/84/122 ln); `add-shop` has local `addShopSchema`, `update-shop` doesn't                                                                                                                                             | `(Vendor)/Shop/Shop.tsx` (manage); `(Vendor)/Shop/form/{AddShop,UpdateShop}.tsx`; `(Vendor)/Shop/schema/addShop.schema.ts`                   | EXTRACT                                                                               |
| `monitor-reviews`                                         | inline (71 ln), local `TVendorReview` (near-duplicate shape of admin's `TAdminReview` — do not merge the two types in this pass, just relocate each into its own feature's `type/`, per the type-placement rule in spec 14)    | `(Vendor)/MonitorReviews/MonitorReviews.tsx` + `type/vendorReview.type.ts`                                                                   | EXTRACT                                                                               |
| `order-history`                                           | inline (62 ln), `useOrderPusher()` side effect, local `TVendorOrder`                                                                                                                                                           | `(Vendor)/OrderHistory/OrderHistory.tsx` + `type/vendorOrder.type.ts`                                                                        | EXTRACT                                                                               |

### Customer

| Routes           | Current                                   | New                                          | Action  |
| ---------------- | ----------------------------------------- | -------------------------------------------- | ------- |
| `followed-shops` | inline (107 ln), `useDeleteData` unfollow | `(Customer)/FollowedShops/FollowedShops.tsx` | EXTRACT |
| `order-history`  | inline (88 ln), `useOrderPusher()`        | `(Customer)/OrderHistory/OrderHistory.tsx`   | EXTRACT |

### Shared/root

| Routes                          | Current                                                                  | New                                                                                | Action  |
| ------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------- |
| `dashboard` (landing)           | inline (90 ln), profile fetch/display + edit link                        | `Dashboard/Dashboard.tsx`                                                          | EXTRACT |
| `dashboard/update-profile/[id]` | inline (139 ln), RHF+Zod (`updateProfileSchema`), skeleton loading state | `UpdateProfile/UpdateProfile.tsx` + `UpdateProfile/schema/updateProfile.schema.ts` | EXTRACT |

Leave untouched (already correctly placed, cross-cutting, not tied to one feature): `components/shared/Sidebar/{Sidebar,DashboardLinks}.tsx` (used only by `app/(dashboard)/layout.tsx`, role-based nav, not a page feature).

## Type-placement rule (recap from spec 14)

`TCategory`, `TCoupon`, `TAdminShop`, `TAdminUser`, `TVendorProduct`, `TVendorShop`, `TFollowData`, `TOrderHistory`, `TLoggedInUser`, `TAdminStats` currently live in `types/index.ts`. Before relocating any of them into a feature's `type/` folder, grep for cross-feature usage — e.g. `TCategory`/category option shapes are likely also needed by the vendor product form (spec 15's own `(Vendor)/Products`) and possibly `AllProducts` (spec 14). Anything referenced by 2+ features stays centralized; single-feature types move.

## Verify

- `yarn lint` and `yarn build` clean after each group (Admin, then Vendor, then Customer, then shared).
- Every admin/vendor/customer CRUD flow exercised manually: create, edit, delete/block/unblock, list filters, pagination — identical behavior to before, including the pre-existing add/update duplication (not fixed by this spec).
- Realtime: vendor and customer order-history pages still receive Pusher `new-order`/`order-status-changed`/`low-stock` events after the move (`useOrderPusher()` call site unchanged in behavior).
- Role-gated routing (`middleware.ts`) unaffected — this spec doesn't touch `app/` route paths, only what each `page.tsx` renders.
- No leftover imports pointing at `components/main/AdminDashboard/` (old path) — grep before deleting the folder.
- `context/progress-tracker.md` updated when this spec starts and completes.
