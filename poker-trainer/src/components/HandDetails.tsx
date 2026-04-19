import type { Action, Category, RangeEntry } from '../types';
import { handType, getCombos } from '../utils/handUtils';
import { ACTION_LABELS, ACTION_COLORS, ACTION_TEXT_COLORS } from '../utils/actionStyles';
import { CATEGORY_ACTIONS } from '../config/spots';

interface Props {
  hand: string | null;
  entry: RangeEntry | null;
  editMode?: boolean;
  category?: Category;
  onSetAction?: (hand: string, action: Action) => void;
}

export function HandDetails({ hand, entry, editMode, category, onSetAction }: Props) {
  if (!hand || !entry) {
    return (
      <div className="hand-details hand-details--empty">
        <p>{editMode ? 'Click a hand to edit its action' : 'Click any hand to see details'}</p>
      </div>
    );
  }

  const type = handType(hand);
  const combos = getCombos(hand);
  const actions: Action[] = category ? CATEGORY_ACTIONS[category] : [];

  return (
    <div className="hand-details">
      <div className="hand-details__name">{hand}</div>

      <div className="hand-details__meta">
        <span className="badge">{type}</span>
        <span className="badge">{combos} combos</span>
      </div>

      {editMode && onSetAction ? (
        <div className="hand-details__edit-actions">
          <p className="hand-details__edit-label">Set action</p>
          {actions.map((action) => {
            const isActive = entry.action === action;
            return (
              <button
                key={action}
                className={`edit-action-btn ${isActive ? 'edit-action-btn--active' : ''}`}
                style={{
                  borderColor: ACTION_COLORS[action],
                  backgroundColor: isActive ? ACTION_COLORS[action] : 'transparent',
                  color: isActive ? ACTION_TEXT_COLORS[action] : ACTION_COLORS[action],
                }}
                onClick={() => onSetAction(hand, action)}
              >
                {ACTION_LABELS[action]}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          className="hand-details__action"
          style={{ color: ACTION_COLORS[entry.action] }}
        >
          {ACTION_LABELS[entry.action]}
        </div>
      )}
    </div>
  );
}
