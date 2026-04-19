// ─── Positions ─────────────────────────────────────────────────────────────
export const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const;
export type Position = (typeof POSITIONS)[number];

// ─── Categories ──────────────────────────────────────────────────────────────
export const CATEGORIES = ['open', 'vsOpen', 'vs3Bet'] as const;
export type Category = (typeof CATEGORIES)[number];

// ─── Actions ────────────────────────────────────────────────────────────────
export const ACTIONS = [
  'fold',
  'raise',
  'call',
  'three-bet',
  'four-bet-call',
  'four-bet-fold',
  'all-in',
  'mixed',
] as const;
export type Action = (typeof ACTIONS)[number];

/** Percentage breakdown for mixed-strategy cells. Values must sum to 100. */
export interface MixRatio {
  raise?: number;
  call?: number;
  fold?: number;
  'all-in'?: number;
}

// ─── Range entries ───────────────────────────────────────────────────────────
export interface RangeEntry {
  action: Action;
  /** Only present when action === 'mixed' */
  mix?: MixRatio;
}

/** Full range for one (category, preset) pair.
 *  Key = hand notation e.g. "AA", "AKs", "AKo"
 *  Any hand not present defaults to fold. */
export type RangeData = Record<string, RangeEntry>;

// ─── JSON file shape ─────────────────────────────────────────────────────────
export type Hand = string;

export interface OpenRange {
  raise: Hand[];
}

export interface VsOpenRange {
  call: Hand[];
  threeBet: Hand[];
}

export interface Vs3BetRange {
  call: Hand[];
  fourBetCall: Hand[];
  fourBetFold: Hand[];
}

export interface RangeFile {
  open: Record<string, OpenRange>;
  vsOpen: Record<string, VsOpenRange>;
  vs3Bet: Record<string, Vs3BetRange>;
}

// ─── Preset / category config ─────────────────────────────────────────────────
export interface PresetMeta {
  id: string;
  label: string;
}

export interface CategoryConfig {
  category: Category;
  label: string;
  presets: PresetMeta[];
}

// ─── View / Edit mode ────────────────────────────────────────────────────────
export type ViewMode = 'view' | 'edit';

// ─── App UI state ─────────────────────────────────────────────────────────────
export interface AppState {
  category: Category;
  preset: string;
  selectedHand: string | null;
  showOnlyPlayable: boolean;
  viewMode: ViewMode;
}
