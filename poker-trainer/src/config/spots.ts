import type { Action, Category, CategoryConfig } from '../types';

/** Actions shown per category — used by Legend and QuizMode. */
export const CATEGORY_ACTIONS: Record<Category, Action[]> = {
  open:    ['raise', 'fold'],
  vsOpen:  ['three-bet', 'call', 'fold'],
  vs3Bet:  ['four-bet-call', 'four-bet-fold', 'call', 'fold'],
};

/**
 * Central registry of all categories and their presets.
 * The first preset in each array is the default selection.
 */
export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    category: 'open',
    label: 'Open',
    presets: [
      { id: 'UTG', label: 'UTG' },
      { id: 'HJ',  label: 'HJ' },
      { id: 'CO',  label: 'CO' },
      { id: 'BTN', label: 'BTN' },
      { id: 'SB',  label: 'SB' },
    ],
  },
  {
    category: 'vsOpen',
    label: 'Vs Open',
    presets: [
      { id: 'BB_vs_SB',        label: 'BB vs SB' },
      { id: 'BB_vs_BTN',       label: 'BB vs BTN' },
      { id: 'BB_vs_CO',        label: 'BB vs CO' },
      { id: 'BB_vs_HJ_UTG',    label: 'BB vs HJ / UTG' },
      { id: 'SB_vs_BTN',       label: 'SB vs BTN' },
      { id: 'SB_vs_CO_HJ_UTG', label: 'SB vs CO / HJ / UTG' },
      { id: 'BTN_vs_CO',       label: 'BTN vs CO' },
      { id: 'BTN_vs_HJ_UTG',   label: 'BTN vs HJ / UTG' },
    ],
  },
  {
    category: 'vs3Bet',
    label: 'Vs 3-Bet',
    presets: [
      { id: 'OOP_vs_tight',      label: 'OOP vs Tight' },
      { id: 'IP_vs_tight',       label: 'IP vs Tight' },
      { id: 'BTN_vs_aggressive', label: 'BTN vs Aggressive' },
      { id: 'CO_vs_BTN',         label: 'CO vs BTN' },
      { id: 'CO_vs_blinds',      label: 'CO vs Blinds' },
    ],
  },
];
