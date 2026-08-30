# 18: Bug & Security Audit

Status: 📝 Planned, awaiting user review/approval. No code changed yet. This is not a single feature spec like the others in this folder — it's a catalog of independent findings from a full-repo audit, each with its own proposed fix. Pick and implement whichever findings you want, in whatever order; they don't depend on each other unless a finding's "Depends on" line says so.

## Goal

Catalog every concrete bug, security hole, and correctness gap found in a full pass over `app/`, `components/`, `hooks/`, `stores/`, `lib/`, `middleware.ts`, ordered critical → low, so they can be triaged and fixed incrementally without losing track of what's been found.

## How to use this document

Each finding has: **Location** (file:line), **Problem** (the actual offending code + why it's wrong), **Impact** (concrete failure scenario), and **Fix** (a proposed implementation approach — not just "this is broken"). Nothing here has been changed in code yet.

---

## Critical

### C1. `envConfig.ts` hardcoded to `localhost:5000` — breaks every deployed environment

**Location:** `config/envConfig.ts:1-9` (verified directly)

**Problem:**
```ts
export const baseURL = "http://localhost:5000";
// export const baseURL = "http://localhost:3000";
// export const baseURL = "https://reiment-l2-server.vercel.app";

export const getBaseUrl = (): string => {
  return `${baseURL}/api`;
  // return process.env.NEXT_PUBLIC_API_BASE_URL || `${baseURL}/api`;
};
```
The `NEXT_PUBLIC_API_BASE_URL` read is commented out. Every build — local, staging, or a real Vercel production deploy — currently resolves the API base to `http://localhost:5000/api`. This directly contradicts `architecture.md`'s documented invariant that `envConfig.ts` is "the single place `NEXT_PUBLIC_API_BASE_URL` is resolved."

**Impact:** A production build of this app cannot reach the real API at all — literally every request goes to `localhost:5000`, which doesn't exist in a deployed environment.

**Fix:** Restore the env-var read: `return process.env.NEXT_PUBLIC_API_BASE_URL || \`${baseURL}/api\`;`, keep `baseURL` as the local-dev fallback only. Delete the dead commented-out alternates.

---

### C2. `axiosInstance.ts`'s refresh-token call is hardcoded to a second, separate localhost URL

**Location:** `lib/axiosInstance.ts:72-76` (verified directly)

**Problem:**
```ts
const response = await axios.post(
  "http://localhost:5000/api/auth/refresh-token",
  { refreshToken },
  { withCredentials: true },
);
```
This bypasses `getBaseUrl()`/`config/envConfig.ts` entirely — even after fixing C1, this one call site would still silently point at localhost in production.

**Impact:** The entire "silent refresh + retry on 401" flow is non-functional outside local dev, independent of C1.

**Fix:** Replace the hardcoded string with `` `${getBaseUrl()}/auth/refresh-token` ``, importing `getBaseUrl` from `@/config/envConfig` (already imported in this file for the main `instance`).

**Depends on:** See C3 below — fixing the URL alone isn't sufficient; the endpoint this points at doesn't exist on the server today at all.

---

### C3. The refresh-token endpoint this code calls does not exist on the server

**Location:** `lib/axiosInstance.ts:70-88` (client side); server-side confirmed via `grep -rn "refresh-token" reiment-l2-server/src` returning **zero matches** — there is no `/auth/refresh-token` route, controller, or service anywhere in the server repo.

**Problem:** The client's 401-refresh flow reads a `refreshToken` cookie (`getCookies(refreshTokenKey)`) and POSTs it to `/auth/refresh-token`, expecting back `response.data.data.accessToken`. No such endpoint is implemented server-side, so this call resolves as a 404 today. On top of that, `refreshTokenKey` is never `Cookies.set(...)` anywhere client-side either (confirmed via `grep -rln "refreshTokenKey"` — only ever removed, in `stores/useAuthStore.ts:25` and `lib/axiosInstance.ts:94` — `LoginForm.tsx:47` only sets `authKey`, the access token).

**Impact:** Every access-token expiry currently results in an immediate hard logout (the `catch` branch at `axiosInstance.ts:89-101` fires: cookies cleared, toast shown, `window.location.href = "/login"`) instead of the silent-refresh UX the code is written to provide. Users get logged out on token expiry with no recovery, mid-session, on every device.

**Fix:** This needs a real, coordinated implementation across both repos, not a client-only patch:
1. **Server** (see server spec `14`'s finding M4 for the server-side half of this): build `POST /auth/refresh-token` — issue a long-lived refresh token at login (httpOnly, `secure: true` cookie — not `js-cookie`-readable, to avoid the XSS-to-session-theft chain in C4), verify it server-side, issue a new short-lived access token.
2. **Client:** stop reading `refreshTokenKey` via `getCookies`/`js-cookie` (it can't read an httpOnly cookie anyway) — rely on `withCredentials: true` to send the httpOnly refresh cookie automatically, matching how the fixed server endpoint should read it.
3. Recommend scoping this as its own new spec (e.g. `19-refresh-token-flow.md`, paired with server spec `15`) once both repos are ready to implement it together, since it's a cross-repo feature, not a one-line fix.

---

### C4. Stored XSS via unsanitized vendor-controlled product descriptions on public pages

**Location:** `components/main/ProductDetail/ProductDetailPage.tsx:171-174`, `components/main/ComparisonProduct/ComparisonProduct.tsx:298`

**Problem:**
```tsx
// ProductDetailPage.tsx
<div
  className="productDetail text-gray-600 text-sm leading-relaxed"
  dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
/>
```
```tsx
// ComparisonProduct.tsx
<div
  className="line-clamp-5 leading-relaxed prose prose-sm max-w-none"
  dangerouslySetInnerHTML={{ __html: product.description }}
/>
```
`product.description` is vendor-authored TipTap rich text, rendered raw on public, no-login-required pages. No sanitization library exists in `package.json` (`grep -i "sanitize\|dompurify" package.json` → nothing), and there's no server-side sanitization documented either.

**Impact:** A malicious or compromised vendor account can inject `<script>`/`onerror=` payloads into a product description that execute in every visitor's browser on that product page. Since `authKey` is a plain (non-httpOnly) `js-cookie` cookie (`LoginForm.tsx:47`), this is directly exploitable to read `document.cookie` and hijack a logged-in customer's or admin's session when they view the poisoned product page.

**Fix:**
1. Add `dompurify` (`isomorphic-dompurify` for SSR compatibility with Next.js), and wrap both `dangerouslySetInnerHTML` call sites: `{ __html: DOMPurify.sanitize(product?.description ?? "") }`.
2. This is a client-side mitigation only — also worth flagging to the server side that rich-text fields like this should ideally be sanitized on write too (defense in depth), though that's out of scope for this repo's fix.

---

## High

### H1. Middleware force-redirects to `/login` on any route when token parsing fails — even public routes

**Location:** `middleware.ts:19-48`

**Problem:**
```ts
if (token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"));
    ...
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(authKey);
    return response;
  }
}
```
The `try`/`catch` around JWT decoding runs for **any** route whenever the `accessToken` cookie is present — it's not gated by whether the route is actually protected (`isProtected`).

**Impact:** If a user's cookie is truncated, tampered, or otherwise fails to parse (browser bug, manual cookie edit, a race with the C3 refresh flow leaving a partial cookie), they get force-redirected to `/login` from the homepage, `/products`, or any other public page — pages that never required auth in the first place.

**Fix:** Only redirect-and-clear on a decode failure when `isProtected` is true for the current route; on a public route, just clear the bad cookie and `NextResponse.next()` through instead of hard-redirecting.

---

### H2. No JWT expiry (`exp`) check in middleware

**Location:** `middleware.ts` (role-gating logic)

**Problem:** The middleware decodes `payload.userRole` for role-gating but never checks `payload.exp`.

**Impact:** An expired access token still passes middleware and grants edge-level access to role-gated dashboard routes; only a subsequent API call would 401 — and per C3, the refresh-and-retry that's supposed to recover from that is itself broken today.

**Fix:** After decoding, check `payload.exp * 1000 < Date.now()` and treat an expired token the same as a missing one (redirect on protected routes per the corrected H1 logic).

---

### H3. No mutex on concurrent 401 refresh — thundering herd + duplicate redirects

**Location:** `lib/axiosInstance.ts:66-102`

**Problem:** `_retry` only guards a single request from retrying itself twice; there's no shared "a refresh is already in flight" flag/promise. If N requests 401 concurrently (e.g. a dashboard page firing several parallel queries right as the token expires), all N independently call the refresh endpoint and, on failure, all N independently call `toast.error(...)` + `window.location.href = "/login"`.

**Impact:** Duplicate refresh calls at best; at worst, once C3 is fixed and refresh tokens rotate/single-use, concurrent refresh calls can race and cause some requests to fail even though the first refresh succeeded — spurious logouts.

**Fix:** Add a module-level `let refreshPromise: Promise<string> | null = null;` — the first 401 kicks off the refresh and stores the promise; subsequent concurrent 401s await the same `refreshPromise` instead of starting their own. Clear it once resolved/rejected.

---

### H4. Zustand auth-store token goes stale after a silent refresh

**Location:** `stores/useAuthStore.ts`, `lib/axiosInstance.ts:83-87`, `hooks/useOrderPusher.ts:14,37-47`

**Problem:** The refresh-success path only updates the `accessToken` **cookie** (`Cookies.set(authKey, ...)`); it never calls into `useAuthStore` to update `token`. Any consumer reading `token` from the Zustand store (rather than re-reading the cookie) keeps using the pre-refresh, soon-to-expire token. `useOrderPusher.ts` does exactly this — `const token = useAuthStore((s) => s.token);` is used to build the Pusher client's `auth.headers.Authorization`, with no `pusher:subscription_error`/connection-error handler bound anywhere in the file to catch or recover from an auth failure.

**Impact:** After the first silent refresh, Pusher's private-channel auth (`/pusher/auth`) keeps sending an expired token, silently breaking realtime order/inventory notifications with no visible error.

**Fix:** In `axiosInstance.ts`'s refresh-success path, also call `useAuthStore.getState().setAuth({ token: newAccessToken, ... })` (or whatever the store's setter is named) so every consumer — Zustand-based or cookie-based — sees the refreshed token. Also add a `pusher:subscription_error` bind in `useOrderPusher.ts` to at least log/retry rather than silently failing.

---

### H5. Vendor product forms allow negative price/discount/inventory

**Location:** `components/main/(Vendor)/Products/form/AddProduct.tsx:182,188,193`, `UpdateProduct.tsx:218,224,229`

**Problem:**
```tsx
<Input id="price" type="number" ... {...register("price", { valueAsNumber: true, required: "Price is required" })} />
...
<Input id="discount" type="number" ... {...register("discount", { valueAsNumber: true })} />
...
<Input id="inventoryCount" type="number" ... {...register("inventoryCount", { valueAsNumber: true, required: "Inventory is required" })} />
```
No `min`/`validate` rule on any of the three. Per `CLAUDE.md`, these forms intentionally skip Zod — but that doesn't mean skipping RHF's own native validation rules.

**Impact:** A vendor can submit a negative price, negative/zero inventory, or a negative discount; the client has no guard and posts it as-is, relying entirely on whatever (currently unverified) backend validation exists.

**Fix:** Add RHF validation rules to all three fields in both forms: `{ valueAsNumber: true, required: "...", min: { value: 0, message: "Must be 0 or greater" } }` (price/inventory should probably require `> 0`, discount `>= 0`).

---

### H6. Logout does not clear the React Query cache

**Location:** `components/shared/Sidebar/Sidebar.tsx:14-17`, `stores/useAuthStore.ts:23-28` (`logout()`)

**Problem:**
```tsx
const handleLogout = () => {
  logout(); // clears cookies + Zustand user/token only
  router.push("/"); // soft navigation — QueryClient instance survives
};
```
`logout()` never calls `queryClient.clear()`/`removeQueries()`.

**Impact:** Because `router.push` is a client-side soft navigation, the singleton `QueryClient`'s cache (cart, order history, vendor products — none keyed by user id) survives logout. If a second user logs in on the same browser/tab without a full reload, stale previous-user data can flash from cache before it's invalidated.

**Fix:** In `handleLogout` (or better, inside `useAuthStore`'s `logout()` itself if the store has access to the query client, e.g. via a passed-in `queryClient` param or a top-level `queryClient.clear()` call in the component right after `logout()`), clear the query cache before or immediately after clearing auth state.

---

## Medium

### M1. Duplicate `useDebounce` hook files

**Location:** `hooks/useDebounce.ts` and `hooks/useDebounce.tsx` — byte-identical bodies (both export `function useDebounce(value: string, delay: number)`)

**Problem:** `NavbarTop.tsx:11` imports from `@/hooks/useDebounce` (ambiguous between the two), `hooks/useSearchDebounce.ts:2` imports from `./useDebounce`.

**Impact:** Confusing dead weight today; a landmine if a future edit updates only one of the two files and callers silently diverge in behavior.

**Fix:** Delete one (keep `.ts`, since it's not actually using JSX), confirm both current import sites resolve correctly afterward.

---

### M2. `useApi.ts`'s `useGet` has mistyped generics and is unused; `useFetch_Legacy`/`useUpdateData` also unused

**Location:** `hooks/useApi.ts:63-92`

**Problem:**
```ts
export const useGet = <T = unknown>(
  endpoint: string, queryKey: string[], queryParams?, options?,
) => {
  ...
  return useQuery<IGenericResponse<T>, IGenericResponse<T>, string[]>({ ... });
};
```
TanStack's generic order is `<TQueryFnData, TError, TData, TQueryKey>` — here `TError` is set to `IGenericResponse<T>` (should be `Error`, matching `useFetchData`'s own convention) and `TData` is set to `string[]`, which doesn't match the real runtime shape. `grep -rln "useGet("` across the repo → zero call sites; same for `useFetch_Legacy`/`useUpdateData`.

**Impact:** Currently harmless (dead code), but a landmine — the name `useGet` is a natural thing to reach for given `useFetchData` also exists, and whoever uses it next inherits broken type inference.

**Fix:** Either delete all three unused exports, or fix `useGet`'s generic order to match `useFetchData`'s pattern if it's meant to stay as an alternative.

---

### M3. `AllProducts` swallows fetch errors into a misleading "no products match" empty state

**Location:** `components/main/AllProducts/AllProducts.tsx:88-112`

**Problem:**
```ts
const { data: allProducts, isLoading } = useFetchData<TProductResponse[]>([...], url);
...
const products: TProductResponse[] = smartSearchActive ? smartProducts : ((allProducts as any)?.data?.data ?? []);
```
Only `isLoading` is destructured; `isError`/`error` are ignored.

**Impact:** On a genuine fetch failure (network error, 500), `products` silently becomes `[]` and the UI renders "No products match your filters" with a "Reset Filters" CTA — actively misleading the user into thinking their filters are too narrow rather than that the request failed.

**Fix:** Destructure `isError` from `useFetchData` and render a distinct error state (e.g. "Something went wrong loading products, try again") instead of falling through to the empty-filters state.

---

### M4. Pusher env vars read via raw `process.env` instead of `config/envConfig.ts`

**Location:** `hooks/useOrderPusher.ts:38,40`

**Problem:**
```ts
const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string, ... }
);
```
Violates `architecture.md`'s "env vars are centralized via `config/envConfig.ts`" invariant, and both `as string` assertions mean a genuinely missing env var constructs `Pusher` with the literal string `"undefined"` rather than failing fast/legibly.

**Fix:** Add `pusherKey`/`pusherCluster` exports to `config/envConfig.ts` (matching the pattern used for the API base URL, once C1 restores it properly) with an explicit presence check that throws or logs clearly if missing, and import from there instead.

---

### M5. Inconsistent access-token cookie expiry (7d login vs 1d refresh)

**Location:** `components/main/(Auth)/Login/LoginForm.tsx:47` vs `lib/axiosInstance.ts:83-85`

**Problem:** Login sets `Cookies.set(authKey, token, { expires: 7 })`; the refresh-success path sets `Cookies.set(authKey, ..., { expires: 1 })`.

**Impact:** Minor UX inconsistency — effective session length silently shrinks from 7 days to 1 day the moment any silent refresh occurs (once C3 makes refresh actually work).

**Fix:** Use the same expiry value in both places — pick one intended session length and apply it consistently, ideally driven by the actual access-token `exp` claim rather than a separately-guessed cookie `expires` value.

---

## Low / Cleanup

- **L1. Non-keyboard-accessible logout control.** `components/shared/Sidebar/Sidebar.tsx:34-40` — a `<div onClick={handleLogout}>` with no `role="button"`, `tabIndex`, or key handler. Fix: convert to a real `<button>`, or add `role="button" tabIndex={0]` + `onKeyDown` handling for Enter/Space.
- **L2. Confirmed-still-dead components.** `components/common/GenericTable.tsx` and all of `components/shared/table/*` have zero import references anywhere (`grep -rln` confirms). Matches `progress-tracker.md`'s existing note that these were deliberately left untouched — not a new finding, just confirmed still true. Fold into any future cleanup pass rather than acting on it alone.
- **L3. Vestigial unused `userIdKey`.** `constants/storageKey.ts` — `userIdKey` ("userId") is set nowhere, only ever removed (`stores/useAuthStore.ts:26`, `lib/axiosInstance.ts:95`). Likely safe to delete along with its removal call sites, but confirm nothing reads it first.
- **L4. Pervasive `any`/`as any` usage.** 91 `: any` hits + 64 `as any` hits across `hooks`/`components`/`lib`/`stores`/`app` (e.g. `AddProduct.tsx:26,37`, `AllProducts.tsx:62,109,112`, `UpdateProduct.tsx:26,28,35,38`). This is exactly what `context/specs/11-code-quality-cleanup-frontend.md` already targets — confirmed still present and pervasive; not a new spec, just evidence this one is still relevant.
