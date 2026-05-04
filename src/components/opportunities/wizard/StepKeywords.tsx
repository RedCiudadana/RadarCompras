import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StepKeywordsProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export const StepKeywords: React.FC<StepKeywordsProps> = ({ value, onChange }) => {
  const [draft, setDraft] = useState('');

  const commit = (raw: string) => {
    const token = raw.trim().toLowerCase();
    if (!token) return;
    if (value.includes(token)) return;
    onChange([...value, token]);
  };

  const remove = (token: string) => {
    onChange(value.filter(k => k !== token));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      commit(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (draft.trim()) {
      commit(draft);
      setDraft('');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-rc-text-base">Palabras clave</h3>
        <p className="text-sm text-rc-text-muted mt-1">
          Opcional. Las palabras clave resaltan coincidencias en los resultados.
        </p>
      </div>

      <div className="border border-rc-border rounded-lg p-2 bg-white focus-within:ring-2 focus-within:ring-rc-primary/30 focus-within:border-rc-primary transition-colors">
        <div className="flex flex-wrap gap-1.5 items-center">
          {value.map(kw => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 bg-rc-primary/10 text-rc-primary text-xs font-medium px-2 py-1 rounded"
            >
              {kw}
              <button
                type="button"
                onClick={() => remove(kw)}
                aria-label={`Quitar ${kw}`}
                className="hover:bg-rc-primary/20 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? 'Ej: medicina, computadora, escritorio...' : ''}
            className="flex-1 min-w-[160px] px-1 py-1 text-sm bg-transparent text-rc-text-base focus:outline-none"
          />
        </div>
      </div>

      <p className="text-xs text-rc-text-subtle">
        Presiona <kbd className="px-1.5 py-0.5 border border-rc-border rounded text-[10px] font-sans">Espacio</kbd> o <kbd className="px-1.5 py-0.5 border border-rc-border rounded text-[10px] font-sans">Enter</kbd> para agregar una palabra clave.
      </p>
    </div>
  );
};
