# 07: Deployment Verification & README Polish

Status: 📝 Planned, awaiting user review/approval. No code changed yet.

## Goal

Make the project's existing live deployment trustworthy and visible: confirm it actually works end-to-end, then make sure a reviewer skimming the repo sees that proof in under a minute (demo link, screenshots, architecture summary) instead of having to run it locally to find out.

## Context

This repo already has `vercel.json` and `reiment-l2-server/src/app/modules/payment/payment.controller.ts` hardcodes `https://reiment-l2-client.vercel.app` as its payment-redirect target — a live deployment exists, it is not being stood up from scratch. `README.md` already has a solid features list and tech-stack table but no demo link, no screenshots, and no architecture summary — for a mid-level application, an interviewer who can't see the app running in one click is a lost opportunity, regardless of how good the code is underneath.

## Design

Two tracks, both low-risk and reversible:

1. **Verification pass** (manual, via the live URL, not local dev): walk the golden paths — guest browse → product detail → login-gated cart/checkout, vendor login → shop/product CRUD, admin login → dashboard analytics, the AI chat widget, smart search, follow/unfollow (per spec `06`). Anything broken gets logged as a follow-up bug spec rather than silently patched here, keeping this spec's scope to "verify and document," not "fix whatever's found."
2. **README enhancement**: add a "Live Demo" section near the top (URL + one-line note on demo/test credentials if applicable), a screenshots/GIF section (home, product detail, vendor dashboard, admin analytics — 4-5 images), and an "Architecture" section summarizing the two-repo split, App Router route groups, and the client's data-layer conventions (React Query generics, Zustand stores, Axios double-unwrap) already documented in `CLAUDE.md` — written for an external reader, not as a copy of the internal dev docs.

## Implementation

1. Manually exercise the live deployment's golden paths listed above; note any breakage in a short checklist (not fixed as part of this spec unless trivial and clearly in-scope).
2. Capture 4-5 screenshots (or a short GIF) of representative pages.
3. `README.md` — add, near the top after the title/description:
   - "Live Demo" section with the URL.
   - "Screenshots" section embedding the captured images (stored under e.g. `public/readme/` or linked externally, matching whatever the images actually end up as).
   - "Architecture" section: 1-2 paragraphs on the two-repo split and this client's App Router/data-layer conventions.
4. If `reiment-l2-server/README.md` is thin or missing equivalent deployment/env-var/Prisma-setup info, extend it to match (tracked here since it's the same "make the project reviewable" goal, but only the README file itself — no server code changes).

## Dependencies

None — documentation and manual verification only. If verification surfaces a real bug, that becomes its own numbered spec (following the `04`/`05`/`06` bug-fix pattern) rather than being folded in here.

## Verify

- Every link in the new README sections resolves (demo URL loads, images render on GitHub's README preview).
- The golden-path checklist has been walked against the live URL, not just local dev.
- No source code changed — `git diff` should show only `README.md` (and `reiment-l2-server/README.md` if touched) plus any added image assets.
