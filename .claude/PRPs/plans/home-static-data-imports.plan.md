# Plan: Home Static Data Imports (HeroSection KPIs + SectorComparisonSection)

## Summary
Replace hardcoded dummy data in the two **static-import** home sections with real data from
`src/data/outputs/`. Phase 1: `HeroSection` KPIs from `summary.json`. Phase 2:
`SectorComparisonSection` from `top_categories.json`, classified into two columns by UNSPSC
segment code. Both use the static-JSON-import + shared-formatter pattern already established in
`Trends.tsx`. No API calls, no async, no `Home.tsx` changes.

## User Story
As a Mipyme owner visiting the RadarCompras home page, I want the hero stats and the
"Compras por Sector" panel to show real procurement figures, so I can trust the platform
reflects Guatemala's actual procurement activity.

## Problem → Solution
Hero shows fabricated figures (`20`, `1600+`, `Q10.8LM`) and the sector panel shows invented
sector names/amounts/trends (`dummyBlueSectors`, `dummyOrangeSectors`) → Hero shows real
`summary.json` totals; sector panel shows real UNSPSC segments and amounts from
`top_categories.json` (trend indicators removed — no historical baseline exists).

## Metadata
- **Complexity**: Small (two independent static-import changes batched)
- **Source PRD**: `RadarCompras/.claude/PRPs/prds/home-real-data.prd.md`
- **PRD Phases**: Phase 1 — HeroSection KPIs; Phase 2 — SectorComparisonSection (both `pending`,
  fully independent, marked "parallel" in the PRD)
- **Estimated Files**: 2 (`HeroSection.tsx`, `SectorComparisonSection.tsx`)

---

## UX Design

### Before
```
HERO:    [ 20 Procesos ] [ 1600+ Entidades ] [ Q10.8LM Monto Total ]      (3 fake)

SECTORES:  Sectores Sociales            Sectores Económicos
           Educación        Q42.5M ▲+12%   Agricultura...  Q31.2M ▲+18%
           Salud y Bien.    Q35.2M ▲+8%    Ambiente...     Q19.8M ▲+22%
           ...(invented names + fake trend %)
```

