import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import * as fs from 'node:fs';

interface Config {
  q1StartMonth: number | null;
}

const CONFIG_FILE = path.join(app.getPath('userData'), 'quarterticker-config.json');

function readConfig(): Config {
  try {
    const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    if (typeof parsed.q1StartMonth === 'number' &&
        parsed.q1StartMonth >= 1 && parsed.q1StartMonth <= 12) {
      return { q1StartMonth: parsed.q1StartMonth };
    }
  } catch {
    // No config yet (or unreadable) — fall through to the default.
  }
  return { q1StartMonth: null };
}

function writeConfig(config: Config): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

let win: BrowserWindow | null = null;

function createWindow(): void {
  win = new BrowserWindow({
    width: 440,
    height: 360,
    resizable: false,
    fullscreenable: false,
    title: 'QuarterTicker',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle('config:get', () => readConfig());
  ipcMain.handle('config:set', (_event, month: number) => {
    const config: Config = { q1StartMonth: month };
    writeConfig(config);
    return config;
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
