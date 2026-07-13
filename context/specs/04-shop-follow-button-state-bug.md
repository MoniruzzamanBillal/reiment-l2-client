# 04: Shop-Detail Follow Button State Bug

Status: ✅ Complete. Implemented exactly as specified in `app/(public)/shop/[id]/page.tsx`; `yarn build` passes.

## Goal

Make the Follow/Unfollow button on `/shop/[id]` correctly reflect whether the logged-in customer already follows that shop, eliminating the spurious `"You are already following this shop !!!"` error a user hits when clicking "Follow" on a shop they (unknowingly, per the broken UI) already follow.

## Context

Reported symptom: on `/shop/[id]`, clicking "Follow" returns a `400` from the backend with `"You are already following this shop !!!"`.

This is a **frontend-only bug** — the backend (`followerService.followShop`, `reiment-l2-server/src/app/modules/follower/follower.service.ts:21-46`) is behaving correctly: it looks up an existing `Follower` row for `(customerId, shopId)` and rejects a duplicate follow with exactly that message. The bug is that the client never shows "Unfollow" for a shop the customer already follows, so the user keeps clicking "Follow" and keeps hitting the duplicate-follow rejection.

Root cause, in `app/(public)/shop/[id]/page.tsx`:

```ts
type TFollower = { shopId: string };
type TFollowData = { follower: TFollower[] }; // wrong shape — shadows the correct exported type

const { data: userData } = useFetchData<TFollowData>(
  ["loggedUserFollow"],
  "/follow/logged-user-data",
  { enabled: !!user },
);

const followers: TFollower[] = (userData as any)?.data?.follower ?? []; // .data.follower is always undefined
const isFollowing = followers.some((f) => f.shopId === shop?.id); // always false
```

`GET /follow/logged-user-data` (`follower.controller.ts:7-18` → `followerService.getLoggedUserFollowShop`) actually returns `data: Follower[]` — a **plain array** of `{ id, customerId, shopId, shop: { id, name, logo } }`, not an object with a `.follower` key. This is confirmed by three independent places that already use the correct shape:

- `types/index.ts`'s exported `TFollowData` type (`{ id, customerId, shopId, shop }`).
- `app/(dashboard)/dashboard/customer/followed-shops/page.tsx`, which does `useFetchData<TFollowData[]>(["loggedUserFollow"], "/follow/logged-user-data")` and reads `(followData as any)?.data ?? []` directly as an array.
- `app/(public)/products/page.tsx`'s "Only shops I follow" filter (added for spec `03`), which uses the same correct array-shaped pattern against the same `["loggedUserFollow"]` cache key.

Because `shop/[id]/page.tsx` reads a `.follower` property that doesn't exist on the array response, `followers` is always `[]`, so `isFollowing` is always `false` — the Follow button never switches to "Unfollow", even immediately after a successful follow (`handleFollow`'s `userRefetch()` just re-fetches the same wrongly-parsed data). The next click on "Follow" hits the backend's correct duplicate-follow rejection.

Note: `TShopDetailWithProducts.follower: TFollower[]` (the shop-detail endpoint's own embedded field, used only for the `{shop?.follower?.length} followers` count) is unrelated to this bug and is not touched by the fix.

## Design

Drop the local, incorrectly-shaped follow-check types and reuse the real exported `TFollowData` from `@/types`, deriving `isFollowing` directly from the array — mirroring the pattern already used by `followed-shops/page.tsx` and `products/page.tsx`.

## Implementation

`app/(public)/shop/[id]/page.tsx`:

1. Remove `type TFollowData = { follower: TFollower[] };` (the local, wrong one). Keep `type TFollower = { shopId: string }` only if still needed for `TShopDetailWithProducts.follower`, or inline it there.
2. Import `TFollowData` from `@/types`.
3. Change `useFetchData<TFollowData>(...)` to `useFetchData<TFollowData[]>(...)` for the `/follow/logged-user-data` call.
4. Replace:
   ```ts
   const followers: TFollower[] = (userData as any)?.data?.follower ?? [];
   const isFollowing = followers.some((f) => f.shopId === shop?.id);
   ```
   with:
   ```ts
   const followedShops: TFollowData[] = (userData as any)?.data ?? [];
   const isFollowing = followedShops.some((f) => f.shopId === shop?.id);
   ```

No other files need to change.

## Dependencies

None — self-contained single-file frontend fix. No backend change needed; the backend's duplicate-follow rejection is correct behavior and should stay as-is.

## Verify

- Logged-in customer visiting a shop they don't follow: sees "Follow"; clicking it succeeds and the button immediately flips to "Unfollow" (via `userRefetch()`, no page reload needed).
- Reloading the page on an already-followed shop: button shows "Unfollow" on first render (no stale "Follow" flash-then-error).
- Clicking "Unfollow": flips back to "Follow", and a subsequent "Follow" click succeeds (no false-positive duplicate error).
- Guest (logged-out) visitor: "Follow" button is disabled (existing `disabled={followLoading || !user}` behavior, unaffected by this fix); no crash.
- Shop with zero followers: `{shop?.follower?.length ?? 0}` count still renders `0`, unaffected (different field, not touched).
