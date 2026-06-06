import React from 'react';
import { SectionHeader } from './SectionHeader';
import { Building2, Calendar } from 'lucide-react';

export interface BiddingItem {
  id: string;
  title: string;
  entity: string;
  sector: string;
  amount: string;
  publicationDate: string;
  closingDate: string;
  daysLeft: number;
  modalidad: string;
  description: string;
}

interface RecentBiddingsSectionProps {
  biddings?: BiddingItem[];
  onViewAll?: () => void;
  onSelectBidding?: (id: string) => void;
}

const dummyBiddings: BiddingItem[] = [
  {
    id: 'bid-1',
    title: 'Adquisición de medicamentos esenciales y material médico quirúrgico',
    entity: 'Hospital Nacional de Occidente',
    sector: 'Salud',
    amount: 'Q 3,450,000',
    publicationDate: 'Ene 5, 2026',
    closingDate: 'Ene 26, 2026',
    daysLeft: 18,
    modalidad: 'Licititud Pública',
    description: 'Convocatoria abierta para la adquisición de medicamentos de uso hospitalario y material médico quirúrgico de alto volumen.',
  },
  {
    id: 'bid-2',
    title: 'Servicios de limpieza, desinfección y mantenimiento de instalaciones',
    entity: 'Secretaría de Gestión Pública',
    sector: 'Administración',
    amount: 'Q 890,500',
    publicationDate: 'Ene 8, 2026',
    closingDate: 'Feb 2, 2026',
    daysLeft: 25,
    modalidad: 'Contratación Directa',
    description: 'Servicio integral de limpieza, desinfección y mantenimiento preventivo de edificios administrativos.',
  },
  {
    id: 'bid-3',
    title: 'Suministro e instalación de sistemas de agua potable y saneamiento',
    entity: 'Municipalidad de Huehuetenango',
    sector: 'Infraestructura',
    amount: 'Q 5,200,000',
    publicationDate: 'Ene 3, 2026',
    closingDate: 'Feb 15, 2026',
    daysLeft: 38,
    modalidad: 'Licititud Pública',
    description: 'Proyecto de mejora de infraestructura de agua potable incluyendo tuberías, sistemas de purificación y distribución.',
  },
  {
    id: 'bid-4',
    title: 'Capacitación en atención al cliente y servicio de calidad para personal',
    entity: 'Instituto de Administración Pública',
    sector: 'Educación',
    amount: 'Q 450,000',
    publicationDate: 'Ene 10, 2026',
    closingDate: 'Ene 30, 2026',
    daysLeft: 20,
    modalidad: 'Compra Abierta',
    description: 'Programa de capacitación para 200 servidores públicos en atención al cliente y estándares de servicio.',
  },
  {
    id: 'bid-5',
    title: 'Arrendamiento de equipos de cómputo y soluciones de infraestructura TI',
    entity: 'Dirección de Sistemas',
    sector: 'Tecnología',
    amount: 'Q 1,850,000',
    publicationDate: 'Ene 7, 2026',
    closingDate: 'Feb 5, 2026',
    daysLeft: 28,
    modalidad: 'Licititud Pública',
    description: 'Arrendamiento de servidores, equipos de cómputo, software y servicios de soporte técnico integral.',
  },
  {
    id: 'bid-6',
    title: 'Construcción y adaptación de espacios educativos en escuelas rurales',
    entity: 'Ministerio de Educación',
    sector: 'Infraestructura',
    amount: 'Q 4,125,750',
    publicationDate: 'Ene 4, 2026',
    closingDate: 'Feb 10, 2026',
    daysLeft: 33,
    modalidad: 'Licititud Pública',
    description: 'Construcción de aulas, sanitarios y espacios complementarios en 5 escuelas de comunidades rurales.',
  },
];

const BiddingCard: React.FC<{ item: BiddingItem; onClick?: () => void }> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-rc-blue transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-rc-blue transition-colors line-clamp-2 mb-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {item.entity}
            </span>
            <span className="text-gray-400">•</span>
            <span>{item.sector}</span>
          </div>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <div className="text-lg font-bold text-rc-orange">{item.amount}</div>
          <div className="text-xs text-gray-500">{item.modalidad}</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
        <span className="text-gray-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Publ. {item.publicationDate}
        </span>
        <span className="font-semibold text-rc-blue">Cierra en {item.daysLeft} días</span>
      </div>
    </div>
  );
};

export const RecentBiddingsSection: React.FC<RecentBiddingsSectionProps> = ({
  biddings = dummyBiddings,
  onViewAll,
  onSelectBidding
}) => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Licitaciones y Concursos Recientes"
          subtitle="Los procesos más recientes publicados en la plataforma"
          showViewAll
          onViewAll={onViewAll}
          icon="📋"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {biddings.map((bidding) => (
            <BiddingCard
              key={bidding.id}
              item={bidding}
              onClick={() => onSelectBidding?.(bidding.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
