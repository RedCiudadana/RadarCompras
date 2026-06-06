import React from 'react';
import { Clock, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Release } from '../../types/ocds';

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

const getStatusBadge = (status: string, methodDetails: string): { label: string; bgColor: string; textColor: string } => {
  if (status === 'closing-soon') {
    return { label: methodDetails || 'Proceso', bgColor: 'bg-red-100', textColor: 'text-red-700' };
  }
  return { label: methodDetails || 'Proceso', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
};

const getStatusClass = (daysLeft: number): 'open' | 'closing-soon' | 'closed' => {
  if (daysLeft <= 0) return 'closed';
  if (daysLeft <= 7) return 'closing-soon';
  return 'open';
};

export const ProcessCard: React.FC<ProcessCardProps> = ({ data, variant = 'compact' }) => {
  const daysLeft = getDaysRemaining(data.tender.tenderPeriod.endDate);
  const status = getStatusClass(daysLeft);
  const amount = data.awards?.[0]?.value?.amount || data.contracts?.[0]?.value?.amount || 0;
  const categories = data.tender.items.slice(0, 2).map(item => item.classification.id);
  const badge = getStatusBadge(status, data.tender.procurementMethodDetails);

  const statusBorderColors = {
    'open': 'border-l-4 border-rc-blue',
    'closing-soon': 'border-l-4 border-red-500',
    'closed': 'border-l-4 border-gray-400',
  };

  if (variant === 'full') {
    return (
      <div className={`rounded-lg p-4 bg-white ${statusBorderColors[status]} transition-shadow hover:shadow-md`}>
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${badge.bgColor} ${badge.textColor}`}>
            {badge.label}
          </span>
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-rc-blue/10 text-rc-blue">
            Mipyme
          </span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{data.tender.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{data.buyer.name}</p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map(cat => (
              <span key={cat} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-600 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(data.tender.tenderPeriod.endDate)}
          </span>
          <span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>
        </div>
      </div>
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
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-rc-blue/10 text-rc-blue">
            Mipyme
          </span>
        </div>
        <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{data.tender.title}</h4>
        <p className="text-xs text-gray-600 mb-2">{data.buyer.name}</p>

        <div className="flex items-center gap-1 mb-2 text-red-600">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold">Cierra en {daysLeft} días</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{formatDate(data.tender.tenderPeriod.endDate)}</span>
          <span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>
        </div>
      </div>
    );
  }

  // Open state
  return (
    <div className={`rounded-lg p-4 bg-white ${statusBorderColors[status]} transition-shadow hover:shadow-md cursor-pointer`}>
      <div className="flex items-start justify-between mb-2 gap-2">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded bg-rc-blue/10 text-rc-blue`}>
          {data.tender.procurementMethodDetails || 'Proceso'}
        </span>
        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-rc-blue/10 text-rc-blue flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Apto Mipyme
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{data.tender.title}</h4>
      <p className="text-xs text-gray-600 mb-1">{data.buyer.name}</p>

      {data.buyer.name && (
        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3" />
          Ciudad de Guatemala
        </p>
      )}

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
          {formatDate(data.tender.tenderPeriod.endDate)}
        </span>
        <span className="font-semibold text-rc-orange">{formatAmount(amount)}</span>
      </div>
    </div>
  );
};
