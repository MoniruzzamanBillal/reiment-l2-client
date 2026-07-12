# AI Workflow Rules

## Overall Approach

This is a live, already-built codebase — the priority is fitting new work into the existing patterns (`hooks/useApi.ts` + generic mutation hooks, route groups, `components/main`/`shared`/`common` organization), not re-architecting. Work one page/feature at a time and verify before moving on.

## Scoping Rules

1. **One feature at a time.** Don't bundle unrelated fixes/refactors into a feature change.
2. **No speculative changes.** Don't refactor unrelated components, don't build placeholder UI for unrequested features, don't hand-roll validation/state patterns that already exist (RHF, Zustand, TanStack Query).
3. **Strict boundaries.** This repo consumes the `reiment-l2-server` API contract as-is — if a needed endpoint doesn't exist or a payload shape is unclear, say so and ask; don't invent client-side workarounds for missing backend behavior, and don't assume a backend change will land without checking `reiment-l2-server`'s own context docs / implementation plans first.
4. **Two-repo changes are two edits.** A feature spanning both repos (e.g. the coupon fix, the followed-shops filter) needs its own plan/spec in each repo; check `git status` in the correct directory before committing either half.

## Splitting Work

- Split a complex page into smaller pieces the same way the codebase already does (a dedicated filter/form component, orchestration in the page or a small hook) rather than one large file.

## Handling Missing Requirements

- If a visual design detail isn't specified, follow `context/ui-context.md`'s actual tokens — don't introduce new colors/fonts.
- If an API payload/response shape is ambiguous, check `types/index.ts` first, then the corresponding backend module (`reiment-l2-server/src/app/modules/<name>/*.interface.ts` / `*.validation.ts`) before guessing. Do not guess the payload shape.
- If a UX edge case is unclear (e.g. what a customer sees for a shop with no products), stop and ask.

## Protected Files

- Don't modify `components/ui/*` (shadcn-generated) unless explicitly asked to customize globally.
- Don't alter `middleware.ts`'s matcher or role-redirect logic without confirming — it's the actual route-protection boundary (see `context/architecture.md`).
- Don't add a new global state library — Zustand (client state) and TanStack Query (server state) already cover this; ask before introducing something else (Redux, Jotai, etc.).
- Don't "fix" the backend's intentionally-misspelled `isDelated` field or the routing/response conventions documented in the root `CLAUDE.md` — match existing spelling/shape exactly.

## Documentation Sync

- If an implementation decision diverges from `context/architecture.md` or `context/code-standards.md`, or establishes a new reusable pattern, update the relevant file in the same change.
- Update `context/progress-tracker.md` after each meaningful change.
- Root-level plan docs (`implementationplan.md`, `coupon-implementation-plan.md`, `followed-shops-filter-implementation-plan.md`) are the detailed, checklist-driven source of truth for pending/completed cross-cutting features — keep `context/specs/` and `context/progress-tracker.md` in sync with their checkbox state rather than duplicating and drifting from them.

## Verification Checklist Before Moving On

- [ ] No TypeScript errors (`yarn build` type-checks as part of the Next.js build).
- [ ] `yarn lint` is clean.
- [ ] The feature is responsive (check mobile and desktop, including the custom `sc-430`/`sc-500`/`sc-laptop` breakpoints where relevant).
- [ ] UI reflects TanStack Query loading/error states, not just the happy path.
- [ ] Manually exercised in the browser (`yarn dev`) — golden path plus edge cases, not just a type-check pass.
