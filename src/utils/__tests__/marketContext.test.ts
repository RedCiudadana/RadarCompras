import { describe, it, expect } from 'vitest';
import { Item, Party } from '../../types/ocds';
import { getBuyerEntidadId, getFamilyCode, getLastNMonths } from '../marketContext';

describe('getBuyerEntidadId', () => {
  it('returns the first segment of the GT-GCUC buyer identifier', () => {
    const parties = [
      {
        identifier: { scheme: 'GT-CISP', id: '12100503' },
        roles: ['buyer'],
        name: 'X',
        id: 'GT-CISP-12100503',
      },
      {
        identifier: { scheme: 'GT-GCUC', id: '207-3' },
        roles: ['buyer'],
        name: 'Y',
        id: 'GT-GCUC-207-3',
      },
    ] as unknown as Party[];

    expect(getBuyerEntidadId(parties)).toBe('207');
  });

  it('returns null when no GT-GCUC buyer party exists', () => {
    const parties = [
      {
        identifier: { scheme: 'GT-CISP', id: '12100503' },
        roles: ['buyer'],
      },
      {
        identifier: { scheme: 'GT-GCUC', id: '207-3' },
        roles: ['supplier'],
      },
    ] as unknown as Party[];

    expect(getBuyerEntidadId(parties)).toBeNull();
  });

  it('returns null for empty or missing input', () => {
    expect(getBuyerEntidadId(undefined)).toBeNull();
    expect(getBuyerEntidadId([])).toBeNull();
  });

  it('returns null when identifier.id has no value before the dash', () => {
    const parties = [
      {
        identifier: { scheme: 'GT-GCUC', id: '' },
        roles: ['buyer'],
      },
    ] as unknown as Party[];

    expect(getBuyerEntidadId(parties)).toBeNull();
  });
});

describe('getFamilyCode', () => {
  it('returns the first 4 chars of the first item classification id', () => {
    const items = [
      { classification: { id: '72141701', scheme: 'UNSPSC' } },
      { classification: { id: '99999999', scheme: 'UNSPSC' } },
    ] as unknown as Item[];

    expect(getFamilyCode(items)).toBe('7214');
  });

  it('returns null when items is empty or missing', () => {
    expect(getFamilyCode(undefined)).toBeNull();
    expect(getFamilyCode([])).toBeNull();
  });

  it('returns null when classification id is missing or too short', () => {
    expect(getFamilyCode([{ classification: { id: '', scheme: 'X' } }] as unknown as Item[])).toBeNull();
    expect(getFamilyCode([{ classification: { id: '12', scheme: 'X' } }] as unknown as Item[])).toBeNull();
    expect(getFamilyCode([{} as Item])).toBeNull();
  });
});

describe('getLastNMonths', () => {
  it('returns N most-recent months including the anchor, newest first', () => {
    const result = getLastNMonths(4, new Date(2026, 4, 11));
    expect(result).toEqual([
      { year: 2026, month: 5 },
      { year: 2026, month: 4 },
      { year: 2026, month: 3 },
      { year: 2026, month: 2 },
    ]);
  });

  it('crosses year boundaries correctly', () => {
    const result = getLastNMonths(4, new Date(2026, 1, 15));
    expect(result).toEqual([
      { year: 2026, month: 2 },
      { year: 2026, month: 1 },
      { year: 2025, month: 12 },
      { year: 2025, month: 11 },
    ]);
  });

  it('returns an empty array when n is 0', () => {
    expect(getLastNMonths(0, new Date(2026, 4, 11))).toEqual([]);
  });
});
