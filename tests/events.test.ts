import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveStatus,
  googleCalendarUrl,
  groupByMonth,
  isFull,
  isPast,
  isRegistrationOpen,
} from "../src/lib/events";

// ---------------------------------------------------------------------------
// M2 tests — derived event state + display helpers. Focus on the status
// priority (cancelled > past > full > open) and the boundary cases.
// ---------------------------------------------------------------------------

const TODAY = "2026-07-28";

test("isPast: ended before today is past; ending today is not", () => {
  assert.equal(isPast("2026-02-08", TODAY), true);
  assert.equal(isPast("2026-07-28", TODAY), false); // ends today → still on
  assert.equal(isPast("2026-08-01", TODAY), false);
});

test("isFull: at or over capacity is full", () => {
  assert.equal(isFull(99, 100), false);
  assert.equal(isFull(100, 100), true);
  assert.equal(isFull(101, 100), true);
  assert.equal(isFull(0, 0), true);
});

test("deriveStatus: cancelled always wins, even if upcoming or past", () => {
  const upcoming = { status: "cancelled" as const, endDate: "2026-08-01", capacity: 100 };
  assert.equal(deriveStatus(upcoming, 0, TODAY), "cancelled");
  const alreadyOver = { status: "cancelled" as const, endDate: "2026-02-01", capacity: 100 };
  assert.equal(deriveStatus(alreadyOver, 0, TODAY), "cancelled");
});

test("deriveStatus: past beats full", () => {
  const overAndFull = { status: "scheduled" as const, endDate: "2026-02-01", capacity: 100 };
  assert.equal(deriveStatus(overAndFull, 100, TODAY), "past");
});

test("deriveStatus: full when upcoming and at capacity", () => {
  const event = { status: "scheduled" as const, endDate: "2026-08-01", capacity: 100 };
  assert.equal(deriveStatus(event, 100, TODAY), "full");
});

test("deriveStatus: open when upcoming with room", () => {
  const event = { status: "scheduled" as const, endDate: "2026-08-01", capacity: 100 };
  assert.equal(deriveStatus(event, 50, TODAY), "open");
});

test("isRegistrationOpen: only open and full accept sign-ups", () => {
  assert.equal(isRegistrationOpen("open"), true);
  assert.equal(isRegistrationOpen("full"), true);
  assert.equal(isRegistrationOpen("cancelled"), false);
  assert.equal(isRegistrationOpen("past"), false);
});

test("groupByMonth: sorts by date and buckets into calendar-ordered months", () => {
  const events = [
    { slug: "b", startDate: "2026-08-22" },
    { slug: "a", startDate: "2026-02-07" },
    { slug: "c", startDate: "2026-08-01" },
  ];
  const groups = groupByMonth(events);

  assert.deepEqual(
    groups.map((g) => g.key),
    ["2026-02", "2026-08"],
  );
  assert.equal(groups[0].label, "February 2026");
  assert.equal(groups[1].label, "August 2026");
  // Within August, the earlier date (Aug 1) comes before Aug 22.
  assert.deepEqual(
    groups[1].events.map((e) => e.slug),
    ["c", "b"],
  );
});

test("googleCalendarUrl: uses an exclusive end date (end + 1 day)", () => {
  const url = googleCalendarUrl({
    title: "Talentbank Engineering Career Fair",
    startDate: "2026-08-22",
    endDate: "2026-08-22",
    venue: "MITEC — Hall 5",
    city: "Kuala Lumpur",
    description: "Specialist fair.",
  });
  const params = new URL(url).searchParams;
  assert.equal(params.get("action"), "TEMPLATE");
  assert.equal(params.get("dates"), "20260822/20260823");
  assert.equal(params.get("text"), "Talentbank Engineering Career Fair");
  assert.equal(params.get("location"), "MITEC — Hall 5, Kuala Lumpur");
});

test("googleCalendarUrl: multi-day event spans the whole range", () => {
  const url = googleCalendarUrl({
    title: "KL Graduate Mega Fair",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    venue: "WTC",
    city: "Kuala Lumpur",
    description: "Big fair.",
  });
  assert.equal(new URL(url).searchParams.get("dates"), "20260912/20260914");
});
