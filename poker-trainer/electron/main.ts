import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import fs from 'fs';

// ─── Environment ──────────────────────────────────────────────────────────
// app.isPackaged is false in dev (electron .) and true in a packaged .exe
const isDev = !app.isPackaged;

// ─── File paths ───────────────────────────────────────────────────────────

function getUserDataPath(): string {
  return path.join(app.getPath('userData'), 'poker_ranges_6max.json');
}

function getBundledDefaultPath(): string {
  if (isDev) {
    // In dev, __dirname === <project-root>/dist-electron
    // The source JSON is one level up at <project-root>/src/data/
    return path.join(__dirname, '../src/data/poker_ranges_6max.json');
  }
  // In a packaged app, electron-builder copies extraResources to process.resourcesPath
  return path.join(process.resourcesPath, 'poker_ranges_6max.json');
}

/**
 * On first launch, copy the bundled default JSON into the user-writable
 * AppData folder.  After that we always read/write from there so the
 * user's edits survive rebuilds and reinstalls.
 */
function ensureUserDataFile(): void {
  const dest = getUserDataPath();
  if (fs.existsSync(dest)) return;

  const src = getBundledDefaultPath();
  if (!fs.existsSync(src)) {
    throw new Error(
      `[PokerTrainer] Default data file not found at: ${src}\n` +
      `Expected location: ${dest}`,
    );
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[PokerTrainer] Initialized data file at ${dest}`);
}

// ─── Window ───────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Initialise data first — any error here is fatal and intentional
  ensureUserDataFile();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: false,                  // prevent flash of unstyled content
    backgroundColor: '#0f1628',
    title: 'Poker Trainer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,             // required for contextBridge + ipcRenderer
    },
  });

  // Hide the default menu bar (File / Edit / View …)
  Menu.setApplicationMenu(null);

  // Show only once the renderer is ready — no white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools automatically in dev
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Security: block navigation away from the app ─────────────────────────

app.on('web-contents-created', (_e, contents) => {
  contents.on('will-navigate', (event, url) => {
    const allowed = isDev ? 'http://localhost:5173' : 'file://';
    if (!url.startsWith(allowed)) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

// ─── IPC handlers ─────────────────────────────────────────────────────────

/** Load the user-local range file and return it as a parsed object. */
ipcMain.handle('range:load', () => {
  const content = fs.readFileSync(getUserDataPath(), 'utf-8');
  return JSON.parse(content) as unknown;
});

/** Overwrite the user-local range file with the supplied data. */
ipcMain.handle('range:save', (_event, data: unknown) => {
  fs.writeFileSync(getUserDataPath(), JSON.stringify(data, null, 2), 'utf-8');
  return true;
});

/** Reset the user-local file from the bundled default and return the data. */
ipcMain.handle('range:reset', () => {
  const src  = getBundledDefaultPath();
  const dest = getUserDataPath();
  fs.copyFileSync(src, dest);
  const content = fs.readFileSync(dest, 'utf-8');
  return JSON.parse(content) as unknown;
});

// ─── Future hooks (stub — implement when needed) ──────────────────────────
//
//  ipcMain.handle('license:validate', async (_e, key: string) => { … });
//  ipcMain.handle('update:check', async () => { … });  // electron-updater
//

// ─── App lifecycle ─────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
}).catch((err: unknown) => {
  console.error('[PokerTrainer] Failed to create window:', err);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

