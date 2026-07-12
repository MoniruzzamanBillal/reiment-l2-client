# 02: Coupon Feature (Frontend)

Status: ⛔ Not started. Full checklist lives in root `coupon-implementation-plan.md` for both repos — this is a condensed summary, not a replacement for it.

## Goal

Make checkout coupon application actually work, and reflect the backend's new date-range/usage-limit/per-user-use rules with correct messaging.

## Context

Today `Coupon` has no date-range fields, `usedCount` is never enforced, there's no per-user usage tracking, and a `cuponId`/`couponId` spelling mismatch between this repo and `reiment-l2-server` means **the discount is never actually applied in production**, despite checkout UI existing for it (`6da5ede feat(coupon): added cupon functionality and coupon in checkout`). This frontend plan depends on the backend plan landing first — don't build UI against the current broken/partial state.

## Design (depends on backend landing)

- Checkout "Apply" button hits the new `POST /apply-coupon` preview endpoint (replacing the old mismatched call), surfacing the exact error message strings the backend returns (not-found / not-yet-active / expired / usage-limit / already-used) verbatim via `sonner` toast.
- Fix the `cuponId` → `couponId` key at the actual order-placement call site (`useCouponStore` and wherever `order-item` is posted) — this is the root cause of the discount never applying.
- Order placement (commit step) re-validates atomically server-side; the client should treat a late failure here (e.g. limit reached between preview and submit) the same way as any other order-placement error — toast + stay on checkout, don't optimistically clear the cart.
- Admin coupon management forms (add/update) need `startDate`/`endDate` fields once the backend adds them.

## Implementation (sketch — finalize once backend spec is confirmed landed)

1. Rename/fix the `cuponId` key wherever it's read/sent for checkout (`useCouponStore.ts`, checkout page/component).
2. Point the "Apply" flow at `POST /coupon/apply-coupon`, display returned `discountValue`/errors.
3. Add `startDate`/`endDate` date pickers (`react-day-picker`, already a dependency) to the admin add/update coupon forms.
4. Surface the backend's specific error messages (expiry date, usage limit, already-used) without rewording them client-side.

## Dependencies

Backend: full rewrite per `reiment-l2-server/coupon-implementation-plan.md` (schema migration, `CouponUsage` model, atomic `usedCount` claim, `couponId` fix in `order.service.ts`).

## Verify

- Applying a valid, in-range, under-limit coupon actually reduces the order total end-to-end (not just in the UI preview).
- Expired/not-yet-active/limit-reached/already-used coupons show the specific backend message, not a generic error.
- Admin can set/edit a coupon's date range from the dashboard.
