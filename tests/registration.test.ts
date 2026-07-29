import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decideRegistrationStatus,
  isUniqueViolation,
  registrationSchema,
} from "../src/lib/registration";

// ---------------------------------------------------------------------------
// M3 tests — the capacity/waitlist decision (the case the SPEC explicitly asks
// for), plus form validation and duplicate detection. Pure functions, no DB.
// ---------------------------------------------------------------------------

test("decideRegistrationStatus: confirmed while there is room", () => {
  assert.equal(decideRegistrationStatus(0, 100), "confirmed");
  assert.equal(decideRegistrationStatus(99, 100), "confirmed");
});

test("decideRegistrationStatus: waitlisted exactly at capacity", () => {
  assert.equal(decideRegistrationStatus(100, 100), "waitlisted");
});

test("decideRegistrationStatus: waitlisted over capacity", () => {
  assert.equal(decideRegistrationStatus(150, 100), "waitlisted");
});

test("decideRegistrationStatus: zero-capacity event always waitlists", () => {
  assert.equal(decideRegistrationStatus(0, 0), "waitlisted");
});

test("registrationSchema: accepts valid input, trims name, lowercases email", () => {
  const result = registrationSchema.safeParse({
    name: "  Aina Rahman  ",
    email: "  Aina.Rahman@Example.COM ",
    attendeeType: "candidate",
  });
  assert.ok(result.success);
  assert.equal(result.data.name, "Aina Rahman");
  assert.equal(result.data.email, "aina.rahman@example.com");
});

test("registrationSchema: rejects too-short name", () => {
  const result = registrationSchema.safeParse({
    name: "A",
    email: "a@b.com",
    attendeeType: "candidate",
  });
  assert.ok(!result.success);
});

test("registrationSchema: rejects invalid email", () => {
  const result = registrationSchema.safeParse({
    name: "Aina Rahman",
    email: "not-an-email",
    attendeeType: "candidate",
  });
  assert.ok(!result.success);
});

test("registrationSchema: rejects an unknown attendee type", () => {
  const result = registrationSchema.safeParse({
    name: "Aina Rahman",
    email: "a@b.com",
    attendeeType: "robot",
  });
  assert.ok(!result.success);
});

test("isUniqueViolation: recognises the SQLite unique-constraint error", () => {
  const dup = new Error(
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: registrations.event_id, registrations.email",
  );
  assert.equal(isUniqueViolation(dup), true);
  assert.equal(isUniqueViolation(new Error("network down")), false);
});
