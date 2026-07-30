import { NextResponse, type NextRequest } from "next/server";
import { accessRedirect } from "@/lib/access";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";

// ---------------------------------------------------------------------------
// Role gate (SPEC rule 5, extended to strict RBAC). DELIBERATE SIMPLIFICATION:
// there are no user accounts — a single shared passcode (ADMIN_PASSCODE) marks
// a session as "admin" via an httpOnly cookie. The two roles don't overlap:
// visitors can't reach /admin, and an admin session is kept out of the public
// site. The actual policy lives in accessRedirect() so it can be unit tested.
// ---------------------------------------------------------------------------
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed =
    req.cookies.get(ADMIN_COOKIE)?.value === process.env.ADMIN_PASSCODE;

  const target = accessRedirect(pathname, authed);
  if (target && target !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run on every page request except Next internals and static assets.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
