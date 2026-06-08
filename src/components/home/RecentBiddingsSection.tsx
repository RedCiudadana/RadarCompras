import React from 'react';
import { SectionHeader } from './SectionHeader';
import { Loading } from '../ui/Loading';
import { Release } from '../../types/ocds';
import { ProcessCard } from './ProcessCard';
import { AlertCircle, Radar } from 'lucide-react';
import { IconImage } from '../ui/IconImage';

interface RecentBiddingsSectionProps {
  biddings?: Release[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onSelectBidding?: (id: string) => void;
}

export const RecentBiddingsSection: React.FC<RecentBiddingsSectionProps> = ({
  biddings = [],
  isLoading = false,
  onViewAll,
  onSelectBidding
}) => {
  console.log('biddings', biddings);

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Licitaciones y Concursos Recientes"
          subtitle="Los procesos más recientes publicados en la plataforma"
          showViewAll
          onViewAll={onViewAll}
          icon={<IconImage img='/iconos/radar-green.png' background='bg-green/30' />}
        />
        {isLoading ? (
          <Loading text="Cargando procesos..." />
        ) : biddings.length === 0 ? (
          <div className="px-6 py-12 text-center text-rc-text-base/60 text-sm">
            No hay procesos recientes disponibles
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {biddings.map((release) => (
              <ProcessCard
                key={release.id}
                data={release}
                variant='full'
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
