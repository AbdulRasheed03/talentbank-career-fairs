import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, registrations, type Event } from "@/db/schema";

// ---------------------------------------------------------------------------
// Read queries for the public pages
// ---------------------------------------------------------------------------
// Registration counts are always COUNTED from the registrations table, never
// stored on the event (SPEC: derived state, single source of truth).

export type EventWithCounts = Event & {
  confirmedCount: number;
  waitlistedCount: number;
};

// Every event plus its confirmed/waitlisted counts, in one pass.
// Two queries (all events, then grouped counts) stitched together in memory —
// simple and plenty fast for ~20 events.
export async function getEventsWithCounts(): Promise<EventWithCounts[]> {
  const rows = await db.select().from(events);

  const counts = await db
    .select({
      eventId: registrations.eventId,
      status: registrations.status,
      n: sql<number>`count(*)`,
    })
    .from(registrations)
    .groupBy(registrations.eventId, registrations.status);

  const confirmed = new Map<number, number>();
  const waitlisted = new Map<number, number>();
  for (const c of counts) {
    const map = c.status === "confirmed" ? confirmed : waitlisted;
    map.set(c.eventId, Number(c.n));
  }

  return rows.map((e) => ({
    ...e,
    confirmedCount: confirmed.get(e.id) ?? 0,
    waitlistedCount: waitlisted.get(e.id) ?? 0,
  }));
}

// A single event by its public slug, with counts. Returns null if not found.
export async function getEventBySlug(
  slug: string,
): Promise<EventWithCounts | null> {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!event) return null;

  const [confirmed] = await db
    .select({ n: sql<number>`count(*)` })
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, event.id),
        eq(registrations.status, "confirmed"),
      ),
    );

  const [waitlisted] = await db
    .select({ n: sql<number>`count(*)` })
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, event.id),
        eq(registrations.status, "waitlisted"),
      ),
    );

  return {
    ...event,
    confirmedCount: Number(confirmed?.n ?? 0),
    waitlistedCount: Number(waitlisted?.n ?? 0),
  };
}
