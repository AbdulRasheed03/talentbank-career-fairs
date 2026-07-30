// ---------------------------------------------------------------------------
// Access control (RBAC) — the single rule the middleware enforces.
// ---------------------------------------------------------------------------
// Two roles, kept strictly apart:
//   - visitor (no admin cookie): may use the public site, never /admin/*
//   - admin  (valid cookie):     confined to /admin/*, kept off the public site
//
// Pure function so the whole policy is unit tested (tests/access.test.ts)
// without spinning up the edge runtime. Returns the path to redirect to, or
// null to allow the request through.
export function accessRedirect(pathname: string, authed: boolean): string | null {
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin";

  if (isAdminArea) {
    // Not signed in → bounce to the login page.
    if (!authed && !isLoginPage) return "/admin";
    // Already signed in → skip the login page.
    if (authed && isLoginPage) return "/admin/events";
    return null;
  }

  // Public area: a signed-in admin doesn't belong here — send them back to
  // their dashboard. Visitors pass through freely.
  if (authed) return "/admin/events";
  return null;
}
