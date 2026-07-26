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

### Domain language

`CONTEXT.md` at the repo root is the glossary — the canonical term for each domain concept and the synonyms to avoid. The domain speaks two languages (OCDS in English, Guatecompras in Spanish); the glossary picks one per concept. Read it before naming anything. Decisions with lasting consequences live in `docs/adr/`.

### View routing

`react-router-dom`. `App.tsx` declares the routes inside `AppShell`; `SLIDERS_CONFIG` in the same file maps a path to its hero banner title and image, keyed by pathname.

| Path | Component |
|------|-----------|
| `/` | `Home` (rendered without the `main` wrapper or hero slider) |
| `/busqueda` | `ProcessSearch` |
| `/busqueda/:releaseId` | `ProcessDetail` |
| `/oportunidades` | `OpportunitiesRadar` |
| `/tendencias` | `Trends` |
| `/pymes` | `TrendsHome` |
| `/docs` | `Documentation` |
| `*` | redirect to `/` |

`Analytics` exists but its `/estadisticas` route is commented out.

### Data layer

`src/services/ocdsApi.ts` — single static class `OCDSApi` with three methods:
- `searchReleases(filters, page)` — calls `/release/search` on the OCDS API; the API **requires** at least one of Año/Mes/Dia. Defaults to current year/month. Returns `{ data, hasMore, total }`.
- `getRecord(ocid)` — fetches full process record from `/record/{ocid}`.
- `filterReleases(releases, filters)` — client-side filter (buyer name, date range). Used after API response since the API doesn't support free-text search or amount filtering.

#### Identifying the Entidad

A release lists several parties with role `buyer`: the Entidad and its Unidades de compra. They are told apart by identifier scheme — `GT-CISP` with `memberOf: null` is the Entidad, `GT-GCUC` with `memberOf` pointing at the `GT-CISP` party is a Unidad de compra. `release.buyer` and `tender.procuringEntity` both carry the Entidad, under a third scheme (`GT-NIT`).

The `Entidad` query parameter takes a fourth ID space: the head of the `GT-GCUC` compound code (`GT-GCUC-52-15` → `52`), which is what `entidades_selector.json` and `guatecompras.ts` are keyed on. `utils/marketContext.ts` `getBuyerEntidadId` derives it. Filtering is only possible at Entidad level — there is no parameter for a Unidad de compra.

### Types

`src/types/ocds.ts` — TypeScript interfaces matching the OCDS standard: `Release`, `Record`, `Tender`, `Award`, `Contract`, `Organization`, `Money`, `Period`. `ProcessFilters` maps to API query parameters. `StatusRelease` enum mirrors the full `/politica` catalog.

### Catalog constants

`src/const/catalogo.ts` — `MODALIDADES`, `SUB_MODALIDADES`, `ESTATUS_CONCURSO` arrays sourced from the `/politica` endpoint. Sub-modalidades only exist for modalidad `6` (Casos de Excepción). These values are the authoritative source for filter dropdowns and test assertions.

`src/const/entidades_selector.json` — buying entities list used in the entity filter searchable select. Format: `[{ id: string, name: string }]`.

### Styling

Tailwind CSS with a custom `rc-*` color token set defined in `tailwind.config.js`:
- `blue` — `#1a3d52` (deep teal, main brand color)
- `orange` — `#c47d1a` (amber, CTAs and amount emphasis)
- `neutral-400`, `neutral`, `rc-text-base`, `rc-base/60`, `rc-base/90`

Font: Figtree (single family, hierarchy via weight/size — no separate display font). Design target: dense data dashboard, not a marketing page. No gradients, no glassmorphism, no hero sliders.

### Tests

Tests live in `src/services/__tests__/`. They mock `fetch` via `vi.stubGlobal` and validate both the API contract (URL parameter mapping against `docs.json`) and the catalog integrity (entry counts, unique IDs). If the API or catalogs change, these tests must be updated to match.
