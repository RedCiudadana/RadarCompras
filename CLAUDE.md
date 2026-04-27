# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

Run a single test file:
```bash
npx vitest run src/services/__tests__/ocdsApi.test.ts
```

## Architecture

**Radar de Compras Públicas** — a public procurement intelligence tool for Guatemala, built by Red Ciudadana. It surfaces data from the OCDS API at `https://ocds.guatecompras.gt`.

### View routing

There is no router library. `App.tsx` manages a `currentView` string state and renders components via a `switch`. Navigation calls `setCurrentView(viewName)`. Views: `home`, `search`, `detail`, `opportunities`, `analytics`, `trends`, `docs`.

### Data layer

`src/services/ocdsApi.ts` — single static class `OCDSApi` with three methods:
- `searchReleases(filters, page)` — calls `/release/search` on the OCDS API; the API **requires** at least one of Año/Mes/Dia. Defaults to current year/month. Returns `{ data, hasMore, total }`.
- `getRecord(ocid)` — fetches full process record from `/record/{ocid}`.
- `filterReleases(releases, filters)` — client-side filter (buyer name, date range). Used after API response since the API doesn't support free-text search or amount filtering.

### Types

`src/types/ocds.ts` — TypeScript interfaces matching the OCDS standard: `Release`, `Record`, `Tender`, `Award`, `Contract`, `Organization`, `Money`, `Period`. `ProcessFilters` maps to API query parameters. `StatusRelease` enum mirrors the full `/politica` catalog.

### Catalog constants

`src/const/catalogo.ts` — `MODALIDADES`, `SUB_MODALIDADES`, `ESTATUS_CONCURSO` arrays sourced from the `/politica` endpoint. Sub-modalidades only exist for modalidad `6` (Casos de Excepción). These values are the authoritative source for filter dropdowns and test assertions.

`src/const/entidades_selector.json` — buying entities list used in the entity filter searchable select. Format: `[{ id: string, name: string }]`.

### Styling

Tailwind CSS with a custom `rc-*` color token set defined in `tailwind.config.js`:
- `rc-primary` — `#1a3d52` (deep teal, main brand color)
- `rc-accent` — `#c47d1a` (amber, CTAs and amount emphasis)
- `rc-border`, `rc-surface`, `rc-text-base`, `rc-text-muted`, `rc-text-subtle`

Font: Figtree (single family, hierarchy via weight/size — no separate display font). Design target: dense data dashboard, not a marketing page. No gradients, no glassmorphism, no hero sliders.

### Tests

Tests live in `src/services/__tests__/`. They mock `fetch` via `vi.stubGlobal` and validate both the API contract (URL parameter mapping against `docs.json`) and the catalog integrity (entry counts, unique IDs). If the API or catalogs change, these tests must be updated to match.
