import { getQuarterInfo, MONTHS } from './quarter';

declare global {
  interface Window {
    quarterAPI: {
      getConfig: () => Promise<{ q1StartMonth: number | null }>;
      setConfig: (month: number) => Promise<{ q1StartMonth: number }>;
    };
  }
}

const el = (id: string): HTMLElement => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node;
};

let refreshTimer: number | undefined;

async function init(): Promise<void> {
  const { q1StartMonth } = await window.quarterAPI.getConfig();
  if (q1StartMonth == null) {
    showSetup();
  } else {
    showDashboard(q1StartMonth);
  }
}

function showSetup(current?: number): void {
  el('setup').classList.remove('hidden');
  el('dashboard').classList.add('hidden');

  const select = el('month-select') as HTMLSelectElement;
  select.innerHTML = '';
  MONTHS.forEach((month, i) => {
    const option = document.createElement('option');
    option.value = String(i + 1);
    option.textContent = month;
    if (current === i + 1) option.selected = true;
    select.appendChild(option);
  });

  (el('save-btn') as HTMLButtonElement).onclick = async () => {
    const month = Number(select.value);
    await window.quarterAPI.setConfig(month);
    showDashboard(month);
  };
}

function showDashboard(q1StartMonth: number): void {
  el('setup').classList.add('hidden');
  el('dashboard').classList.remove('hidden');

  render(q1StartMonth);

  (el('settings-btn') as HTMLButtonElement).onclick = () => showSetup(q1StartMonth);

  if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
  scheduleMidnightRefresh(q1StartMonth);
}

/** Re-render shortly after the next local midnight, then keep rescheduling. */
function scheduleMidnightRefresh(q1StartMonth: number): void {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5,
  );
  const ms = nextMidnight.getTime() - now.getTime();
  refreshTimer = window.setTimeout(() => {
    render(q1StartMonth);
    scheduleMidnightRefresh(q1StartMonth);
  }, ms);
}

function render(q1StartMonth: number): void {
  const today = new Date();
  const info = getQuarterInfo(today, q1StartMonth);

  el('today-date').textContent = today.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  el('quarter-day').innerHTML =
    `Day <strong>${info.dayOfQuarter}</strong> of <strong>Q${info.quarter}</strong>` +
    ` <span class="muted">· ${info.totalDays} days total</span>`;

  const pct = info.percent;
  el('percent-text').innerHTML =
    `<strong>${pct.toFixed(1)}%</strong> through Q${info.quarter}`;
  (el('progress-fill')).style.width = `${Math.min(100, Math.max(0, pct))}%`;

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  el('range').textContent = `${fmt(info.start)} → ${fmt(info.end)}`;
}

init();
