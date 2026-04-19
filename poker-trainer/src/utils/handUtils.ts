/**
 * handUtils.ts — 13×13 matrix logic and hand categorisation.
 *
 * Matrix layout (ranks[0]='A' … ranks[12]='2'):
 *   cell[row][col] where row === col  → pair   (AA, KK …)
 *                       row <  col   → suited  (AKs, QJTs …)  ← top-right triangle
 *                       row >  col   → offsuit (AKo, QJo …)  ← bottom-left triangle
 */

export const RANKS = [
  'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2',
] as const;
export type Rank = (typeof RANKS)[number];

/** Returns the canonical hand label for a matrix cell. */
export function getHandLabel(row: number, col: number): string {
  if (row === col) return `${RANKS[row]}${RANKS[col]}`;
  if (row < col)  return `${RANKS[row]}${RANKS[col]}s`; // suited — top-right
  return `${RANKS[col]}${RANKS[row]}o`;                  // offsuit — bottom-left
}

/** All 169 unique starting hands in left-to-right, top-to-bottom matrix order. */
export function getAllHands(): string[] {
  const hands: string[] = [];
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      hands.push(getHandLabel(row, col));
    }
  }
  return hands;
}

export const isPair    = (h: string) => h.length === 2 && h[0] === h[1];
export const isSuited  = (h: string) => h.endsWith('s');
export const isOffsuit = (h: string) => h.endsWith('o');

export const handType = (h: string): 'pair' | 'suited' | 'offsuit' =>
  isPair(h) ? 'pair' : isSuited(h) ? 'suited' : 'offsuit';

/** Number of distinct card combos for a hand category. */
export const getCombos = (h: string): number =>
  isPair(h) ? 6 : isSuited(h) ? 4 : 12;
