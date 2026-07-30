import { test } from "node:test";
import assert from "node:assert/strict";
import { accessRedirect } from "../src/lib/access";

// ---------------------------------------------------------------------------
// RBAC policy tests — the two roles are kept strictly apart.
// null = allowed through; a string = redirect target.
// ---------------------------------------------------------------------------

test("visitor (not authed) is blocked from admin pages", () => {
  assert.equal(accessRedirect("/admin/events", false), "/admin");
  assert.equal(accessRedirect("/admin/events/5/edit", false), "/admin");
  assert.equal(accessRedirect("/admin/events/5/registrants/csv", false), "/admin");
  assert.equal(accessRedirect("/admin/outbox", false), "/admin");
});

test("visitor can use the public site and the login page", () => {
  assert.equal(accessRedirect("/", false), null);
  assert.equal(accessRedirect("/events/some-fair", false), null);
  assert.equal(accessRedirect("/admin", false), null); // login page
});

test("admin (authed) is confined to /admin and kept off the public site", () => {
  assert.equal(accessRedirect("/", true), "/admin/events");
  assert.equal(accessRedirect("/events/some-fair", true), "/admin/events");
});

test("admin on the login page is sent to the dashboard", () => {
  assert.equal(accessRedirect("/admin", true), "/admin/events");
});

test("admin can move freely within /admin", () => {
  assert.equal(accessRedirect("/admin/events", true), null);
  assert.equal(accessRedirect("/admin/events/5/edit", true), null);
  assert.equal(accessRedirect("/admin/outbox", true), null);
});
