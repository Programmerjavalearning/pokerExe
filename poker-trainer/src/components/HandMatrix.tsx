import { useMemo, Fragment } from 'react';
import type { RangeData } from '../types';
import { RANKS, getHandLabel } from '../utils/handUtils';
import { getHandAction } from '../utils/rangeLoader';
import { HandCell } from './HandCell';

interface Props {
  range: RangeData;
  selectedHand: string | null;
  showOnlyPlayable: boolean;
  onSelectHand: (hand: string) => void;
}

export function HandMatrix({
  range,
  selectedHand,
  showOnlyPlayable,
  onSelectHand,
}: Props) {
  // Pre-compute the entire cell grid once per range change
  const cells = useMemo(
    () =>
      Array.from({ length: 13 }, (_, row) =>
        Array.from({ length: 13 }, (_, col) => {
          const hand = getHandLabel(row, col);
          return { hand, entry: getHandAction(range, hand) };
        }),
      ),
    [range],
  );

  return (
    <div className="matrix-wrapper">
      <div className="hand-matrix">
        {/* Column rank headers */}
        <div className="matrix-corner" />
        {RANKS.map((r) => (
          <div key={r} className="matrix-header-cell">
            {r}
          </div>
        ))}

        {/* Data rows — each rank maps to 1 row-header + 13 cells (Fragment renders as siblings in the CSS grid) */}
        {RANKS.map((rank, row) => (
          <Fragment key={rank}>
            <div className="matrix-row-header">
              {rank}
            </div>
            {cells[row].map(({ hand, entry }, col) => {
              if (showOnlyPlayable && entry.action === 'fold') {
                return (
                  <div
                    key={`${row}-${col}`}
                    className="matrix-cell matrix-cell--hidden"
                  />
                );
              }
              return (
                <HandCell
                  key={`${row}-${col}`}
                  hand={hand}
                  entry={entry}
                  isSelected={selectedHand === hand}
                  onClick={() => onSelectHand(hand)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
