# Reiment — Multi-Role E-Commerce Platform

A full-featured e-commerce web application built with Next.js 16 (App Router). Supports three user roles — **Admin**, **Vendor**, and **Customer** — with JWT-based authentication and role-enforced routing via middleware.

---

## Features

### Public / Customer
- Browse products with filters and search
- Product detail with reviews and related products
- Flash sale page
- Product comparison (up to 3 products, same category)
- Recently viewed products
- Shop profiles and listings
- Shopping cart and checkout with coupon support
- Order history
- Follow / unfollow shops
- Contact page

### Vendor
- Create and manage shop
- Add, edit, and delete products (with rich text descriptions via TipTap)
- View orders placed for their products
- Monitor customer reviews

### Admin
- Manage all categories, shops, users, and coupons
- Monitor all reviews and transactions
- Dashboard statistics and analytics (charts via Recharts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4, Radix UI, Shadcn/UI, CVA |
| Server State | TanStack React Query 5 |
| Client State | Zustand 5 (persisted to localStorage) |
| Forms | React Hook Form 7 + Zod 4 |
| HTTP Client | Axios (interceptors, auto token refresh) |
| Auth | JWT — access + refresh tokens in cookies |
| Tables | TanStack React Table 8 |
| Rich Text | TipTap 3 |
| Animations | Framer Motion 12, GSAP 3 |
| Charts | Recharts 3 |
| Icons | Lucide React, React Icons |
| Notifications | Sonner |
| Date Handling | date-fns, react-day-picker |
| Theming | next-themes (dark/light mode) |

---

## Project Structure

```
reiment-l2-next-client/
├── app/
│   ├── (auth)/          # Login, sign-up, password reset flows
│   ├── (public)/        # Storefront pages (home, products, cart, etc.)
│   └── (dashboard)/     # Protected dashboard (admin / vendor / customer)
├── components/
│   ├── ui/              # Shadcn/Radix UI primitives
│   ├── main/            # Feature-specific page sections
│   ├── shared/          # Reusable shared components (navbar, footer, cards)
│   ├── common/          # Generic utilities (GenericTable)
│   └── providers/       # AuthBootstrap provider
├── hooks/               # Custom hooks (useApi, useDebounce, usePagination, useSearchDebounce)
├── stores/              # Zustand stores (auth, comparison, coupon, recentProducts)
├── schemas/             # Zod validation schemas (auth flows)
├── types/               # TypeScript type definitions
├── utils/               # Axios instance, API helpers, constants, token utils
├── lib/                 # Response types, cn utility
└── middleware.ts        # JWT validation + RBAC route protection
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn
- Backend API running (see below)

### Installation

```bash
git clone <repository-url>
cd reiment-l2-next-client
yarn install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

For production, point this to the deployed backend:

```env
NEXT_PUBLIC_API_BASE_URL=https://reiment-l2-server.vercel.app/api
```

### Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The backend API must be running at `http://localhost:5000` for the app to function locally.

---

## Routes Overview

| Route Group | Paths | Access |
|---|---|---|
| **(auth)** | `/login`, `/sign-up`, `/forgot-password`, `/reset-password/[token]`, `/change-password`, `/email-reset-confirmation/[email]` | Public |
| **(public)** | `/`, `/products`, `/product/[id]`, `/shops`, `/shop/[id]`, `/flash-sale`, `/cart`, `/checkout`, `/order-success`, `/comparison-product`, `/recent-products`, `/contact` | Public (`/cart`, `/checkout` require login) |
| **(dashboard)** | `/dashboard`, `/dashboard/admin/*`, `/dashboard/vendor/*`, `/dashboard/customer/*`, `/dashboard/update-profile/[id]` | Authenticated + role-matched |

---

## Role-Based Access Control

Authentication and authorization are enforced in `middleware.ts` using JWT cookies.

| Role | Allowed Dashboard Prefix | Redirect if wrong role |
|---|---|---|
| ADMIN | `/dashboard/admin` | Homepage |
| VENDOR | `/dashboard/vendor` | Homepage |
| CUSTOMER | `/dashboard/customer` | Homepage |

Unauthenticated access to any protected route redirects to `/login`. Cookies are cleared on session expiry or refresh token failure.

---

## Available Scripts

```bash
yarn dev      # Start development server (http://localhost:3000)
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

---

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Set the `NEXT_PUBLIC_API_BASE_URL` environment variable in your Vercel project settings to point to your production backend.

The production backend is hosted at: `https://reiment-l2-server.vercel.app`
