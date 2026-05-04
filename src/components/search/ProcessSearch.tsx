import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { Loading } from '../ui/Loading';
import { SearchableSelect } from '../ui/SearchableSelect';
import { OCDSApi } from '../../services/ocdsApi';
import { Release, ProcessFilters } from '../../types/ocds';
import entidades from '../../const/entidades_selector.json';
import { MODALIDADES, SUB_MODALIDADES, ESTATUS_CONCURSO } from '../../const/catalogo';
import { TOP_ENTIDADES_BY_FAMILIA } from '../../const/guatecompras';
import { ReleaseRow } from './ReleaseRow';

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

const CATEGORIES = TOP_ENTIDADES_BY_FAMILIA.map((family) => ({
  id: family.fam_code,
  name: family.fam_nombre
}));

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

function filtersFromParams(params: URLSearchParams): ProcessFilters {
  return {
    year: params.has('year') ? Number(params.get('year')) : DEFAULT_FILTERS.year,
    month: params.has('month') ? Number(params.get('month')) : DEFAULT_FILTERS.month,
    entidad: params.get('entidad') ?? DEFAULT_FILTERS.entidad,
    modalidad: params.get('modalidad') ?? DEFAULT_FILTERS.modalidad,
    subModalidad: params.get('subModalidad') ?? DEFAULT_FILTERS.subModalidad,
    estatus: params.has('estatus') ? Number(params.get('estatus')) : DEFAULT_FILTERS.estatus,
  };
}

function filtersToParams(filters: ProcessFilters): Record<string, string> {
  const p: Record<string, string> = {
    year: String(filters.year ?? DEFAULT_FILTERS.year),
    month: String(filters.month ?? DEFAULT_FILTERS.month),
    estatus: String(filters.estatus ?? DEFAULT_FILTERS.estatus),
  };
  if (filters.entidad) p.entidad = filters.entidad;
  if (filters.modalidad) p.modalidad = filters.modalidad;
  if (filters.subModalidad) p.subModalidad = filters.subModalidad;
  return p;
}

export const ProcessSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<ProcessFilters>(() => filtersFromParams(searchParams));

  const subModalidadOptions = filters.modalidad ? (SUB_MODALIDADES[filters.modalidad] ?? []) : [];
  const hasSubModalidades = subModalidadOptions.length > 0;

  const hasActiveFilters =
    !!filters.entidad ||
    !!filters.modalidad ||
    !!filters.subModalidad ||
    (filters.estatus !== undefined && filters.estatus !== 1);

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
    const initialFilters = filtersFromParams(searchParams);
    setFilters(initialFilters);
    setPage(1);
    setReleases([]);
    loadReleases(initialFilters, 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerSearch = (newFilters: ProcessFilters) => {
    setFilters(newFilters);
    setSearchParams(filtersToParams(newFilters), { replace: true });
    setPage(1);
    setReleases([]);
    loadReleases(newFilters, 1);
  };

  const handleFilterChange = (
    key: 'year' | 'month' | 'entidad' | 'modalidad' | 'subModalidad' | 'estatus' | 'category',
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

  const handleSelectRelease = (release: Release) => {
    navigate(`/busqueda/${encodeURIComponent(release.id)}`);
  };

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

          <div className="flex flex-col w-64">
            <SearchableSelect
              label="Categoria"
              options={CATEGORIES}
              value={filters.category || ''}
              onChange={(id) => handleFilterChange('category', id)}
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
                {releases.length}
              </span>{' '}
              procesos
              {hasMore && <span className="text-rc-text-subtle"> · más disponibles</span>}
            </span>
          </div>

          {/* Dense rows */}
          <div className="bg-white border border-rc-border rounded-lg overflow-hidden">
            {releases.length === 0 && !loading ? (
              <div className="px-6 py-12 text-center text-rc-text-subtle text-sm">
                No se encontraron procesos con los filtros seleccionados.
              </div>
            ) : (
              releases.map((release, index) => (
                <ReleaseRow
                  key={release.id || index}
                  release={release}
                  onClick={() => handleSelectRelease(release)}
                />
              ))
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
