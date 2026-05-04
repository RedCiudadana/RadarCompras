import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TOP_ENTIDADES_BY_FAMILIA } from '../../../const/guatecompras';

interface StepCategoriesProps {
  value: string[];
  onChange: (next: string[]) => void;
}

const CATEGORIES = TOP_ENTIDADES_BY_FAMILIA.map((family) => ({
  code: family.fam_code,
  name: family.fam_nombre
}));

export const StepCategories: React.FC<StepCategoriesProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter(
      f => f.code.toLowerCase().includes(q) || f.name.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (code: string) => {
    if (selected.has(code)) {
      onChange(value.filter(c => c !== code));
    } else {
      onChange([...value, code]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-rc-text-base">¿Cuál es la actividad principal de tu empresa?</h3>
        <p className="text-sm text-rc-text-muted mt-1">
          Selecciona una o más familias UNSPSC que describan los productos o servicios que ofreces.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rc-text-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código o nombre..."
          className="w-full pl-9 pr-3 py-2 border border-rc-border rounded text-sm bg-white text-rc-text-base focus:outline-none focus:ring-2 focus:ring-rc-primary/30 focus:border-rc-primary"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-rc-text-muted">
          <span className="font-semibold text-rc-text-base">{value.length}</span> seleccionadas
          <span className="text-rc-text-subtle"> · {filtered.length} de {CATEGORIES.length} visibles</span>
        </span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-rc-primary hover:underline font-medium"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="border border-rc-border rounded-lg overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-rc-text-subtle">
              No se encontraron familias con "{query}".
            </div>
          ) : (
            filtered.map(f => {
              const checked = selected.has(f.code);
              return (
                <label
                  key={f.code}
                  className={`flex items-center gap-3 px-3 py-2 border-b border-rc-border last:border-b-0 cursor-pointer hover:bg-rc-surface transition-colors ${checked ? 'bg-rc-primary/5' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(f.code)}
                    className="w-4 h-4 accent-rc-primary"
                  />
                  <span className="font-mono text-xs text-rc-text-subtle tabular-nums shrink-0 w-12">{f.code}</span>
                  <span className="text-sm text-rc-text-base flex-1">{f.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
