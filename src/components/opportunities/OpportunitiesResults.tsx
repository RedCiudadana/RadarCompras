import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Radar } from 'lucide-react';
import { Loading } from '../ui/Loading';
import { Release } from '../../types/ocds';
import { OpportunitiesParams, CompanySize } from '../../services/recommender';
import { UNSPCS_FAMILIES } from '../../const/unspcs';
import { ReleaseRow } from '../search/ReleaseRow';

const SIZE_LABEL: Record<CompanySize, string> = {
  small: 'Empresa pequeña',
  medium: 'Empresa mediana',
  large: 'Empresa grande',
};

interface OpportunitiesResultsProps {
  params: OpportunitiesParams;
  releases: Release[];
  loading: boolean;
  error?: string;
  onEdit: () => void;
}

export const OpportunitiesResults: React.FC<OpportunitiesResultsProps> = ({
  params,
  releases,
  loading,
  error,
  onEdit,
}) => {
  const navigate = useNavigate();

  const familyMap = useMemo(
    () => new Map(UNSPCS_FAMILIES.map(f => [f.code, f.name])),
    []
  );

  if (loading) {
    return <Loading text="Buscando oportunidades..." />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-rc-border rounded-lg p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-rc-text-base">
              {releases.length} oportunidades encontradas
            </h2>
            <p className="text-xs text-rc-text-muted mt-1">
              Búsqueda de los últimos 3 meses según tu perfil.
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rc-primary border border-rc-primary rounded hover:bg-rc-primary hover:text-white transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar criterios
          </button>
        </div>

        {/* Active criteria chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-rc-border">
          <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded bg-rc-primary/10 text-rc-primary">
            {SIZE_LABEL[params.companySize]}
          </span>
          {params.categories.map(code => (
            <span
              key={code}
              className="inline-flex items-center text-xs font-medium px-2 py-1 rounded bg-rc-surface text-rc-text-base border border-rc-border"
              title={familyMap.get(code) ?? code}
            >
              <span className="font-mono text-rc-text-subtle mr-1">{code}</span>
              <span className="max-w-[180px] truncate">{familyMap.get(code) ?? 'Familia'}</span>
            </span>
          ))}
          {params.keywords.map(kw => (
            <span
              key={kw}
              className="inline-flex items-center text-xs font-medium px-2 py-1 rounded bg-rc-accent/10 text-rc-accent border border-rc-accent/30"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Results list */}
      {releases.length === 0 ? (
        <div className="bg-white border border-rc-border rounded-lg px-6 py-12 text-center">
          <Radar className="w-12 h-12 text-rc-text-subtle mx-auto mb-3" />
          <p className="text-sm text-rc-text-muted">
            No encontramos oportunidades con estos criterios.
            <br />
            Edita tu perfil o prueba con menos categorías.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-rc-border rounded-lg overflow-hidden">
          {releases.map((release, idx) => (
            <ReleaseRow
              key={release.id || idx}
              release={release}
              highlightKeywords={params.keywords}
              onClick={() => navigate(`/busqueda/${encodeURIComponent(release.id)}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
