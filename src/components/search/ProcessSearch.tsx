import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, ArrowUpDown, ChevronRight } from 'lucide-react';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { Loading } from '../ui/Loading';
import { SearchableSelect } from '../ui/SearchableSelect';
import { OCDSApi } from '../../services/ocdsApi';
import { Release, ProcessFilters } from '../../types/ocds';
import { formatCurrency, formatDate } from '../../utils/formatters';
import entidades from '../../const/ejecutivo.json';
import { MODALIDADES, SUB_MODALIDADES, ESTATUS_CONCURSO } from '../../const/catalogo';

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

const DEFAULT_FILTERS: ProcessFilters = {
  entidad: '',
  modalidad: '',
  subModalidad: '',
  estatus: 1,
  year: currentYear,
  month: new Date().getMonth() + 1,
};

function statusStyle(status?: string): { bg: string; text: string } {
  if (!status) return { bg: 'bg-gray-100', text: 'text-gray-500' };
  const s = status.toLowerCase();
  if (s.includes('vigent') || s.includes('activ')) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (s.includes('adjudic') || s.includes('seleccion')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
  if (s.includes('evaluac') || s.includes('espera') || s.includes('subast')) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  if (s.includes('desert') || s.includes('cancel') || s.includes('anulad') || s.includes('prescind') || s.includes('improbad')) return { bg: 'bg-red-100', text: 'text-red-600' };
  return { bg: 'bg-gray-100', text: 'text-gray-500' };
}

interface ProcessSearchProps {
  onSelectProcess?: (release: Release) => void;
}

export const ProcessSearch: React.FC<ProcessSearchProps> = ({ onSelectProcess }) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filters, setFilters] = useState<ProcessFilters>(DEFAULT_FILTERS);

  const subModalidadOptions = filters.modalidad ? (SUB_MODALIDADES[filters.modalidad] ?? []) : [];
  const hasSubModalidades = subModalidadOptions.length > 0;

  const hasActiveFilters =
    !!filters.entidad ||
    !!filters.modalidad ||
    !!filters.subModalidad ||
    (filters.estatus !== undefined && filters.estatus !== 1);

  const sortedReleases = useMemo(() => {
    return [...releases].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return (b.tender?.value?.amount || 0) - (a.tender?.value?.amount || 0);
    });
  }, [releases, sortBy]);

  const loadReleases = useCallback(
    async (currentFilters: ProcessFilters, currentPage: number) => {
      const abortController = new AbortController();
      setLoading(true);
      try {
        const { data, hasMore: more } = await OCDSApi.searchReleases(
          currentFilters,
          currentPage,
          50,
          abortController
        );
        if (currentPage === 1) {
          setReleases(data);
        } else {
          setReleases(prev => [...prev, ...data]);
        }
        setHasMore(more);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error loading releases:', error);
        }
      } finally {
        setLoading(false);
      }
      return () => abortController.abort();
    },
    []
  );

  useEffect(() => {
    if (page > 1) {
      loadReleases(filters, page);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadReleases(DEFAULT_FILTERS, 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerSearch = (newFilters: ProcessFilters) => {
    setFilters(newFilters);
    setPage(1);
    setReleases([]);
    loadReleases(newFilters, 1);
  };

  const handleFilterChange = (
    key: 'year' | 'month' | 'entidad' | 'modalidad' | 'subModalidad' | 'estatus',
    value: string | number
  ) => {
    let newFilters = { ...filters, [key]: value };
    if (key === 'modalidad') {
      newFilters = { ...newFilters, subModalidad: '' };
    }
    triggerSearch(newFilters);
  };

  const resetFilters = () => triggerSearch(DEFAULT_FILTERS);

  const handleLoadMore = () => setPage(prev => prev + 1);

  const toggleSort = () => setSortBy(s => (s === 'date' ? 'amount' : 'date'));

  return (
    <div className="space-y-4">
      <ApiStatusBar />

      {/* Filter bar */}
      <div className="bg-white border border-rc-border rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-2">
          {/* Año */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-rc-text-muted mb-1">Año</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', Number(e.target.value))}
              className="px-3 py-2 border border-rc-border rounded text-sm bg-white text-rc-text-base focus:outline-none focus:ring-2 focus:ring-rc-primary/30 focus:border-rc-primary"
            >
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Mes */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-rc-text-muted mb-1">Mes</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', Number(e.target.value))}
              className="px-3 py-2 border border-rc-border rounded text-sm bg-white text-rc-text-base focus:outline-none focus:ring-2 focus:ring-rc-primary/30 focus:border-rc-primary"
            >
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Estatus */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-rc-text-muted mb-1">Estatus</label>
            <select
              value={filters.estatus ?? 1}
              onChange={(e) => handleFilterChange('estatus', Number(e.target.value))}
              className="px-3 py-2 border border-rc-border rounded text-sm bg-white text-rc-text-base focus:outline-none focus:ring-2 focus:ring-rc-primary/30 focus:border-rc-primary"
            >
              {ESTATUS_CONCURSO.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Entidad */}
          <div className="flex flex-col w-64">
            <SearchableSelect
              label="Entidad compradora"
              options={entidades}
              value={filters.entidad || ''}
              onChange={(id) => handleFilterChange('entidad', id)}
              placeholder="Todas las entidades"
              searchPlaceholder="Buscar entidad..."
            />
          </div>

          {/* Modalidad */}
          <div className="flex flex-col w-56">
            <SearchableSelect
              label="Modalidad"
              options={MODALIDADES}
              value={filters.modalidad || ''}
              onChange={(id) => handleFilterChange('modalidad', id)}
              placeholder="Todas las modalidades"
              searchPlaceholder="Buscar modalidad..."
            />
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="Limpiar filtros"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rc-text-muted border border-rc-border rounded hover:border-rc-primary hover:text-rc-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {/* Sub-modalidad — solo cuando modalidad 6 está seleccionada */}
        {hasSubModalidades && (
          <div className="mt-3 pt-3 border-t border-rc-border">
            <div className="w-72">
              <SearchableSelect
                label="Sub-modalidad (Casos de Excepción)"
                options={subModalidadOptions}
                value={filters.subModalidad || ''}
                onChange={(id) => handleFilterChange('subModalidad', id)}
                placeholder="Todas las sub-modalidades"
                searchPlaceholder="Buscar sub-modalidad..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && page === 1 ? (
        <Loading text="Cargando procesos..." />
      ) : (
        <>
          {/* Results header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-rc-text-muted">
              <span className="font-semibold text-rc-text-base font-sans text-base">
                {sortedReleases.length}
              </span>{' '}
              procesos
              {hasMore && <span className="text-rc-text-subtle"> · más disponibles</span>}
            </span>
            <button
              onClick={toggleSort}
              className="flex items-center gap-1.5 text-xs font-medium text-rc-text-muted hover:text-rc-primary transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Ordenar por {sortBy === 'date' ? 'fecha' : 'monto'}
            </button>
          </div>

          {/* Dense rows */}
          <div className="bg-white border border-rc-border rounded-lg overflow-hidden">
            {sortedReleases.length === 0 && !loading ? (
              <div className="px-6 py-12 text-center text-rc-text-subtle text-sm">
                No se encontraron procesos con los filtros seleccionados.
              </div>
            ) : (
              sortedReleases.map((release, index) => {
                const st = statusStyle(release.tender?.status);
                return (
                  <button
                    key={release.id || index}
                    onClick={() => onSelectProcess?.(release)}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-rc-border last:border-b-0 hover:bg-rc-surface transition-colors text-left group"
                  >
                    {/* Entity + title */}
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-xs font-semibold uppercase tracking-wider text-rc-primary truncate leading-tight">
                        {release.buyer?.name || '—'}
                      </div>
                      <div className="text-sm text-rc-text-muted truncate mt-0.5 leading-snug">
                        {release.tender?.title || 'Sin título'}
                      </div>
                    </div>

                    {/* Amount + date */}
                    <div className="shrink-0 text-right">
                      <div className="font-sans font-bold text-sm text-rc-accent tabular-nums">
                        {formatCurrency(release.tender?.value?.amount || 0)}
                      </div>
                      <div className="text-xs text-rc-text-subtle mt-0.5 tabular-nums">
                        {formatDate(release.date)}
                      </div>
                    </div>

                    {/* Status pill */}
                    {release.tender?.status && (
                      <div className="shrink-0 hidden sm:block w-24 text-right">
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.text} truncate max-w-full`}>
                          {release.tender.status}
                        </span>
                      </div>
                    )}

                    <ChevronRight className="w-4 h-4 text-rc-border group-hover:text-rc-text-subtle transition-colors shrink-0" />
                  </button>
                );
              })
            )}
          </div>

          {hasMore && !loading && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 text-sm font-medium text-rc-primary border border-rc-primary rounded hover:bg-rc-primary hover:text-white transition-colors"
              >
                Cargar más procesos
              </button>
            </div>
          )}

          {loading && page > 1 && (
            <div className="text-center text-sm text-rc-text-subtle py-4">Cargando más procesos...</div>
          )}
        </>
      )}
    </div>
  );
};
