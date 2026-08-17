export interface QuarterInfo {
  /** 1-4 */
  quarter: number;
  /** 1-based day number within the quarter */
  dayOfQuarter: number;
  /** total number of days in the quarter */
  totalDays: number;
  /** how far through the quarter, 0-100 */
  percent: number;
  /** first day of the quarter (local midnight) */
  start: Date;
  /** last day of the quarter (local midnight) */
  end: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Strip the time component, returning local midnight of the given date. */
function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Work out which quarter `today` falls in, given the calendar month that the
 * user's Q1 begins on.
 *
 * @param today        Any Date; only the calendar day is used.
 * @param q1StartMonth 1 = January ... 12 = December
 */
export function getQuarterInfo(today: Date, q1StartMonth: number): QuarterInfo {
  const t = atMidnight(today).getTime();
  const baseMonth = q1StartMonth - 1; // 0-based month index

  // Generate every quarter-start across a 3-year window centred on `today`,
  // so there is always a start before and after the current day.
  const starts: Date[] = [];
  for (let yr = today.getFullYear() - 1; yr <= today.getFullYear() + 1; yr++) {
    for (let k = 0; k < 4; k++) {
      // Date normalises month overflow (e.g. month 13 -> Feb of next year).
      starts.push(new Date(yr, baseMonth + k * 3, 1));
    }
  }
  starts.sort((a, b) => a.getTime() - b.getTime());

  // The current quarter starts at the latest start on or before today.
  let idx = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i].getTime() <= t) idx = i;
    else break;
  }

  const start = starts[idx];
  const next = starts[idx + 1];

  // Round to absorb any daylight-saving-time hour shifts.
  const totalDays = Math.round((next.getTime() - start.getTime()) / DAY_MS);
  const dayOfQuarter = Math.round((t - start.getTime()) / DAY_MS) + 1;
  const percent = (dayOfQuarter / totalDays) * 100;

  const quarter = (((start.getMonth() - baseMonth) + 12) % 12) / 3 + 1;
  const end = new Date(next.getTime() - DAY_MS);

  return { quarter, dayOfQuarter, totalDays, percent, start, end };
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
