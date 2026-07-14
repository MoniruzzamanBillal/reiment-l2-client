# 06: Unfollow Shop 404 Bug

Status: ✅ Complete. Implemented exactly as specified in `hooks/useApi.ts`, `utils/api.ts`, `app/(public)/shop/[id]/page.tsx`, and `app/(dashboard)/dashboard/customer/followed-shops/page.tsx`; `yarn build` passes.

## Goal

Make "Unfollow" work correctly from both places it's triggered — the shop detail page (`/shop/[id]`, where the reported 404 happens) and the customer's "Followed Shops" dashboard list (found to have the same root cause during investigation, currently masked by a different error) — without changing the server, which is already correct and consistent with `follow-shop`'s body-based contract.

## Context

Reported symptom: on `/shop/[id]`, clicking "Unfollow" returns:

```json
{
  "success": false,
  "message": "API NOT FOUND!",
  "error": {
    "path": "/api/follow/unfollow-shop/<id>",
    "message": "Your requested path is not found!"
  }
}
```

### Server contract

`reiment-l2-server/src/app/modules/follower/follower.route.ts:22-27` (mounted at `/api/follow` via `src/app/router/index.ts`):

```ts
router.delete(
  "/unfollow-shop",
  validateUser(UserRole.CUSTOMER),
  followerController.unfollowShop,
);
```

This is a **literal path with no `:id`/param segment at all**. `follower.controller.ts:36-40`'s `unfollowShop` reads the shop id from **`req.body?.shopId`** (mirroring `followShop`, which also reads `req.body?.shopId`), then `follower.service.ts`'s `unfollowShop(shopId, userId)` deletes the `Follower` row by composite key `(customerId, shopId)`. So the real contract is: **`DELETE /api/follow/unfollow-shop` with JSON body `{ shopId }`** — nothing in the URL.

### Client is broken in two different ways, both stemming from the same underlying gap

1. **`app/(public)/shop/[id]/page.tsx:75-80`** (`handleUnfollow`, the reported bug):

   ```ts
   const result: any = await unfollowMutate({
     url: `/follow/unfollow-shop/${shop?.id}`,
   });
   ```

   Puts the shop id as a **URL path segment**. The server has no route matching `/unfollow-shop/:anything` → Express falls through to the catch-all 404 handler → exactly the reported `"API NOT FOUND!"` error.

2. **`app/(dashboard)/dashboard/customer/followed-shops/page.tsx:22-27`** (`handleUnfollowShop`) — not reported by the user, but discovered while tracing the same bug family:

   ```ts
   const result: any = await unfollowMutate({
     url: `/follow/unfollow-shop?shopId=${shopId}`,
   });
   ```

   This _does_ match the route (query strings don't affect Express path matching), but the controller reads `req.body.shopId`, not `req.query.shopId` — so it fails differently: the backend throws `"You are not following this shop !!!"` even when the user does follow the shop, since `shopId` is `undefined` server-side.

### Deeper root cause — the shared hook never sends a request body on DELETE

- `hooks/useApi.ts:156-175` — `useDeleteData`'s `mutationFn` type is `(params: { url: string }) => apiDelete(params.url)` — no `payload` field exists at all, unlike `usePost`/`usePatch` which both accept `{ url, payload }`.
- `utils/api.ts:24-27` — `apiDelete(endPoint)` calls `axiosInstance.delete(endPoint)` with no body/`data` config — so **no DELETE call anywhere in the app can currently send a request body**.

Both unfollow call sites are workarounds for this gap (one stuffing the id into the URL path, the other into the query string) rather than fixes for it — and neither actually satisfies the server's `req.body.shopId` contract.

## Design

Extend the shared `useDeleteData`/`apiDelete` pair to optionally accept a `payload`, mirroring the existing `usePost`/`apiPost` and `usePatch`/`apiPatch` shape exactly (`{ url, payload }` → `axiosInstance.delete(endPoint, { data: payload })`). No new pattern is introduced, and every other existing DELETE call site in the app (which pass no payload today) is unaffected since `payload` stays optional. Then fix both unfollow call sites to hit the plain `/follow/unfollow-shop` path and pass `{ shopId }` as the payload — matching how `handleFollow`/`follow-shop` already sends `{ shopId }` in its body.

## Implementation

1. **`hooks/useApi.ts`** — widen `useDeleteData`'s `mutationFn` param type from `{ url: string }` to `{ url: string; payload?: Record<string, unknown> }`, and pass `payload` through to `apiDelete`.
2. **`utils/api.ts`** — widen `apiDelete` from `(endPoint: string)` to `(endPoint: string, payLoad?: any)`, calling `axiosInstance.delete(endPoint, { data: payLoad })`.
3. **`app/(public)/shop/[id]/page.tsx:78-80`** — change:
   ```ts
   const result: any = await unfollowMutate({
     url: `/follow/unfollow-shop/${shop?.id}`,
   });
   ```
   to:
   ```ts
   const result: any = await unfollowMutate({
     url: "/follow/unfollow-shop",
     payload: { shopId: shop?.id },
   });
   ```
4. **`app/(dashboard)/dashboard/customer/followed-shops/page.tsx:25-27`** — change:
   ```ts
   const result: any = await unfollowMutate({
     url: `/follow/unfollow-shop?shopId=${shopId}`,
   });
   ```
   to:
   ```ts
   const result: any = await unfollowMutate({
     url: "/follow/unfollow-shop",
     payload: { shopId },
   });
   ```

No other files need to change.

## Dependencies

None — frontend-only, no backend change needed (the server's body-based contract is already correct and consistent with `follow-shop`). `useDeleteData` is a shared generic used elsewhere in the app, but the change is purely additive (`payload` is optional), so no other existing caller is affected.

## Verify

- On `/shop/[id]`: Follow succeeds, button flips to "Unfollow"; clicking "Unfollow" now succeeds (no more `"API NOT FOUND!"`) and the button flips back to "Follow".
- On the customer dashboard "Followed Shops" page: removing a shop from the list now actually succeeds (no more spurious `"You are not following this shop !!!"`), and the shop disappears from the list.
- Re-following a shop after unfollowing it works cleanly (no false-positive duplicate-follow or duplicate-unfollow errors), consistent with the fix already landed in `04-shop-follow-button-state-bug.md`.
- Any other existing `useDeleteData` call sites in the app (grep for `useDeleteData` usages) continue to work unchanged, since `payload` is optional and defaults to `undefined`.
