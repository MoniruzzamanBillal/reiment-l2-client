# 14: Folder Structure Restructure — Shared Infra + Auth + Public

Status: ⛔ Not started. Planning document only — no code changes yet. This is a **pure file-relocation** exercise: every component keeps its exact current logic, markup, styling, props, and behavior. The only things that change are *which file a piece of code lives in* and the import paths that point at it. Nothing here should alter what a user sees or how the app behaves.

Reference structure: `../reference folder structure` (sibling directory, one level up from the two repos). Read `folder_structure_notes` below before implementing — it captures the conventions pulled from that project.

Companion doc: `15-folder-structure-dashboard-restructure.md` covers `(dashboard)`. **Phase 0 in this doc must land first** — the dashboard doc assumes Phase 0 is already done, since it touches shared infra (`config/`, `constants/`, `providers/`, `lib/`) that dashboard code also imports.

## Why

The reference project organizes each page's UI as `components/main/<Group>/<Feature>/` with `form/`, `schema/`, `type/`, `column/` subfolders, and keeps global concerns (`config/`, `constants/`, `providers/`) as dedicated top-level folders instead of nested under `utils/`. This repo currently mixes both patterns: some features (`HomePage/`, `AllProducts/`, `ProductDetail/`, `Auth/`) already live under `components/main/`, but most public pages (`cart`, `checkout`, `contact`, `shops`, `shop/[id]`, `comparison-product`, `recent-products`, `flash-sale`, `order-success`) have all their JSX/logic inline in `app/(public)/.../page.tsx` with no matching component folder, and shared infra (`config`, `constants`, axios/token/api helpers) sits under `utils/`. This spec brings the client in line with the reference convention.

## Folder structure notes (from the reference project)

- Top-level dedicated folders for cross-cutting concerns: `config/` (env), `constants/`, `providers/`, `lib/` (axios instance, api wrapper, token manager, generic utils), `utils/` (small pure helpers only — date/url formatting, table-status mapping), `hooks/`, `types/` (small, only truly global/shared types — most types live next to the feature that owns them).
- No top-level `schemas/` folder — each feature's Zod schema lives in its own `schema/` subfolder.
- `components/main/<Feature>/` for standalone single-page features (e.g. reference's `Requisition/`, `Production/`); `components/main/(<Group>)/<Feature>/` (parens folder) when several related pages cluster into one domain area (e.g. reference's `(Warehouse)/ReceiveRequest`, `(setup)/Room`).
- Inside a feature folder: the root component (page composition), plus `form/` (RHF form components), `schema/` (Zod schemas), `type/` (TS types local to that feature), `column/` (table column defs), `modal/` (feature-specific dialogs) as needed — only the subfolders a feature actually uses.
- `app/.../page.tsx` stays a thin wrapper that renders the feature's root component (and does route-level concerns only: `params`/`searchParams` unwrapping, metadata).

## Constraints (read before executing)

1. **No behavior changes.** Extracting inline page code into a component is a copy-and-wire-up operation, not a rewrite — same JSX, same hooks, same state, same validation.
2. **No renames of existing exported component names** unless a file is being extracted fresh (new files created during extraction get reference-style names, e.g. `Cart.tsx`, `Checkout.tsx`).
3. **No deduplication of existing logic.** This spec is not the place to merge similar code — see "Explicitly out of scope" below.
4. After every phase: `yarn lint` and `yarn build` must pass, and the affected flow must be manually smoke-tested in the browser (this app has no test suite).
5. Update `CLAUDE.md` and `context/architecture.md`/`context/ui-context.md` (wherever they cite `utils/axiosInstance.ts`, `utils/config/envConfig.ts`, `schemas/`, or "flat `types/index.ts`") once the moves land — those docs currently describe the *pre*-restructure layout.

## Explicitly out of scope (found during investigation, flagged for a future spec)

- None found specific to Auth/Public — the duplicate-form findings are all in the dashboard doc.

---

## Phase 0 — Shared/global infra (prerequisite for both this doc and the dashboard doc)

