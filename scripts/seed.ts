import "dotenv/config";
import { db } from "../src/db";
import { events, notifications, registrations } from "../src/db/schema";
import { SEED_EVENTS } from "./seed-data";

// ---------------------------------------------------------------------------
// Seed script — inserts the demo career fairs (scripts/seed-data.ts) into the
// database, then generates fake-but-realistic registrants and, for the
// cancelled event, one outbox row per confirmed registrant.
//
// Run with: npm run db:seed  (safe to re-run; it wipes and rebuilds).
//
// The demo data itself lives in seed-data.ts so it can be unit tested without
// a database. This file is only the "turn that data into rows" part.
// ---------------------------------------------------------------------------

const now = new Date().toISOString(); // audit timestamp only, not a domain date

// Fake-but-realistic registrant pools. Every email uses example.com so it is
// obviously not real personal data.
const FIRST_NAMES = [
  "Aina", "Arif", "Mei Ling", "Kavya", "Daniel", "Nurul", "Wei Jie", "Farah",
  "Hafiz", "Priya", "Jia Hui", "Syafiq", "Rachel", "Amirul", "Yong Sheng",
  "Zulaikha", "Thanesh", "Chloe", "Iskandar", "Suhana",
];
const LAST_NAMES = [
  "Rahman", "Tan", "Kumar", "Lim", "Abdullah", "Wong", "Ismail", "Nair", "Lee",
  "Yusof", "Chong", "Balakrishnan", "Ariffin", "Ong", "Devi", "Hassan",
];

let emailCounter = 0; // keeps every generated email unique across all events

function makeRegistrant(
  eventId: number,
  status: "confirmed" | "waitlisted",
): typeof registrations.$inferInsert {
  const first = FIRST_NAMES[emailCounter % FIRST_NAMES.length];
  const last = LAST_NAMES[emailCounter % LAST_NAMES.length];
  emailCounter += 1;
  const handle = `${first.split(" ")[0]}.${last}`.toLowerCase();
  return {
    eventId,
    name: `${first} ${last}`,
    email: `${handle}${emailCounter}@example.com`,
    // Roughly 1 in 6 attendees is an employer rep; the rest are candidates.
    attendeeType: emailCounter % 6 === 0 ? "employer" : "candidate",
    status,
    createdAt: now,
  };
}

async function main() {
  console.log("Seeding database…");

  // Idempotent: wipe children first (FKs), then events. Re-running gives a
  // clean, known demo state every time.
  await db.delete(notifications);
  await db.delete(registrations);
  await db.delete(events);

  // Insert events, keep their generated ids by slug.
  const inserted = await db
    .insert(events)
    .values(
      SEED_EVENTS.map((e) => ({
        slug: e.slug,
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        timeLabel: e.timeLabel,
        venue: e.venue,
        city: e.city,
        description: e.description,
        capacity: e.capacity,
        status: e.status ?? "scheduled",
        cancellationReason: e.cancellationReason ?? null,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .returning({ id: events.id, slug: events.slug });

  const idBySlug = new Map(inserted.map((row) => [row.slug, row.id]));

  let totalConfirmed = 0;
  let totalWaitlisted = 0;
  let totalNotifications = 0;

  for (const e of SEED_EVENTS) {
    const eventId = idBySlug.get(e.slug)!;

    // Generate this event's registrants (confirmed first, then waitlisted, so
    // insertion order / id reflects who signed up earliest).
    const rows: (typeof registrations.$inferInsert)[] = [];
    for (let i = 0; i < e.confirmed; i++) {
      rows.push(makeRegistrant(eventId, "confirmed"));
    }
    for (let j = 0; j < e.waitlisted; j++) {
      rows.push(makeRegistrant(eventId, "waitlisted"));
    }

    if (rows.length > 0) {
      await db.insert(registrations).values(rows);
    }
    totalConfirmed += e.confirmed;
    totalWaitlisted += e.waitlisted;

    // Cancelled event: write one outbox row per confirmed registrant, exactly
    // as the real cancel flow will in M4.
    if (e.status === "cancelled") {
      const confirmedRows = rows.filter((r) => r.status === "confirmed");
      if (confirmedRows.length > 0) {
        await db.insert(notifications).values(
          confirmedRows.map((r) => ({
            eventId,
            recipientEmail: r.email,
            message: `Event cancelled: ${e.title} — ${e.cancellationReason ?? ""}`.trim(),
            createdAt: now,
          })),
        );
        totalNotifications += confirmedRows.length;
      }
    }
  }

  console.log(
    `Done. ${SEED_EVENTS.length} events, ${totalConfirmed} confirmed + ` +
      `${totalWaitlisted} waitlisted registrations, ` +
      `${totalNotifications} outbox notifications.`,
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
