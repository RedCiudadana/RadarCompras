# Home Page — Real Data Integration

## Problem Statement

The RadarCompras home page shows hardcoded dummy data in four sections (HeroSection KPIs,
ProcessesClosingSoonSection, RecentBiddingsSection, SectorComparisonSection). Users see
fabricated figures that bear no relation to Guatemala's actual procurement activity, undermining
trust in the platform. Real data sources already exist: the OCDS API at `ocds.guatecompras.gt`
and pre-calculated analytics files in `src/data/outputs/`.

## Evidence

- All four home sections have explicit dummy constants (`dummyProcesses`, `dummyBiddings`,
  `dummyBlueSectors`, `defaultKPIs`) — confirmed in source code.
- `summary.json` contains real totals: 143,233 procesos, 546 entidades, 7,940 proveedores,
  Q50.2B total (period 2026-01-02 → 2026-04-08).
- `OCDSApi.searchReleases` is functional and used in the search view — API integration pattern
  already established.
- The OCDS API limitation (no text search, no amount filter, requires Año/Mes) is documented in
  `ocdsApi.ts` and `CLAUDE.md`.

## Proposed Solution

Replace all dummy data with live or static real data:
- **HeroSection KPIs**: static import from `summary.json` (no API call; plan for richer KPIs is
  a separate pending PRD).
- **ProcessesClosingSoonSection**: live API call for `Compra Directa` (modalidades 1, 33) with
  `Estatus=Vigente` for current month.
- **RecentBiddingsSection**: live API call for `Cotización` (modalidad 3) and `Licitación
  Pública` (modalidad 4) with `Estatus=Vigente` for current month. Refactor component to accept
  `Release[]` directly, replacing the custom `BiddingItem` type.
- **SectorComparisonSection**: static import from `top_categories.json`, classified by UNSPSC
  segment code rules.

## Key Hypothesis

We believe replacing dummy data with real procurement data will make the home page trustworthy
and actionable for Mipyme users discovering the platform.
We'll know we're right when zero hardcoded dummy constants remain in any home component.

## What We're NOT Building

- Free-text search integration — OCDS API does not support it.
- Amount-based filtering on the home page — API does not support it.
- KPI deep analysis / richer metrics for HeroSection — deferred to pending KPI plan (Phase 7).
- Trend percentages for SectorComparisonSection — `top_categories.json` has no historical
  comparison period; trend indicators are removed.
- Pagination on home page sections — show a fixed cap (6 items) per section.

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Dummy constants removed | 0 remaining | `grep -r "dummy\|Dummy" src/components/home/` returns nothing |
| Home loads real data | Visible on load | Manual observation |
| Empty state shown when API fails | Always | Disconnect network, reload |
| TypeScript build passes | 0 errors | `npm run typecheck` |

## Open Questions

- [ ] KPI analysis: what richer metrics can be derived from `radar-compras-data` notebooks?
  (Pending separate plan)
- [ ] Accepted default for missing `tenderPeriod.endDate`: use `release.date` as proxy
  (compras directas are published and close same day).

---

## Users & Context

**Primary User**
- **Who**: Mipyme owner or procurement officer visiting the home page for the first time.
- **Current behavior**: Sees suspiciously round, obviously fake numbers and process titles.
- **Trigger**: Wants to know if there are relevant opportunities right now.
- **Success state**: Sees real process titles, real entity names, real amounts.

**Job to Be Done**
When I visit RadarCompras, I want to see real government procurement activity, so I can quickly
judge whether there are relevant opportunities for my business.

**Non-Users**
Large enterprises with dedicated procurement teams — they have direct GuateCompras access.

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | HeroSection KPIs from `summary.json` | Trivial static import; highest visibility |
| Must | ProcessesClosingSoonSection — live compras directas | Compras directas are 1-day windows = closing soon |
| Must | RecentBiddingsSection — live cotizaciones + licitaciones | Core home page value |
| Must | SectorComparisonSection — real category data | Replaces entirely fabricated sector names |
| Must | Loader + empty state replacing dummies | UX requirement |
| Must | Refactor RecentBiddingsSection to accept `Release[]` | Eliminates BiddingItem adapter debt |
| Should | ProcessCard handles missing `tenderPeriod.endDate` | Compras directas have no endDate |
| Won't | Trend percentages in SectorComparisonSection | No historical baseline in static files |
| Won't | Caching / stale-while-revalidate | Out of scope for this phase |

