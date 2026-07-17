# 10: Real-Time Order Notifications (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. One of two candidate "depth" features (the other being server spec `07`, payment hardening) — pick one, not both, per the roadmap discussion.

## Goal

Give vendors a live notification when a new order comes in, and customers a live update when their order's status changes, instead of requiring a manual refresh. This is the client half; depends entirely on the server spec (`reiment-l2-server/context/specs/06-realtime-notifications-backend.md`) landing first — specifically its Pusher channel-naming scheme and `/pusher/auth` endpoint.

## Context

Today, order status is only known via a page refetch (`useFetchData` on mount/refetch). The `Order`/`OrderStatus` model already exists and is the natural anchor for this — this spec does not touch order business logic, only adds a live-update layer on top of it. Chosen over the alternative depth feature (payment hardening) when the target roles skew full-stack/frontend-visible rather than backend-infra, since this is the one that's demoable in a screen-share.

The server side of this feature uses **Pusher Channels** rather than a self-hosted Socket.io server (the backend is deployed on Vercel as a stateless serverless function, which can't hold a persistent Socket.io connection open) — the client accordingly connects with `pusher-js` directly to Pusher's own infrastructure, not to a socket server run by this repo.

## Design

- `pusher-js` client SDK, one connection established after login, configured with `NEXT_PUBLIC_PUSHER_KEY`/`NEXT_PUBLIC_PUSHER_CLUSTER` (added to `.env.local`, read through the existing `utils/config/envConfig.ts` pattern) and `authEndpoint` pointing at the server's `POST /pusher/auth`, sending `Authorization: Bearer <token>` in the auth request headers (same token-attachment shape the Axios instance already uses from the `accessToken` cookie, though this call goes through `pusher-js`'s own auth mechanism rather than `axiosInstance`).
- Vendor dashboard: subscribe to `private-vendor-<shopId>`; bind `new-order` → show a toast (reusing the existing `sonner` toast pattern already used throughout the app, e.g. `handleUnfollow`'s `toast.loading`/`toast.success`) and a live-updating order count/badge.
- Customer order-history/detail page: subscribe to `private-customer-<userId>`; bind `order-status-changed` → toast + in-place status update without a manual refetch, using React Query's `queryClient.setQueryData` or `invalidateQueries` on the relevant `["orders", ...]` key.
- No new Zustand store needed — connection lifecycle lives in a small hook, `hooks/useOrderPusher.ts`, following the existing pattern of thin one-off hooks (`hooks/useAi.ts`) rather than introducing a new state-management layer.

## Implementation

1. Add `pusher-js` dependency.
2. Add `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` to `.env.local`, wired through `utils/config/envConfig.ts`.
3. `hooks/useOrderPusher.ts` — connects and subscribes to the role-appropriate private channel on mount (guarded by `!!user`), unsubscribes/disconnects on unmount, exposes nothing but side effects (toast + query cache updates); mirrors the auth-gating already used by `useFetchData(..., { enabled: !!user })` calls elsewhere.
4. Wire the hook into the vendor dashboard order list page and the customer order-history/detail page.
5. Reuse existing `sonner` toast calls for the visible notification, and existing React Query keys for the underlying data so no new caching pattern is introduced.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/06-realtime-notifications-backend.md` landing first (needs the Pusher channel-naming scheme and a working `/pusher/auth` endpoint). No other frontend spec blocks this.

## Verify

- Placing an order as a customer triggers a visible, live notification on the relevant vendor's dashboard without a page refresh.
- A vendor/admin changing an order's status triggers a visible, live update on the customer's order page without a page refresh.
- Logging out cleanly disconnects/unsubscribes the Pusher client (no lingering connection, no notifications after logout).
- Attempting to subscribe to another user's private channel is rejected by the server's `/pusher/auth` (no cross-account leakage) — verifies the client can't just guess a channel name to see someone else's orders.
- No regression to the existing (non-realtime) order flows if the Pusher connection fails — the page should still work via the existing fetch/refetch path, just without live updates.
