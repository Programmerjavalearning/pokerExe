# Poker Trainer — 6-Max Preflop Ranges

A desktop application built with Electron, React, and TypeScript for studying preflop GTO ranges in 6-max cash games.

## Features

- **13×13 hand matrix** — pairs on the diagonal, suited in the top-right triangle, offsuit in the bottom-left
- **Three range categories** — Open (RFI), Vs Open (facing a raise), and Vs 3-Bet
- **Multiple presets per category** — e.g. UTG/HJ/CO/BTN/SB opens; BB vs SB, BB vs BTN, SB vs BTN scenarios; OOP/IP vs tight/aggressive 3-bets
- **View / Edit modes** — study ranges in view mode; click any hand cell in edit mode to change its action and save it locally
- **Persistent edits** — modified ranges are written to the OS user-data folder and survive app restarts; a one-click reset restores the bundled defaults
- **Playable-only filter** — hide fold hands to focus only on the playable range
- **Hand details panel** — click any cell to see the hand type, combo count, and assigned action
- **Mixed strategy support** — gradient cells for hands with split-strategy actions
- **Dark theme** — optimised for long study sessions
- **localStorage persistence** — last selected category and preset are remembered across sessions

---

## Tech stack

| Tool | Version | Role |
|------|---------|------|
| Electron | 41 | Desktop shell, file-system IPC |
| React | 18 | UI framework |
| TypeScript | 5 | Type safety across renderer and main process |
| Vite | 5 | Renderer bundler |
| electron-builder | 26 | Windows installer packaging |
| CSS custom properties | — | Dark theme without a CSS framework |

No backend, no network requests, no external services — all range data is bundled and stored locally.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer (includes npm)

---

## Install and run

```bash
# from the poker-trainer directory
npm install

# start Electron in development mode (opens DevTools automatically)
npm run dev
```

The Vite dev server starts on `http://localhost:5173` and Electron loads it automatically.

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server + Electron (hot reload for renderer) |
| `npm run build` | Compile Electron main process + build renderer with Vite |
| `npm run preview` | Preview the production renderer build in a browser |
| `npm run package:win` | Build and package a Windows NSIS installer to `release/` |

---

## Project structure

```
poker-trainer/
├── electron/
│   ├── main.ts          — Electron main process: window, IPC handlers, file I/O
│   └── preload.ts       — contextBridge: exposes a typed API to the renderer
├── src/
│   ├── types/
│   │   ├── index.ts     — all shared TypeScript types and constants
│   │   └── electron.d.ts — Window.electronAPI type augmentation
│   ├── config/
│   │   └── spots.ts     — category/preset registry + actions per category
│   ├── utils/
│   │   ├── handUtils.ts — 13×13 matrix logic, hand labels, combo counts
│   │   ├── rangeLoader.ts — getHandAction helper (fold default)
│   │   ├── rangeParser.ts — parse/write RangeFile ↔ RangeData structures
│   │   └── actionStyles.ts — action → colour / gradient mapping
│   ├── services/
│   │   └── rangeService.ts — IPC bridge for load/save/reset (falls back to JSON in browser)
│   ├── hooks/
│   │   └── useRange.ts  — main app state: category, preset, edit/view mode, dirty flag
│   ├── components/
│   │   ├── CategorySelector.tsx — Open / Vs Open / Vs 3-Bet tab bar
│   │   ├── PresetSelector.tsx   — position/scenario tab bar per category
│   │   ├── HandMatrix.tsx       — 13×13 CSS grid of cells
│   │   ├── HandCell.tsx         — individual clickable cell
│   │   ├── HandDetails.tsx      — selected hand panel + edit action picker
│   │   ├── Legend.tsx           — action colour key
│   │   └── FilterBar.tsx        — "Playable only" toggle
│   ├── data/
│   │   └── poker_ranges_6max.json — bundled default range file
│   ├── App.tsx / App.css
│   └── main.tsx / index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.electron.json / tsconfig.node.json
└── .gitignore
```

---

## Range data format

All ranges live in a single JSON file (`src/data/poker_ranges_6max.json`) structured as:

```json
{
  "open": {
    "BTN": { "raise": ["AA", "KK", "AKs", "..."] },
    "UTG": { "raise": ["AA", "KK", "..."] }
  },
  "vsOpen": {
    "BB_vs_BTN": {
      "call":    ["ATo", "KQs", "..."],
      "threeBet": ["AA", "KK", "AKs", "..."]
    }
  },
  "vs3Bet": {
    "IP_vs_tight": {
      "call":        ["AQs", "KQs", "..."],
      "fourBetCall": ["AA", "KK", "..."],
      "fourBetFold": ["AJo", "KQo", "..."]
    }
  }
}
```

**Hand notation:** `AA` (pair) · `AKs` (suited) · `AKo` (offsuit). Ranks: `A K Q J T 9 8 7 6 5 4 3 2`.

Any hand absent from all action arrays defaults to **fold**.

---

## Extending the app

| Goal | Where to change |
|------|----------------|
| Add a new category | `src/types/index.ts` → `CATEGORIES`; `src/config/spots.ts` → `CATEGORY_CONFIG` + `CATEGORY_ACTIONS`; `src/utils/rangeParser.ts` → parse/apply logic |
| Add a new preset to an existing category | `src/config/spots.ts` → add entry to the relevant `presets` array; add the preset key to `poker_ranges_6max.json` |
| Add a new action | `src/types/index.ts` → `ACTIONS`; `src/utils/actionStyles.ts` → `ACTION_COLORS` / `ACTION_LABELS` |
| Replace ranges with your own solver output | Edit `src/data/poker_ranges_6max.json` directly, or use the in-app edit mode |
