import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  events,
  notifications,
  registrations,
  type Event,
  type Registration,
} from "@/db/schema";

// A single event by numeric id (admin edit/registrants pages).
export async function getEventById(id: number): Promise<Event | null> {
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return event ?? null;
}

// Confirmed + waitlisted lists for one event, each in sign-up order (oldest
// first — the order the waitlist would be promoted in).
export async function getRegistrationsForEvent(
  eventId: number,
): Promise<{ confirmed: Registration[]; waitlisted: Registration[] }> {
  const rows = await db
    .select()
    .from(registrations)
    .where(eq(registrations.eventId, eventId))
    .orderBy(asc(registrations.id));

  return {
    confirmed: rows.filter((r) => r.status === "confirmed"),
    waitlisted: rows.filter((r) => r.status === "waitlisted"),
  };
}

export type OutboxRow = {
  id: number;
  recipientEmail: string;
  message: string;
  createdAt: string;
  eventTitle: string | null;
};

// The outbox, newest first, with each row's event title.
export async function getOutbox(): Promise<OutboxRow[]> {
  return db
    .select({
      id: notifications.id,
      recipientEmail: notifications.recipientEmail,
      message: notifications.message,
      createdAt: notifications.createdAt,
      eventTitle: events.title,
    })
    .from(notifications)
    .leftJoin(events, eq(notifications.eventId, events.id))
    .orderBy(desc(notifications.id));
}
