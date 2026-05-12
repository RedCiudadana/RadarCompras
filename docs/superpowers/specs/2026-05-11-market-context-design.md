# Market Context Section Design Spec

**Date:** 2026-05-11  
**Feature:** Market Context historical pricing comparison  
**Goal:** Help SMEs and providers assess tender competitiveness by comparing against recent similar tenders

---

## 1. Overview

The **Market Context** section surfaces historical pricing data in the ProcessDetail view. When a user views an active tender, they see a table of the last 4 months' completed tenders from the same buyer in the same product category — showing what similar processes actually cost, who won them, and when they closed.

This answers the critical question: **"Is this tender's budget realistic and competitive?"**

---

## 2. User Need

**Primary persona:** SMEs, vendors, and providers evaluating whether to bid on a procurement opportunity.

**Decision point:** When viewing an active tender (status: no awards yet), they need real-world pricing signals to assess:
- Is the budget realistic for this type of product/service?
- What did similar past purchases from this buyer cost?
- What companies typically win these tenders?

**Success metric:** Provider can quickly gauge market-typical pricing and decide to bid or pass.

---

## 3. Scope

### What's Included
- Fetching completed tenders from the same buyer + category within the last 4 months
- Displaying a sortable table with date, awarded amount, supplier name, and status
- Handling empty states (no comparables found)
- Loading states while fetching data

### What's NOT Included
- Budgeting tools or bid strategy advisors
- Real-time price trending or historical charts
- Comparison across multiple buyers or categories
- Filters to customize the 4-month window or comparison logic

---

## 4. Data Model & API Integration

### Data Source
**API Method:** `OCDSApi.searchReleases(filters, page)`

**Filter logic:**
1. Buyer ID: lookup in the parties array to the item with roles contain buyer and identifier.schema = GT-GCUC, use the valude  identifier.id.split('-')[0]
2. Category (UNSPCS family): extracted from current tender's `release.tender.items[].classification.id` (first 4 chars = family code)
3. Date range: last 4 months from today
4. Status: StatusRelease.Adjudicado and StatusRelease.Vigente tenders only (with `awards` data)

**Client-side filtering:**
- Fetch tenders matching buyer + category
- Filter for `awards` array not empty (indicates completion)
- Filter for `datePublished` within last 4 months
- Sort by `datePublished` descending (most recent first)
- Take first 4 results

### Data Displayed in Table

| Column | Source | Format | Notes |
|--------|--------|--------|-------|
| **Date** | `tender.datePublished` or `release.date` | `formatDate()` | ISO string → "DD MMM YYYY" |
| **Awarded Amount** | `awards[0].value.amount` | `formatCurrency(amount, currency)` | Use first award's amount and currency |
| **Winner** | `awards[0].suppliers[0].name` | Plain text | Primary supplier from first award |
| **Status** | `tender.statusDetails ?? tender.status` | Plain text | e.g., "Adjudicado", "Finalizado Adjudicado" |

### Edge Cases
- **Multiple awards:** Show the first award (index 0)
- **Multiple suppliers in an award:** Show the first supplier
- **Missing data:** Fallback to "—" if field is absent
- **No comparables:** Display empty state (see section 5)

---

## 5. UI & UX

### Location in ProcessDetail
Positioned after the "Key facts strip" and before the "Buyer" section. This gives market context before explaining who the buyer is.

### Section Structure
```
┌─────────────────────────────────────────────────────────┐
│ Market Context (Last 4 Months)                          │
│ Similar tenders from [Buyer Name] in [Category Name]    │
│                                                         │
│ [Table]                                                 │
│                                                         │
│ X comparable processes found                            │
└─────────────────────────────────────────────────────────┘
```

### Section Header
- **Title:** "Market Context (Last 4 Months)"
- **Subtitle:** "Similar tenders from {buyer.name} in {category.name}"
  - Category name sourced from `UNSPCS_FAMILIES` constant (same as ReleaseRow)

### Table
- **Container:** Reuse existing `.bg-white border border-rc-border rounded-lg overflow-hidden` styling (matches Items section)
- **Columns:** Date | Awarded Amount | Winner | Status
- **Row styling:** `.flex items-center gap-4 px-4 py-3 border-b border-rc-border last:border-b-0`
- **Column widths:** Flexible, responsive
- **Text styling:** 
  - Date: `text-sm text-rc-text-base`
  - Amount: `font-semibold text-rc-accent` (emphasize currency like in key facts)
  - Winner: `text-sm text-rc-text-base`
  - Status: `text-xs text-rc-text-subtle`
- **Sort order:** Date descending (most recent first)

### Footer Text
Below the table: `"{count} comparable processes found"` (e.g., "4 comparable processes found")

