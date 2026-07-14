# 05: Followed Shops Filter Not Visible Bug

Status: ✅ Complete. Implemented exactly as specified in `app/(public)/products/page.tsx`; `yarn build` passes.

## Goal

Make the "Only shops I follow" checkbox (built for spec `03-followed-shops-filter.md`) actually appear on `/products` for logged-in customers — right now it's permanently invisible to everyone, regardless of login state.

## Context

Reported symptom: on `/products`, the "Only shops I follow" filter never shows up at all.

This is a bug in the original `03-followed-shops-filter.md` implementation itself — a wrong field name. In `app/(public)/products/page.tsx`, all three gates on the feature check `user.role`:

```ts
{ enabled: !!user && user.role === "CUSTOMER" },        // line 60 — gates the /follow/logged-user-data fetch
canFilterFollowed={!!user && user.role === "CUSTOMER"}   // line 281 — desktop sidebar <ProductsFilter>
canFilterFollowed={!!user && user.role === "CUSTOMER"}   // line 319 — mobile sheet <ProductsFilter>
```

But `role` does not exist on the actual decoded JWT user object. Tracing the whole auth pipeline:

- **Backend** (`reiment-l2-server/src/app/modules/auth/auth.util.ts:4`, and `auth.service.ts:53,165,357`): `createToken`'s JWT payload is built as `{ userId, userEmail, userRole }` — there is no `role` key anywhere in the signed token.
- **Frontend decode** (`utils/tokenUtils.ts:4-10`): `decodeToken` does `jwtDecode<TUser>(token)`, returning exactly what's in the JWT payload — so the resulting object has `userRole` populated and `role` always `undefined`.
- `types/index.ts:3-9`'s `TUser` type declares **both** `userRole: string` and `role: string` — `role` is dead/unused, never actually populated by anything that produces a `TUser`. This is presumably what made the mistake easy to make; the type made `.role` look like a valid field.
- Every other call site in the codebase correctly checks `user?.userRole === "..."`, confirmed by grep across: `middleware.ts`, `components/main/Auth/LoginForm.tsx`, `components/shared/Navbar/NavbarTop.tsx`, `components/shared/Sidebar/DashboardLinks.tsx`, `components/shared/cards/ProductCard.tsx`, `components/shared/cards/FlashSaleProductCard.tsx`, `components/main/ProductDetail/ProductDetailPage.tsx`. `products/page.tsx` is the only place in the codebase using `.role` instead of `.userRole`.

Effect: `user.role === "CUSTOMER"` is always `false`, for every user, logged in or not. So:

1. The `/follow/logged-user-data` fetch (line 57-61) is never `enabled` → `followedShopIds` is always `[]`.
2. `canFilterFollowed` is always `false` on both `<ProductsFilter>` usages → the checkbox card's render guard in `components/main/AllProducts/ProductsFilter.tsx` (`{canFilterFollowed && (...)}`) never passes, for anyone.

This fully explains the report: the filter isn't conditionally hidden by role or follow-state, it's unconditionally dead code right now.

## Design

Replace `user.role === "CUSTOMER"` with `user.userRole === "CUSTOMER"` at all three call sites in `app/(public)/products/page.tsx`, matching the established codebase convention exactly — no new pattern introduced.

Note but do not touch as part of this fix: `TUser.role` in `types/index.ts` is dead/unused across the whole codebase. Out of scope here — flagged only as context in case a separate cleanup is wanted later (e.g. removing the field, or renaming it if some other intent existed).

## Implementation

`app/(public)/products/page.tsx`:

1. Line 60: `{ enabled: !!user && user.role === "CUSTOMER" }` → `{ enabled: !!user && user.userRole === "CUSTOMER" }`.
2. Line 281: `canFilterFollowed={!!user && user.role === "CUSTOMER"}` → `canFilterFollowed={!!user && user.userRole === "CUSTOMER"}`.
3. Line 319: same change as line 281 (mobile sheet usage).

No other files need to change.

## Dependencies

None — self-contained, three-line change in one file. No backend change needed.

## Verify

- Logged-out visitor: still sees no checkbox (unchanged).
- Logged-in CUSTOMER following ≥1 shop: checkbox now appears, enabled, narrows results correctly, composes with search/category/price/sort.
- Logged-in CUSTOMER following 0 shops: checkbox now appears but disabled, with "Follow a shop to use this filter" helper text.
- Logged-in VENDOR/ADMIN: still sees no checkbox (role gate correctly still excludes them).
- "Reset Filters" / chip clear still turns the toggle off.
