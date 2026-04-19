import { contextBridge, ipcRenderer } from 'electron';

/**
 * This file runs in a privileged context (Node + Electron APIs available).
 * contextBridge safely exposes a minimal, typed API to the renderer.
 *
 * The API surface is intentionally small — add methods here only when the
 * renderer needs to reach into the main process.
 *
 * Future extension points (uncomment or add as needed):
 *   license:validate  → premium unlock
 *   update:check      → auto-update via electron-updater
 *   app:getVersion    → display build version in the UI
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /** Load the user-writable range file from AppData. */
  loadRange: (): Promise<unknown> =>
    ipcRenderer.invoke('range:load'),

  /** Save the entire updated range file back to AppData. */
  saveRange: (data: unknown): Promise<boolean> =>
    ipcRenderer.invoke('range:save', data) as Promise<boolean>,

  /** Reset AppData to the bundled defaults and return the fresh data. */
  resetRange: (): Promise<unknown> =>
    ipcRenderer.invoke('range:reset'),
});