### MVP Scope

All Must items above. No new UI chrome — use existing components as-is except for the
`Release[]` refactor.

### User Flow

Home loads → skeleton/spinner shown → API calls resolve → real data rendered. If API fails →
empty state with "No hay procesos recientes disponibles" message. No dummy fallback.

---

## Technical Approach

**Feasibility**: HIGH

### Architecture Notes

**Data fetching in `Home.tsx`** (not inside section components):
- `useEffect` + `useState` for `closingSoon: Release[]` and `recentBiddings: Release[]`.
- `AbortController` passed to `searchReleases` for cleanup on unmount.
- Two independent API calls (one for modalidad 1/33, one for modalidad 3/4 — two sequential
  calls merged client-side since the API accepts one modalidad per call).
- Static imports for `summary.json` and `top_categories.json` (no async needed).

**ProcessesClosingSoonSection changes:**
- Remove `dummyProcesses` constant.
- Add `isLoading: boolean` prop to render skeleton.
- Add `endDate` fallback in `ProcessCard`: when `tenderPeriod.endDate` is absent, use
  `release.date` (compras directas are published and close same day).

**RecentBiddingsSection refactor:**
- Delete `BiddingItem` interface and `dummyBiddings` constant.
- Change prop type from `BiddingItem[]` to `Release[]`.
- Rewrite `BiddingCard` to consume `Release` fields directly.
- Add `isLoading: boolean` prop; add skeleton + empty state.
- `daysLeft` derived from `tender.tenderPeriod.endDate` if present, else shown as `"—"`.

**SectorComparisonSection — UNSPSC segment classification:**

| Column | Segment codes |
|--------|--------------|
| Sectores Sociales | 50 (Alimentos), 51 (Medicamentos), 52 (Equipo médico), 53 (Cuidado personal), 83 (Salud/Sociales), 84 (Servicios educativos), 85 (Educación) |
| Sectores Económicos | 30 (Transporte), 43 (TIC), 56 (Telecom), 72 (Infraestructura), 78 (Almacenamiento), 80 (Gestión), 81 (Manufactura) |

- Filter `top_categories.json` by segment code into two groups.
- Map to `SectorData` shape: `totalAmount` as formatted GTQ string, `processCount` from
  `item_count` (label should clarify these are units, not process count).
- Remove `trend` and `percentage` fields from display (no historical data available).

**HeroSection KPIs** — replace `defaultKPIs` with values from `summary.json`:
```ts
[
  { label: 'Procesos registrados', value: '143,233' },
  { label: 'Entidades compradoras', value: '546' },
  { label: 'Proveedores', value: '7,940' },
  { label: 'Monto total', value: 'Q50.2B' },
]
```
`kpiStats` prop already accepts `KPIStat[]` — no interface change needed.

### Technical Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| API returns 0 results for current month | Medium | Show empty state; do not fall back to dummy |
| `tenderPeriod.endDate` missing crashes `ProcessCard` | High | Guard with `?? release.date` fallback |
| `RecentBiddingsSection` refactor breaks existing callers | Low | Only called from `Home.tsx` |
| `top_categories.json` segment names contain "Otros" for unknown codes | Low | Filter to known segments only |

---

## Implementation Phases

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | HeroSection KPIs | Static import summary.json, replace defaultKPIs | complete | with 2 | - | `.claude/PRPs/plans/home-static-data-imports.plan.md` |
| 2 | SectorComparisonSection | Map top_categories.json via UNSPSC rules | complete | with 1 | - | `.claude/PRPs/plans/home-static-data-imports.plan.md` |
| 3 | ProcessCard endDate guard | Handle missing tenderPeriod.endDate | complete | - | - | `.claude/PRPs/plans/home-live-sections.plan.md` |
| 4 | ProcessesClosingSoonSection | Add isLoading + empty state; remove dummyProcesses | complete | with 5 | 3 | `.claude/PRPs/plans/home-live-sections.plan.md` |
| 5 | RecentBiddingsSection refactor | Rewrite to accept Release[]; add isLoading + empty state | complete | with 4 | 3 | `.claude/PRPs/plans/home-live-sections.plan.md` |
| 6 | Home.tsx data wiring | useEffect fetches for modalidades 1/33 and 3/4; pass props | complete | - | 4, 5 | - |
| 7 | KPI analysis | Analyze radar-compras-data notebooks for richer HeroSection KPIs | pending | - | - | (separate PRD) |

