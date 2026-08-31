# 21: Refresh-Token Flow (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends on `reiment-l2-server/context/specs/17-refresh-token-flow.md` landing first. Closes findings C2, C3, H2, H3, H4 from `context/specs/18-bug-and-security-audit.md`.

## Goal

Fix the client's already-broken refresh-token call (hardcoded dead URL, endpoint that doesn't exist server-side, a refresh-token cookie that's never set, a stale auth store after refresh, no concurrency guard) once the server side actually exists.

## Context

Current state, verified directly:

- `lib/axiosInstance.ts`'s 401 handler POSTs to a **hardcoded** `"http://localhost:5000/api/auth/refresh-token"` (bypasses `getBaseUrl()`/env config — would break in production even once the route exists), reads `refreshTokenKey` cookie which is **never set anywhere** in the client repo, and on success only updates the `authKey` cookie — the Zustand `useAuthStore` token field is never synced, so it goes stale.
- `config/envConfig.ts`'s `baseURL` is a hardcoded literal `"http://localhost:5000"`; the `NEXT_PUBLIC_API_BASE_URL` env fallback is commented out — affects the whole app's API calls, not just refresh.
- The request interceptor's skip-condition checks for a `/auth/signing` substring that never matches the real `/auth/log-in` URL — dead code.
- `middleware.ts` decodes the JWT payload manually with no `exp` check at all.
- Login (`LoginForm.tsx`, `VendorRegisterForm.tsx`) manually sets the `accessToken` cookie with a 7-day expiry — inconsistent with the server's current 20-day token and the refresh path's 1-day expiry.

## Design

Once the server issues the access token via a client-visible `Set-Cookie` and the refresh token via an httpOnly `Set-Cookie` (per spec `17`), the client's job shrinks to: stop manually managing cookie values the server now owns, fix the URL/skip-condition bugs, and add a mutex so concurrent 401s share one refresh call.

## Implementation

1. `config/envConfig.ts` — fix the hardcoded `baseURL`, restore the `NEXT_PUBLIC_API_BASE_URL` env fallback.
2. `lib/axiosInstance.ts`:
   - Refresh call uses `getBaseUrl()` instead of the hardcoded literal.
   - Fix the dead `/auth/signing` skip-condition.
   - Remove the "read `refreshTokenKey` cookie, POST it in body" logic — refresh becomes a bare `POST` relying on the browser auto-attaching the new httpOnly cookie.
   - Add a module-level refresh mutex (`let refreshPromise: Promise<string> | null`) so concurrent 401s share a single in-flight refresh call.
   - After a successful refresh, sync `useAuthStore` (not just the cookie).
   - Remove the manual `Cookies.set(authKey, ..., { expires: 1 })` on refresh-success — the server's `Set-Cookie` now owns TTL.
3. `middleware.ts` — add an `exp` check to the existing manual decode.
4. `components/main/(Auth)/Login/LoginForm.tsx`, `VendorRegisterForm.tsx` — remove the manual `Cookies.set(authKey, token, { expires: 7 })`; keep only `setAuth(user, token)` for the in-memory store.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/17-refresh-token-flow.md`. Recommend landing after specs `19`/`20` (wishlist, export/invoice) since this rewrites the auth path their manual QA also relies on.

## Verify

- Log in in the browser, devtools → Application → Cookies: confirm the refresh cookie shows `HttpOnly` and the access cookie doesn't.
- Force an access-token expiry (temporarily shorten server TTL) and confirm a silent refresh happens with no visible interruption to the user.
- Trigger a burst of near-simultaneous requests during expiry and check the Network tab for exactly one `/refresh-token` call (mutex working, not one per request).
- Test logout clears both cookies and redirects to `/login`.
- Re-run specs `19`/`20`'s manual QA end-to-end once more, since this touches the auth path every request depends on.
