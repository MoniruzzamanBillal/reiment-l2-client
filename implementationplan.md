# AI Integration Plan — Frontend (consumes `/api/ai/*`)

Scope: wire the 3 backend AI endpoints into the Next.js client, following the
patterns already in this codebase (generic `hooks/useApi.ts` wrappers, `sonner`
toasts, zustand stores per concern, `components/shared/*` for cross-feature UI).

Backend endpoints this plan consumes (see `reiment-l2-server/implementationplan.md`):

| Endpoint                            | Auth            | Request                                   | Response                                                 |
| ----------------------------------- | --------------- | ----------------------------------------- | -------------------------------------------------------- |
| `POST /api/ai/generate-description` | Vendor (bearer) | `{ name, categoryId, keywords?, price? }` | `{ title, description }`                                 |
| `POST /api/ai/chat`                 | Public          | `{ message, history? }`                   | `{ reply, productIds }`                                  |
| `POST /api/ai/smart-search`         | Public          | `{ query }`                               | `{ data, meta }` (same shape as `/product/all-products`) |

---

## 1. API client — no new setup needed

`utils/axiosInstance.ts` already handles everything these 3 endpoints need:

- Attaches `Authorization: Bearer <token>` automatically when the `accessToken`
  cookie exists, and simply omits it when it doesn't — so the public endpoints
  (`chat`, `smart-search`) and the vendor-gated one (`generate-description`) all
  go through the **same** instance with zero special-casing.
- **Gotcha to carry into the new hooks:** the response interceptor reshapes the
  axios response to `{ data: response.data, meta: response.data?.meta }`. Every
  existing hook consumer does a double-unwrap (`result.data.data`,
  `result.data.message`). The new AI hooks must follow the same shape so
  components don't need special handling.

---

## 2. New hook file — `hooks/useAi.ts`

Matches the project's convention of centralizing API hooks (there's no
per-resource `hooks/useProducts.ts` — everything wraps the generic
`useFetchData` / `usePost` from `hooks/useApi.ts`).

```ts
// hooks/useAi.ts
import { usePost } from "./useApi";

export const useGenerateDescription = () => usePost(); // no cache to invalidate
export const useAiChat = () => usePost();
export const useSmartSearch = () => usePost(); // POST body, so mutation not useFetchData
```

Call sites pass `{ url, payload }` at call time, exactly like the existing
`addProductMutate({ url: "/product/add-product", payload: formData })` pattern:

```ts
await generateDescriptionMutate({
  url: "/ai/generate-description",
  payload: { name, categoryId, keywords },
});
```

`smart-search` is a POST with a body (`{ query }`), so it's a mutation, not
`useFetchData` (which is GET-oriented) — call it imperatively on search submit
rather than treating it as a cached query.

---

## 3. New types — add to `types/index.ts`

Centralize here rather than a new file, matching how `TUser`, `TProductResponse`
etc. already live in one flat file:

```ts
export type TAiGenerateDescriptionResponse = {
  title: string;
  description: string;
};
export type TAiChatMessage = { role: "user" | "assistant"; content: string };
export type TAiChatResponse = { reply: string; productIds: string[] };
// smart-search response reuses the existing TProductResponse[] + meta shape
```

---

## 4. Feature 1 — "Generate with AI" on the vendor product form

**Files touched:**

- `app/(dashboard)/dashboard/vendor/add-products/page.tsx`
- `app/(dashboard)/dashboard/vendor/update-products/[id]/page.tsx`

Both forms use plain `react-hook-form` (`register`, no `zodResolver` — this repo's
Auth forms use zod but the product forms don't; keep consistent with the file
being touched rather than introducing a mismatched validation layer here).

**UI placement:** a small "✨ Generate with AI" `Button` (existing
`components/ui/button.tsx`) directly above the `name` input, enabled once the
vendor has picked a `category` (the category `Controller`/react-select field
already in the form) and typed at least a few keywords into the `name` field.

**Flow:**

1. On click, call `useGenerateDescription()` with
   `{ name: watch("name"), categoryId: watch("category")?.value, keywords }`
   (`keywords` can just be the current `name` value if there's no separate
   keywords input — simplest v1, no new field required).
