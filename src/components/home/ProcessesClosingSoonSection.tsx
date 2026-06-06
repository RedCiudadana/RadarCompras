import React from 'react';
import { ProcessCard } from './ProcessCard';
import { SectionHeader } from './SectionHeader';
import { Release } from '../../types/ocds';

interface ProcessesClosingSoonSectionProps {
  processes?: Release[];
  onViewAll?: () => void;
  onSelectProcess?: (id: string) => void;
}

const createDummyRelease = (id: string, title: string, buyer: string, endDate: string, amount: number, methodDetails: string): Release => ({
  id,
  ocid: `ocds-test-${id}`,
  date: new Date().toISOString().split('T')[0],
  publishedDate: new Date().toISOString().split('T')[0],
  language: 'es',
  tag: [],
  initiationType: 'tender',
  parties: [],
  buyer: { name: buyer, id: `buyer-${id}` },
  bids: { details: [] },
  tender: {
    id: `tender-${id}`,
    title,
    status: 'active',
    statusDetails: '',
    datePublished: new Date().toISOString().split('T')[0],
    procuringEntity: { name: buyer, id: `entity-${id}` },
    items: [
      { id: '1', description: 'Item 1', classification: { id: 'Servicios Generales', scheme: 'UNSPSC' }, quantity: 1, unit: { name: 'unit' }, attributes: [] }
    ],
    procurementMethod: 'open',
    procurementMethodDetails: methodDetails,
    mainProcurementCategory: 'goods',
    additionalProcurementCategories: [],
    submissionMethod: [],
    submissionMethodDetails: '',
    tenderPeriod: { startDate: new Date().toISOString().split('T')[0], endDate },
    numberOfTenderers: 0,
    tenderers: [],
    documents: []
  },
  awards: [{ id: '1', title, status: 'active', statusDetails: '', date: new Date().toISOString().split('T')[0], value: { amount, currency: 'GTQ' }, suppliers: [] }],
  contracts: [],
  sources: [],
  dataSegmentation: { id: '', criteria: [] }
});

const dummyProcesses: Release[] = [
  createDummyRelease('1', 'Adquisición de alimentación y suministros para comedores escolares', 'Ministerio de Educación', '2026-01-15', 450000, 'Licitación'),
  createDummyRelease('2', 'Servicios de mantenimiento y reparación de equipos de cómputo', 'Municipalidad de Guatemala', '2026-01-18', 320000, 'Licititud Pública'),
  createDummyRelease('3', 'Suministros médicos y farmacéuticos para clínicas públicas', 'Ministerio de Salud Pública', '2026-01-20', 680500, 'Compra Abierta'),
  createDummyRelease('4', 'Implementación de sistemas de energía renovable en edificios públicos', 'Ministerio de Energía', '2026-01-12', 1200000, 'Licititud Pública'),
  createDummyRelease('5', 'Servicio de capacitación en competencias digitales', 'INFOM', '2026-01-25', 280000, 'Contratación Directa'),
  createDummyRelease('6', 'Adquisición de mobiliario para oficinas administrativas', 'Secretaría de Gestión Pública', '2026-01-22', 195750, 'Compra Abierta'),
];

export const ProcessesClosingSoonSection: React.FC<ProcessesClosingSoonSectionProps> = ({
  processes = dummyProcesses,
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
          icon="📍"
        />
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
      </div>
    </section>
  );
};
