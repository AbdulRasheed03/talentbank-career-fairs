import { test } from "node:test";
import assert from "node:assert/strict";
import { accessRedirect } from "../src/lib/access";

// ---------------------------------------------------------------------------
// RBAC policy tests. Roles: null (visitor), "user", "admin".
// null return = allowed through; a string = redirect target.
// ---------------------------------------------------------------------------

test("visitor is blocked from admin pages (→ login)", () => {
  assert.equal(accessRedirect("/admin/events", null), "/login");
  assert.equal(accessRedirect("/admin/events/5/edit", null), "/login");
  assert.equal(accessRedirect("/admin/outbox", null), "/login");
});

test("logged-in user is blocked from admin pages (→ home)", () => {
  assert.equal(accessRedirect("/admin/events", "user"), "/");
  assert.equal(accessRedirect("/admin/events/5/registrants/csv", "user"), "/");
});

test("visitors and users can browse the public site", () => {
  for (const role of [null, "user"] as const) {
    assert.equal(accessRedirect("/", role), null);
    assert.equal(accessRedirect("/events/some-fair", role), null);
  }
});

test("admin is confined to /admin and kept off the public site", () => {
  assert.equal(accessRedirect("/", "admin"), "/admin/events");
  assert.equal(accessRedirect("/events/some-fair", "admin"), "/admin/events");
  assert.equal(accessRedirect("/admin/events", "admin"), null);
  assert.equal(accessRedirect("/admin", "admin"), null);
});

test("login/register are hidden from users who are already logged in", () => {
  assert.equal(accessRedirect("/login", null), null); // visitor sees it
  assert.equal(accessRedirect("/register", null), null);
  assert.equal(accessRedirect("/login", "user"), "/");
  assert.equal(accessRedirect("/register", "user"), "/");
  assert.equal(accessRedirect("/login", "admin"), "/admin/events");
});
