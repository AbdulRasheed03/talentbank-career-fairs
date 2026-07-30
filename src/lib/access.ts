// ---------------------------------------------------------------------------
// Access control (RBAC) — the single rule the middleware enforces.
// ---------------------------------------------------------------------------
// Three roles, kept apart:
//   - null  (visitor, not logged in): public site + the login/register pages.
//   - "user"  (logged-in public user): public site; NOT /admin.
//   - "admin" (the seeded admin):      confined to /admin/*.
//
// Pure function so the whole policy is unit tested (tests/access.test.ts).
// Returns the path to redirect to, or null to allow the request through.
export type Role = "user" | "admin" | null;

export function accessRedirect(pathname: string, role: Role): string | null {
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAdminArea) {
    if (role === "admin") return null; // admins belong here
    return role === null ? "/login" : "/"; // visitor → login; user → home
  }

  if (isAuthPage) {
    // Already logged in? No need to see login/register.
    if (role === "admin") return "/admin/events";
    if (role === "user") return "/";
    return null;
  }

  // Public area: admins are confined to /admin; visitors and users pass through.
  if (role === "admin") return "/admin/events";
  return null;
}
