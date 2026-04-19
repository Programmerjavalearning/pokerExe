import type { RangeFile } from '../types';
import rawDefault from '../data/poker_ranges_6max.json';

const DEFAULT_DATA = rawDefault as unknown as RangeFile;

/**
 * Load the range file.
 * - In Electron: reads from the user-writable appData file via IPC.
 * - Fallback (browser / Vite dev without Electron): uses the bundled JSON.
 */
export async function loadRangeFile(): Promise<RangeFile> {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.loadRange();
  }
  return DEFAULT_DATA;
}

/**
 * Persist the full updated range file.
 * - In Electron: writes to appData via IPC.
 * - Fallback: no-op (read-only in browser mode).
 */
export async function saveRangeFile(data: RangeFile): Promise<void> {
  if (typeof window !== 'undefined' && window.electronAPI) {
    await window.electronAPI.saveRange(data);
  }
}

/**
 * Reset the user-local file back to the bundled default and return it.
 * - In Electron: tells main process to copy the default, then returns it.
 * - Fallback: returns the bundled default in memory.
 */
export async function resetRangeFile(): Promise<RangeFile> {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.resetRange();
  }
  return DEFAULT_DATA;
}
