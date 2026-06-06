import React from 'react';
import { ProcessCard } from './ProcessCard';
import { SectionHeader } from './SectionHeader';
import { Release } from '../../types/ocds';

interface OpportunitiesSectionProps {
  opportunities?: Release[];
  onViewAll?: () => void;
  onSelectOpportunity?: (id: string) => void;
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

const dummyOpportunities: Release[] = [
  createDummyRelease('opp-1', 'Suministro de insumos de oficina y papelería para entidades gubernamentales', 'Dirección General de Aduanas', '2026-02-10', 215000, 'Compra Abierta'),
  createDummyRelease('opp-2', 'Servicio de consultoría en transformación digital e implementación de TI', 'Instituto de Fomento Municipal', '2026-02-15', 890000, 'Licititud Pública'),
  createDummyRelease('opp-3', 'Adquisición de equipos de laboratorio y análisis clínicos', 'Centro de Salud Regional', '2026-02-05', 520000, 'Compra Abierta'),
  createDummyRelease('opp-4', 'Construcción y mejora de infraestructura vial municipal', 'Municipalidad de Quetzaltenango', '2026-02-28', 2450000, 'Licititud Pública'),
  createDummyRelease('opp-5', 'Servicios de vigilancia y seguridad para instalaciones públicas', 'Ministerio de Gobernación', '2026-02-20', 385000, 'Contratación Directa'),
  createDummyRelease('opp-6', 'Desarrollo de plataforma web para gestión de servicios municipales', 'Municipalidad de Antigua Guatemala', '2026-03-05', 765000, 'Licititud Pública'),
];

export const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({
  opportunities = dummyOpportunities,
  onViewAll,
  onSelectOpportunity
}) => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SectionHeader
          title="Oportunidades para Mipymes"
          subtitle="Procesos de contratación especialmente para pequeñas y medianas empresas"
          showViewAll
          onViewAll={onViewAll}
          icon="💼"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              onClick={() => onSelectOpportunity?.(opportunity.id)}
              className="cursor-pointer"
            >
              <ProcessCard data={opportunity} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
