import React from 'react';
import { SectionHeader } from './SectionHeader';
import { TrendingUp } from 'lucide-react';

export interface SectorData {
  id: string;
  name: string;
  processCount: number;
  totalAmount: string;
  trend: 'up' | 'down' | 'stable';
  percentage?: string;
}

interface SectorComparisonSectionProps {
  blueSectors?: SectorData[];
  orangeSectors?: SectorData[];
  onSelectSector?: (sectorId: string) => void;
}

const dummyBlueSectors: SectorData[] = [
  { id: 'edu-1', name: 'Educación', processCount: 145, totalAmount: 'Q 42,500,000', trend: 'up', percentage: '+12%' },
  { id: 'health-1', name: 'Salud y Bienestar', processCount: 89, totalAmount: 'Q 35,200,000', trend: 'up', percentage: '+8%' },
  { id: 'infra-1', name: 'Infraestructura', processCount: 67, totalAmount: 'Q 128,750,000', trend: 'stable', percentage: '±0%' },
  { id: 'admin-1', name: 'Administración Pública', processCount: 112, totalAmount: 'Q 18,900,000', trend: 'up', percentage: '+5%' },
  { id: 'tech-1', name: 'Tecnología e Innovación', processCount: 78, totalAmount: 'Q 22,450,000', trend: 'up', percentage: '+15%' },
  { id: 'transport-1', name: 'Transporte y Movilidad', processCount: 45, totalAmount: 'Q 85,300,000', trend: 'down', percentage: '-3%' },
];

const dummyOrangeSectors: SectorData[] = [
  { id: 'agri-1', name: 'Agricultura y Desarrollo Rural', processCount: 98, totalAmount: 'Q 31,200,000', trend: 'up', percentage: '+18%' },
  { id: 'env-1', name: 'Ambiente y Cambio Climático', processCount: 56, totalAmount: 'Q 19,850,000', trend: 'up', percentage: '+22%' },
  { id: 'justice-1', name: 'Justicia y Seguridad', processCount: 134, totalAmount: 'Q 45,600,000', trend: 'up', percentage: '+10%' },
  { id: 'social-1', name: 'Desarrollo Social', processCount: 87, totalAmount: 'Q 28,900,000', trend: 'stable', percentage: '±2%' },
  { id: 'energy-1', name: 'Energía y Recursos Naturales', processCount: 42, totalAmount: 'Q 156,800,000', trend: 'up', percentage: '+25%' },
  { id: 'culture-1', name: 'Cultura y Patrimonio', processCount: 31, totalAmount: 'Q 9,450,000', trend: 'down', percentage: '-5%' },
];

const SectorItem: React.FC<{ sector: SectorData; color: 'blue' | 'orange'; onClick?: () => void }> = ({
  sector,
  color,
  onClick
}) => {
  const bgColor = color === 'blue' ? 'hover:bg-blue-50' : 'hover:bg-orange-50';
  const textColor = color === 'blue' ? 'text-rc-blue' : 'text-rc-orange';
  const trendColor = sector.trend === 'up' ? 'text-green-600' : sector.trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 rounded-lg border border-gray-200 ${bgColor} transition-all cursor-pointer flex items-center justify-between`}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 text-sm">{sector.name}</h4>
        <p className="text-xs text-gray-600 mt-1">{sector.processCount} procesos</p>
      </div>
      <div className="text-right ml-4">
        <div className={`font-semibold text-sm ${textColor}`}>{sector.totalAmount}</div>
        {sector.percentage && (
          <div className={`text-xs font-medium ${trendColor} flex items-center gap-1 justify-end mt-1`}>
            <TrendingUp className="w-3 h-3" />
            {sector.percentage}
          </div>
        )}
      </div>
    </div>
  );
};

export const SectorComparisonSection: React.FC<SectorComparisonSectionProps> = ({
  blueSectors = dummyBlueSectors,
  orangeSectors = dummyOrangeSectors,
  onSelectSector
}) => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Compras por Sector"
          subtitle="Analiza la distribución de procesos y montos por sector económico"
          icon="📊"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blue Sectors */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-rc-blue rounded-full"></div>
              <h3 className="font-semibold text-gray-900">Sectores Sociales</h3>
            </div>
            <div className="space-y-2">
              {blueSectors.map((sector) => (
                <SectorItem
                  key={sector.id}
                  sector={sector}
                  color="blue"
                  onClick={() => onSelectSector?.(sector.id)}
                />
              ))}
            </div>
          </div>

          {/* Orange Sectors */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-rc-orange rounded-full"></div>
              <h3 className="font-semibold text-gray-900">Sectores Económicos</h3>
            </div>
            <div className="space-y-2">
              {orangeSectors.map((sector) => (
                <SectorItem
                  key={sector.id}
                  sector={sector}
                  color="orange"
                  onClick={() => onSelectSector?.(sector.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
