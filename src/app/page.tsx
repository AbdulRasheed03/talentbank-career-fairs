import { db } from "@/db";
import { events } from "@/db/schema";

// Milestone 1 (Skeleton) placeholder.
// This page's only job is to prove the whole stack is wired end to end:
// Next.js (App Router) -> Drizzle ORM -> Turso/libSQL. It reads a live count
// of events from the database. The real public year view arrives in M2.
//
// force-dynamic: render on each request (never at build time) so we don't need
// a database during `next build`.
export const dynamic = "force-dynamic";

async function countEvents(): Promise<number | null> {
  try {
    const rows = await db.select({ id: events.id }).from(events);
    return rows.length;
  } catch {
    // DB not created/migrated yet — show a setup hint instead of crashing.
    return null;
  }
}

export default async function HomePage() {
  const count = await countEvents();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        Talentbank
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Career Fair Calendar
      </h1>
      <p className="mt-3 text-neutral-600">
        Milestone 1 — skeleton is running. Next.js, Tailwind, Drizzle and the
        libSQL database are wired together.
      </p>

      <div className="mt-8 rounded-lg border border-neutral-200 p-5">
        {count === null ? (
          <div>
            <p className="font-medium text-neutral-900">
              Database not ready yet.
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Run the migration and seed:{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[13px]">
                npm run db:migrate
              </code>{" "}
              then{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[13px]">
                npm run db:seed
              </code>
              .
            </p>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-bold text-neutral-900">{count}</p>
            <p className="mt-1 text-sm text-neutral-600">
              events in the database. The public year view is built in Milestone
              2.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
