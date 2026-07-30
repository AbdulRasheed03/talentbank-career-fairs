import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { logout } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/session-server";

export const metadata: Metadata = {
  title: "Talentbank Career Fairs",
  description: "Career fair calendar for Talentbank — Malaysia, 2026.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link
              href={isAdmin ? "/admin/events" : "/"}
              className="flex items-baseline gap-2"
            >
              <span className="text-lg font-bold tracking-tight text-brand">
                Talentbank
              </span>
              <span className="text-sm text-neutral-500">Career Fairs 2026</span>
            </Link>

            {/* Admins use AdminNav; this toolbar is for the public side. */}
            {!isAdmin && (
              <div className="flex items-center gap-4 text-sm">
                {user ? (
                  <>
                    <span className="text-neutral-500">
                      Hi, {user.name.split(" ")[0]}
                    </span>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="font-medium text-neutral-600 hover:text-brand"
                      >
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
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
