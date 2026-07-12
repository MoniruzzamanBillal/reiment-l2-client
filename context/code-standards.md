# Code Standards

## TypeScript & Next.js Patterns

- `page.tsx`/`layout.tsx` files are generally left as server components where the page itself doesn't need interactivity; interactivity (state, hooks, event handlers) is pushed into imported client components marked `"use client"`. The codebase is not strictly server-first everywhere — many feature components (forms, filter panels, dashboard views) are client components by necessity (they use TanStack Query, Zustand, or RHF) — but keep new top-level `page.tsx` files as server shells when possible, matching the existing pattern.
- Use React Hook Form for all form handling. Add `zodResolver` + a schema under `schemas/` **only** for auth flows, matching the existing split — don't add Zod validation to a non-auth form that doesn't already have it.

## File Organization & Naming

- **Pages:** `app/[route]/page.tsx`; **Layouts:** `app/[route]/layout.tsx`.
- **Single-page feature composition:** PascalCase, under `components/main/<Feature>/` (e.g. `components/main/AllProducts/ProductsFilter.tsx`, `components/main/ProductDetail/...`).
- **Reusable cross-feature UI:** `components/shared/<Feature>/` (e.g. `ChatWidget/`, `Navbar/`, `Footer/`, `Modal/`).
- **Generic utilities:** `components/common/` (e.g. `GenericTable`).
- **Generic UI primitives:** `components/ui/` (shadcn-generated — don't hand-edit beyond what the shadcn CLI produces).
- **Hooks:** camelCase, prefixed `use` (`hooks/useApi.ts`, `hooks/useAi.ts`, `hooks/useSearchDebounce.ts`).
- **Zustand stores:** `stores/use<Concern>Store.ts`, one per concern.
- **Types:** centralized in `types/index.ts` — add new API request/response types there rather than creating new type files.

## Data Fetching & Mutations

- Reads: `useFetchData<TData>(queryKey, endpoint, options?)` (or the newer `useGet`) from `hooks/useApi.ts`.
- Writes: `usePost`/`usePatch`/`useUpdateData`/`useDeleteData` from the same file, called with `{ url, payload }` (or `{ url }` for delete), passing an array of query keys to invalidate on success.
- Query-string params are built via `utils/buildUrl.ts`, which strips `undefined`/`null`/empty-string values automatically — pass `undefined` for an inactive filter rather than omitting the key conditionally.
- Remember the axios interceptor's reshaping: every response needs a **double unwrap** (`result.data.data` for payload, `result.data.message` for message) — follow this in any new hook/component.
- AI calls go through the thin wrappers in `hooks/useAi.ts` (`useGenerateDescription`, `useAiChat`, `useSmartSearch`), all built on `usePost()` — never call an AI endpoint via a different pattern.

## Styling Rules

- Tailwind CSS for all styling; avoid new `.css` files unless there's a genuine need (complex animation, third-party override).
- Use `cn()` (`lib/utils.ts`) for conditional/merged class names instead of manual string concatenation.
- Use the semantic shadcn tokens (`bg-primary`, `text-muted-foreground`, `bg-card`, etc.) for anything that should adapt to light/dark theme; use the `prime50`/`prime100`/`prime200` and `surface-*` brand tokens only where existing brand-accent usage already does (see `context/ui-context.md`).

## Error Handling

- `utils/axiosInstance.ts` already normalizes API errors and handles `401` (silent refresh + retry, then redirect) globally — don't duplicate that logic per-component.
- Surface errors/success via `sonner` toast (`toast.loading(...)` → `toast.success/error(...)`) for async operations, not inline banners.

## Linting

`eslint.config.mjs` uses the flat `eslint-config-next` config. Run `yarn lint` before considering frontend work done.

## Testing

No automated test suite is configured. "Verification" means a clean `yarn lint`, a successful `yarn build` (which also type-checks), and manual verification in the browser — including checking TanStack Query loading/error states, not just the happy path (see `context/ai-workflow-rules.md`).
