import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import summaryData from '../../data/outputs/summary.json';
import { formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';

interface KPIStat {
  label: string;
  value: string;
}

interface HeroSectionProps {
  kpiStats?: KPIStat[];
  onSearch?: (query: string) => void;
  onCTAClick?: (actionType: string) => void;
}

const { totals } = summaryData;

const defaultKPIs: KPIStat[] = [
  { label: 'Procesos registrados', value: formatNumber(totals.processes) },
  { label: 'Entidades compradoras', value: formatNumber(totals.unique_buyers) },
  { label: 'Proveedores', value: formatNumber(totals.unique_suppliers) },
  { label: 'Monto total', value: formatAbbreviatedCurrency(totals.total_amount_gtq) },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  kpiStats = defaultKPIs,
  onSearch,
  onCTAClick
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="text-white relative overflow-visible">
      {/* Background pattern */}
      <div className="absolute inset-0">
        {/* <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)" />
        </svg> */}
        <img src="/slider_home.png" alt="" className="w-full h-full" />
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M 0,64 Q 360,0 720,64 T 1440,64 L 1440,120 L 0,120 Z"
            fill="white"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 md:py-24 pb-20 min-h-[85vh]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Radar de Compras Públicas<br />para Mipymes
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Acceso centralizado a las licitaciones y procesos de contratación del Estado. Descubre oportunidades de negocio y analiza el mercado público en Guatemala
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="filled"
              size="lg"
              onClick={() => onCTAClick?.('search')}
              className="bg-white text-rc-blue hover:bg-blue-50"
            >
              <Search className="w-5 h-5" />
              Buscar Procesos
            </Button>
            <Button
              variant="outlined"
              size="lg"
              onClick={() => onCTAClick?.('opportunities')}
              className="border-white text-white hover:bg-white/10"
            >
              Ver Oportunidades
            </Button>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {kpiStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          {/* Currently OCDS API don't support this feature */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar procesos, entidades, montos..."
                className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rc-orange"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-rc-orange text-white p-2 rounded-md hover:bg-orange-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
