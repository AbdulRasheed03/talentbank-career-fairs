import Link from "next/link";
import { logout } from "@/lib/auth-actions";

// Admin top bar — navy to match the marketing palette but clearly "admin".
// `logout` is a server action wired straight to the form.
export function AdminNav() {
  return (
    <div className="border-b border-navy-700 bg-navy-900 text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-6 text-[0.8125rem] uppercase tracking-[0.12em]">
          <span className="font-extrabold italic tracking-tight text-paper">
            TALENTBANK
          </span>
          <span className="text-champagne">Admin</span>
          <Link href="/admin/events" className="text-paper/70 hover:text-champagne">
            Events
          </Link>
          <Link href="/admin/outbox" className="text-paper/70 hover:text-champagne">
            Outbox
          </Link>
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="text-[0.8125rem] uppercase tracking-[0.12em] text-paper/70 hover:text-champagne"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
