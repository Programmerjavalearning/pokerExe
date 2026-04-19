import type { RangeFile } from './index';

/**
 * Augment the global Window interface so the renderer can call
 * window.electronAPI without TypeScript errors.
 * The preload script (electron/preload.ts) provides this object at runtime.
 */
declare global {
  interface Window {
    electronAPI?: {
      loadRange(): Promise<RangeFile>;
      saveRange(data: RangeFile): Promise<boolean>;
      resetRange(): Promise<RangeFile>;
    };
  }
}

export {};
