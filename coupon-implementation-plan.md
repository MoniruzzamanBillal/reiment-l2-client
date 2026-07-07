# Coupon Feature — Frontend Implementation Plan

Status: planned, not yet implemented. Check items off as they're built.

## Context

The "Apply Coupon" box currently lives on the Cart page; the Checkout page has no coupon UI and no price
breakdown at all. Per product decision, coupon-apply moves to Checkout only. Admin coupon management is
missing date-range fields and an update page entirely. All of this depends on the backend plan
(`reiment-l2-server/coupon-implementation-plan.md`) being implemented first — the endpoints/fields referenced
below don't exist until then.

## 1. `types/index.ts` — modify `TCoupon`

- [ ] Replace the unused `expiryDate?: string` with required `startDate: string` and `endDate: string`:
  ```ts
  export type TCoupon = {
    id: string;
    code: string;
    discountValue: number;
    usageLimit: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    createdAt: string;
  };
  ```

## 2. `stores/useCouponStore.ts`

- [x] No change needed — `couponId: string | null` (+ `setCouponId`/`resetCoupon`) is still the right shape,
      reused as-is by the checkout page.

## 3. `app/(dashboard)/dashboard/admin/manage-coupon/add-coupon/page.tsx` — modify

- [ ] Fix the misleading label: `"Discount Value (%) :"` → `"Discount Amount ($) :"`, placeholder
      `"e.g. 10 for 10%"` → `"e.g. 10 for $10 off"` (label/text only — no math changes, still a flat amount).
- [ ] Add `startDate`/`endDate` fields via `ControlledInput` with `type="date"` (already supports arbitrary
      `type` passthrough — confirmed by direct read, no component changes needed).
- [ ] Extend `addCouponSchema`: add `startDate`/`endDate` as required strings, plus a `.refine()` that
      `endDate > startDate` (client-side mirror of the backend zod refine).
- [ ] Include `startDate`/`endDate` in the `addMutate` payload. Endpoint stays `POST /coupon/add-coupon`.

## 4. NEW FILE — `app/(dashboard)/dashboard/admin/manage-coupon/update-coupon/[id]/page.tsx`

- [ ] Mirror `update-category/[id]/page.tsx` exactly (confirmed as the template via direct read): `use(params)`
      to unwrap the route param, `useFetchData<TCoupon>(["coupon", id], /coupon/get-coupon/${id})` to prefill,
      `usePatch([["allCoupon"]])` submitting to `PATCH /coupon/update-coupon/${id}`, same
      code/discountValue("Discount Amount ($)")/usageLimit/startDate/endDate fields, same
      `FormSubmitLoading` + success-toast-then-redirect pattern. No file-upload controller needed (coupons
      have no image).

## 5. `app/(dashboard)/dashboard/admin/manage-coupon/page.tsx` — modify

- [ ] Add columns: **Used / Limit** (`{coupon.usedCount} / {coupon.usageLimit}`), **Start Date**, **End Date**
      (both `new Date(...).toLocaleDateString()`).
- [ ] Add an **Update** action (Link/Button to the new `update-coupon/[id]` page) next to the existing Delete
      `AlertDialog`, matching the categories list page's Update+Delete pattern.
- [ ] Fix the existing Discount cell: currently renders `{coupon.discountValue}%` — change to
      `${coupon.discountValue}` (flat amount, no percent sign).
- [ ] Bump `colSpan` on the loading/error/empty-state `<tr>` fallbacks to match the new column count.

## 6. `app/(public)/cart/page.tsx` — remove coupon-apply block

- [ ] Remove the `coupon`/`discount` local state, the `useCouponStore` import/usage, `couponMutate`, and
      `handleApplyCoupon`.
- [ ] Remove the "Enter Promo Code" input + Apply button JSX.
- [ ] Revert the price breakdown to plain values (no `- discount` in Subtotal/Total; keep the flat `$4.99`
      Shipping line as-is).
- [ ] Replace the page's own direct "Order Item" button (which today bypasses the address form and, with it,
      any chance to apply a coupon) with a **"Proceed to Checkout"** link to `/checkout` — this makes Checkout
      the single place an order is actually placed, which is what makes "apply coupon at checkout" coherent
      instead of optional. Flagged here explicitly as an incidental UX fix tied directly to the coupon
      relocation, not unrelated scope creep.

## 7. `app/(public)/checkout/page.tsx` — add coupon UI + price breakdown

- [ ] Add local state: `code`, `discount`, `couponError`.
- [ ] Compute `subtotal` via the existing `calculateCartPrice(cart?.cartItem)` (already used on the cart page,
      reused here as-is — no changes to that util).
- [ ] Add `handleApplyCoupon` calling `usePost([])` against the new `POST /coupon/apply-coupon` with
      `{ code }`; on success, `setCouponId`/`setDiscount` from the response; on error, set `couponError` to
      the backend's exact message (`err?.response?.data?.message`) **and** show it inline under the input (not
      just as a toast) so the specific expired/not-started/limit/already-used message is clearly visible.
- [ ] Add the "Enter Promo Code" input + Apply button JSX (moved from the cart page) and a price-breakdown box
      (Subtotal / Shipping $4.99 / discount line shown only when `discount > 0` / Total), mirroring the cart
      page's existing box structure.
- [ ] On successful order placement, also reset local `discount`/`code`/`couponError` alongside the existing
      `resetCoupon()` call.
- [ ] No change needed to the existing order-submit `catch` block — it already surfaces
      `err?.response?.data?.message` verbatim, so a commit-time coupon failure (e.g. someone else claimed the
      last usage slot between preview and submit) will automatically show the right message with zero extra
      frontend work.

## 8. Shared components/hooks — no changes needed

- [x] `hooks/useApi.ts` generics (`useFetchData`/`usePost`/`usePatch`/`useDeleteData`, `{url,payload}` shape) —
      reused unmodified everywhere above.
- [x] `ControlledInput.tsx` — already supports `type="date"`/`type="number"`, confirmed by direct read.
- [x] `components/ui/alert-dialog.tsx` delete-confirm pattern — untouched.
- [x] `utils/calculateCartPrice.ts` — reused as-is, just called from a new place (checkout instead of cart).

## Known pre-existing gap (explicitly out of scope for this plan)

- The checkout form already collects street/city/postalCode but **never actually sends them** in the order
  payload (`onSubmit`'s `_data` parameter is unused) — `Order` has no shipping-address field on the backend
  either. This is a separate, larger gap unrelated to coupons; noted here so it isn't confused with something
  this plan silently fixed.
