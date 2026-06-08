# Plan: Home Live Sections (ProcessCard guard + ClosingSoon + RecentBiddings refactor)

## Summary
Batched implementation of PRD Phases 3, 4, 5 — the component-side prep for live OCDS data on
the home page. Phase 3: make `ProcessCard` tolerate a missing `tenderPeriod.endDate` (compras
directas). Phase 4: `ProcessesClosingSoonSection` gains `isLoading` + empty state and loses its
dummy data. Phase 5: `RecentBiddingsSection` is refactored to consume `Release[]` directly
(dropping the `BiddingItem` adapter), with `isLoading` + empty state. **API wiring stays in
`Home.tsx` (Phase 6 — NOT in this plan).**

## User Story
As a Mipyme owner, I want the "Cierran Pronto" and "Licitaciones Recientes" home sections to
render real OCDS processes (with a loader while fetching and a clear empty state when there are
none), so I never see fabricated listings.

## Problem → Solution
`ProcessCard` reads `tender.tenderPeriod.endDate` unconditionally (crashes / "Invalid Date" on
compras directas); both list sections default to hardcoded dummy `Release[]` / `BiddingItem[]`
→ `ProcessCard` falls back to `release.date`; both sections accept real `Release[]`, show a
loader while loading and an empty state otherwise, with zero dummy constants.

## Metadata
- **Complexity**: Medium
- **Source PRD**: `RadarCompras/.claude/PRPs/prds/home-real-data.prd.md`
- **PRD Phases**: 3 (ProcessCard endDate guard), 4 (ProcessesClosingSoonSection), 5
  (RecentBiddingsSection refactor). Phase 3 is a prerequisite for 4 & 5; 4 & 5 are parallel.
- **Estimated Files**: 3 (`ProcessCard.tsx`, `ProcessesClosingSoonSection.tsx`,
  `RecentBiddingsSection.tsx`)

---

## UX Design

### Before
```
CIERRAN PRONTO:   [6 fabricated compra-directa cards, hardcoded]
LICITACIONES:     [6 fabricated BiddingItem cards, hardcoded]
ProcessCard:      crashes / "Invalid Date" when endDate missing
```

### After (this plan — components only; data arrives in Phase 6)
```
isLoading=true →  <Loading text="Cargando procesos..." />
isLoading=false, [] →  "No hay procesos recientes disponibles"
isLoading=false, [Release...] →  real cards (endDate falls back to release.date)
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| ProcessCard date | reads `tenderPeriod.endDate` always | `tenderPeriod?.endDate ?? data.date` | compras directas have no endDate |
| ClosingSoon default | `dummyProcesses` (6) | `[]` + `isLoading?` | loader / empty state |
| RecentBiddings prop | `biddings?: BiddingItem[]` | `biddings?: Release[]` + `isLoading?` | adapter removed |
| BiddingCard | consumes `BiddingItem` | consumes `Release` | `daysLeft` → `"—"` when no endDate |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `src/components/home/ProcessCard.tsx` | 10-20, 45-50, 85, 114, 156 | Phase 3 target: date helpers + every `endDate` read |
| P0 | `src/components/home/ProcessesClosingSoonSection.tsx` | all | Phase 4 target: dummy consts, default prop, render |
| P0 | `src/components/home/RecentBiddingsSection.tsx` | all | Phase 5 target: `BiddingItem`, dummy, `BiddingCard`, render |
| P0 | `src/components/search/ProcessSearch.tsx` | 5, 273-303 | Loader + empty-state pattern to mirror (`<Loading text=.../>`, empty `<div>`) |
| P1 | `src/types/ocds.ts` | 21-37 (`Release`), 137-187 (`Tender`/`Item`/`TenderPeriod`) | Field names for the `Release` rewrite |
| P1 | `src/components/ui/Loading.tsx` | all | The shared loader component (`text` prop) |
| P2 | `src/utils/formatters.ts` | 11-13, 64-92 | `formatNumber`/`formatAbbreviatedCurrency` for amounts/dates |
| P2 | `src/components/home/Home.tsx` | 55-67 | Both sections are rendered here; confirms Home passes no `biddings`/`processes` yet |

## External Documentation
No external research needed — established internal patterns (OCDS types, `OCDSApi`, `Loading`).

---

## Patterns to Mirror

### LOADER_AND_EMPTY_STATE
```tsx
// SOURCE: src/components/search/ProcessSearch.tsx:5,273,290-293
import { Loading } from '../ui/Loading';
// ...
{loading && page === 1 ? (
  <Loading text="Cargando procesos..." />
) : (
  releases.length === 0 && !loading ? (
    <div className="px-6 py-12 text-center text-rc-text-base/60 text-sm">
      No se encontraron procesos con los filtros seleccionados.
    </div>
  ) : ( /* grid */ )
)}
```

### AMOUNT_FROM_RELEASE
```tsx
// SOURCE: src/components/home/ProcessCard.tsx:48
const amount = data.awards?.[0]?.value?.amount || data.contracts?.[0]?.value?.amount || 0;
```

### DAYS_REMAINING
```tsx
// SOURCE: src/components/home/ProcessCard.tsx:10-15
const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  const closing = new Date(endDate);
  return Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
