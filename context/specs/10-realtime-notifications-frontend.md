# 10: Real-Time Order Notifications (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. One of two candidate "depth" features (the other being server spec `07`, payment hardening) — pick one, not both, per the roadmap discussion.

## Goal

Give vendors a live notification when a new order comes in, and customers a live update when their order's status changes, instead of requiring a manual refresh. This is the client half; depends entirely on the server spec (`reiment-l2-server/context/specs/06-realtime-notifications-backend.md`) landing first, since there's no socket server to connect to otherwise.

## Context

Today, order status is only known via a page refetch (`useFetchData` on mount/refetch). The `Order`/`OrderStatus` model already exists and is the natural anchor for this — this spec does not touch order business logic, only adds a live-update layer on top of it. Chosen over the alternative depth feature (payment hardening) when the target roles skew full-stack/frontend-visible rather than backend-infra, since this is the one that's demoable in a screen-share.

## Design

- `socket.io-client`, one connection established after login (JWT passed as `auth` payload to the socket handshake, mirroring how the Axios instance already attaches the token from the `accessToken` cookie).
- Vendor dashboard: subscribe to a `new-order` event scoped to the vendor's shop; show a toast (reusing the existing `sonner` toast pattern already used throughout the app, e.g. `handleUnfollow`'s `toast.loading`/`toast.success`) and a live-updating order count/badge.
- Customer order-history/detail page: subscribe to `order-status-changed` for their own orders; toast + in-place status update without a manual refetch, using React Query's `queryClient.setQueryData` or `invalidateQueries` on the relevant `["orders", ...]` key.
- No new Zustand store needed — connection lifecycle lives in a small hook (`hooks/useOrderSocket.ts` or similar), following the existing pattern of thin one-off hooks (`hooks/useAi.ts`) rather than introducing a new state-management layer.

## Implementation

1. Add `socket.io-client` dependency.
2. `hooks/useOrderSocket.ts` — connects on mount (guarded by `!!user`), disconnects on unmount, exposes nothing but side effects (toast + query cache updates); mirrors the auth-gating already used by `useFetchData(..., { enabled: !!user })` calls elsewhere.
3. Wire the hook into the vendor dashboard order list page and the customer order-history/detail page.
4. Reuse existing `sonner` toast calls for the visible notification, and existing React Query keys for the underlying data so no new caching pattern is introduced.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/06-realtime-notifications-backend.md` landing first (needs a running Socket.io server emitting the two events above). No other frontend spec blocks this.

## Verify

- Placing an order as a customer triggers a visible, live notification on the relevant vendor's dashboard without a page refresh.
- A vendor/admin changing an order's status triggers a visible, live update on the customer's order page without a page refresh.
- Logging out cleanly disconnects the socket (no lingering connection, no notifications after logout).
- No regression to the existing (non-realtime) order flows if the socket fails to connect — the page should still work via the existing fetch/refetch path, just without live updates.
