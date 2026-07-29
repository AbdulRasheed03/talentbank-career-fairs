import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";

// ---------------------------------------------------------------------------
// Admin gate (SPEC rule 5). DELIBERATE SIMPLIFICATION: there are no user
// accounts — a single shared passcode (ADMIN_PASSCODE) unlocks all of /admin.
// On login we store the passcode in an httpOnly cookie; here we just check it
// still matches. Fine for a demo; a real app would use signed sessions + roles.
// ---------------------------------------------------------------------------
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin";
  const authed =
    req.cookies.get(ADMIN_COOKIE)?.value === process.env.ADMIN_PASSCODE;

  // Not logged in and asking for a protected admin page → send to login.
  if (!authed && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in but sitting on the login page → jump to the events table.
  if (authed && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/events";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
