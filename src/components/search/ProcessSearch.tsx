import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, RotateCcw, Save, Download } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loading } from '../ui/Loading';
import { HeroSlider } from '../ui/HeroSlider';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { SearchableSelect } from '../ui/SearchableSelect';
import { OCDSApi } from '../../services/ocdsApi';
import { Release, ProcessFilters } from '../../types/ocds';
import { formatCurrency, formatDate, getStatusColor, truncateText } from '../../utils/formatters';
import entidades from '../../const/ejecutivo.json';

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

interface ProcessSearchProps {
  onSelectProcess?: (release: Release) => void;
}

export const ProcessSearch: React.FC<ProcessSearchProps> = ({ onSelectProcess }) => {
  const heroSlides = [
    {
      title: 'Buscador de Procesos',
      subtitle: 'Encuentra y filtra procesos de compras públicas con facilidad',
      gradient: 'from-orange-600 to-red-700',
    },
    {
      title: 'Búsqueda Avanzada',
      subtitle: 'Filtra por institución, monto, fecha y más',
      gradient: 'from-pink-600 to-rose-700',
    },
  ];

  const [releases, setReleases] = useState<Release[]>([]);
  const [filteredReleases, setFilteredReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'amount'>('relevance');

  const [filters, setFilters] = useState<ProcessFilters>({
    keyword: '',
    entidad: '',
    minAmount: undefined,
    maxAmount: undefined,
    year: currentYear,
    month: new Date().getMonth() + 1,
  });

  const hasActiveFilters =
    !!filters.entidad || filters.minAmount !== undefined || filters.maxAmount !== undefined;

  // Carga releases usando los filtros actuales (o los que se provean explícitamente)
  const loadReleases = useCallback(
    async (currentFilters: ProcessFilters = filters, currentPage = page) => {
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
    [filters, page]
  );

  // Carga más páginas cuando cambia `page` (solo en load more)
  useEffect(() => {
    if (page > 1) {
      loadReleases(filters, page);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Carga inicial
  useEffect(() => {
    loadReleases(filters, 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [filters, releases, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    let filtered = OCDSApi.filterReleases(releases, filters);

    filtered = filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        const amountA = a.tender?.value?.amount || 0;
        const amountB = b.tender?.value?.amount || 0;
        return amountB - amountA;
      }
      return 0;
    });

    setFilteredReleases(filtered);
  };

  const handleSearch = () => {
    setPage(1);
    setReleases([]);
    loadReleases(filters, 1);
  };

  // Cambia un filtro que afecta la API y dispara búsqueda inmediata
  const handleApiFilterChange = (key: 'year' | 'month' | 'entidad', value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    setReleases([]);
    loadReleases(newFilters, 1);
  };

  const handleFilterChange = (key: keyof ProcessFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const newFilters = { ...filters, entidad: '', minAmount: undefined, maxAmount: undefined };
    setFilters(newFilters);
    setPage(1);
    setReleases([]);
    loadReleases(newFilters, 1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <HeroSlider slides={heroSlides} />

      <ApiStatusBar />

      <Card>
        <div className="space-y-4">
          {/* Fila principal: búsqueda + periodo + acciones */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por palabra clave..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                icon={<Search className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* Selector de año */}
            <div className="flex flex-col">
              <label className="block text-xs font-medium text-gray-500 mb-1">Año</label>
              <select
                value={filters.year}
                onChange={(e) => handleApiFilterChange('year', Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Selector de mes */}
            <div className="flex flex-col">
              <label className="block text-xs font-medium text-gray-500 mb-1">Mes</label>
              <select
                value={filters.month}
                onChange={(e) => handleApiFilterChange('month', Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleSearch}>
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                className={hasActiveFilters ? 'border-blue-600 text-blue-600' : ''}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    !
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {filters.keyword && (
            <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              Características de búsqueda: Tipo: Abierto. Palabra clave incluida: "{filters.keyword}"
            </div>
          )}

          {showFilters && (
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros avanzados</h3>
                {hasActiveFilters && (
                  <Button variant="outlined" size="sm" onClick={resetFilters}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Entidad compradora — filtro enviado a la API */}
                <SearchableSelect
                  label="Entidad compradora"
                  options={entidades}
                  value={filters.entidad || ''}
                  onChange={(id) => handleApiFilterChange('entidad', id)}
                  placeholder="Seleccionar entidad..."
                  searchPlaceholder="Buscar entidad..."
                />
                <Input
                  label="Monto Mínimo"
                  type="number"
                  placeholder="0"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  label="Monto Máximo"
                  type="number"
                  placeholder="Sin límite"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {loading && page === 1 ? (
        <Loading text="Cargando procesos..." />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                Mostrando {filteredReleases.length} procesos
              </span>
              {filters.keyword && (
                <span className="ml-2">para "{filters.keyword}"</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevancia</option>
                <option value="date">Fecha (más reciente)</option>
                <option value="amount">Monto (mayor a menor)</option>
              </select>
              <Button variant="outlined" size="sm">
                <Save className="w-4 h-4 mr-1" />
                Guardar búsqueda
              </Button>
              <Button variant="outlined" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Descargar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReleases.map((release, index) => (
              <Card
                key={release.id || index}
                hover
                onClick={() => onSelectProcess?.(release)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {release.tender?.title || 'Sin título'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {release.buyer?.name || 'Institución no especificada'}
                      </p>
                    </div>
                    {release.tender?.status && (
                      <Badge variant={getStatusColor(release.tender.status) as any}>
                        {release.tender.status}
                      </Badge>
                    )}
                  </div>

                  {release.tender?.description && (
                    <p className="text-sm text-gray-700">
                      {truncateText(release.tender.description, 200)}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Monto: </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(release.tender?.value?.amount || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha: </span>
                      <span className="font-semibold text-gray-900">
                        {formatDate(release.date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">OCID: </span>
                      <span className="font-mono text-xs text-gray-700">
                        {release.ocid}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} variant="outlined">
                Cargar más procesos
              </Button>
            </div>
          )}

          {loading && page > 1 && (
            <Loading text="Cargando más procesos..." />
          )}
        </>
      )}
    </div>
  );
};