### After
```
HERO:  [143,233 Procesos registrados] [546 Entidades compradoras]
       [7,940 Proveedores] [50.22B GTQ Monto total]                       (4 real)

SECTORES:  Sectores Sociales                 Sectores Económicos
           Salud y Sociales   2.93B GTQ        Infraestructura   17.06B GTQ
           Medicamentos       2.38B GTQ        Industria/Manuf.   4.85B GTQ
           Alimentos          1.26B GTQ        Transporte/Log.    2.55B GTQ
           Educación          1.19B GTQ        Gestión/Negocios   2.05B GTQ
           Servicios educat.  0.75B GTQ        Almacenamiento     1.47B GTQ
                                               Telecomunicaciones 1.33B GTQ
                                               Equipos TIC        1.25B GTQ
           (real names + amounts; NO trend %; "unidades" not "procesos")
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| Hero KPI grid | 3 fabricated stats | 4 real stats from `summary.json` | Grid already `md:grid-cols-4` |
| Sector items | invented names, fake `Q...` amounts, trend arrows | real segment labels, real `formatAbbreviatedCurrency` amounts, no trend | `trend`/`percentage` removed from interface + render |
| Sector count line | `{n} procesos` | `{n} unidades` | `item_count` ≠ process count (PRD requires relabel) |
| Data source | inline dummy consts | static JSON import + formatters | Mirrors `Trends.tsx` |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `src/components/home/HeroSection.tsx` | 1-26 | Phase 1 target: `KPIStat`, `defaultKPIs`, prop default |
| P0 | `src/components/home/SectorComparisonSection.tsx` | 1-73 | Phase 2 target: `SectorData`, dummy consts, `SectorItem` render, prop defaults |
| P0 | `src/components/trends/Trends.tsx` | 7-10, 30-36, 56-59, 97-145 | Pattern to mirror: import JSON, `CategoryEntry` type, destructure, format |
| P0 | `src/utils/formatters.ts` | 11-13, 64-92 | `formatNumber` / `formatAbbreviatedCurrency` signatures + output |
| P1 | `src/data/outputs/summary.json` | all | Real `totals` values + key names |
| P1 | `src/data/outputs/top_categories.json` | all | `categories[]` shape; note codes 84/85/42/60/25 have `segment_name:"Otros"` |
| P2 | `src/components/home/Home.tsx` | 50-72 | Confirms neither section receives data props — defaults render |

## External Documentation
No external research needed — established internal patterns; `resolveJsonModule: true` is set in
`tsconfig.app.json`.

---

## Patterns to Mirror

### STATIC_JSON_IMPORT
```ts
// SOURCE: src/components/trends/Trends.tsx:7,10
import summaryData from '../../data/outputs/summary.json';
import topCategoriesData from '../../data/outputs/top_categories.json';
```
HeroSection and SectorComparisonSection are both in `src/components/home/` → identical
`'../../data/outputs/...'` relative path.

### CATEGORY_ENTRY_TYPE
```ts
// SOURCE: src/components/trends/Trends.tsx:30-36
interface CategoryEntry {
  rank: number;
  segment_code: string;
  segment_name: string;
  total_amount_gtq: number;
  pct_of_total: number;
  item_count: number;
}
```

### DESTRUCTURE_AND_CAST
```ts
// SOURCE: src/components/trends/Trends.tsx:56,59
const { totals } = summaryData;
const categories = topCategoriesData.categories as CategoryEntry[];
```

### NUMBER_FORMATTING
```ts
// SOURCE: src/components/trends/Trends.tsx:97,113 + src/utils/formatters.ts:64-92
formatNumber(totals.processes)                  // "143,233"
formatAbbreviatedCurrency(totals.total_amount_gtq)  // "50.22B GTQ"
```

### FORMATTER_IMPORT
```ts
// SOURCE: src/components/detail/ProcessDetail.tsx:6
import { formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';
```

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `src/components/home/HeroSection.tsx` | UPDATE | Replace `defaultKPIs` literals with `summary.json` totals |
| `src/components/home/SectorComparisonSection.tsx` | UPDATE | Replace dummy sectors with `top_categories.json` classified by UNSPSC segment; remove trend/percentage |

## NOT Building
- KPI deep analysis / richer hero metrics (PRD Phase 7, separate PRD).
- Trend/percentage indicators in the sector panel (PRD "Won't" — no historical baseline).
- Any change to the `KPIStat` interface or `kpiStats`/`blueSectors`/`orangeSectors` prop
  contracts beyond removing `trend`/`percentage` from `SectorData`.
- Any `Home.tsx` change — it passes no data props, so the new component defaults render.
- Other home sections / API wiring (PRD Phases 3-6).

---

## Step-by-Step Tasks

### Task 1: HeroSection — import summary data + formatters
- **ACTION**: Add static import and named formatter import after `import { Button }...` (line 3).
- **IMPLEMENT**:
  ```ts
  import summaryData from '../../data/outputs/summary.json';
  import { formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';
  ```
- **MIRROR**: STATIC_JSON_IMPORT, FORMATTER_IMPORT.
- **GOTCHA**: relative path `'../../data/outputs/summary.json'`; `resolveJsonModule` already on.
- **VALIDATE**: `npm run typecheck` resolves imports.

### Task 2: HeroSection — replace `defaultKPIs` (lines 16-20)
- **ACTION**: Derive the four KPIs from `summaryData.totals`.
- **IMPLEMENT**:
  ```ts
  const { totals } = summaryData;

  const defaultKPIs: KPIStat[] = [
    { label: 'Procesos registrados', value: formatNumber(totals.processes) },
    { label: 'Entidades compradoras', value: formatNumber(totals.unique_buyers) },
    { label: 'Proveedores', value: formatNumber(totals.unique_suppliers) },
    { label: 'Monto total', value: formatAbbreviatedCurrency(totals.total_amount_gtq) },
  ];
  ```
- **MIRROR**: DESTRUCTURE_AND_CAST, NUMBER_FORMATTING.
- **GOTCHA**: `formatAbbreviatedCurrency(50222443389.64)` → `"50.22B GTQ"`, not the PRD's
  literal `"Q50.2B"`. Prefer the shared formatter (real value, no hardcoded string). See Risks.
- **VALIDATE**: 4 cells render (markup already `md:grid-cols-4`).

### Task 3: SectorComparisonSection — imports + types
- **ACTION**: Add JSON import, formatter import, and the `CategoryEntry` type.
- **IMPLEMENT**:
  ```ts
  import topCategoriesData from '../../data/outputs/top_categories.json';
  import { formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';

  interface CategoryEntry {
    rank: number;
    segment_code: string;
    segment_name: string;
    total_amount_gtq: number;
    pct_of_total: number;
    item_count: number;
  }
  ```
- **MIRROR**: STATIC_JSON_IMPORT, CATEGORY_ENTRY_TYPE, FORMATTER_IMPORT.
- **VALIDATE**: typecheck resolves.

### Task 4: SectorComparisonSection — UNSPSC segment map + builders
- **ACTION**: Define a code→{column,label} lookup and build the two sector arrays. Replace the
  `dummyBlueSectors`/`dummyOrangeSectors` constants (lines 20-36).
- **IMPLEMENT**:
  ```ts
  // UNSPSC segment classification (PRD Decisions Log: standards-based code lookup).
  // Labels are defined here, NOT read from segment_name: codes 84/85 are "Otros" in the JSON.
  const SECTOR_SEGMENTS: Record<string, { column: 'social' | 'economic'; label: string }> = {
    // Sectores Sociales (blue)
    '50': { column: 'social', label: 'Alimentos' },
    '51': { column: 'social', label: 'Medicamentos' },
    '52': { column: 'social', label: 'Equipo médico' },
    '53': { column: 'social', label: 'Cuidado personal' },
    '83': { column: 'social', label: 'Salud y Sociales' },
    '84': { column: 'social', label: 'Servicios educativos' },
    '85': { column: 'social', label: 'Educación' },
    // Sectores Económicos (orange)
    '30': { column: 'economic', label: 'Transporte/Logística' },
    '43': { column: 'economic', label: 'Equipos TIC' },
    '56': { column: 'economic', label: 'Telecomunicaciones' },
    '72': { column: 'economic', label: 'Infraestructura' },
    '78': { column: 'economic', label: 'Almacenamiento' },
    '80': { column: 'economic', label: 'Gestión/Negocios' },
    '81': { column: 'economic', label: 'Industria/Manufactura' },
  };

  const categories = topCategoriesData.categories as CategoryEntry[];

  const buildSectors = (column: 'social' | 'economic'): SectorData[] =>
    categories
      .filter((c) => SECTOR_SEGMENTS[c.segment_code]?.column === column)
      .map((c) => ({
        id: c.segment_code,
        name: SECTOR_SEGMENTS[c.segment_code].label,
        processCount: c.item_count,
        totalAmount: formatAbbreviatedCurrency(c.total_amount_gtq),
      }));

  const realBlueSectors = buildSectors('social');
  const realOrangeSectors = buildSectors('economic');
  ```
  Update the component default props (lines 70-71):
  ```ts
  blueSectors = realBlueSectors,
  orangeSectors = realOrangeSectors,
  ```
- **MIRROR**: DESTRUCTURE_AND_CAST.
- **GOTCHA**: `categories` is pre-sorted by `rank` (amount desc); `filter` preserves that order,
  so each column is already ranked. Codes 42/60/25 ("Otros") are absent from the map → excluded
  via `?.column` (PRD: "filter to known segments only"). Segments 52/53 are not present in the
  current data file — that's fine; they simply produce no row.
- **VALIDATE**: `realBlueSectors` has rows for 83/51/50/85/84; `realOrangeSectors` for
  72/81/30/80/78/56/43.

### Task 5: SectorComparisonSection — remove trend/percentage from interface + render
- **ACTION**: Drop `trend` and `percentage` from `SectorData` (lines 10-11); remove the
  `TrendingUp` import (line 3); remove the trend/percentage block in `SectorItem` (the
  `trendColor` const on line 45 and the `{sector.percentage && (...)}` block lines 58-63);
  relabel the count line.
- **IMPLEMENT**:
  - `SectorData` becomes: `{ id: string; name: string; processCount: number; totalAmount: string; }`
  - In `SectorItem`, change line 54 from `{sector.processCount} procesos` to
    `{formatNumber(sector.processCount)} unidades` (PRD: clarify these are item units).
  - Remove `import { TrendingUp } from 'lucide-react';`.
- **MIRROR**: NUMBER_FORMATTING (for the count).
- **GOTCHA**: After removing `trend`, ensure no remaining reference (`trendColor`,
  `sector.trend`, `sector.percentage`, `TrendingUp`) survives or typecheck fails.
- **VALIDATE**: `grep -n "trend\|percentage\|TrendingUp\|dummy" src/components/home/SectorComparisonSection.tsx`
  returns nothing.

### Task 6: Confirm no external consumers of the changed shapes
- **ACTION**: Confirm `Home.tsx` passes neither `kpiStats` nor `blueSectors`/`orangeSectors`
  (so defaults render), and `SectorData` isn't constructed elsewhere expecting `trend`.
- **IMPLEMENT**: No code change — confirmation only.
- **VALIDATE**:
  - `grep -rn "kpiStats" src` → only `HeroSection.tsx`.
  - `grep -rn "SectorData" src` → only `SectorComparisonSection.tsx` (Home passes only the
    `onSelectSector` callback).

---

## Testing Strategy

### Unit Tests
No unit tests for this phase. The existing suite (`src/services/__tests__/`) covers the
API/catalog contract only; there are no React component tests in the codebase, so adding one for
static literal maps would break with convention.

| Test | Input | Expected | Edge? |
|---|---|---|---|
| (manual) Hero render | `summary.json` totals | 4 real KPI cells | No |
| (manual) Sector render | `top_categories.json` | social: 5 rows, economic: 7 rows, no trends | Yes — "Otros" codes excluded |

### Edge Cases Checklist
- [x] Unknown/"Otros" segment codes (42/60/25) — excluded by `SECTOR_SEGMENTS[...]?.column`.
- [x] Mapped code missing from data (52/53) — simply yields no row.
- [x] Invalid types — guarded by `resolveJsonModule` typed import + interface typing.
- [ ] Network / async / concurrency — N/A (static imports only).

---

## Validation Commands

### Static Analysis
```bash
npm run typecheck
```
EXPECT: Zero type errors.

### Lint
```bash
npm run lint
```
EXPECT: No new lint errors in the two files.

### Tests (regression)
```bash
npm run test
```
EXPECT: No regressions (no API/catalog code touched).

### Dummy-constant check (PRD success metric)
```bash
grep -rn "dummy\|Dummy" src/components/home/HeroSection.tsx src/components/home/SectorComparisonSection.tsx
```
EXPECT: Nothing — `defaultKPIs`, `dummyBlueSectors`, `dummyOrangeSectors` all gone/derived.

### Browser Validation
```bash
npm run dev
```
EXPECT: Hero shows `143,233 / 546 / 7,940 / 50.22B GTQ`. Sector panel shows real labels with
`...B GTQ` amounts, `N unidades` counts, and no trend arrows.

### Manual Validation
- [ ] Hero: 4 cells, real values, correct labels.
- [ ] Sociales column: Salud y Sociales, Medicamentos, Alimentos, Educación, Servicios educativos.
- [ ] Económicos column: Infraestructura, Industria/Manufactura, Transporte/Logística, etc.
- [ ] No trend percentages or arrows anywhere in the sector panel.
- [ ] No "Otros" rows.
- [ ] No console errors.

---

## Acceptance Criteria
- [ ] `defaultKPIs` derived from `summary.json` (no fabricated literals).
- [ ] Sector columns derived from `top_categories.json` via `SECTOR_SEGMENTS`.
- [ ] `trend`/`percentage` removed from `SectorData` and render; `TrendingUp` import gone.
- [ ] Count line reads "unidades".
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` all pass.
- [ ] Dummy-constant grep returns nothing.

## Completion Checklist
- [ ] Mirrors the `Trends.tsx` static-import + formatter pattern.
- [ ] Uses shared formatters (no inline number/currency formatting).
- [ ] No hardcoded data values; labels come from the documented UNSPSC map.
- [ ] No `Home.tsx` change.
- [ ] No scope additions beyond Phases 1 & 2.
- [ ] Self-contained — no questions needed during implementation.

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `formatAbbreviatedCurrency` outputs `"50.22B GTQ"` vs PRD `"Q50.2B"` | High | Low | Prefer shared formatter (real value, no hardcode). Escalate if exact glyph mandated. |
| JSON `segment_name` is "Otros" for codes 84/85 | High (already true) | Med | Labels sourced from `SECTOR_SEGMENTS`, never from `segment_name`. |
| `SectorData` consumed elsewhere expecting `trend` | Low | Med | Task 6 grep confirms only-local usage before removing fields. |
| Large `item_count` values look odd as "unidades" | Low | Low | Formatted via `formatNumber`; PRD explicitly relabels from "procesos". |
| Stale data period (2026-01 → 2026-04) | Low | Low | Out of scope; pipeline concern. |

## Notes
- Phases 1 and 2 are independent static-import changes the PRD marks "parallel" — batching them
  is purely organizational; they touch separate files with zero shared code.
- Both component KPI/sector grids already have the layout to hold the real data (no markup
  restructuring needed beyond removing the trend block).
- Supersedes the standalone `herosection-kpis.plan.md` (removed).
