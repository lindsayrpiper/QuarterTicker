/**
 * Browser implementation of the config bridge that the Electron build exposes
 * from preload.ts. In the desktop app the renderer talks to the main process
 * over IPC and the choice is saved to disk; on the web there is no main
 * process, so we persist the Q1 start month in localStorage instead.
 *
 * Importing this module for its side effect installs `window.quarterAPI`,
 * matching the shape the renderer already expects — so renderer.ts runs
 * unchanged in both environments.
 */

const STORE_KEY = 'quarterticker-q1-start-month';

window.quarterAPI = {
  getConfig(): Promise<{ q1StartMonth: number | null }> {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORE_KEY);
    } catch {
      // Private-mode or storage disabled — treat as unconfigured.
    }
    const n = raw == null ? NaN : Number(raw);
    const valid = Number.isInteger(n) && n >= 1 && n <= 12;
    return Promise.resolve({ q1StartMonth: valid ? n : null });
  },

  setConfig(month: number): Promise<{ q1StartMonth: number }> {
    try {
      window.localStorage.setItem(STORE_KEY, String(month));
    } catch {
      // Best effort — the dashboard still works for this session.
    }
    return Promise.resolve({ q1StartMonth: month });
  },
};
