import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/session-server";

// The plain header for the FUNCTIONAL app pages (/events, event detail, login,
// register). The marketing landing (/) uses its own SiteHeader instead.
export async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/events" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-brand">
            Talentbank
          </span>
          <span className="text-sm text-neutral-500">Career Fairs 2026</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-neutral-500">Hi, {user.name.split(" ")[0]}</span>
              <form action={logout}>
                <button type="submit" className="font-medium text-neutral-600 hover:text-brand">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-600 hover:text-brand">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
