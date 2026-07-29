// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
// Domain dates are plain "YYYY-MM-DD" text, Malaysia time implicit. We NEVER do
// new Date("YYYY-MM-DD") to read them — that parses as UTC midnight and can slip
// the day backwards in a +8 timezone. Instead we split the string ourselves.
//
// The ONLY place we build a real Date is date *arithmetic* (add days, weekday),
// and there we construct from explicit numbers via Date.UTC(...) and read the
// UTC fields back — no string parsing, so no timezone shift.

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

type DateParts = { year: number; month: number; day: number };

// "2026-03-14" -> { year: 2026, month: 3, day: 14 }. Month is 1-based.
function parts(iso: string): DateParts {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

// Today in Malaysia (UTC+8, no daylight saving) as "YYYY-MM-DD".
// Shift "now" by +8h, then read the UTC calendar fields — this gives the KL
// wall-clock date without depending on the server's own timezone.
export function todayInKL(): string {
  const kl = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const y = kl.getUTCFullYear();
  const m = String(kl.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kl.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Add n days to a "YYYY-MM-DD" and return a "YYYY-MM-DD". Handles month/year
// rollover correctly (e.g. 2026-01-31 + 1 -> 2026-02-01).
export function addDaysISO(iso: string, n: number): string {
  const { year, month, day } = parts(iso);
  const t = new Date(Date.UTC(year, month - 1, day + n));
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, "0");
  const d = String(t.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "2026-02-07" -> "Saturday, 7 February 2026". Weekday via Date.UTC (safe).
export function formatFullDate(iso: string): string {
  const { year, month, day } = parts(iso);
  const weekday = WEEKDAYS_LONG[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${weekday}, ${day} ${MONTHS_LONG[month - 1]} ${year}`;
}

// A compact, human date range for cards and headings:
//   same day      -> "7 Feb 2026"
//   same month    -> "7–8 Feb 2026"
//   same year     -> "31 Jan – 1 Feb 2026"
//   different year -> "31 Dec 2026 – 1 Jan 2027"
export function formatDateRange(startDate: string, endDate: string): string {
  const s = parts(startDate);
  const e = parts(endDate);

  if (startDate === endDate) {
    return `${s.day} ${MONTHS_SHORT[s.month - 1]} ${s.year}`;
  }
  if (s.year === e.year && s.month === e.month) {
    return `${s.day}–${e.day} ${MONTHS_SHORT[s.month - 1]} ${s.year}`;
  }
  if (s.year === e.year) {
    return `${s.day} ${MONTHS_SHORT[s.month - 1]} – ${e.day} ${MONTHS_SHORT[e.month - 1]} ${s.year}`;
  }
  return (
    `${s.day} ${MONTHS_SHORT[s.month - 1]} ${s.year} – ` +
    `${e.day} ${MONTHS_SHORT[e.month - 1]} ${e.year}`
  );
}

// "2026-02" -> "February 2026". Used for month section headings.
export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTHS_LONG[month - 1]} ${year}`;
}

// "2026-02-07" -> "20260207" (for Google Calendar's all-day date format).
export function toStamp(iso: string): string {
  return iso.replace(/-/g, "");
}
