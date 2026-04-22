import React from 'react';
import { ArrowLeft, Building2, FileText, Layers, ExternalLink, Users } from 'lucide-react';
import { Release } from '../../types/ocds';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Local extensions for API fields present in real responses but not yet in shared types.
// Not added to ocds.ts because these extensions exist only for display purposes.
interface TenderItem {
  id: string;
  description: string;
  quantity?: { parsedValue?: number };
  unit?: { name: string };
}

interface TenderDocument {
  id: string;
  title: string;
  url: string;
  documentTypeDetails?: string;
}

interface ExtendedTender {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  statusDetails?: string;
  datePublished?: string;
  value?: { amount: number; currency: string };
  procurementMethod?: string;
  procurementMethodDetails?: string;
  mainProcurementCategory?: string;
  tenderPeriod?: { startDate?: string; endDate?: string };
  numberOfTenderers?: number;
  items?: TenderItem[];
  documents?: TenderDocument[];
}

type ReleaseDetail = Omit<Release, 'tender'> & { tender?: ExtendedTender };

const CATEGORY_LABEL: Record<string, string> = {
  works: 'Obras',
  goods: 'Bienes',
  services: 'Servicios',
  consultingServices: 'Consultoría',
};

function statusStyle(status?: string): { bg: string; text: string } {
  if (!status) return { bg: 'bg-gray-100', text: 'text-gray-500' };
  const s = status.toLowerCase();
  if (s.includes('vigent') || s.includes('activ')) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (s.includes('adjudic') || s.includes('seleccion')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
  if (s.includes('evaluac') || s.includes('espera') || s.includes('subast')) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  if (s.includes('desert') || s.includes('cancel') || s.includes('anulad') || s.includes('prescind') || s.includes('improbad')) return { bg: 'bg-red-100', text: 'text-red-600' };
  return { bg: 'bg-gray-100', text: 'text-gray-500' };
}

interface ProcessDetailProps {
  release?: Release;
  onBack?: () => void;
}

export const ProcessDetail: React.FC<ProcessDetailProps> = ({ release, onBack }) => {
  if (!release) {
    return (
      <div className="text-center py-16 text-rc-text-subtle text-sm">
        No se encontró información del proceso.
      </div>
    );
  }

  const detail = release as ReleaseDetail;
  const tender = detail.tender;
  const st = statusStyle(tender?.statusDetails ?? tender?.status);
  const displayStatus = tender?.statusDetails ?? tender?.status;
  const amount = tender?.value?.amount ?? 0;
  const category = tender?.mainProcurementCategory
    ? (CATEGORY_LABEL[tender.mainProcurementCategory] ?? tender.mainProcurementCategory)
    : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-rc-text-muted hover:text-rc-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a resultados
        </button>
      )}

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-semibold text-rc-text-base leading-snug">
            {tender?.title || 'Proceso sin título'}
          </h1>
          {displayStatus && (
            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
              {displayStatus}
            </span>
          )}
        </div>
        <p className="text-xs text-rc-text-subtle font-mono">{detail.ocid}</p>
      </div>

      {/* Key facts strip */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 py-4 border-y border-rc-border text-sm">
        {tender?.procurementMethodDetails && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Modalidad</span>
            <span className="text-rc-text-base font-medium">{tender.procurementMethodDetails}</span>
          </div>
        )}
        {category && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Tipo</span>
            <span className="text-rc-text-base font-medium">{category}</span>
          </div>
        )}
        {(tender?.datePublished ?? detail.date) && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Publicado</span>
            <span className="text-rc-text-base font-medium">{formatDate(tender?.datePublished ?? detail.date)}</span>
          </div>
        )}
        {tender?.tenderPeriod?.startDate && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Inicio del concurso</span>
            <span className="text-rc-text-base font-medium">{formatDate(tender.tenderPeriod.startDate)}</span>
          </div>
        )}
        {typeof tender?.numberOfTenderers === 'number' && tender.numberOfTenderers > 0 && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Oferentes</span>
            <span className="text-rc-text-base font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {tender.numberOfTenderers}
            </span>
          </div>
        )}
        {amount > 0 && (
          <div>
            <span className="text-xs font-medium text-rc-text-subtle uppercase tracking-wide block mb-0.5">Monto</span>
            <span className="font-bold text-rc-accent">{formatCurrency(amount, tender?.value?.currency)}</span>
          </div>
        )}
      </div>

      {/* Buyer */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-rc-primary uppercase tracking-wide mb-3">
          <Building2 className="w-4 h-4" />
          Entidad compradora
        </h2>
        <div className="bg-white border border-rc-border rounded-lg px-4 py-3">
          <p className="font-semibold text-rc-text-base">{detail.buyer?.name || 'N/A'}</p>
          <p className="text-xs text-rc-text-subtle mt-0.5 font-mono">{detail.buyer?.id || ''}</p>
        </div>
      </section>

      {/* Items / Bienes, obras o servicios */}
      {tender?.items && tender.items.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-rc-primary uppercase tracking-wide mb-3">
            <Layers className="w-4 h-4" />
            Bienes, obras o servicios a licitar
          </h2>
          <div className="bg-white border border-rc-border rounded-lg overflow-hidden">
            {tender.items.map((item, i) => (
              <div
                key={item.id || i}
                className="flex items-start gap-4 px-4 py-3 border-b border-rc-border last:border-b-0"
              >
                <span className="shrink-0 text-xs font-mono text-rc-text-subtle mt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-rc-text-base">{item.description}</p>
                </div>
                {(item.quantity?.parsedValue != null || item.unit?.name) && (
                  <span className="shrink-0 text-xs text-rc-text-muted bg-rc-surface px-2 py-0.5 rounded">
                    {item.quantity?.parsedValue != null ? `${item.quantity.parsedValue} ` : ''}
                    {item.unit?.name ?? ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      {tender?.documents && tender.documents.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-rc-primary uppercase tracking-wide mb-3">
            <FileText className="w-4 h-4" />
            Documentos ({tender.documents.length})
          </h2>
          <div className="bg-white border border-rc-border rounded-lg overflow-hidden">
            {tender.documents.map((doc, i) => (
              <a
                key={doc.id || i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 border-b border-rc-border last:border-b-0 hover:bg-rc-surface transition-colors group"
              >
                <FileText className="w-3.5 h-3.5 shrink-0 text-rc-text-subtle group-hover:text-rc-primary transition-colors" />
                <span className="flex-1 text-sm text-rc-text-base group-hover:text-rc-primary transition-colors truncate">
                  {doc.documentTypeDetails ?? doc.title}
                </span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-rc-text-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
