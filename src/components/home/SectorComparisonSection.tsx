import React from 'react';
import { SectionHeader } from './SectionHeader';
import topCategoriesData from '../../data/outputs/top_categories.json';
import { formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';
import { IconImage } from '../ui/IconImage';

export interface SectorData {
  id: string;
  name: string;
  processCount: number;
  totalAmount: string;
}

interface CategoryEntry {
  rank: number;
  segment_code: string;
  segment_name: string;
  total_amount_gtq: number;
  pct_of_total: number;
  item_count: number;
}

interface SectorComparisonSectionProps {
  blueSectors?: SectorData[];
  orangeSectors?: SectorData[];
  onSelectSector?: (sectorId: string) => void;
}

// UNSPSC segment classification (PRD Decisions Log: standards-based code lookup).
const SECTOR_SEGMENTS: Record<string, { column: 'social' | 'economic' }> = {
  // Sectores Sociales (blue)
  '50': { column: 'social' },
  '51': { column: 'social' },
  '52': { column: 'social' },
  '53': { column: 'social' },
  '83': { column: 'social' },
  '84': { column: 'social' },
  '85': { column: 'social' },
  // Sectores Económicos (orange)
  '30': { column: 'economic' },
  '43': { column: 'economic' },
  '56': { column: 'economic' },
  '72': { column: 'economic' },
  '78': { column: 'economic' },
  '80': { column: 'economic' },
  '81': { column: 'economic' },
};

const categories = topCategoriesData.categories as CategoryEntry[];

const buildSectors = (column: 'social' | 'economic'): SectorData[] =>
  categories
    .filter((c) => SECTOR_SEGMENTS[c.segment_code]?.column === column)
    .map((c) => ({
      id: c.segment_code,
      name: c.segment_name,
      processCount: c.item_count,
      totalAmount: formatAbbreviatedCurrency(c.total_amount_gtq),
    }));

const realBlueSectors = buildSectors('social');
const realOrangeSectors = buildSectors('economic');

const SectorItem: React.FC<{ sector: SectorData; color: 'blue' | 'orange'; }> = ({
  sector,
  color
}) => {
  const bgColor = color === 'blue' ? 'hover:bg-blue-50' : 'hover:bg-orange-50';
  const textColor = color === 'blue' ? 'text-rc-blue' : 'text-rc-orange';

  return (
    <div
      className={`px-4 py-3 rounded-lg border border-gray-200 ${bgColor} transition-all flex items-center justify-between`}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 text-sm">{sector.name}</h4>
        <p className="text-xs text-gray-600 mt-1">{formatNumber(sector.processCount)} unidades</p>
      </div>
      <div className="text-right ml-4">
        <div className={`font-semibold text-sm ${textColor}`}>{sector.totalAmount}</div>
      </div>
    </div>
  );
};

export const SectorComparisonSection: React.FC<SectorComparisonSectionProps> = ({
  blueSectors = realBlueSectors,
  orangeSectors = realOrangeSectors,
  onSelectSector
}) => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Compras por Sector"
          subtitle="Analiza la distribución de procesos y montos por sector económico"
          icon={<IconImage img='/iconos/stonk-orange.png' background='bg-orange/20' />}
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
