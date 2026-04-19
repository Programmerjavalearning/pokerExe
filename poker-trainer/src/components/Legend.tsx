import type { Action, Category } from '../types';
import { ACTION_COLORS, ACTION_LABELS } from '../utils/actionStyles';
import { CATEGORY_ACTIONS } from '../config/spots';

interface Props {
  category: Category;
}

export function Legend({ category }: Props) {
  const actions: Action[] = CATEGORY_ACTIONS[category];

  return (
    <div className="legend">
      {actions.map((action) => (
        <div key={action} className="legend-item">
          <div
            className="legend-swatch"
            style={{ background: ACTION_COLORS[action] }}
          />
          <span>{ACTION_LABELS[action]}</span>
        </div>
      ))}
    </div>
  );
}
