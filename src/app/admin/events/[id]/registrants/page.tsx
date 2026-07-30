import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import type { Registration } from "@/db/schema";
import { getEventById, getRegistrationsForEvent } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export default async function RegistrantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);
  const event = await getEventById(eventId);
  if (!event) notFound();

  const { confirmed, waitlisted } = await getRegistrationsForEvent(eventId);

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/admin/events" className="text-sm text-warm-grey hover:text-navy-900">
          ← Back to events
        </Link>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-tight">Who&apos;s registered</h1>
            <p className="mt-1 text-sm text-neutral-600">{event.title}</p>
          </div>
          {/* Download link — a GET route streams the CSV (events team lives in sheets). */}
          <a
            href={`/admin/events/${eventId}/registrants/csv`}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
          >
            Download CSV
          </a>
        </div>

        <RegistrantTable
          title={`Confirmed (${confirmed.length} of ${event.capacity})`}
          rows={confirmed}
          emptyText="No confirmed registrations yet."
        />
        <RegistrantTable
          title={`Waitlist (${waitlisted.length})`}
          rows={waitlisted}
          emptyText="Nobody on the waitlist."
        />
      </main>
    </div>
  );
}

function RegistrantTable({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: Registration[];
  emptyText: string;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-500">{emptyText}</p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-neutral-900">{r.name}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.email}</td>
                  <td className="px-4 py-2 capitalize text-neutral-600">{r.attendeeType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
