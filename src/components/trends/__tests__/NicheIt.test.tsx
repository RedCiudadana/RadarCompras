import { describe, it, expect } from 'vitest';
import { shouldShowMonthlyChart, hasItItem } from '../NicheIt';
import type { Release } from '../../../types/ocds';

describe('shouldShowMonthlyChart', () => {
  it('returns false when there are fewer than 3 months of data', () => {
    expect(shouldShowMonthlyChart([{ month: '2026-01', processes: 10 }])).toBe(false);
    expect(
      shouldShowMonthlyChart([
        { month: '2026-01', processes: 10 },
        { month: '2026-02', processes: 20 },
      ])
    ).toBe(false);
  });

  it('returns true when there are 3 or more months of data', () => {
    expect(
      shouldShowMonthlyChart([
        { month: '2026-01', processes: 10 },
        { month: '2026-02', processes: 20 },
        { month: '2026-03', processes: 30 },
      ])
    ).toBe(true);
  });
});

function releaseWithItems(classificationIds: string[]): Release {
  return {
    tender: {
      items: classificationIds.map(id => ({ classification: { id } })),
    },
  } as Release;
}

describe('hasItItem', () => {
  it('returns true when any item is classified under the given UNSPSC prefix', () => {
    expect(hasItItem(releaseWithItems(['43211508', '12345678']), '43')).toBe(true);
  });

  it('returns false when no item matches the prefix', () => {
    expect(hasItItem(releaseWithItems(['12345678', '98765432']), '43')).toBe(false);
  });

  it('returns false when the release has no items', () => {
    expect(hasItItem(releaseWithItems([]), '43')).toBe(false);
  });
});
