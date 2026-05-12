import { UNSPCS_FAMILIES } from './unspcs';

export const UNSPCS_MAP: Record<string, string> = Object.fromEntries(
  UNSPCS_FAMILIES.map(f => [f.code, f.name])
);
