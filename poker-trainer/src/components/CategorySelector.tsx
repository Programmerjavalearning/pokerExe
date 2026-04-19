import type { Category } from '../types';
import { CATEGORY_CONFIG } from '../config/spots';

interface Props {
  value: Category;
  onChange: (c: Category) => void;
}

export function CategorySelector({ value, onChange }: Props) {
  return (
    <div className="selector-group">
      <span className="selector-label">Category</span>
      <div className="tab-group">
        {CATEGORY_CONFIG.map(({ category, label }) => (
          <button
            key={category}
            className={`tab-btn ${value === category ? 'tab-btn--active' : ''}`}
            onClick={() => onChange(category)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