### Empty State
If no comparable tenders found:
```
┌─────────────────────────────────────────────────────────┐
│ Market Context (Last 4 Months)                          │
│ Similar tenders from [Buyer Name] in [Category Name]    │
│                                                         │
│ No comparable tenders found in the last 4 months.       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
- Centered, `text-sm text-rc-text-subtle`

### Loading State
While fetching comparables (async):
```
┌─────────────────────────────────────────────────────────┐
│ Market Context (Last 4 Months)                          │
│                                                         │
│ [Spinner] Loading market context...                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
- Use existing `<Loading />` component or inline spinner

### Error State
If API call fails:
```
┌─────────────────────────────────────────────────────────┐
│ Market Context (Last 4 Months)                          │
│                                                         │
│ Unable to load market context. Please try again.        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
- `text-xs text-rc-text-subtle`, graceful fallback (no error page)

---

## 6. Implementation Details

### Component Structure
Create new component: `src/components/detail/MarketContext.tsx`

**Props:**
```typescript
interface MarketContextProps {
  release: Release;
  tender: Tender;
  category: string; // UNSPCS family code (e.g., "8512")
}
```

**Responsibilities:**
1. Extract buyer ID and category from props
2. Fetch comparable tenders via `OCDSApi.searchReleases()`
3. Filter and sort results client-side
4. Render table or empty/error state
5. Format amounts and dates

### State Management
- `comparables: Release[]` — array of comparable tenders
- `loading: boolean` — while fetching
- `error: boolean` — if fetch fails

### API Call Logic
```typescript
const fetchComparables = async () => {
  const now = new Date();
  const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, 1);
  
  const { data } = await OCDSApi.searchReleases({
    entidad: release.buyer.id,
    category: category,
    startDate: formatISO(fourMonthsAgo),
    endDate: formatISO(now),
    estatus: StatusRelease.Adjudicado, // or equivalent "complete" status
  });
  
  // Client-side: filter for awards, sort by date, take first 4
  const filtered = data
    .filter(r => r.awards && r.awards.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
  
  setComparables(filtered);
};
```

### Integration into ProcessDetail
In `ProcessDetail.tsx`, after the key facts strip:

```tsx
{tender && (
  <MarketContext 
    release={detail} 
    tender={tender}
    category={getFamilyCode(tender.items)}
  />
)}
```

Add helper to extract UNSPCS family code from tender items:
```typescript
function getFamilyCode(items: Item[]): string | null {
  if (!items || items.length === 0) return null;
  const code = items[0].classification?.id;
  return code ? code.slice(0, 4) : null;
}
```

---

## 7. Data Quality & Assumptions

### Assumptions
1. **Buyer ID stability:** Buyer IDs in `release.buyer.id` match the `Entidad` parameter in the API
2. **Category extraction:** First item's classification ID is representative of the tender's category
3. **Award data:** Completed tenders have non-empty `awards` array
4. **Currency consistency:** All awards from the same buyer are in the same currency (or use first award's currency)

### Validation
- If `buyer.id` is empty → skip fetch, show empty state
- If no items or classification → skip fetch, show "Unable to load"
- If fetch fails → show error state, log to console
- If comparables array is empty → show "No comparable tenders found"

---

## 8. Testing Strategy

### Unit Tests
- Extract and test `getFamilyCode()` helper
- Test filter logic (awards present, date range, sort order)
- Test formatting (amounts, dates, names fallbacks)

### Integration Tests
- Mock `OCDSApi.searchReleases()` to return sample data
- Verify table renders with correct data
- Verify empty state when no comparables
- Verify error state on API failure
- Verify loading state during fetch

### E2E Tests
- Navigate to ProcessDetail with a tender
- Verify MarketContext section loads
- Verify table displays expected comparables
- Verify data matches source tenders

---

## 9. Future Enhancements (Out of Scope)

- Clickable rows linking to comparable tender details
- Date range slider to customize lookback period
- Filtering by procurement method or supplier
- Mini sparkline showing price trend
- Export comparables as CSV

---

## 10. Acceptance Criteria

- [ ] MarketContext component exists at `src/components/detail/MarketContext.tsx`
- [ ] Fetches completed tenders from same buyer + category, last 4 months
- [ ] Displays table with Date | Awarded Amount | Winner | Status
- [ ] Shows count of comparables below table
- [ ] Empty state displays when no comparables found
- [ ] Loading state displays while fetching
- [ ] Error state displays gracefully on API failure
- [ ] Integrated into ProcessDetail after key facts strip
- [ ] Uses existing rc-* color tokens and styling patterns
- [ ] All data formatted consistently (dates, currency, names)
- [ ] Unit tests for filtering and formatting logic
- [ ] Deployed and tested in browser

