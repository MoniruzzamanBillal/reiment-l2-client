# Build Plan

Unlike a greenfield project, `reiment-l2-client` is already built and in active use — there is no historical unit-by-unit build sequence to record here.

This file exists so future frontend feature work can be planned the same way: when a new feature is scoped, add a numbered spec file here (`01-<feature-name>.md`, `02-<feature-name>.md`, ...) describing its goal, design, and implementation steps. List them below as they're added.

These specs are adapted summaries of the repo's root-level implementation-plan docs (`implementationplan.md`, `coupon-implementation-plan.md`, `followed-shops-filter-implementation-plan.md`), which remain the detailed, checkbox-driven source of truth — keep both in sync rather than letting the spec drift from the root doc's checklist state.

## Units

1. **[01: AI Integration](./01-ai-integration.md)** — vendor "Generate with AI" description button, customer shopping chat widget, and AI smart search on `/products`. Implemented; see root `implementationplan.md`.
2. **[02: Coupon Feature](./02-coupon-feature.md)** — date-range validity, usage-limit enforcement, per-user one-time-use, and fixing the `cuponId`/`couponId` mismatch that currently makes the discount a no-op in production. Depends on the backend plan landing first. Not yet implemented.
3. **[03: Followed Shops Product Filter](./03-followed-shops-filter.md)** — explicit opt-in "Only shops I follow" toggle on `/products`, connecting the existing follow-a-shop feature to product discovery. Depends on the backend plan landing first. Plan written, awaiting user review/approval before implementation.
4. **[04: Shop Follow Button State Bug](./04-shop-follow-button-state-bug.md)** — fixes a type-shape mismatch on `/shop/[id]` that makes the Follow button never show "Unfollow", causing a spurious "already following" error on repeat clicks. Frontend-only, no backend change. Implemented.
5. **[05: Followed Shops Filter Not Visible Bug](./05-followed-shops-filter-not-visible-bug.md)** — fixes a `user.role` vs. `user.userRole` field-name bug on `/products` that makes the "Only shops I follow" checkbox permanently invisible. Frontend-only, no backend change. Implemented.
6. **[06: Unfollow Shop 404 Bug](./06-unfollow-shop-404-bug.md)** — fixes the "Unfollow" button on `/shop/[id]` (and the same underlying bug on the customer "Followed Shops" dashboard page) by making `useDeleteData`/`apiDelete` support a request body and sending `{ shopId }` in it, matching the server's `DELETE /api/follow/unfollow-shop` contract. Frontend-only, no backend change. Implemented.
