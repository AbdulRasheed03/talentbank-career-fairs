import { test } from "node:test";
import assert from "node:assert/strict";
import { datesOverlap, detectClashes, type ClashCandidate } from "../src/lib/clashes";

// ---------------------------------------------------------------------------
// M4 tests — clash detection (the SPEC-required case): overlap edges, same day,
// different city, case-insensitivity, cancelled exclusion, self exclusion.
// ---------------------------------------------------------------------------

function ev(over: Partial<ClashCandidate> & { id: number }): ClashCandidate {
  return {
    id: over.id,
    title: over.title ?? `Event ${over.id}`,
    slug: over.slug ?? `event-${over.id}`,
    city: over.city ?? "Kuala Lumpur",
    startDate: over.startDate ?? "2026-09-12",
    endDate: over.endDate ?? "2026-09-12",
    status: over.status ?? "scheduled",
  };
}

test("datesOverlap: overlapping, touching, and disjoint ranges", () => {
  assert.equal(datesOverlap("2026-09-12", "2026-09-13", "2026-09-13", "2026-09-14"), true); // touch on 13th
  assert.equal(datesOverlap("2026-09-12", "2026-09-12", "2026-09-12", "2026-09-12"), true); // same day
  assert.equal(datesOverlap("2026-09-12", "2026-09-13", "2026-09-14", "2026-09-15"), false); // disjoint
});

test("detectClashes: same city + overlapping dates clash", () => {
  const target = ev({ id: 1, startDate: "2026-09-12", endDate: "2026-09-12" });
  const others = [ev({ id: 2, startDate: "2026-09-12", endDate: "2026-09-13" })];
  assert.deepEqual(detectClashes(target, others).map((e) => e.id), [2]);
});

test("detectClashes: different city does not clash even if dates overlap", () => {
  const target = ev({ id: 1, city: "Kuala Lumpur" });
  const others = [ev({ id: 2, city: "George Town" })];
  assert.equal(detectClashes(target, others).length, 0);
});

test("detectClashes: adjacent (non-overlapping) dates do not clash", () => {
  const target = ev({ id: 1, startDate: "2026-09-12", endDate: "2026-09-12" });
  const others = [ev({ id: 2, startDate: "2026-09-13", endDate: "2026-09-13" })];
  assert.equal(detectClashes(target, others).length, 0);
});

test("detectClashes: city match is case-insensitive", () => {
  const target = ev({ id: 1, city: "Kuala Lumpur" });
  const others = [ev({ id: 2, city: "  kuala lumpur " })];
  assert.equal(detectClashes(target, others).length, 1);
});

test("detectClashes: cancelled events never clash (either side)", () => {
  const cancelledTarget = ev({ id: 1, status: "cancelled" });
  assert.equal(detectClashes(cancelledTarget, [ev({ id: 2 })]).length, 0);

  const target = ev({ id: 1 });
  const cancelledOther = [ev({ id: 2, status: "cancelled" })];
  assert.equal(detectClashes(target, cancelledOther).length, 0);
});

test("detectClashes: an event never clashes with itself", () => {
  const target = ev({ id: 1 });
  assert.equal(detectClashes(target, [ev({ id: 1 })]).length, 0);
});
