import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Calendar, CheckCircle2, Check, Building2 } from 'lucide-react';
import { Release, Tender } from '../../types/ocds';
import { MODALIDADES } from '../../const/catalogo';
import { UNSPCS_MAP } from '../../const/unspcsMap';
import { UNSPCS_FAMILIES } from '../../const/unspcs';

interface ProcessCardProps {
  data: Release;
  variant?: 'compact' | 'full';
}

const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  const closing = new Date(endDate);
  const diffMs = closing.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `GTQ ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `GTQ ${(amount / 1000).toFixed(1)}K`;
  }
  return `GTQ ${amount.toFixed(0)}`;
};

const getShortMethodDetail = (methodDetails: string) => {
  const mod = MODALIDADES.find((mod) => mod.name === methodDetails);

  console.log(mod, methodDetails);

  if (mod) {
    return mod.shortName || mod.name;
  }

  return methodDetails;
}

const getStatusBadge = (status: string, methodDetails: string): { label: string; bgColor: string; textColor: string } => {
  if (status === 'closing-soon') {
    return { label: getShortMethodDetail(methodDetails) || 'Proceso', bgColor: 'bg-red-100', textColor: 'text-red-700' };
  }
  return { label: getShortMethodDetail(methodDetails) || 'Proceso', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
};

const getStatusClass = (tender: Tender): 'open' | 'closing-soon' | 'closed' => {
  if (tender.procurementMethodDetails === 'Compra Directa con Oferta Electrónica (Art. 43 LCE Inciso b)') {
    return 'closing-soon';
  }
  if (tender.status === 'active') return 'open';

  const open_status = ['Vigente', 'Evaluacion', 'Subastando']
  if (open_status.includes(tender.statusDetails)) return 'open';

  return 'closed';

};

const getCategoryName = (category: string) => {
  const familiy = UNSPCS_FAMILIES.find(family => family.code.startsWith(category.slice(0, 3)));

  return familiy?.name || category;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ data, variant = 'compact' }) => {
  const endDate = data.tender.tenderPeriod?.endDate ?? data.date;
  const daysLeft = getDaysRemaining(endDate);
  const publishedDate = data.tender.datePublished ?? data.date;
  const status = getStatusClass(data.tender);
  const amount = data.awards?.[0]?.value?.amount || data.contracts?.[0]?.value?.amount || 0;
  const categories = data.tender.items.slice(0, 2).map(item => item.classification.id);
  const badge = getStatusBadge(status, data.tender.procurementMethodDetails);
  const isPyme = data.tender.procurementMethodDetails === "Compra Directa con Oferta Electrónica (Art. 43 LCE Inciso b)";

  const statusBorderColors = {
    'open': '',
    'closing-soon': 'border-l-4 border-orange',
    'closed': 'border-l-4 border-neutral',
  };

  if (variant === 'full') {
    return (
      <Link to={`/busqueda/${data.id}`} className={`block rounded-lg p-4 bg-white ${statusBorderColors[status]} transition-shadow hover:shadow-md`}>
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${badge.bgColor} ${badge.textColor}`}>
            {badge.label}
          </span>
          {isPyme && (<span className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white font-medium rounded-lg bg-green">
            <CheckCircle2 size={12} className='text-white' /> PYME
          </span>)}
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-4">{data.tender.title}</h3>
        <p className="text-sm text-gray-600 mb-2 flex gap-1">
          <Building2 className="w-4 h-4" />
          {data.buyer.name}
        </p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map(cat => (
              <span key={cat} className="text-xs bg-neutral text-rc-blue px-2 py-0.5 rounded">
                {getCategoryName(cat)}
              </span>
            ))}
          </div>
        )}

        {/* END DATES DON'T MAKE SENSE IN OCDS API */}
        {/* <span className="text-gray-600 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(endDate)}
        </span> */}
        { amount > 0 && (<div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
          <span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>
        </div>)}
      </Link>
    );
  }

  // Compact variant
  if (status === 'closing-soon') {
    return (
      <div className={`rounded-lg p-4 bg-white ${statusBorderColors[status]} transition-shadow hover:shadow-md cursor-pointer`}>
        <div className="flex items-start justify-between mb-2 gap-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${badge.bgColor} ${badge.textColor}`}>
            {badge.label}
          </span>
          <span className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white font-medium rounded-lg bg-green">
            <CheckCircle2 size={12} className='text-white' /> PYME
          </span>
        </div>
        <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{data.tender.title}</h4>
        <p className="text-xs text-gray-600 mb-2">{data.buyer.name}</p>

        {/* END DATES DON'T MAKE SENSE IN OCDS API */}
        {/* <div className="flex items-center gap-1 mb-2 text-red-600">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold">Cierra en {daysLeft} días</span>
        </div> */}

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{formatDate(publishedDate)}</span>

          {amount > 0 && (<span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>)}
        </div>
      </div>
    );
  }

  // Open state
  return (
    <div className={`rounded-lg p-4 bg-white ${statusBorderColors[status]} transition-shadow hover:shadow-md cursor-pointer`}>
      <div className="flex items-start justify-between mb-2 gap-2">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded bg-rc-blue/10 text-rc-blue`}>
          {badge.label || 'Proceso'}
        </span>
        <span className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white font-medium rounded-lg bg-green">
            <CheckCircle2 size={12} className='text-white' /> PYME
          </span>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{data.tender.title}</h4>
      <p className="text-xs text-gray-600 mb-1">{data.buyer.name}</p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.map(cat => (
            <span key={cat} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
        <span className="text-gray-600 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(endDate)}
        </span>
        <span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>
      </div>
    </div>
  );
};
