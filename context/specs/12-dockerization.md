# 12: Dockerize the Client

Status: ✅ Complete. Implemented as a **self-contained, client-only** Docker setup — not the shared-compose design this spec originally called for. See "What actually shipped" below for why, and `reiment-l2-server/context/specs/09-dockerization.md` for the paired backend change.

## Goal

Add a production-style `Dockerfile` for the Next.js client so "containerized" is a real, demonstrable line on the resume, not just a claim.

## What actually shipped (supersedes the original Design/Implementation below)

The client and server are dockerized **independently**, each with its own `Dockerfile` + `docker-compose.yml` + 3 environments (local/qa/production) — mirroring how both repos already deploy independently via Vercel (`deploy.yml` in each repo). There is no shared/root-level compose file bringing up Postgres+API+client together; each environment's client container is instead configured to call whatever backend URL that environment's `.env` supplies (a real running server, containerized or not).

- `next.config.ts` gained `output: "standalone"`.
- `Dockerfile` (multi-stage: `deps` → `builder` → `runner`, all `node:20-alpine`) — `deps` runs `apk add --no-cache libc6-compat` (needed now that `sharp` is a dependency) then `yarn install --frozen-lockfile`; `builder` takes **three** build ARGs, not one — `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` (all three are actually referenced in the codebase — `config/envConfig.ts` and `hooks/useOrderPusher.ts` — and all are build-time-inlined, so all three had to be ARGs); `runner` runs as a non-root `nextjs` user, copies `.next/standalone` + `.next/static` + `public`, `CMD ["node", "server.js"]`.
- `sharp` added as a real dependency — required for `next/image` optimization to work when self-hosted outside Vercel, given the app already configures `images.remotePatterns`.
- `.dockerignore`: `node_modules`, `.next`, `.git`, `.env`/`.env.*`, `*.tsbuildinfo`, `next-env.d.ts`, `.vscode`, `README.md`, `context`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`.
- `docker-compose.yml`: three services — `local` (port `3000`), `qa` (port `4000`), `production` (port `5000`) — each with its own healthcheck (`wget --spider` against `/`, no dedicated `/health` route exists yet), 512M/1cpu resource limits, json-file logging with rotation, and its own bridge network. Each service maps distinctly-named host env vars to the same three build args: `local` uses `NEXT_PUBLIC_API_BASE_URL`/`NEXT_PUBLIC_PUSHER_KEY`/`NEXT_PUBLIC_PUSHER_CLUSTER` directly, `qa` uses `QA_API_URL`/`QA_PUSHER_KEY`/`QA_PUSHER_CLUSTER`, `production` uses `PROD_API_URL`/`PROD_PUSHER_KEY`/`PROD_PUSHER_CLUSTER` — all required via Compose's `:?must be set` guard.
- `.env.example` documents all 9 host-side vars above (placeholders only).

## Original Design (superseded, kept for history)

- Multi-stage `Dockerfile`: a `deps` stage (`yarn install`), a `builder` stage (`yarn build`, needs `NEXT_PUBLIC_API_BASE_URL` as a build arg since Next.js inlines `NEXT_PUBLIC_*` vars at build time), and a slim `runner` stage (`yarn start`) copying only the `.next`/`public`/`node_modules` output — not the full source tree — to keep the image small.
- `.dockerignore` excluding `node_modules`, `.next`, `.git`.
- Coordinate with `reiment-l2-server/context/specs/09-dockerization.md`'s shared `docker-compose.yml`, which would have owned bringing up Postgres+API+client together.

This shared-compose design was abandoned in favor of the self-contained approach above — both repos deploy independently already (Vercel), so independent Docker setups matching that same shape were a better fit than introducing a new cross-repo coordination point Docker-only.

## Verify

- `docker build` succeeds and produces a working image; `docker compose up local` serves the app on `http://localhost:3000` with no console errors.
- The built image's client JS actually contains the baked-in `NEXT_PUBLIC_API_BASE_URL` value (confirms build-arg threading took effect, not just that the build succeeded).
- `yarn build` (outside Docker) still passes after the `next.config.ts`/`package.json` changes.
