import type { Action, MixRatio, RangeEntry } from '../types';
import type { CSSProperties } from 'react';

/** Base colours for each action. */
export const ACTION_COLORS: Record<Action, string> = {
  raise:            '#16a34a', // green-700
  call:             '#2563eb', // blue-600
  fold:             '#1e293b', // slate-800
  'all-in':         '#dc2626', // red-600
  mixed:            '#16a34a', // fallback — overridden by gradient
  'three-bet':      '#f97316', // orange-500
  'four-bet-call':  '#7c3aed', // violet-700
  'four-bet-fold':  '#db2777', // pink-600
};

/** Text colour to use on top of each action background. */
export const ACTION_TEXT_COLORS: Record<Action, string> = {
  raise:           '#bbf7d0',
  call:            '#bfdbfe',
  fold:            '#475569',
  'all-in':        '#fecaca',
  mixed:           '#ffffff',
  'three-bet':     '#ffedd5',
  'four-bet-call': '#ede9fe',
  'four-bet-fold': '#fce7f3',
};

/**
 * Returns a React CSSProperties object (background / color) for a range entry.
 * Mixed entries get a diagonal stepped gradient proportional to mix percentages.
 */
export function getActionStyle(entry: RangeEntry): CSSProperties {
  if (entry.action !== 'mixed' || !entry.mix) {
    return {
      backgroundColor: ACTION_COLORS[entry.action],
      color: ACTION_TEXT_COLORS[entry.action],
    };
  }
  return {
    background: buildMixedGradient(entry.mix),
    color: '#ffffff',
  };
}

function buildMixedGradient(mix: MixRatio): string {
  type ColorStop = { color: string; start: number; end: number };
  const stops: ColorStop[] = [];
  let cumulative = 0;

  for (const [action, pct] of Object.entries(mix) as [Action, number][]) {
    if (!pct) continue;
    stops.push({ color: ACTION_COLORS[action], start: cumulative, end: cumulative + pct });
    cumulative += pct;
  }

  if (stops.length === 0) return ACTION_COLORS.fold;
  if (stops.length === 1) return stops[0].color;

  const parts = stops.flatMap(({ color, start, end }) => [
    `${color} ${start}%`,
    `${color} ${end}%`,
  ]);
  return `linear-gradient(135deg, ${parts.join(', ')})`;
}

/** Human-readable label for the action displayed in the details panel. */
export const ACTION_LABELS: Record<Action, string> = {
  raise:           'Raise',
  call:            'Call',
  fold:            'Fold',
  'all-in':        'All-In',
  mixed:           'Mixed',
  'three-bet':     '3-Bet',
  'four-bet-call': '4-Bet / Call',
  'four-bet-fold': '4-Bet / Fold',
};
