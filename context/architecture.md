# Architecture

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Framework** | Next.js 16 (App Router), React 19 | Routing, layouts, SSR/CSR, `middleware.ts`. |
| **Language** | TypeScript 5 (strict mode) | Static typing throughout. |
| **Styling** | Tailwind CSS 4 | Utility-first styling, theme via CSS variables in `app/globals.css`. |
| **UI Components** | shadcn/ui (Radix primitives, "new-york" style, neutral base) | Accessible pre-built components in `components/ui/`. |
| **API Client** | Axios (`utils/axiosInstance.ts`) | Single configured instance with request/response interceptors. |
| **Server State** | TanStack React Query 5 (`hooks/useApi.ts`) | Fetching, caching, and mutation of API data. |
| **Client State** | Zustand 5 (`stores/`) | Auth/comparison/coupon/chat/recent-products UI state, several persisted to `localStorage`. |
| **Forms** | React Hook Form 7 (+ Zod 4 for auth flows only) | Form state and validation. |
| **Rich Text** | TipTap 3 | Product description editing (vendor). |
| **Tables** | TanStack React Table 8 | Admin/vendor management tables (`components/common`). |
| **Charts** | Recharts 3 | Admin dashboard analytics. |
| **Animation** | Framer Motion 12, GSAP 3 | Chat widget panel, marketing-page motion. |
| **Notifications** | Sonner | Toast feedback for async operations. |

## System Boundaries

- `app/(auth)/` — public route group: `login`, `sign-up`, `forgot-password`, `email-reset-confirmation/[email]`, `reset-password/[token]`, `change-password`.
- `app/(public)/` — public storefront route group: `home`, `products` (catalog + filters/search), `product/[id]`, `flash-sale`, `shop`/`shops`, `comparison-product`, `recent-products`, `contact`, `order-success`, and `cart`/`checkout` (these two require login — enforced by `middleware.ts`, not by client-side conditional rendering alone).
- `app/(dashboard)/dashboard/` — protected route group split into `admin/`, `vendor/`, `customer/`, plus shared `update-profile/`. Role-specific pages live under their respective subfolder.
- `middleware.ts` (repo root) — the actual route-protection boundary. Reads the `accessToken` cookie (key from `utils/constants/storageKey.ts`), base64-decodes the JWT payload **without verifying the signature** (signature verification happens server-side only), and redirects: no token + protected route → `/login`; token present but `userRole` mismatches the route's role prefix (`ADMIN_ROUTES`/`VENDOR_ROUTES`/`CUSTOMER_ROUTES`) → `/`; malformed token → clears the cookie and redirects to `/login`. `PROTECTED_ROUTES = ["/dashboard", "/cart", "/checkout"]`; `matcher: ["/dashboard/:path*", "/cart", "/checkout"]`. Keep this matcher and role logic in sync with any new top-level protected route prefix.
- `components/` — `ui/` (shadcn primitives), `main/` (single-page feature composition, e.g. `AllProducts/`, `ProductDetail/`, `HomePage/`, `AdminDashboard/`), `shared/` (reusable cross-feature UI: `Navbar/`, `Footer/`, `Modal/`, `ChatWidget/`, `Sidebar/`, `table/`, `cards/`), `common/` (generic utilities, e.g. `GenericTable`), `providers/` (`AuthBootstrap`).
- `hooks/` — `useApi.ts` (TanStack Query generic wrappers, see below), `useAi.ts` (thin one-liners over `usePost()` for the 3 AI endpoints), `useDebounce`/`useSearchDebounce`, `usePagination`.
- `stores/` — one Zustand store per concern: `useAuthStore`, `useComparisonStore`, `useCouponStore`, `useChatStore`, `useRecentProductsStore`.
- `schemas/` — Zod schemas; today only `auth.schema.ts` (auth flows are the one place this repo uses `zodResolver`).
- `types/index.ts` — one flat file for all shared API request/response types (`TUser`, `TProductResponse`, `TShopDetail`, `TFollowData`, AI types, etc.) — not split per feature.
- `utils/` — `axiosInstance.ts` (the HTTP client), `api.ts` (`apiGet`/`apiPost`/`apiPut`/`apiPatch`/`apiDelete` thin wrappers used by `hooks/useApi.ts`), `buildUrl.ts` (query-string builder, strips `undefined`/`null`/empty-string params), `calculateCartPrice.ts`, `getChangedFields.ts`, `GetCookies.ts`, `tokenUtils.ts`, `constants/storageKey.ts` (cookie key names, e.g. `authKey`), `config/envConfig.ts` (the single place `NEXT_PUBLIC_API_BASE_URL` is resolved).
- `lib/` — `apiResponse.ts` (shared generic response type), `utils.ts` (`cn()`).
- Path alias `@/*` → the `reiment-l2-client/` root (see `components.json` aliases and `tsconfig.json`).

## Storage Model

- **Auth tokens:** access + refresh JWTs stored in cookies (not `localStorage`), key name from `utils/constants/storageKey.ts`.
- **Server state cache:** TanStack Query cache, populated via `hooks/useApi.ts`.
- **Client UI state:** Zustand stores under `stores/`, several persisted to `localStorage` (comparison list, recent products, coupon, chat history) — not a substitute for the Query cache.

## Auth & Access Model

- Login/registration go through the API directly; the response sets the access/refresh JWT cookies. `middleware.ts` decodes the access token client-side (no signature check) purely for route/role gating.
- `utils/axiosInstance.ts` request interceptor attaches `Authorization: Bearer <token>` automatically when the `accessToken` cookie is present, and simply omits it otherwise — public and auth-gated endpoints go through the **same** instance with no special-casing.
- Response interceptor reshapes every response to `{ data: response.data, meta: response.data?.meta }`. Since the server's own envelope is `{ success, message, data }`, this means every consumer does a **double unwrap**: `result.data.data` for the payload, `result.data.message` for the message. Any new hook/component must follow this same shape.
- On `401`, the interceptor silently attempts a refresh-token call and retries the original request once; on refresh failure, it clears the auth cookies and hard-redirects to `/login`.

## Invariants

1. **No raw Axios/fetch in components.** Use `hooks/useApi.ts` (`useFetchData`/`useGet` for GET, `usePost`/`usePatch`/`useUpdateData`/`useDeleteData` for mutations) — there is no per-resource hook file (no `useProducts.ts`); everything wraps these generics and passes `{ url, payload }` at call time.
2. **One Zustand store per concern**, not one giant store — follow the existing `stores/use*Store.ts` naming/shape when adding client state, and don't introduce a second global-state library (Redux, Jotai, etc.) without explicit confirmation.
3. **Zod only for auth forms.** Other forms (vendor product forms, etc.) use plain React Hook Form — match whichever convention the file you're editing already uses; don't introduce a mismatched validation layer into one form.
4. **`middleware.ts` is the security boundary for route access** — don't rely solely on client-side conditional rendering for protecting a route; keep its `matcher` and role logic current for any new protected top-level path.
5. **Env vars are centralized** via `utils/config/envConfig.ts` — don't read `process.env.NEXT_PUBLIC_*` ad hoc elsewhere.
6. **AI calls only through `hooks/useAi.ts`**, which wraps `usePost()` — never call the backend's OpenRouter-backed endpoints via a raw fetch; chat/smart-search are public (no auth gating needed on the client).
7. **This is one half of a two-repo product.** Never assume `reiment-l2-server` shares code, types, or version control with this repo — a cross-cutting change is always two separate edits, each verified in its own repo.
