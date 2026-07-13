# 12: Dockerize the Client

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Pairs with `reiment-l2-server/context/specs/09-dockerization.md`, which owns the shared `docker-compose.yml` (since that's where the Postgres dependency lives).

## Goal

Add a production-style `Dockerfile` for the Next.js client and a matching entry in the server repo's `docker-compose.yml`, so the whole stack (Postgres + API + client) can be brought up with one command for local development — and so "containerized" is a real, demonstrable line on the resume, not just a claim.

## Context

Neither repo currently has a `Dockerfile` or `docker-compose.yml`. Since the two repos are independent (separate remotes, per `CLAUDE.md`), the compose file that orchestrates all three services has to live in one of them — it's specified here as living in `reiment-l2-server` (see that repo's spec `09`) since that's where the database dependency originates, with this client's `Dockerfile` referenced from there via a relative build context or a documented path convention (both repos are checked out as sibling directories in this workspace).

## Design

- Multi-stage `Dockerfile`: a `deps` stage (`yarn install`), a `builder` stage (`yarn build`, needs `NEXT_PUBLIC_API_BASE_URL` as a build arg since Next.js inlines `NEXT_PUBLIC_*` vars at build time), and a slim `runner` stage (`yarn start`) copying only the `.next`/`public`/`node_modules` output — not the full source tree — to keep the image small.
- `.dockerignore` excluding `node_modules`, `.next`, `.git`.
- No change to the actual app code — this is infra-only.

## Implementation

1. `Dockerfile` (multi-stage: deps → builder → runner), `ARG NEXT_PUBLIC_API_BASE_URL` threaded through the build stage since it's a build-time-inlined env var, not a runtime one.
2. `.dockerignore`.
3. Coordinate with `reiment-l2-server/context/specs/09-dockerization.md` so its `docker-compose.yml` correctly points at this Dockerfile's build context and exposes the client on a sensible local port (e.g. `3000`).

## Dependencies

Coordinates with (does not strictly block on) `reiment-l2-server/context/specs/09-dockerization.md` — the client's `Dockerfile` is useful standalone (`docker build`/`docker run`), but the full one-command-startup experience needs the server repo's compose file too.

## Verify

- `docker build` succeeds and produces a working image; `docker run -p 3000:3000 <image>` serves the app.
- Via the server repo's `docker-compose up`, the client is reachable and can successfully call the containerized API (confirms the `NEXT_PUBLIC_API_BASE_URL` build-arg wiring is correct, since a wrong value would silently point the built client at the wrong host).
