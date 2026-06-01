import React, { useEffect, useState } from 'react';
import { TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { Release, StatusRelease } from '../../types/ocds';
import { OCDSApi } from '../../services/ocdsApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getLastNMonths } from '../../utils/marketContext';

interface MarketContextProps {
  entidadId: string;
  familyCode: string;
  buyerName: string;
  categoryName: string;
}

const MONTHS_LOOKBACK = 4;
const MAX_ROWS = 4;
const STATUSES = [StatusRelease.Adjudicado, StatusRelease.Vigente];

function pickAward(release: Release) {
  return release.awards?.[0];
}

function comparableDate(release: Release): string | undefined {
  return release.tender?.datePublished ?? release.date;
}

export const MarketContext: React.FC<MarketContextProps> = ({
  entidadId,
  familyCode,
  buyerName,
  categoryName,
}) => {
  const [comparables, setComparables] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError(false);
    setComparables([]);

    const months = getLastNMonths(MONTHS_LOOKBACK);
    const requests = months.flatMap(({ year, month }) =>
      STATUSES.map(estatus =>
        OCDSApi.searchReleases(
          { entidad: entidadId, year, month, estatus },
          1,
          50,
          abortController
        )
      )
    );

    Promise.all(requests)
      .then(results => {
        if (abortController.signal.aborted) return;

        const flat = results.flatMap(r => r.data);

        const deduped = new Map<string, Release>();
        for (const r of flat) {
          if (r.ocid && !deduped.has(r.ocid)) deduped.set(r.ocid, r);
        }

        const filtered = Array.from(deduped.values())
          .filter(r => {
            const items = r.tender?.items;
            if (!items || items.length === 0) return false;
            return items.some(i => i.classification?.id?.startsWith(familyCode));
          })
          .filter(r => Array.isArray(r.awards) && r.awards.length > 0)
          .sort((a, b) => {
            const da = new Date(comparableDate(a) ?? 0).getTime();
            const db = new Date(comparableDate(b) ?? 0).getTime();
            return db - da;
          })
          .slice(0, MAX_ROWS);

        setComparables(filtered);
        setLoading(false);
      })
      .catch(err => {
        if (abortController.signal.aborted) return;
        console.error('Error loading market context:', err);
        setError(true);
        setLoading(false);
      });

    return () => abortController.abort();
  }, [entidadId, familyCode]);

  return (
    <section>
      <h2 className="flex items-center gap-2 text-sm font-semibold text-blue uppercase tracking-wide mb-1">
        <TrendingUp className="w-4 h-4" />
        Contexto de mercado (Últimos {MONTHS_LOOKBACK} meses)
      </h2>
      <p className="text-xs text-rc-text-base/60 mb-3">
        Procesos similares de <span className="font-medium text-rc-text-base">{buyerName || '—'}</span>
        {' '}en{' '}
        <span className="font-medium text-rc-text-base">{categoryName}</span>
      </p>

      {loading && (
        <div className="bg-white border border-neutral-400 rounded-lg px-4 py-6 flex items-center justify-center gap-2 text-sm text-rc-text-base/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando contexto de mercado…
        </div>
      )}

      {!loading && error && (
        <div className="bg-white border border-neutral-400 rounded-lg px-4 py-6 text-center text-xs text-rc-text-base/60">
          No se pudo cargar el contexto de mercado.
        </div>
      )}

      {!loading && !error && comparables.length === 0 && (
        <div className="bg-white border border-neutral-400 rounded-lg px-4 py-6 text-center text-sm text-rc-text-base/60">
          No se encontraron procesos comparables en los últimos {MONTHS_LOOKBACK} meses.
        </div>
      )}

      {!loading && !error && comparables.length > 0 && (
        <>
          <div className="bg-white border border-neutral-400 rounded-lg overflow-hidden">
            {comparables.map(release => {
              const award = pickAward(release);
              const supplier = award?.suppliers?.[0]?.name ?? '—';
              const amount = award?.value?.amount ?? 0;
              const currency = award?.value?.currency || 'GTQ';
              const date = comparableDate(release);
              const status = release.tender?.statusDetails ?? release.tender?.status ?? '—';
              const title = release.tender?.title || 'Proceso sin título';
              const href = `/busqueda/${encodeURIComponent(release.id)}`;
              return (
                <a
                  key={release.ocid}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 px-4 py-3 border-b border-neutral-400 last:border-b-0 hover:bg-neutral transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-1 min-w-0 text-sm font-medium text-rc-text-base group-hover:text-blue transition-colors line-clamp-2">
                      {title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rc-text-base/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="shrink-0 text-rc-text-base/60 tabular-nums">
                      {formatDate(date)}
                    </span>
                    <span className="shrink-0 font-semibold text-orange">
                      {formatCurrency(amount, currency)}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-rc-text-base/60">
                      {supplier}
                    </span>
                    <span className="shrink-0 text-rc-text-base/60">
                      {status}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <p className="text-xs text-rc-text-base/60 mt-2">
            {comparables.length} {comparables.length === 1 ? 'proceso comparable encontrado' : 'procesos comparables encontrados'}
          </p>
        </>
      )}
    </section>
  );
};
