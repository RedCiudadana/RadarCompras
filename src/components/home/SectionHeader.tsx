import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  showViewAll = false,
  onViewAll,
  icon
}) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="text-2xl">{icon}</div>}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>}
      </div>
      {showViewAll && (
        <Button
          variant="sky"
          size="sm"
          onClick={onViewAll}
          className="ml-4"
        >
          Ver todos
        </Button>
      )}
    </div>
  );
};
