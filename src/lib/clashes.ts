// ---------------------------------------------------------------------------
// Clash detection (SPEC business rule 1)
// ---------------------------------------------------------------------------
// Two SCHEDULED events clash when their city matches (case-insensitive) AND
// their date ranges overlap. Clashes are a warning, never a block — running two
// events at once can be intentional. Pure functions so they're unit tested
// (tests/clashes.test.ts) without a database.

export type ClashCandidate = {
  id: number;
  title: string;
  slug: string;
  city: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  status: "scheduled" | "cancelled";
};

// Inclusive overlap: [aStart, aEnd] intersects [bStart, bEnd]. String compare is
// correct for "YYYY-MM-DD". Touching edges (a ends the day b starts) counts as
// an overlap — both events run that day.
export function datesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

// Every scheduled event that clashes with `target`. Cancelled events never
// clash (on either side), and an event never clashes with itself.
export function detectClashes<T extends ClashCandidate>(
  target: Pick<T, "id" | "city" | "startDate" | "endDate" | "status">,
  others: T[],
): T[] {
  if (target.status === "cancelled") return [];

  const targetCity = target.city.trim().toLowerCase();

  return others.filter(
    (e) =>
      e.id !== target.id &&
      e.status === "scheduled" &&
      e.city.trim().toLowerCase() === targetCity &&
      datesOverlap(target.startDate, target.endDate, e.startDate, e.endDate),
  );
}