| Current | New | Notes |
|---|---|---|
| `utils/config/envConfig.ts` | `config/envConfig.ts` | new top-level `config/` folder |
| `utils/constants/roles.ts` | `constants/roles.ts` | new top-level `constants/` folder |
| `utils/constants/routes.ts` | `constants/routes.ts` | |
| `utils/constants/storageKey.ts` | `constants/storageKey.ts` | |
| `components/providers/AuthBootstrap.tsx` | `providers/AuthBootstrap.tsx` | new top-level `providers/` folder |
| `utils/axiosInstance.ts` | `lib/axiosInstance.ts` | joins existing `lib/apiResponse.ts`, `lib/utils.ts` |
| `utils/api.ts` | `lib/api.ts` | |
| `utils/tokenUtils.ts` | `lib/tokenUtils.ts` | |
| `utils/buildUrl.ts`, `utils/getChangedFields.ts`, `utils/GetCookies.ts`, `utils/calculateCartPrice.ts` | *(unchanged, stay in `utils/`)* | matches reference's `utils/` role as small pure helpers |

Execution order for Phase 0:

1. Create `config/`, `constants/`, `providers/` at repo root.
2. Move each file with `git mv` (preserves history), one group at a time.
3. Repo-wide find/replace of the old import specifiers (`@/utils/config/envConfig` → `@/config/envConfig`, `@/utils/constants/...` → `@/constants/...`, `@/components/providers/AuthBootstrap` → `@/providers/AuthBootstrap`, `@/utils/axiosInstance` → `@/lib/axiosInstance`, `@/utils/api` → `@/lib/api`, `@/utils/tokenUtils` → `@/lib/tokenUtils`). This phase touches **both** public and dashboard files since these are app-wide imports — grep for every usage before moving, don't rely on the two files each doc's phase happens to mention.
4. Delete the now-empty `utils/config/`, `utils/constants/`, `components/providers/` directories.
5. `yarn lint && yarn build`; smoke-test login (uses `AuthBootstrap`, `axiosInstance`, `roles.ts`), one authenticated API call, and one env-dependent call (image URLs / API base).

---

## Phase 1 — Auth (`app/(auth)/`)

Target group: `components/main/(Auth)/<Feature>/`. All six Auth pages already delegate to a component in `components/main/Auth/` today — this phase is a pure move plus splitting the shared `schemas/auth.schema.ts` file apart, one schema per feature.

| Route | Current component | New location | Action |
|---|---|---|---|
| `/login` | `components/main/Auth/LoginForm.tsx` | `components/main/(Auth)/Login/LoginForm.tsx` | MOVE |
| `/sign-up` | `Auth/RegisterForm.tsx`, `Auth/UserRegisterForm.tsx`, `Auth/VendorRegisterForm.tsx` | `components/main/(Auth)/Register/{RegisterForm,UserRegisterForm,VendorRegisterForm}.tsx` | MOVE (group of 3, keep together — `RegisterForm` composes the other two as tabs) |
| `/forgot-password` | `Auth/ForgotPasswordForm.tsx` | `components/main/(Auth)/ForgotPassword/ForgotPasswordForm.tsx` | MOVE |
| `/reset-password/[token]` | `Auth/ResetPasswordForm.tsx` | `components/main/(Auth)/ResetPassword/ResetPasswordForm.tsx` | MOVE |
| `/change-password` | `Auth/ChangePasswordForm.tsx` | `components/main/(Auth)/ChangePassword/ChangePasswordForm.tsx` | MOVE |
| `/email-reset-confirmation/[email]` | inline in `page.tsx` (21 lines, static message card, no form/logic) | NEW `components/main/(Auth)/EmailResetConfirmation/EmailResetConfirmation.tsx`; `page.tsx` becomes a thin wrapper that unwraps `params.email` and renders it | EXTRACT |

**Schema split** — `schemas/auth.schema.ts` → one file per feature, colocated with its form:

- `loginSchema` → `(Auth)/Login/schema/login.schema.ts`
- `registerUserSchema`, `registerVendorSchema` → `(Auth)/Register/schema/register.schema.ts`
- `forgotPasswordSchema` → `(Auth)/ForgotPassword/schema/forgotPassword.schema.ts`
- `resetPasswordSchema` → `(Auth)/ResetPassword/schema/resetPassword.schema.ts`
- `changePasswordSchema` → `(Auth)/ChangePassword/schema/changePassword.schema.ts`

