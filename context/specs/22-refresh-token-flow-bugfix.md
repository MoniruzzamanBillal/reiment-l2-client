# 22: Refresh-Token Flow — Bug Fix (logout doesn't clear the httpOnly refresh cookie)

Status: Discovered while black-box testing spec `21` end-to-end in a real browser (Playwright), after the
server's spec `17` and its own bug-fix (`reiment-l2-server/context/specs/18-refresh-token-flow-bugfix.md`) were
verified working. Fix implemented immediately after being found, same session.

## Bug

`stores/useAuthStore.ts`'s `logout()` only does `Cookies.remove(authKey)` / `Cookies.remove(refreshTokenKey)` /
`Cookies.remove(userIdKey)` via `js-cookie` — a client-side-only operation. Before spec `17`, this was
sufficient because the (dead) `refreshToken` cookie the client removed was never actually set by the server, so
there was nothing real to worry about invalidating. Spec `17` makes the server set a real `refreshToken` cookie
with `httpOnly: true` — and **`js-cookie` (or any client JS) cannot read or clear an `httpOnly` cookie**; only a
server `Set-Cookie` response can. So after spec `17` landed, `logout()`'s `Cookies.remove(refreshTokenKey)` call
became a silent no-op, and the real refresh token keeps living in the browser's cookie jar, fully valid, after
the user "logs out."

**Confirmed via Playwright**: logged in as a seeded customer, navigated to `/dashboard`, clicked "Logout" (the
`Sidebar.tsx` action). After the click: the client-readable `accessToken` cookie was gone (as expected), but
the `refreshToken` cookie was still present in the browser's cookie jar, unchanged. Replaying that exact
`refreshToken` cookie value directly against `POST /auth/refresh-token` via `curl` returned **200** with a
freshly issued, fully usable access token — proof the "logged out" session was never actually terminated
server-side. Since the client's own `axiosInstance.ts` interceptor auto-attaches the refresh cookie via
`withCredentials: true`, this isn't just a curl edge case: if the user (or anyone with access to the browser's
cookie jar) triggered a 401 after "logout," the silent-refresh mutex would transparently re-authenticate them.

## Fix

Two changes, matching the pattern spec `17` already established for `/auth/refresh-token` (a route the server
alone can act on for an `httpOnly` cookie):

1. **Server** (`reiment-l2-server`): new `POST /auth/logout` route + `authController.logout` — clears both
   cookies via `res.clearCookie(...)` with attributes matching how `setAuthCookies` originally set them (same
   `secure`/`sameSite` per `NODE_ENV`, correct `httpOnly` per cookie). No `validateUser` gate (a logout attempt
   with an already-expired/missing access token must still succeed), no service-layer call (nothing to persist
   — clearing cookies is a response-layer concern, matching how `setAuthCookies` itself already lives in the
   controller, not the service).
2. **Client**: `useAuthStore.ts`'s `logout()` now also fires `axiosInstance.post("/auth/logout", {})`
   (best-effort, `.catch(() => {})` — logout must still clear local state and proceed even if the network call
   fails) before its existing `Cookies.remove(...)` calls. Kept the function's existing synchronous signature so
   `Sidebar.tsx`'s `handleLogout` (`logout(); router.push("/")`) didn't need to change — the local
   cookie/store cleanup is still immediate, the server call to actually invalidate the `httpOnly` cookie
   happens in the background.

## Verify

Re-run the same Playwright scenario: log in, navigate to `/dashboard`, click Logout. After logout, both
`accessToken` and `refreshToken` are gone from the browser's cookie jar (confirmed via
`context.cookies()`), and replaying the pre-logout `refreshToken` value against `POST /auth/refresh-token`
now correctly returns 401.
