# Project Overview: Reiment (Frontend)

## Overview

Reiment's frontend is a Next.js 16 (App Router) application that consumes the `reiment-l2-server` REST API to deliver a multi-role e-commerce platform: a public storefront (browse, search, cart, checkout) plus role-scoped dashboards for Admin, Vendor, and Customer. It is an independent git repository — it shares no code or types with `reiment-l2-server`, only the HTTP contract at `NEXT_PUBLIC_API_BASE_URL`.

## Goals

1. Let visitors browse, search, and filter products, view shop and product detail pages, and compare products.
2. Let customers cart, check out (with coupon support), track orders, follow shops, and leave reviews.
3. Give vendors a shop + product management workflow (CRUD, AI-assisted description generation).
4. Give admins full oversight: categories, shops, users, coupons, reviews, transactions, and dashboard analytics.
5. Keep protected routes enforced by role via `middleware.ts` (customer can't reach vendor/admin dashboards and vice versa).

## Core User Flows

### Public visitor
1. Browses the storefront (`app/(public)/`): home, all products (`/products`, filters + search), flash sale, shop listings/detail, product detail with reviews and related products, product comparison (up to 3, same category).
2. Signs up (`app/(auth)/sign-up`) or logs in (`app/(auth)/login`); password reset via `forgot-password` → `email-reset-confirmation/[email]` → `reset-password/[token]`.
3. Can chat with the AI shopping assistant (`ChatWidget`, public, no login required) and use AI smart search on `/products`.

### Customer (`CUSTOMER` role)
1. Logs in and stays on the public site (not auto-redirected into a dashboard) — customer-facing pages live at `app/(dashboard)/dashboard/customer/`.
2. Adds products to cart (`/cart`) and checks out (`/checkout`), applying a coupon — both routes require login, enforced by `middleware.ts`.
3. Views order history, follows/unfollows shops (`app/(dashboard)/dashboard/customer/followed-shops`), views recently viewed products, leaves reviews.

### Vendor
1. Creates and manages their shop (1:1 with the vendor account).
2. Adds/edits/deletes products (`add-products`, `update-products/[id]`) with TipTap rich-text descriptions, optionally pre-filled via "Generate with AI".
3. Views orders placed for their products and monitors reviews on their products.

### Admin
1. Manages categories, shops, users, and coupons (CRUD + soft delete).
2. Monitors all reviews and transactions platform-wide.
3. Views dashboard statistics/analytics (Recharts).

All three dashboard roles share `app/(dashboard)/dashboard/update-profile` for account management.

## Features by Category

- **Auth:** JWT login/registration, access + refresh tokens in cookies, role-based route protection.
- **Storefront:** product catalog with search/filter/sort/pagination, flash sale page, shop profiles/listings, product comparison, recently-viewed tracking.
- **Cart & checkout:** cart management, coupon application, order placement, order-success page.
- **Follow system:** customers follow/unfollow shops; a dedicated "Followed Shops" dashboard list (not yet connected to product discovery — see `context/specs/`).
- **Reviews:** product reviews, tied to purchase/eligibility rules enforced server-side.
- **Vendor tools:** shop + product CRUD, AI-assisted product description generation.
- **Admin oversight:** category/shop/user/coupon CRUD, review/transaction monitoring, analytics dashboard.
- **AI integration:** vendor description generation, public shopping chat widget, smart search — all routed through the backend's `askOpenRouter` fallback client (see `implementationplan.md` at repo root for the original delivered plan).

## In Scope

- Next.js App Router frontend integrating with the `reiment-l2-server` REST API only (`NEXT_PUBLIC_API_BASE_URL`).
- Three route groups: `(auth)`, `(public)`, `(dashboard)` (role-gated: admin/vendor/customer).
- Responsive design (desktop + mobile, including the custom `sc-430`/`sc-500`/`sc-laptop` breakpoints).

## Out of Scope (as currently built)

- No automated test suite (`yarn lint` + `yarn build` type-check + manual browser verification is the whole verification loop).
- No shared code/types with `reiment-l2-server` — cross-repo changes are always two separate edits.
- Coupon date-range/usage-limit enforcement is **not yet built** on either repo, and a `cuponId`/`couponId` spelling mismatch means the discount is never actually applied in production today — see `coupon-implementation-plan.md` (root) / `context/specs/02-coupon-feature.md` before touching coupon code.

## Success Criteria

- A customer can browse, search, filter, cart, apply a coupon, check out, track orders, follow shops, and leave reviews.
- A vendor can build out their shop and product catalog, optionally with AI-generated descriptions.
- An admin can manage categories/shops/users/coupons and see platform analytics.
- Role-based route protection correctly restricts dashboard areas per `middleware.ts`.
