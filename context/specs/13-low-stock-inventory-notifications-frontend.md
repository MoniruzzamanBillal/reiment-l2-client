# 13: Low-Stock Inventory Notifications (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends entirely on the server spec (`reiment-l2-server/context/specs/11-low-stock-inventory-notifications-backend.md`) landing first, since there's no `low-stock` event to bind to otherwise.

## Goal

Give a vendor a live toast (and an auto-refreshed product list) when one of their products crosses into low stock, reusing the exact same Pusher connection/channel `useOrderPusher.ts` already opens for `new-order` — no new hook, no new connection.

## Context

`hooks/useOrderPusher.ts` (spec `10`) already opens one `pusher-js` connection per vendor session, subscribed to `private-vendor-<shopId>`, with a `new-order` binding inside its `if (isVendor) { ... }` branch. The server's spec `11` fires a new `low-stock` event on that identical channel — so the frontend change is additive to that existing branch, not a new subscription.

## Design

- Inside `useOrderPusher.ts`'s existing `if (isVendor) { ... }` block, add `channel.bind("low-stock", (data) => { ... })` right alongside the existing `new-order` bind.
- On receipt: `toast.error(\`Low stock: ${data.productName} has only ${data.inventoryCount} left!\`)`(reusing the existing`sonner`import already in this file) and`queryClient.invalidateQueries({ queryKey: ["vendorProducts", shopId ?? ""] })`— this exact query key/shape is what`app/(dashboard)/dashboard/vendor/manage-products/page.tsx` already uses for its product list.
- Call `useOrderPusher()` from `manage-products/page.tsx` as well (currently only called from `order-history/page.tsx`), so a vendor browsing their product list gets the live alert too, not only while sitting on order history. Safe to have both pages open simultaneously — each page mount independently manages its own Pusher connection and tears it down on unmount, per the hook's existing `useEffect` cleanup.

## Implementation

1. `hooks/useOrderPusher.ts` — add the `low-stock` bind inside the existing vendor branch, no new imports beyond what's already there.
2. `app/(dashboard)/dashboard/vendor/manage-products/page.tsx` — call `useOrderPusher()` at the top of the component, same one-line pattern used in `order-history/page.tsx`.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/11-low-stock-inventory-notifications-backend.md` landing first (needs the `low-stock` event and its payload shape: `{ productId, productName, inventoryCount }`). No other frontend spec blocks this.

## Verify

- Placing an order that drops a product below the server's low-stock threshold shows a live "Low stock" toast on the vendor's `manage-products` page (and/or `order-history` page, if both open) without a manual reload.
- The product list on `manage-products` reflects the updated `inventoryCount` after the toast, via the existing table refetch — no new caching pattern introduced.
- Logging out or navigating away still cleanly disconnects the Pusher client (existing cleanup logic in `useOrderPusher.ts`, unchanged).
- No regression to the existing `new-order` toast/behavior on `order-history`.
