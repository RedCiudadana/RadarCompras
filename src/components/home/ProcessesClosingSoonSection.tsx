import React from 'react';
import { ProcessCard } from './ProcessCard';
import { SectionHeader } from './SectionHeader';
import { Loading } from '../ui/Loading';
import { Release } from '../../types/ocds';
import { IconImage } from '../ui/IconImage';
import { AlertCircle } from 'lucide-react';

interface ProcessesClosingSoonSectionProps {
  processes?: Release[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onSelectProcess?: (id: string) => void;
}

export const ProcessesClosingSoonSection: React.FC<ProcessesClosingSoonSectionProps> = ({
  processes = [],
  isLoading = false,
  onViewAll,
  onSelectProcess
}) => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Procesos que Cierran Pronto"
          subtitle="Oportunidades que vencen próximamente"
          showViewAll
          onViewAll={onViewAll}
          icon={<IconImage img={<AlertCircle className='size-10 text-red-600 m-auto' />} background='bg-red-300' />}
        />
        {isLoading ? (
          <Loading text="Cargando procesos..." />
        ) : processes.length === 0 ? (
          <div className="px-6 py-12 text-center text-rc-text-base/60 text-sm">
            No hay procesos recientes disponibles
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processes.map((process) => (
              <div
                key={process.id}
                onClick={() => onSelectProcess?.(process.id)}
                className="cursor-pointer"
              >
                <ProcessCard data={process} variant="compact" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
