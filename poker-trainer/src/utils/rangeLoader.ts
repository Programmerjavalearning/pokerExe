import type { RangeData } from '../types';

/** Look up a single hand's entry, defaulting to Fold when not defined. */
export function getHandAction(range: RangeData, hand: string) {
  return range[hand] ?? ({ action: 'fold' } as const);
}
