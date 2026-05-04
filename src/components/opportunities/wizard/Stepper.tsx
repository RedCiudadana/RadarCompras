import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  current: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  return (
    <ol className="flex items-center w-full">
      {steps.map((label, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        const circle =
          isDone
            ? 'bg-rc-primary text-white border-rc-primary'
            : isCurrent
              ? 'bg-white text-rc-primary border-rc-primary'
              : 'bg-white text-rc-text-subtle border-rc-border';
        const labelColor = isCurrent || isDone ? 'text-rc-text-base' : 'text-rc-text-subtle';
        return (
          <li key={label} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold tabular-nums transition-colors ${circle}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className={`text-sm font-medium ${labelColor} hidden sm:inline`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-rc-primary' : 'bg-rc-border'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
};