### Phase Details

**Phase 1: HeroSection KPIs**
- **Goal**: Show real aggregate stats in the hero.
- **Scope**: Static import `src/data/outputs/summary.json`; replace `defaultKPIs` constant in
  `HeroSection.tsx` with values derived from `summary.totals`.
- **Success signal**: Hero shows "143,233", "546", "7,940", "Q50.2B".

**Phase 2: SectorComparisonSection**
- **Goal**: Show real UNSPSC-based spending by sector.
- **Scope**: Static import `src/data/outputs/top_categories.json`; define UNSPSC segment →
  column mapping constant; map `categories[]` to `SectorData[]`; remove trend/percentage
  display; remove `dummyBlueSectors` / `dummyOrangeSectors`.
- **Success signal**: Section shows real sector names with real amounts.

**Phase 3: ProcessCard endDate guard**
- **Goal**: Prevent crash/invalid display when `tenderPeriod.endDate` is absent.
- **Scope**: Defensive fallback in `getDaysRemaining` and `formatDate` calls in `ProcessCard`;
  use `release.date` when `endDate` is undefined.
- **Success signal**: `npm run typecheck` passes; card renders without "Invalid Date".

**Phase 4: ProcessesClosingSoonSection**
- **Goal**: Show real vigente compras directas; never show dummy.
- **Scope**: Add `isLoading: boolean` prop; add skeleton loader and empty state; remove
  `dummyProcesses` constant and `createDummyRelease` helper.
- **Success signal**: Spinner on load; live titles from GuateCompras appear after fetch.

**Phase 5: RecentBiddingsSection refactor**
- **Goal**: Consume `Release[]` directly; never show dummy.
- **Scope**: Delete `BiddingItem` interface and `dummyBiddings`; rewrite `BiddingCard` against
  `Release`; add `isLoading` prop; add skeleton + empty state.
- **Success signal**: No `BiddingItem` reference remains; renders real processes.

**Phase 6: Home.tsx data wiring**
- **Goal**: Orchestrate API calls and pass real data to sections 4 and 5.
- **Scope**: Two `useEffect` fetch groups with `AbortController`; `isLoading` states passed to
  `ProcessesClosingSoonSection` and `RecentBiddingsSection`.
- **Success signal**: Real data appears; no console errors on unmount.

**Phase 7: KPI analysis (pending separate PRD)**
- **Goal**: Identify richer real-time or historical KPIs for HeroSection v2.
- **Scope**: Analysis of `radar-compras-data/outputs/` and Jupyter notebooks; produce a new
  PRD with proposed KPI definitions.

### Parallelism Notes

Phases 1 and 2 are fully independent static-import changes — run in parallel.
Phase 3 is a prerequisite for 4 and 5 (ProcessCard is used by both sections).
Phases 4 and 5 can run in parallel once phase 3 is done.
Phase 6 requires both 4 and 5 to be complete.

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| No dummy fallback | Empty state only | Keep dummy as fallback | User requirement |
| Fetch in Home.tsx | Centralized | Each section fetches its own | Avoids duplicate calls; one place to debug |
| Compras directas proxy endDate | Use `release.date` | Omit card / hide date | Legally close same day; date is always present |
| UNSPSC segment rules for sectors | Code lookup table | Manual label mapping | Standards-based; reproducible |
| Static import for analytics | Import JSON directly | Fetch at runtime | Files already bundled in `src/data/outputs/` |

---

## Research Summary

**Technical Context**
- `ProcessCard:46` reads `data.tender.tenderPeriod.endDate` unconditionally — crashes on
  compras directas; must be guarded (Phase 3).
- `RecentBiddingsSection.BiddingItem` has no OCDS equivalent — cleanest path is full refactor
  (Phase 5), not an adapter.
- `Home.tsx` currently passes zero data props to any section — all wire-up in one file (Phase 6).
- `src/data/outputs/` is already under `src/` in the Vite project → static JSON imports work.
- `OCDSApi.searchReleases` accepts one `modalidad` per call → two calls needed for
  cotizaciones + licitaciones, merged client-side in `Home.tsx`.

---

*Generated: 2026-06-07*
*Status: DRAFT*
