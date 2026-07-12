# 01: AI Integration

Status: ✅ Complete. Full delivered plan lives in root `implementationplan.md` — this is a condensed summary, not a replacement for it.

## Goal

Wire the backend's 3 AI endpoints (`/ai/generate-description`, `/ai/chat`, `/ai/smart-search`, all routed through the shared `askOpenRouter` fallback client server-side) into the client, following existing patterns exactly rather than introducing new ones.

## Design

- One new hook file, `hooks/useAi.ts`, wrapping `usePost()` from `hooks/useApi.ts` — no new fetching primitive, no per-resource hook file.
- New types added to the existing flat `types/index.ts` (`TAiGenerateDescriptionResponse`, `TAiChatMessage`, `TAiChatResponse`) — smart-search reuses the existing `TProductResponse[]` + `meta` shape.
- Chat gets a dedicated Zustand store (`stores/useChatStore.ts`) so conversation state survives route navigation, matching the one-store-per-concern convention.

## Implementation

1. **Vendor "Generate with AI"** — button above the `name` field on `add-products`/`update-products/[id]`, pre-fills `name`/`description` via `useGenerateDescription()`; vendor can still edit before submitting.
2. **Customer chat widget** — `components/shared/ChatWidget/{ChatWidget,ChatWindow,ChatMessage}.tsx`, mounted in `app/(public)/layout.tsx` (customer-facing only, not the dashboard layout). Fixed-position panel (not a Radix `Dialog`, which centers/overlays). `productIds` in a chat reply are re-fetched via the existing single-product endpoint, never trusted directly.
3. **Smart search** — additive "Search with AI" affordance on `/products`, gated behind explicit submit (not the existing per-keystroke debounced path), falling back silently to the plain filter path on failure.

## Dependencies

Backend: `askOpenRouter` client, `/ai/generate-description` (vendor JWT), `/ai/chat` (public), `/ai/smart-search` (public) — see `reiment-l2-server/context/` (if present) or its own `implementationplan.md`.

## Verify

- `yarn build` + `yarn lint` clean.
- Vendor form: description button fills both fields, still editable before submit.
- Chat widget: visible on public pages only, works logged-out, shows product cards for any `productIds` in a reply.
- Smart search: natural-language query narrows the grid the same way the plain filter path does; failure falls back silently.
