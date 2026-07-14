# 11: Frontend Code-Quality Cleanup

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Deliberately sequenced last — after testing (spec `08`) exists as a safety net for the type-tightening changes here.

## Goal

Remove the scattered `any` typing that's currently masking real response shapes in mutation call sites, and unify the two coexisting breakpoint-naming conventions in `app/globals.css`. Both are small, mechanical, high-visibility-to-a-reviewer cleanups already flagged in `context/progress-tracker.md`'s "Known Gaps" section — not a broader refactor.

## Context

- `const result: any = await ...Mutate(...)` appears at every mutation call site touched in specs `04`-`06` (`shop/[id]/page.tsx`, `followed-shops/page.tsx`, and likely others using the `useApi.ts` generics) — the actual response shape is always the server's `{ success, message, data }` envelope after Axios's double-unwrap (`result.data.data`, `result.data.message`, per `CLAUDE.md`'s documented Axios interceptor behavior), so a real generic type is derivable, not guessed.
- `app/globals.css` has two breakpoint-naming schemes in simultaneous use (`sc-*` and `xsm`/`xmd`/`xlm`/`xlg`) — not a bug, just inconsistent, and worth unifying once, not "match whichever convention is nearby" forever.

## Design

- Add a small generic response type to `types/index.ts` (e.g. `TApiResponse<T> = { success: boolean; message: string; data: T }`), matching the server's actual envelope, and type each `useMutation`'s `mutateAsync` return via that generic instead of `any`. This is additive to the existing centralized `types/index.ts` file, not a new type-file convention.
- For the breakpoint unification: pick whichever convention has more existing usages (grep count both), migrate the minority convention's call sites to match, and remove the now-dead classes/variables from `globals.css`. Purely mechanical, verified visually (no layout should shift).

## Implementation

1. `types/index.ts` — add `TApiResponse<T>`.
2. Grep for `: any = await` across `app/` and `components/`; replace each with the properly-typed mutation result, only where the type is unambiguous from the endpoint's known response shape (skip anywhere the payload shape isn't already clear from context, rather than guessing).
3. Grep `app/globals.css` and all `.tsx` files for `sc-*` vs `xsm|xmd|xlm|xlg` usages; migrate the minority convention's call sites to the majority one; remove dead CSS.
4. `yarn lint` / `yarn build` after each batch of changes to catch type errors immediately rather than at the end.

## Dependencies

Soft dependency on spec `08` (frontend testing) — not required, but doing the type-tightening with an existing test suite as a safety net catches behavioral regressions the type checker alone won't.

## Verify

- `yarn build` passes with zero new `any`-related suppressions.
- Visual diff/spot-check on a few responsive breakpoints (mobile/tablet/desktop) confirms no layout regression from the breakpoint-convention unification.
- `grep -rn "any = await" app/ components/` returns nothing (or only justified, commented exceptions).
