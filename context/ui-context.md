# UI Context

All tokens below are pulled directly from `app/globals.css` and `components.json` — this is a record of what's actually defined and in use, not a prescriptive palette invented for this doc.

## Component Library

- **shadcn/ui**, style `new-york`, base color `neutral`, CSS variables enabled, no class prefix (`components.json`).
- Icons: `lucide-react` (`iconLibrary: "lucide"`), plus `react-icons` in a few places.
- Components live in `components/ui/` (generated/managed by the shadcn CLI — see `context/ai-workflow-rules.md` on not hand-editing these).

## Brand / Accent Colors

Raw custom properties (not part of the shadcn semantic token set), used directly as Tailwind utility values (`bg-prime100`, `text-prime100`, etc.) across storefront and dashboard components:

| Token | Value (light) | Notes |
| --- | --- | --- |
| `--prime50` | `oklch(0.585 0.233 264.4)` | Lightest of the three — primary brand accent. |
| `--prime100` | `oklch(0.511 0.262 264.1)` | Mid — default brand accent / hover-emphasis. |
| `--prime200` | `oklch(0.447 0.233 264.0)` | Darkest — active/pressed states. |

A second brand-adjacent set, `surface-*`, is also raw (non-shadcn) and theme-flipped between `:root` and `.dark`:

| Token | Light | Dark |
| --- | --- | --- |
| `--surface-primary` | `oklch(1 0 0)` | `oklch(0.27 0 0)` |
| `--surface-secondary` | `oklch(0.97 0 0)` | `oklch(0.44 0 0)` |
| `--surface-border` | `oklch(0.922 0 0)` | `oklch(42.631% 0.0273 18.183)` |
| `--surface-text` | `oklch(0.145 0 0)` | `oklch(0.98 0 0)` |
| `--surface-text-muted` | `oklch(0.556 0 0)` | `oklch(0.7 0 0)` |
| `--surface-hover` | `oklch(0.95 0 0)` | `oklch(0.35 0 0)` |
| `--surface-popover` | `oklch(1 0 0)` | `oklch(0.44 0 0)` |

## Semantic Tokens (shadcn/Tailwind theme, light + `.dark`)

`background`, `foreground`, `card`/`card-foreground`, `popover`/`popover-foreground`, `primary`/`primary-foreground`, `secondary`/`secondary-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `destructive`, `border`, `input`, `ring`, `sidebar` and its `-foreground`/`-primary`/`-accent`/`-border`/`-ring` variants, `chart-1` through `chart-5`. All defined as `oklch(...)` in `:root` and overridden in `.dark` (`app/globals.css`). Use these Tailwind classes for anything that should adapt to light/dark, and the raw `prime*`/`surface-*` tokens only for the fixed brand-accent cases already established.

## Radius Scale

Base `--radius: 0.625rem`, with `--radius-sm/md/lg/xl/2xl/3xl/4xl` derived from it (`calc(var(--radius) ± Npx)`).

## Typography

- **Font family:** Geist Sans (body/UI) and Geist Mono, loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-geist-sans` / `--font-geist-mono`.

## Breakpoints (custom, in addition to Tailwind defaults)

- `sc-430`: 27rem (432px)
- `sc-500`: 32rem (512px)
- `sc-laptop`: 86rem (1376px)
- `xsm`: 27rem, `xmd`: 64rem, `xlm`: 80rem, `xlg`: 86rem (a second, differently-named breakpoint set also defined — check which one a component you're editing already uses before adding a third convention)
- `2xl`: 100rem

## Theming

`next-themes` drives dark/light mode (`.dark` class variant, `@custom-variant dark (&:is(.dark *))`); always style with the semantic tokens above so components adapt automatically rather than hardcoding a light-only color.

## Conventions

- **Feedback:** `sonner` toasts for async operation feedback (loading → success/error) — not inline banners.
- **Class merging:** use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) instead of manual string concatenation for conditional classes.
- **Rich text:** TipTap-based editor (`@tiptap/*` packages) for vendor product descriptions.
- **Animation:** Framer Motion for panel/overlay transitions (e.g. `ChatWidget`), GSAP for marketing-page motion.
- **Tables:** TanStack React Table via `components/common/GenericTable` for admin/vendor management tables.
- **Charts:** Recharts for admin dashboard analytics.
