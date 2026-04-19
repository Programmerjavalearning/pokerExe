import type { RangeEntry } from '../types';
import { getActionStyle } from '../utils/actionStyles';

interface Props {
  hand: string;
  entry: RangeEntry;
  isSelected: boolean;
  onClick: () => void;
}

export function HandCell({ hand, entry, isSelected, onClick }: Props) {
  const style = getActionStyle(entry);

  return (
    <button
      className={`matrix-cell matrix-cell--${entry.action} ${isSelected ? 'matrix-cell--selected' : ''}`}
      style={style}
      onClick={onClick}
      title={hand}
      aria-pressed={isSelected}
    >
      {hand}
    </button>
  );
}
