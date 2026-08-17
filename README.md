# QuarterTicker

A Mac desktop app that shows where you are in the quarter.

You tell QuarterTicker which month your **Q1** starts on, and it figures out
your four quarters from there. The dashboard shows:

- **Today's date**
- **Day X of quarter Y** (1-based, plus the total days in the quarter)
- **z% through quarter Y**, with a progress bar

Because you set the first month of Q1, this works for calendar quarters
(Q1 = January) or any fiscal calendar (e.g. Q1 = February, or Q1 = July).

## Stack

- [Electron](https://www.electronjs.org/) desktop shell
- TypeScript, bundled with [esbuild](https://esbuild.github.io/)
- No runtime dependencies beyond Electron itself

## Getting started

```bash
npm install
npm start
```

`npm start` builds the TypeScript into `dist/` and launches the app. On first
launch you'll be asked which month your Q1 starts on; your choice is saved to
Electron's per-user `userData` directory and can be changed later with the ⚙
button.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Bundle main, preload, and renderer into `dist/` and copy static assets |
| `npm run typecheck` | Type-check the source with `tsc --noEmit` |
| `npm start` | Build, then launch Electron |

## How the quarter math works

`src/quarter.ts` is pure, dependency-free logic. Given today's date and the
month Q1 starts on, it generates every quarter boundary in a 3-year window,
finds the boundary on or before today, and measures the day offset and total
length against real calendar dates — so months of different lengths (and
daylight-saving shifts) are handled exactly.

## Project layout

```
src/
  main.ts       Electron main process — window + config persistence (IPC)
  preload.ts    Safe bridge exposing config get/set to the renderer
  quarter.ts    Pure quarter math (no Electron/DOM dependencies)
  renderer.ts   UI logic: setup screen + dashboard, midnight auto-refresh
  index.html    Markup
  styles.css    Styling
```