2. Show a `sonner` `toast.loading("Drafting with AI...")`, matching the loading
   pattern already used for the form's own submit (`FormSubmitLoading` /
   `toast.loading` seen elsewhere in the codebase).
3. On success: `setValue("name", result.data.title)`, and set the description —
   since `description` is a controlled Tiptap field
   (`components/shared/input/ControlledTipTapTextEditor/ControlledTextEditor.tsx`),
   set it the same way the form already sets it (via RHF `control`/`setValue`
   for that field name) rather than reaching into the editor instance directly.
4. On error: `toast.error(err.message)` — the axios interceptor already
   normalizes error shape to `{ statusCode, message, errorMessages }`.
5. The vendor can still edit both fields before hitting the existing submit —
   this endpoint never touches `/product/add-product` itself, it only
   pre-fills.

**Auth gating:** not strictly needed client-side (the button just won't work for
non-vendors since the route requires a vendor JWT and these pages already sit
behind the vendor dashboard layout), but if you want the button to reflect
"you're a vendor" immediately, read `useAuthStore((s) => s.user)` and check
`user?.userRole === UserRole.VENDOR` (both the page and the store already exist
for this — no new auth wiring needed).

---

## 5. Feature 2 — Customer shopping assistant (chat widget)

**New files:**

```
stores/useChatStore.ts                       # open/closed + message history
components/shared/ChatWidget/ChatWidget.tsx  # floating button + panel shell
components/shared/ChatWidget/ChatWindow.tsx  # message list + input
components/shared/ChatWidget/ChatMessage.tsx # single bubble (+ product cards)
```

Mirrors how other cross-feature UI is organized under `components/shared/*`
(`Navbar/`, `Footer/`, `Modal/`) rather than `components/main/*` (used for
single-page feature composition like `AllProducts/`, `ProductDetail/`).

**Store — `stores/useChatStore.ts`** (same shape as `useAuthStore`/
`useComparisonStore`):

```ts
type TChatState = {
  isOpen: boolean;
  messages: TAiChatMessage[]; // capped client-side, e.g. last 10 turns
  toggle: () => void;
  addMessage: (m: TAiChatMessage) => void;
  reset: () => void;
};
```

Kept in a store (not local component state) so the conversation survives route
navigation, since the widget is mounted globally.

**Mount point:** `app/(public)/layout.tsx`, as a sibling next to `Navbar`/`Footer`
— not the root `app/layout.tsx` — so the assistant is customer-facing only and
doesn't clutter the vendor/admin dashboard (`app/(dashboard)/layout.tsx`). This
is a product call; flip it to root layout later if you want it everywhere.

**UI shape:** build directly with Tailwind fixed positioning
(`fixed bottom-4 right-4 z-50`) rather than the Radix `Dialog`/`BaseModal` —
Dialog centers with a full overlay, which fights a bottom-anchored chat panel
that should stay open while browsing. `framer-motion` (already a dependency) is
a natural fit for the open/close panel animation.

**Send-message flow (`ChatWindow.tsx`):**

1. On submit: `addMessage({ role: "user", content })` to the store immediately
   (optimistic render).
2. Call `useAiChat()` mutation:
   ```ts
   await chatMutate({
     url: "/ai/chat",
     payload: { message: content, history: messages.slice(-10) },
   });
   ```
3. On success: `addMessage({ role: "assistant", content: result.data.reply })`.
   If `result.data.productIds.length`, fetch those products (reuse the existing
   single-product hook/endpoint `GET /product/get-product/:id`, `Promise.all`
   over the ids — no new backend call needed) and render them as compact
   product cards under the reply bubble in `ChatMessage.tsx` (reuse whatever
   card component the product grid already uses, at a smaller size).
4. On error: inline "Sorry, I'm having trouble right now" bubble + `toast.error`,
   don't drop the user's message from history.

