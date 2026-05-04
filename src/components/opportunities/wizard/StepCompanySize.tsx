import React from 'react';
import { CompanySize } from '../../../services/recommender';

interface SizeOption {
  value: CompanySize;
  label: string;
  description: string;
}

const OPTIONS: SizeOption[] = [
  {
    value: 'small',
    label: 'Pequeña',
    description: 'Compra Directa y Baja Cuantía (hasta ~Q90,000).',
  },
  {
    value: 'medium',
    label: 'Mediana',
    description: 'Cotización Pública (Q90,000 – Q900,000).',
  },
  {
    value: 'large',
    label: 'Grande',
    description: 'Licitación Pública (Q900,000 en adelante).',
  },
];

interface StepCompanySizeProps {
  value: CompanySize | null;
  onChange: (size: CompanySize) => void;
}

export const StepCompanySize: React.FC<StepCompanySizeProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-rc-text-base">Tamaño de tu empresa</h3>
        <p className="text-sm text-rc-text-muted mt-1">
          Cada tamaño se asocia a las modalidades de compra que mejor le aplican.
        </p>
      </div>

      <div className="space-y-2">
        {OPTIONS.map(opt => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                checked
                  ? 'border-rc-primary bg-rc-primary/5'
                  : 'border-rc-border hover:border-rc-primary/40'
              }`}
            >
              <input
                type="radio"
                name="company-size"
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 w-4 h-4 accent-rc-primary"
              />
              <div className="flex-1">
                <div className="font-semibold text-rc-text-base">{opt.label}</div>
                <div className="text-sm text-rc-text-muted mt-0.5">{opt.description}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
