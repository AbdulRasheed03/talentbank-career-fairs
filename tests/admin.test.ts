import { test } from "node:test";
import assert from "node:assert/strict";
import { eventSchema, slotsToPromote, slugify } from "../src/lib/admin";

// ---------------------------------------------------------------------------
// M4 tests — admin helpers: slug generation, the waitlist-promotion count
// (SPEC rule 6), and event form validation.
// ---------------------------------------------------------------------------

test("slugify: turns a title into a URL-safe slug", () => {
  assert.equal(slugify("Talentbank KL Graduate Mega Fair"), "talentbank-kl-graduate-mega-fair");
  assert.equal(slugify("  Penang Tech & Semicon!  "), "penang-tech-semicon");
});

test("slotsToPromote: fills the freed capacity, bounded by the waitlist", () => {
  // 100 confirmed, capacity raised to 105, 4 waiting -> promote all 4.
  assert.equal(slotsToPromote(100, 105, 4), 4);
  // 100 confirmed, capacity raised to 102, 4 waiting -> only 2 seats freed.
  assert.equal(slotsToPromote(100, 102, 4), 2);
  // capacity unchanged / lowered -> promote nobody.
  assert.equal(slotsToPromote(100, 100, 4), 0);
  assert.equal(slotsToPromote(100, 90, 4), 0);
  // no one waiting -> nobody to promote.
  assert.equal(slotsToPromote(50, 200, 0), 0);
});

test("eventSchema: accepts a valid event and coerces capacity to a number", () => {
  const result = eventSchema.safeParse({
    title: "Talentbank Ipoh Career Fair",
    slug: "talentbank-ipoh-career-fair",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Ipoh Convention Centre",
    city: "Ipoh",
    description: "Perak-region fair for graduates.",
    capacity: "120", // comes off the form as a string
  });
  assert.ok(result.success);
  assert.equal(result.data.capacity, 120);
});

test("eventSchema: rejects end date before start date", () => {
  const result = eventSchema.safeParse({
    title: "Bad Dates Fair",
    slug: "bad-dates-fair",
    startDate: "2026-08-15",
    endDate: "2026-08-14",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Somewhere",
    city: "Ipoh",
    description: "This should fail validation.",
    capacity: "100",
  });
  assert.ok(!result.success);
});

test("eventSchema: rejects a bad slug and non-positive capacity", () => {
  const badSlug = eventSchema.safeParse({
    title: "Spaces Fair",
    slug: "Not A Slug",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Venue",
    city: "Ipoh",
    description: "Description long enough.",
    capacity: "100",
  });
  assert.ok(!badSlug.success);

  const badCapacity = eventSchema.safeParse({
    title: "Zero Fair",
    slug: "zero-fair",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Venue",
    city: "Ipoh",
    description: "Description long enough.",
    capacity: "0",
  });
  assert.ok(!badCapacity.success);
});