**Debounce/rate note:** every send is a real free-tier model call — no debounce
needed here (it's submit-triggered, not keystroke-triggered), but disable the
send button while a request is in flight to stop double-submits burning quota.

---

## 6. Feature 3 — Smart search on the products page

**File touched:** `app/(public)/products/page.tsx` (`AllProductsInner`).

Today this page builds a URL with `buildUrl("/product/all-products", { page,
limit, searchTerm, priceRange, categoryId, sortBy, sortOrder })` and fetches it
with `useFetchData`. The response shape `{ data, meta }` is deliberately
identical for `smart-search`, so the rest of the page (grid rendering,
pagination, skeletons) needs **no changes** — only how `products`/`totalItems`
get populated changes.

**Approach:** don't replace the existing filter UI (category dropdown, price
slider, sort — those still work great for precise filtering). Instead, treat
the free-text search box as dual-purpose:

1. Keep the current instant `buildUrl` + `useFetchData` path as the default —
   it's free (no model call) and already works.
2. Add a "Search with AI" affordance next to the search input (icon button or
   a switch) for natural-language queries like _"cheap waterproof shoes under
   $50"_ that the existing plain `contains` search can't parse into
   price/category filters.
3. When triggered, call `useSmartSearch()` with `{ query: searchTerm }`, and on
   success, `setState` the same `products`/`totalItems` local state the regular
   path already populates — the render tree doesn't know or care which path
   filled it.
4. Because this is a real model call, gate it behind explicit submit (Enter key
   / button click), **not** the existing `onChange` handler — don't wire this
   through `hooks/useSearchDebounce.ts` on every keystroke, that would fire a
   model call per character. A defined but currently unused debounce hook
   already exists in the repo; leave it unused for this path too, and only
   reserve it if you later add "search-as-you-type" for the plain (non-AI) path.
5. On smart-search failure, fall back silently to the current plain
   `buildUrl`/`searchTerm` path (the backend already zod-falls-back too — this
   is a second layer of the same safety net) rather than showing an error for
   what the user perceives as "just a search."

---

## 7. Cross-cutting

- **Loading states:** reuse `sonner`'s `toast.loading(...)` for the one-shot
  description generator (matches existing form UX); for chat, an inline
  "typing..." bubble/spinner in `ChatWindow.tsx` instead of a toast (toasts are
  for one-off actions, not a running conversation).
- **Error normalization:** all 3 hooks get axios-interceptor-normalized errors
  for free (`{ statusCode, message, errorMessages }`) — no new error-handling
  code needed beyond what `usePost` callers already do elsewhere.
- **No streaming:** none of the 3 endpoints stream (confirmed no `ai`/`openai`/
  SSE deps in `package.json`) — plain request/response mutations are
  sufficient, no need to hand-roll a `fetch` + `ReadableStream` reader.
- **Guest users:** `chat` and `smart-search` work without login (public routes);
  don't gate the chat widget behind auth.

---

## 8. New files checklist

| File                                                                    | Purpose                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `hooks/useAi.ts`                                                        | `useGenerateDescription`, `useAiChat`, `useSmartSearch`                   |
| `stores/useChatStore.ts`                                                | chat open/closed + message history                                        |
| `components/shared/ChatWidget/ChatWidget.tsx`                           | floating trigger + panel shell                                            |
| `components/shared/ChatWidget/ChatWindow.tsx`                           | message list + input + send logic                                         |
| `components/shared/ChatWidget/ChatMessage.tsx`                          | bubble + optional product cards                                           |
| `types/index.ts` (edit)                                                 | add `TAiGenerateDescriptionResponse`, `TAiChatMessage`, `TAiChatResponse` |
| `app/(public)/layout.tsx` (edit)                                        | mount `<ChatWidget />`                                                    |
| `app/(dashboard)/dashboard/vendor/add-products/page.tsx` (edit)         | "Generate with AI" button                                                 |
| `app/(dashboard)/dashboard/vendor/update-products/[id]/page.tsx` (edit) | same button on edit form                                                  |
| `app/(public)/products/page.tsx` (edit)                                 | "Search with AI" affordance in `AllProductsInner`                         |

---

## 9. Implementation order

1. `hooks/useAi.ts` + types — no UI yet, verify each endpoint round-trips with a
   throwaway console.log call.
2. "Generate with AI" button on the add-product form (smallest surface, single
   page, immediate value for testing the description endpoint end-to-end).
3. Smart search affordance on the products page (reuses existing render path,
   low risk given the fallback).
4. Chat widget (most new UI: store + 3 components + global mount) — build last
   since it's the most self-contained addition and doesn't block the other two.
