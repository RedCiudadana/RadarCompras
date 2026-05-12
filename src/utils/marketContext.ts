import { Item, Party } from '../types/ocds';

export function getBuyerEntidadId(parties: Party[] | undefined): string | null {
  if (!parties || parties.length === 0) return null;
  const buyer = parties.find(
    p => p.roles?.includes('buyer') && p.identifier?.scheme === 'GT-GCUC'
  );
  const rawId = buyer?.identifier?.id;
  if (!rawId) return null;
  const head = rawId.split('-')[0];
  return head || null;
}

export function getFamilyCode(items: Item[] | undefined): string | null {
  if (!items || items.length === 0) return null;
  const code = items[0].classification?.id;
  if (!code || code.length < 4) return null;
  return code.slice(0, 4);
}

export function getLastNMonths(
  n: number,
  from: Date = new Date()
): { year: number; month: number }[] {
  const out: { year: number; month: number }[] = [];
  const base = new Date(from.getFullYear(), from.getMonth(), 1);
  for (let i = 0; i < n; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    out.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return out;
}
