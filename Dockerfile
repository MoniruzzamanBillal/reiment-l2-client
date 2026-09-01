# ---- Stage 1: deps ----
# Installs dependencies only. Cached independently of source code changes —
# this layer only re-runs when package.json or yarn.lock actually change.
FROM node:20-alpine AS deps
WORKDIR /app
# Required on Alpine (musl libc) for several native/prebuilt Node packages
# (this project pulls in `sharp` for next/image optimization) to run correctly.
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# ---- Stage 2: builder ----
# Builds the production Next.js output. Receives NEXT_PUBLIC_* vars as build
# arguments — Next.js inlines NEXT_PUBLIC_* env vars into the client bundle
# at build time, so they MUST be present here, not just at container runtime.
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_PUSHER_KEY
ARG NEXT_PUBLIC_PUSHER_CLUSTER
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_PUSHER_KEY=$NEXT_PUBLIC_PUSHER_KEY
ENV NEXT_PUBLIC_PUSHER_CLUSTER=$NEXT_PUBLIC_PUSHER_CLUSTER

RUN yarn build


# ---- Stage 3: runner (final, minimal image) ----
# Only the compiled standalone output + static assets ship here — no
# TypeScript, no devDependencies, no source code beyond what's needed to run.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user — the container should never run as root.
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone mode doesn't automatically include static assets — copy them
# explicitly. This is the standard, required pattern for Next.js standalone
# Docker images (not specific to this repo).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
