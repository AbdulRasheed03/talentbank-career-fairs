import { NextResponse, type NextRequest } from "next/server";
import { accessRedirect } from "@/lib/access";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// ---------------------------------------------------------------------------
// Role gate. Reads the signed session cookie, works out the role (visitor /
// user / admin), and applies the RBAC policy in accessRedirect(). Verification
// uses Web Crypto so it runs in the edge runtime. See src/lib/access.ts.
// ---------------------------------------------------------------------------
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const role = session?.role ?? null;

  const target = accessRedirect(pathname, role);
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