Delete `schemas/` once empty (nothing else uses it — confirm with a repo-wide grep for `@/schemas` before deleting). Each form already does its own local `type TXxx = z.infer<typeof xxxSchema>` — leave that pattern as-is (no separate `type/` folder needed here, matches reference's `Login/Schema`-only precedent).

---

## Phase 2 — Public storefront (`app/(public)/`)

Reference doesn't force a parens-group here — most of its ungrouped, single-purpose folders (`Requisition/`, `Production/`) are the closer analogy, since these 12 areas are independent top-level pages rather than sub-screens of one bigger domain. Keep them flat under `components/main/`.

| Route | Current | New | Action |
|---|---|---|---|
| `/` (home) | `components/main/HomePage/*` (9 files, already composed) | unchanged | KEEP |
| `/products` | inline `app/(public)/products/page.tsx` (468 ln, `AllProductsInner` + `Suspense` wrapper) + existing `components/main/AllProducts/ProductsFilter.tsx` | NEW `AllProducts/AllProducts.tsx` (extracted root); local `TCategory`/`TCategoryOption`/`TProps` types → `AllProducts/type/allProducts.type.ts` | EXTRACT + split types |
| `/product/[id]` | `components/main/ProductDetail/*` (already split: `ProductDetailPage.tsx`, `ProductDetailTop.tsx`, `CommentInput.tsx`, `UserCommentCard.tsx`) | unchanged folder; local `TProps`/`TReview` types → `ProductDetail/type/productDetail.type.ts` | KEEP + split types |
| `/cart` | inline `app/(public)/cart/page.tsx` (176 ln) | NEW `components/main/Cart/Cart.tsx` | EXTRACT |
| `/checkout` | inline `app/(public)/checkout/page.tsx` (233 ln), inline `checkoutSchema` + `TCheckoutForm` | NEW `Checkout/Checkout.tsx` + `Checkout/schema/checkout.schema.ts` + `Checkout/type/checkout.type.ts` | EXTRACT + split schema/type |
| `/shop/[id]` | inline `app/(public)/shop/[id]/page.tsx` (216 ln), local `TFollower`/`TShopDetailWithProducts` | NEW `ShopDetail/ShopDetail.tsx` + `ShopDetail/type/shopDetail.type.ts` | EXTRACT + split types |
| `/shops` | inline `app/(public)/shops/page.tsx` (132 ln), local `SortOption` | NEW `Shops/Shops.tsx` + `Shops/type/shops.type.ts` | EXTRACT |
| `/comparison-product` | inline `app/(public)/comparison-product/page.tsx` (341 ln), inline `StockBadge` sub-component + `getFinalPrice` helper | NEW `ComparisonProduct/ComparisonProduct.tsx`, `ComparisonProduct/StockBadge.tsx` (kept as sibling file, not merged into the root) | EXTRACT |
| `/recent-products` | inline `app/(public)/recent-products/page.tsx` (119 ln) | NEW `RecentProducts/RecentProducts.tsx` | EXTRACT |
| `/flash-sale` | inline `app/(public)/flash-sale/page.tsx` (70 ln) | NEW `FlashSale/FlashSale.tsx` | EXTRACT |
| `/contact` | inline `app/(public)/contact/page.tsx` (201 ln) | NEW `Contact/Contact.tsx` | EXTRACT |
| `/order-success` | inline `app/(public)/order-success/page.tsx` (26 ln) | NEW `OrderSuccess/OrderSuccess.tsx` | EXTRACT |

**Type-placement rule** (also applies in the dashboard doc): a type used by only one feature moves into that feature's `type/` folder; a type referenced by two or more features (grep before moving — e.g. `TCategory`/`TCategoryOption` are likely also needed by vendor product forms in spec 15) stays in the shared `types/index.ts`. Don't guess — check call sites before relocating each type.

No TanStack Table / `ColumnDef` usage exists anywhere in Auth or Public today, and the only Modal usage (`CartItemReplaceModal` in `ProductDetailPage`) is already a shared component — no `column/`/`modal/` subfolders needed in this doc.

---

## Verify

- `yarn lint` and `yarn build` clean after each phase.
- Auth: login, register (both tabs), forgot/reset/change password, email-reset-confirmation page — all render and submit identically to before.
- Public: home, products (filters/search/sort/pagination), product detail (reviews, related products, replace-cart-item modal), cart, checkout (incl. coupon), shop detail (follow/unfollow), shops list, comparison, recent products, flash sale, contact form, order-success — every page visually and functionally unchanged.
- No leftover imports pointing at deleted paths (`utils/config`, `utils/constants`, `components/providers`, `schemas/auth.schema`) — `grep -r` for each before considering the phase done.
- `context/progress-tracker.md` updated when this spec starts and completes.
