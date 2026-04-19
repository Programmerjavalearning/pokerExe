import type { Category } from '../types';
import { CATEGORY_CONFIG } from '../config/spots';

interface Props {
  category: Category;
  value: string;
  onChange: (preset: string) => void;
}

export function PresetSelector({ category, value, onChange }: Props) {
  const config = CATEGORY_CONFIG.find((c) => c.category === category);
  if (!config) return null;

  return (
    <div className="selector-group">
      <span className="selector-label">
        {category === 'open' ? 'Position' : 'Scenario'}
      </span>
      <div className="tab-group tab-group--wrap">
        {config.presets.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-btn ${value === id ? 'tab-btn--active' : ''}`}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
