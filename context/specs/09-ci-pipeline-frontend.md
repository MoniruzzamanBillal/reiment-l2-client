# 09: Frontend CI Pipeline

Status: 📝 Planned, awaiting user review/approval. No code changed yet.

## Goal

Add a GitHub Actions workflow that runs lint, build, and test on every push/PR. Depends on spec `08` (frontend testing) landing first — running "test" in CI before a test suite exists is a no-op.

## Context

There is currently no `.yml`/`.yaml` CI config anywhere in this repo. A green CI badge is disproportionately valuable for a mid-level junior application: it's the cheapest possible signal that code is verified before merging, not just before demoing.

## Design

One workflow file, `on: [push, pull_request]`, three sequential jobs (or one job with three steps — sequential steps are simpler and sufficient at this project's size): `yarn install --frozen-lockfile` → `yarn lint` → `yarn build` → `yarn test` (from spec `08`). No deployment step here — Vercel's own GitHub integration already handles deploy-on-push separately; this workflow is purely for verification gating.

## Implementation

1. `.github/workflows/ci.yml`:
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     verify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: yarn
         - run: yarn install --frozen-lockfile
         - run: yarn lint
         - run: yarn build
         - run: yarn test
   ```
2. Add a CI status badge to `README.md` (pairs naturally with spec `07`'s README work, but tracked as its own line item here since it depends on this workflow existing first).

## Dependencies

Depends on spec `08` (frontend testing) landing first, so `yarn test` is a real command and not the current no-op/absent script. `yarn build` currently requires `NEXT_PUBLIC_API_BASE_URL` to be set (per `envConfig.ts`) — the workflow needs a dummy/staging value added as a repo secret or workflow env var, since CI has no real backend to point at.

## Verify

- A PR with a deliberately broken lint rule or failing test shows a red CI check.
- A clean PR shows a green check across all three steps.
- `yarn build` succeeds in the CI environment (confirms the env-var handling above is correct).
