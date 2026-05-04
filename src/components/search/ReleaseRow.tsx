import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Release } from '../../types/ocds';
import { formatDate } from '../../utils/formatters';
import { UNSPCS_FAMILIES } from '../../const/unspcs';

const UNSPSC_MAP: Record<string, string> = Object.fromEntries(
  UNSPCS_FAMILIES.map(f => [f.code, f.name])
);

function getFamilyNames(release: Release): string[] {
  const items = release.tender?.items;
  if (!items || items.length === 0) return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const item of items) {
    const code = item.classification?.id;
    if (!code) continue;
    const familyCode = code.slice(0, 4);
    if (seen.has(familyCode)) continue;
    seen.add(familyCode);
    const name = UNSPSC_MAP[familyCode];
    if (name) names.push(name);
  }
  return names;
}

function statusStyle(status?: string): { bg: string; text: string } {
  if (!status) return { bg: 'bg-gray-100', text: 'text-gray-500' };
  const s = status.toLowerCase();
  if (s.includes('vigent') || s.includes('activ')) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (s.includes('adjudic') || s.includes('seleccion')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
  if (s.includes('evaluac') || s.includes('espera') || s.includes('subast')) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  if (s.includes('desert') || s.includes('cancel') || s.includes('anulad') || s.includes('prescind') || s.includes('improbad')) return { bg: 'bg-red-100', text: 'text-red-600' };
  return { bg: 'bg-gray-100', text: 'text-gray-500' };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, terms?: string[]): React.ReactNode {
  if (!terms || terms.length === 0 || !text) return text;
  const cleaned = terms.map(t => t.trim()).filter(Boolean);
  if (cleaned.length === 0) return text;
  const re = new RegExp(`(${cleaned.map(escapeRegex).join('|')})`, 'gi');
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-rc-accent/20 text-rc-text-base rounded px-0.5">{part}</mark>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

interface ReleaseRowProps {
  release: Release;
  onClick?: () => void;
  highlightKeywords?: string[];
}

export const ReleaseRow: React.FC<ReleaseRowProps> = ({ release, onClick, highlightKeywords }) => {
  const tender = release.tender;
  const displayStatus = tender?.statusDetails ?? tender?.status;
  const st = statusStyle(displayStatus);
  const families = getFamilyNames(release);
  const publishDate = tender?.tenderPeriod?.startDate ?? tender?.datePublished ?? release.date;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-4 py-3 border-b border-rc-border last:border-b-0 hover:bg-rc-surface transition-colors text-left group"
    >
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Buyer */}
        <div className="font-sans text-xs uppercase tracking-wider text-rc-text-subtle truncate leading-tight">
          {release.buyer?.name ? highlight(release.buyer.name, highlightKeywords) : '—'}
        </div>

        {/* Tender title */}
        <div className="text font-medium text-rc-text-base mt-0.5 leading-snug line-clamp-2">
          {tender?.title ? highlight(tender.title, highlightKeywords) : 'Sin título'}
        </div>

        {/* Families + date row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
          {families.length > 0 ? (
            families.slice(0, 3).map(name => (
              <span
                key={name}
                className="inline-block text-xs px-1.5 py-0.5 rounded bg-rc-primary text-white max-w-[180px]"
              >
                {name}
              </span>
            ))
          ) : null}
          {families.length > 3 && (
            <span className="text-xs text-rc-text-subtle">+{families.length - 3}</span>
          )}
          <span className="text-xs text-rc-text-subtle tabular-nums ml-auto">
            {formatDate(publishDate)}
          </span>
        </div>
      </div>

      {/* Status badge + chevron */}
      <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
        {displayStatus && (
          <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${st.bg} ${st.text}`}>
            {displayStatus}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-rc-border group-hover:text-rc-text-subtle transition-colors" />
      </div>
    </button>
  );
};
