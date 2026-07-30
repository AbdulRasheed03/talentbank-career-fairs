import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/passwords";
import { loginSchema, registerSchema } from "../src/lib/auth";

// ---------------------------------------------------------------------------
// Accounts: password hashing + auth form validation (pure).
// ---------------------------------------------------------------------------

test("password hash verifies the correct password and rejects a wrong one", () => {
  const stored = hashPassword("talentbank2026");
  assert.ok(stored.includes(":")); // salt:hash
  assert.equal(verifyPassword("talentbank2026", stored), true);
  assert.equal(verifyPassword("wrong-password", stored), false);
});

test("the same password hashes differently each time (random salt)", () => {
  assert.notEqual(hashPassword("same"), hashPassword("same"));
});

test("verifyPassword tolerates a malformed stored value", () => {
  assert.equal(verifyPassword("x", "not-a-valid-hash"), false);
});

test("loginSchema requires both fields", () => {
  assert.ok(loginSchema.safeParse({ username: "admin", password: "x" }).success);
  assert.ok(!loginSchema.safeParse({ username: "", password: "x" }).success);
});

test("registerSchema accepts valid input and normalises username/email", () => {
  const r = registerSchema.safeParse({
    name: "Aina Rahman",
    username: "  Aina_01 ",
    email: "  Aina@Example.COM ",
    password: "supersecret",
    attendeeType: "candidate",
  });
  assert.ok(r.success);
  assert.equal(r.data.username, "aina_01");
  assert.equal(r.data.email, "aina@example.com");
});

test("registerSchema rejects bad username, short password, bad email, bad type", () => {
  const base = {
    name: "Aina Rahman",
    username: "aina_01",
    email: "a@b.com",
    password: "supersecret",
    attendeeType: "candidate" as const,
  };
  assert.ok(!registerSchema.safeParse({ ...base, username: "no spaces!" }).success);
  assert.ok(!registerSchema.safeParse({ ...base, password: "short" }).success);
  assert.ok(!registerSchema.safeParse({ ...base, email: "nope" }).success);
  assert.ok(!registerSchema.safeParse({ ...base, attendeeType: "alien" }).success);
});
