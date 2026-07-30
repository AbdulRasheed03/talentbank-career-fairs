import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { contact } from "@/content/site";
import { getCurrentUser } from "@/lib/session-server";

// Stub that catches any nav tab whose page isn't built yet, so no link is dead.
export const dynamic = "force-dynamic";

export default async function ComingSoonPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader user={user ? { name: user.name } : null} />
      <main>
        <section className="flex min-h-[85vh] items-center bg-navy-900 text-paper">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-32 lg:px-16">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-champagne">
              <span aria-hidden className="h-px w-8 bg-gold" />
              Launching soon
            </p>
            <h1
              className="mt-6 max-w-3xl font-serif font-light leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.3rem)" }}
            >
              This page is <em className="headline-italic">on its way</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-paper/80">
              We&apos;re building this out. In the meantime, the full 2026 career-fair
              calendar is already live.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-redx px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-redx-deep"
              >
                Contact us <span aria-hidden>→</span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md border border-paper/50 px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-paper transition-colors hover:bg-paper hover:text-navy-900"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-paper text-navy-900">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-16">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
              While you wait
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { title: "Browse the 2026 calendar", href: "/events" },
                { title: "Create a free account", href: "/register" },
                { title: "Sign in", href: "/login" },
              ].map((l) => (
                <Link
                  key={l.title}
                  href={l.href}
                  className="group flex items-center justify-between border-b border-paper-deep py-4 font-serif text-xl transition-colors hover:text-champagne-deep"
                >
                  {l.title}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
