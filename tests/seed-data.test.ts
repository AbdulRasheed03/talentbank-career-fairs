import { test } from "node:test";
import assert from "node:assert/strict";
import { SEED_EVENTS, SEED_TODAY, type SeedEvent } from "../scripts/seed-data";

// ---------------------------------------------------------------------------
// Milestone 1 tests — the seed data is the deliverable, so we test its SHAPE.
// M1 (skeleton) has no runtime logic to unit test; the real algorithm tests
// (detectClashes, capacity/waitlist decision) arrive with M3/M4 per SPEC.
//
// These run on the data alone — no database — so they're fast and never flaky.
// They assert every demo state the SPEC's "Seed data" section requires is
// actually present, so a reviewer sees all of them right after `db:seed`.
// ---------------------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Two events "clash" when they overlap in time (SPEC uses this with a city
// match too). Plain string compare works for YYYY-MM-DD.
function datesOverlap(a: SeedEvent, b: SeedEvent): boolean {
  return a.startDate <= b.endDate && b.startDate <= a.endDate;
}

test("every event is internally valid", () => {
  for (const e of SEED_EVENTS) {
    assert.ok(e.title.length > 0, `${e.slug}: has a title`);
    assert.ok(e.city.length > 0, `${e.slug}: has a city`);
    assert.ok(e.venue.length > 0, `${e.slug}: has a venue`);
    assert.match(e.startDate, ISO_DATE, `${e.slug}: startDate is YYYY-MM-DD`);
    assert.match(e.endDate, ISO_DATE, `${e.slug}: endDate is YYYY-MM-DD`);
    assert.ok(e.endDate >= e.startDate, `${e.slug}: endDate not before startDate`);
    assert.ok(e.capacity > 0, `${e.slug}: capacity is positive`);
    assert.ok(e.confirmed >= 0 && e.waitlisted >= 0, `${e.slug}: counts non-negative`);
    // A waitlist only makes sense once the event is actually full.
    if (e.waitlisted > 0) {
      assert.ok(
        e.confirmed >= e.capacity,
        `${e.slug}: has a waitlist but isn't full`,
      );
    }
  }
});

test("slugs are unique (public URLs won't collide)", () => {
  const slugs = SEED_EVENTS.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("exactly one cancelled event, and it has a reason", () => {
  const cancelled = SEED_EVENTS.filter((e) => e.status === "cancelled");
  assert.equal(cancelled.length, 1, "SPEC asks for one cancelled demo event");
  assert.ok(
    (cancelled[0].cancellationReason ?? "").length > 0,
    "cancelled event must carry a reason (drives the outbox rows)",
  );
});

test("at least one full event with a waitlist", () => {
  const fullWithWaitlist = SEED_EVENTS.filter(
    (e) =>
      e.status !== "cancelled" &&
      e.confirmed >= e.capacity &&
      e.waitlisted > 0,
  );
  assert.ok(
    fullWithWaitlist.length >= 1,
    "need a full event with waitlisted registrations to demo the waitlist",
  );
});

test("at least one nearly-full event (amber capacity bar)", () => {
  const nearlyFull = SEED_EVENTS.filter((e) => {
    const ratio = e.confirmed / e.capacity;
    return e.status !== "cancelled" && ratio >= 0.9 && ratio < 1;
  });
  assert.ok(nearlyFull.length >= 1, "need a ~95% event for the amber bar demo");
});

test("has both past and upcoming events relative to the seed's 'today'", () => {
  const past = SEED_EVENTS.filter((e) => e.endDate < SEED_TODAY);
  const upcoming = SEED_EVENTS.filter((e) => e.endDate >= SEED_TODAY);
  assert.ok(past.length >= 1, "need at least one past event");
  assert.ok(upcoming.length >= 1, "need at least one upcoming event");
});

test("contains a deliberate clash pair (same city, overlapping dates)", () => {
  const scheduled = SEED_EVENTS.filter((e) => e.status !== "cancelled");
  let found = false;

  for (let i = 0; i < scheduled.length && !found; i++) {
    for (let j = i + 1; j < scheduled.length && !found; j++) {
      const a = scheduled[i];
      const b = scheduled[j];
      const sameCity = a.city.toLowerCase() === b.city.toLowerCase();
      if (sameCity && datesOverlap(a, b)) {
        found = true;
      }
    }
  }

  assert.ok(found, "SPEC asks for two events that clash (same city + overlap)");
});
