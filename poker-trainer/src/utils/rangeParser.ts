import type { Action, Category, RangeData, RangeFile } from '../types';

/**
 * Convert one preset from a RangeFile into a hand→action map.
 * Any hand not listed in any action array is absent — getHandAction() defaults them to Fold.
 */
export function parsePreset(
  file: RangeFile,
  category: Category,
  preset: string,
): RangeData {
  const result: RangeData = {};

  if (category === 'open') {
    const p = file.open[preset];
    if (!p) return result;
    for (const hand of p.raise) {
      result[hand] = { action: 'raise' };
    }
  } else if (category === 'vsOpen') {
    const p = file.vsOpen[preset];
    if (!p) return result;
    for (const hand of p.call) {
      result[hand] = { action: 'call' };
    }
    for (const hand of p.threeBet) {
      result[hand] = { action: 'three-bet' };
    }
  } else if (category === 'vs3Bet') {
    const p = file.vs3Bet[preset];
    if (!p) return result;
    for (const hand of p.call) {
      result[hand] = { action: 'call' };
    }
    for (const hand of p.fourBetCall) {
      result[hand] = { action: 'four-bet-call' };
    }
    for (const hand of p.fourBetFold) {
      result[hand] = { action: 'four-bet-fold' };
    }
  }

  return result;
}

function handsWithAction(range: RangeData, action: Action): string[] {
  return Object.entries(range)
    .filter(([, e]) => e.action === action)
    .map(([h]) => h);
}

/**
 * Write an edited RangeData back into the RangeFile array structure.
 * Returns a deep-cloned, updated copy of the file — does not mutate the input.
 */
export function applyEditedRangeToFile(
  file: RangeFile,
  category: Category,
  preset: string,
  editedRange: RangeData,
): RangeFile {
  const updated = JSON.parse(JSON.stringify(file)) as RangeFile;

  if (category === 'open') {
    updated.open[preset] = {
      raise: handsWithAction(editedRange, 'raise'),
    };
  } else if (category === 'vsOpen') {
    updated.vsOpen[preset] = {
      call: handsWithAction(editedRange, 'call'),
      threeBet: handsWithAction(editedRange, 'three-bet'),
    };
  } else if (category === 'vs3Bet') {
    updated.vs3Bet[preset] = {
      call:        handsWithAction(editedRange, 'call'),
      fourBetCall: handsWithAction(editedRange, 'four-bet-call'),
      fourBetFold: handsWithAction(editedRange, 'four-bet-fold'),
    };
  }

  return updated;
}
