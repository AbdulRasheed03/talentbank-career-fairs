import Link from "next/link";
import { logout } from "@/lib/auth-actions";

// Top bar for the signed-in admin pages. `logout` is a server action wired
// straight to the form — no client component needed.
export function AdminNav() {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-neutral-900">Admin</span>
          <Link href="/admin/events" className="text-neutral-600 hover:text-brand">
            Events
          </Link>
          <Link href="/admin/outbox" className="text-neutral-600 hover:text-brand">
            Outbox
          </Link>
          {/* No "view public site" link: an admin session is confined to
              /admin by the RBAC middleware — log out to browse as a visitor. */}
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-neutral-500 hover:text-brand"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
