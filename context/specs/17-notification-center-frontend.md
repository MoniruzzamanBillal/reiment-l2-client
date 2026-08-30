# 17: Persistent Notification Center (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends on server spec `13`.

## Goal

A bell-icon dropdown in the navbar showing notification history (not just live toasts), with unread
count and mark-as-read/mark-all-read.

## Context

`hooks/useOrderPusher.ts` already binds `new-order`/`order-status-changed`/`low-stock` to a `sonner`
toast plus `queryClient.invalidateQueries`, but that state is never persisted or visible after the toast
disappears. `components/shared/Navbar/` is the natural home for a notification bell, matching where the
ChatWidget and other shared cross-feature UI live.

## Design

- New `components/shared/Navbar/NotificationBell.tsx` (or a small `Notifications/` subfolder if it grows
  a dropdown + list + item components): bell icon with an unread-count badge, dropdown listing recent
  notifications, "mark all read" action.
- Data via `useFetchData<TNotification[]>(["notifications"], "/notification/my-notifications")` for the
  list, `usePatch` for `/notification/:id/read` and `/notification/mark-all-read`.
- In `hooks/useOrderPusher.ts`, alongside the existing toast + `invalidateQueries` calls for each bound
  event, also call `queryClient.invalidateQueries(["notifications"])` (or prepend optimistically) so the
  bell updates live without a manual refetch.
- Add `TNotification` to `types/index.ts` (cross-feature type, used by the navbar and nowhere
  feature-specific).

## Implementation

1. `types/index.ts` — add `TNotification`.
2. `components/shared/Navbar/NotificationBell.tsx` (+ subcomponents if needed).
3. Wire `NotificationBell` into the existing `Navbar` component.
4. Extend `hooks/useOrderPusher.ts`'s three existing event bindings to also invalidate `["notifications"]`.

## Dependencies

Depends on server spec `13` (`Notification` model + endpoints) being implemented first.

## Verify

- Logged in as a vendor/customer, the bell shows real unread notifications from past events (not just
  ones fired while the tab was open); mark-as-read persists across a page reload.
- `yarn build`/`yarn lint` clean; manual browser check, no console errors.
