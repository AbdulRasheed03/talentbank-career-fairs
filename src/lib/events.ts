import { addDaysISO, monthLabel, toStamp } from "./dates";

// ---------------------------------------------------------------------------
// Derived event state + display helpers
// ---------------------------------------------------------------------------
// SPEC rule: isFull and isPast are DERIVED, never stored. This file is the
// single source of truth for both, plus the public status chip and the
// full-year grouping. Everything here is a pure function so it can be unit
// tested without a database (see tests/events.test.ts).

export type StatusKind = "open" | "full" | "cancelled" | "past";

// An event is past once it has ended (endDate is strictly before today).
// String comparison is correct because "YYYY-MM-DD" sorts chronologically.
export function isPast(endDate: string, today: string): boolean {
  return endDate < today;
}

// Full = confirmed registrations have reached (or exceeded) capacity.
export function isFull(confirmedCount: number, capacity: number): boolean {
  return confirmedCount >= capacity;
}

// The one chip a public visitor sees. Priority matters:
//   cancelled  — explicit admin decision, always wins
//   past       — the event already happened
//   full       — still upcoming but at capacity
//   open        — upcoming with room
export function deriveStatus(
  event: {
    status: "scheduled" | "cancelled";
    endDate: string;
    capacity: number;
  },
  confirmedCount: number,
  today: string,
): StatusKind {
  if (event.status === "cancelled") return "cancelled";
  if (isPast(event.endDate, today)) return "past";
  if (isFull(confirmedCount, event.capacity)) return "full";
  return "open";
}

// Whether the public registration form should accept signups for this event.
// Cancelled and past events are closed; open and full both accept (full puts
// the person on the waitlist — that logic lives in M3).
export function isRegistrationOpen(status: StatusKind): boolean {
  return status === "open" || status === "full";
}

// ---------------------------------------------------------------------------
// Full-year grouping for the home page
// ---------------------------------------------------------------------------
export type MonthGroup<T> = {
  key: string; // "2026-02"
  label: string; // "February 2026"
  events: T[];
};

// Sort events by start date, then bucket them into month groups in calendar
// order. Generic so it works for plain events or events-with-counts alike.
export function groupByMonth<T extends { startDate: string }>(
  events: T[],
): MonthGroup<T>[] {
  const sorted = [...events].sort((a, b) =>
    a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0,
  );

  const groups = new Map<string, T[]>();
  for (const event of sorted) {
    const key = event.startDate.slice(0, 7); // "2026-02"
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(event);
    } else {
      groups.set(key, [event]);
    }
  }

  return [...groups.entries()].map(([key, evs]) => ({
    key,
    label: monthLabel(key),
    events: evs,
  }));
}

// ---------------------------------------------------------------------------
// "Add to Google Calendar" link — built from Google's URL template, no library.
// ---------------------------------------------------------------------------
// Google's all-day format uses an EXCLUSIVE end date, so a 7–8 Feb event needs
// dates=20260207/20260209 (end + 1 day) to show both days.
export function googleCalendarUrl(event: {
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  description: string;
}): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toStamp(event.startDate)}/${toStamp(addDaysISO(event.endDate, 1))}`,
    details: event.description,
    location: `${event.venue}, ${event.city}`,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}