```

### SHARED_FORMATTERS
```tsx
// SOURCE: src/components/detail/ProcessDetail.tsx:6 + src/utils/formatters.ts
import { formatDate, formatAbbreviatedCurrency } from '../../utils/formatters';
// formatDate('2026-01-15') -> "15/01/2026"; formatAbbreviatedCurrency(3450000) -> "3.45M GTQ"
```

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `src/components/home/ProcessCard.tsx` | UPDATE | Guard missing `tenderPeriod.endDate` (Phase 3) |
| `src/components/home/ProcessesClosingSoonSection.tsx` | UPDATE | Remove dummy; add `isLoading` + empty state (Phase 4) |
| `src/components/home/RecentBiddingsSection.tsx` | UPDATE | Refactor to `Release[]`; remove `BiddingItem`/dummy; add `isLoading` + empty state (Phase 5) |

## NOT Building
- `Home.tsx` data wiring / `useEffect` / `AbortController` / API calls — **Phase 6**, separate.
- Pagination (PRD: fixed cap, no pagination on home).
- Any change to `OCDSApi` or `ocds.ts` types.
- Caching / stale-while-revalidate.

> **Intermediate state note**: After this plan, `Home.tsx` still passes no `processes`/`biddings`
> and no `isLoading`, so both sections render their **empty state** until Phase 6 wires the
> fetches. That is expected and acceptable; do not add a dummy fallback to compensate.

---

## Step-by-Step Tasks

### Task 1 (Phase 3): Guard `endDate` in `ProcessCard`
- **ACTION**: Compute a single safe `endDate` once and use it for both `getDaysRemaining` and
  `formatDate`, replacing the four direct `data.tender.tenderPeriod.endDate` reads.
- **IMPLEMENT**: In the component body (after line 45), add:
  ```tsx
  const endDate = data.tender.tenderPeriod?.endDate ?? data.date;
  const daysLeft = getDaysRemaining(endDate);
  ```
  Then replace the three remaining `formatDate(data.tender.tenderPeriod.endDate)` calls (lines
  85, 114, 156) with `formatDate(endDate)`.
- **MIRROR**: DAYS_REMAINING (unchanged helper).
- **GOTCHA**: Use optional chaining on `tenderPeriod` itself (`tenderPeriod?.endDate`) — for
  compras directas the whole period object may be absent, not just `endDate`. `data.date` is
  always present (OCDS required field). Keep the helper signatures (`string`) as-is.
- **VALIDATE**: `npm run typecheck` clean; no remaining
  `data.tender.tenderPeriod.endDate` reference: `grep -n "tenderPeriod.endDate" src/components/home/ProcessCard.tsx` → empty (only `tenderPeriod?.endDate`).

### Task 2 (Phase 4): `ProcessesClosingSoonSection` loader + empty state, remove dummy
- **ACTION**: Delete `createDummyRelease` (lines 12-48) and `dummyProcesses` (lines 50-57). Add
  `isLoading?: boolean` to props; default `processes = []`. Add `Loading` import. Render loader
  when `isLoading`, empty state when no processes, else the existing grid.
- **IMPLEMENT**:
  ```tsx
  import { Loading } from '../ui/Loading';
  // props:
  interface ProcessesClosingSoonSectionProps {
    processes?: Release[];
    isLoading?: boolean;
    onViewAll?: () => void;
    onSelectProcess?: (id: string) => void;
  }
  // component default: processes = [], isLoading = false
  // body inside <div className="max-w-6xl ..."> after <SectionHeader/>:
  {isLoading ? (
    <Loading text="Cargando procesos..." />
  ) : processes.length === 0 ? (
    <div className="px-6 py-12 text-center text-rc-text-base/60 text-sm">
      No hay procesos recientes disponibles
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* existing map unchanged */}
    </div>
  )}
  ```
- **MIRROR**: LOADER_AND_EMPTY_STATE.
- **GOTCHA**: The `Release` import (line 4) is still needed for the prop type — keep it.
- **VALIDATE**: `grep -n "dummy\|Dummy\|createDummyRelease" src/components/home/ProcessesClosingSoonSection.tsx` → empty; typecheck clean.

### Task 3 (Phase 5): Refactor `RecentBiddingsSection` to `Release[]`
- **ACTION**: Delete the `BiddingItem` interface (lines 5-16) and `dummyBiddings` (24-97).
  Change prop `biddings?: BiddingItem[]` → `Release[]` (default `[]`); add `isLoading?: boolean`.
  Rewrite `BiddingCard` to take `release: Release`. Add loader + empty state. Update imports.
- **IMPLEMENT**:
  ```tsx
  import { Building2, Calendar } from 'lucide-react';
  import { Release } from '../../types/ocds';
  import { Loading } from '../ui/Loading';
  import { formatDate, formatAbbreviatedCurrency } from '../../utils/formatters';

  interface RecentBiddingsSectionProps {
    biddings?: Release[];
    isLoading?: boolean;
    onViewAll?: () => void;
    onSelectBidding?: (id: string) => void;
  }

  const getDaysLeft = (endDate?: string): string => {
    if (!endDate) return '—';
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const BiddingCard: React.FC<{ release: Release; onClick?: () => void }> = ({ release, onClick }) => {
    const amount = release.awards?.[0]?.value?.amount || release.contracts?.[0]?.value?.amount || 0;
    const description = release.tender.items?.[0]?.description ?? '';
    const endDate = release.tender.tenderPeriod?.endDate;
    return (
      <div onClick={onClick} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-rc-blue transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-rc-blue transition-colors line-clamp-2 mb-2">
              {release.tender.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {release.buyer.name}
              </span>
            </div>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-lg font-bold text-rc-orange">{formatAbbreviatedCurrency(amount)}</div>
            <div className="text-xs text-gray-500">{release.tender.procurementMethodDetails}</div>
          </div>
        </div>
        {description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Publ. {formatDate(release.publishedDate || release.date)}
          </span>
          <span className="font-semibold text-rc-blue">Cierra en {getDaysLeft(endDate)}</span>
        </div>
      </div>
    );
  };
  ```
  Section body: same loader/empty/grid pattern as Task 2; map `biddings` → `<BiddingCard
  key={release.id} release={release} onClick={() => onSelectBidding?.(release.id)} />`.
- **MIRROR**: AMOUNT_FROM_RELEASE, SHARED_FORMATTERS, LOADER_AND_EMPTY_STATE.
- **GOTCHA**: Drop the `sector` chip entirely — `Release` has no clean sector field; do not
  fabricate one. `Cierra en —` is the intended display when `endDate` is absent (per PRD). The
  `BiddingItem` export is removed — confirm no external importer (Task 4).
- **VALIDATE**: `grep -n "BiddingItem\|dummy\|Dummy" src/components/home/RecentBiddingsSection.tsx` → empty; typecheck clean.

### Task 4: Confirm callers still compile
- **ACTION**: `Home.tsx` renders both sections (lines 55, 65). Confirm it passes neither
  `processes`/`biddings` nor `isLoading` (so defaults apply) and does not import `BiddingItem`.
- **IMPLEMENT**: No code change — confirmation only. (Home wiring is Phase 6.)
- **VALIDATE**:
  - `grep -rn "BiddingItem" src` → empty.
  - `npm run typecheck` → no new errors referencing the three changed files or `Home.tsx`.

---

## Testing Strategy

### Unit Tests
No unit tests added — the codebase has no React component tests (only `src/services/__tests__/`
for API/catalog contracts). Adding component tests here would diverge from convention.

| Test | Input | Expected | Edge? |
|---|---|---|---|
| (manual) ProcessCard no endDate | `Release` with `tenderPeriod` absent | renders date from `data.date`, no "Invalid Date" | Yes |
| (manual) ClosingSoon loading | `isLoading=true` | `<Loading>` shown | No |
| (manual) ClosingSoon empty | `processes=[]` | "No hay procesos recientes disponibles" | Yes |
| (manual) BiddingCard no endDate | `Release` w/o endDate | "Cierra en —" | Yes |

### Edge Cases Checklist
- [x] Missing `tenderPeriod`/`endDate` — guarded with `?.` + `data.date` / `"—"`.
- [x] Empty results — empty state, no dummy fallback.
- [x] Missing award/contract amount — `|| 0` fallback (existing pattern).
- [x] Missing first item description — conditional render.
- [ ] Network failure — handled in Phase 6 (`Home.tsx` try/catch); out of scope here.

---

## Validation Commands

### Static Analysis
```bash
npm run typecheck
```
EXPECT: Zero **new** errors in the three changed files / `Home.tsx`. (Pre-existing `TS6133`
unused-import errors elsewhere — `App.tsx`, `ProcessDetail.tsx`, `Navigation.tsx` — are
out of scope.)

### Lint
```bash
npm run lint
```
EXPECT: No new lint errors in the three files.

### Dummy-constant check (PRD success metric)
```bash
grep -rn "dummy\|Dummy\|BiddingItem" src/components/home/
```
EXPECT: Nothing.

### Build
```bash
npm run build
```
EXPECT: Succeeds.

### Browser Validation
```bash
npm run dev
```
EXPECT: Both sections show "No hay procesos recientes disponibles" (no data wired yet — Phase 6). No
crash, no "Invalid Date".

### Manual Validation
- [ ] No console errors on home load.
- [ ] Empty states visible in both sections.
- [ ] Grep checks above return empty.

---

## Acceptance Criteria
- [ ] `ProcessCard` renders with `tenderPeriod` absent (uses `data.date`).
- [ ] `ProcessesClosingSoonSection` has `isLoading` + empty state; no dummy.
- [ ] `RecentBiddingsSection` consumes `Release[]`; `BiddingItem`/dummy removed; loader + empty.
- [ ] `grep "dummy|Dummy|BiddingItem" src/components/home/` → empty.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` pass (no new errors).

## Completion Checklist
- [ ] Mirrors `ProcessSearch` loader/empty pattern and `ProcessCard` amount/days helpers.
- [ ] Uses shared formatters; no inline currency formatting added beyond existing.
- [ ] No dummy fallback anywhere.
- [ ] No `Home.tsx` data wiring (left for Phase 6).
- [ ] No scope additions beyond Phases 3-5.
- [ ] Self-contained — no questions needed during implementation.

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `tenderPeriod` object (not just endDate) absent | High | High | `tenderPeriod?.endDate ?? data.date` covers both |
| Removing `BiddingItem` breaks an importer | Low | Med | Task 4 grep — only `Home.tsx` uses the section, passes no `biddings` |
| Empty home until Phase 6 mistaken for a bug | Med | Low | Documented intermediate state; Phase 6 wires data next |
| `formatAbbreviatedCurrency` "3.45M GTQ" vs old `ProcessCard` "GTQ 3.5M" style | Low | Low | RecentBiddings uses shared formatter; ProcessCard keeps its local one (untouched) |

## Notes
- Phase 3 must land before 4/5 compile cleanly in practice (ProcessCard is rendered by
  ClosingSoon). Implement in task order.
- Phase 6 (Home.tsx `useEffect` fetches for modalidades 1/33 and 3/4, `AbortController`,
  `isLoading` wiring) is the natural next plan after this one.
- Modalidad codes confirmed in `src/const/catalogo.ts`: 1 = Compra Directa (Art.43 b),
  33 = Compra de Baja Cuantía, 3 = Cotización, 4 = Licitación Pública — relevant for Phase 6.
