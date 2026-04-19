import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Category, RangeData, RangeFile, Action, ViewMode } from '../types';
import { parsePreset, applyEditedRangeToFile } from '../utils/rangeParser';
import { loadRangeFile, saveRangeFile, resetRangeFile } from '../services/rangeService';
import { CATEGORY_CONFIG } from '../config/spots';

const STORAGE_KEY = 'poker-trainer-v3';

function loadPersisted(): { category: Category; preset: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { category: Category; preset: string };
  } catch {
    // ignore malformed storage
  }
  return { category: 'open', preset: 'BTN' };
}

export function useRange() {
  const [rangeFile, setRangeFile] = useState<RangeFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategoryRaw] = useState<Category>(() => loadPersisted().category);
  const [preset, setPresetRaw] = useState<string>(() => loadPersisted().preset);
  const [selectedHand, setSelectedHand] = useState<string | null>(null);
  const [showOnlyPlayable, setShowOnlyPlayable] = useState(false);
  const [viewMode, setViewModeRaw] = useState<ViewMode>('view');
  const [editedRange, setEditedRange] = useState<RangeData>({});
  const [dirty, setDirty] = useState(false);

  // ── Load from IPC / bundled file on mount ────────────────────────────────
  useEffect(() => {
    loadRangeFile()
      .then((file) => {
        setRangeFile(file);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to load range file:', err);
        setLoading(false);
      });
  }, []);

  // ── Derive current preset's saved range ──────────────────────────────────
  const savedRange = useMemo<RangeData>(() => {
    if (!rangeFile) return {};
    return parsePreset(rangeFile, category, preset);
  }, [rangeFile, category, preset]);

  // When savedRange changes (preset/category switched), sync editedRange and clear dirty
  useEffect(() => {
    setEditedRange({ ...savedRange });
    setDirty(false);
  }, [savedRange]);

  // The matrix always shows editedRange in edit mode, savedRange in view mode
  const displayRange = viewMode === 'edit' ? editedRange : savedRange;

  // ── Selectors ────────────────────────────────────────────────────────────

  /** Switch category and reset preset to the first available in that category. */
  const setCategory = useCallback((c: Category) => {
    setCategoryRaw(c);
    setSelectedHand(null);
    const config = CATEGORY_CONFIG.find((cfg) => cfg.category === c);
    setPresetRaw(config?.presets[0]?.id ?? '');
  }, []);

  const setPreset = useCallback((p: string) => {
    setPresetRaw(p);
    setSelectedHand(null);
  }, []);

  const setViewMode = useCallback((m: ViewMode) => {
    setViewModeRaw(m);
    setSelectedHand(null);
  }, []);

  const selectHand = useCallback((hand: string) => {
    setSelectedHand((prev) => (prev === hand ? null : hand));
  }, []);

  // ── Edit mode actions ─────────────────────────────────────────────────────

  /** Assign an action to a hand in the current working (edit) state. */
  const setHandAction = useCallback((hand: string, action: Action) => {
    setEditedRange((prev) => {
      if (action === 'fold') {
        const next = { ...prev };
        delete next[hand];
        return next;
      }
      return { ...prev, [hand]: { action } };
    });
    setDirty(true);
  }, []);

  /** Persist the current edited state back to the local file. */
  const saveChanges = useCallback(async () => {
    if (!rangeFile) return;
    const updated = applyEditedRangeToFile(rangeFile, category, preset, editedRange);
    await saveRangeFile(updated);
    setRangeFile(updated);
    setDirty(false);
  }, [rangeFile, category, preset, editedRange]);

  /** Discard current edits and restore from the last saved state. */
  const resetPreset = useCallback(() => {
    setEditedRange({ ...savedRange });
    setDirty(false);
  }, [savedRange]);

  /** Copy the bundled default file back to appData and reload everything. */
  const resetAllToDefault = useCallback(async () => {
    const defaultFile = await resetRangeFile();
    setRangeFile(defaultFile);
    setDirty(false);
  }, []);

  // ── Persist selection ─────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ category, preset }));
  }, [category, preset]);

  return {
    loading,
    category,
    setCategory,
    preset,
    setPreset,
    selectedHand,
    selectHand,
    showOnlyPlayable,
    setShowOnlyPlayable,
    viewMode,
    setViewMode,
    displayRange,
    dirty,
    setHandAction,
    saveChanges,
    resetPreset,
    resetAllToDefault,
  };
}

