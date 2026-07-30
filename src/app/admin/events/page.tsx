import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { StatusChip } from "@/components/StatusChip";
import { formatDateRange, todayInKL } from "@/lib/dates";
import { detectClashes } from "@/lib/clashes";
import { deriveStatus } from "@/lib/events";
import { getEventsWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;
  const today = todayInKL();
  const all = await getEventsWithCounts();

  // Sort by start date so the table reads like a calendar.
  const sorted = [...all].sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Career fairs</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {all.length} events. Edit details, move dates, or cancel.
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Add event
          </Link>
        </div>

        {cancelled && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Event cancelled. Everyone who was registered has an outbox notice.
          </p>
        )}

        {sorted.length === 0 ? (
          <p className="mt-16 text-center text-neutral-500">
            No events yet.{" "}
            <Link href="/admin/events/new" className="font-medium text-brand hover:underline">
              Add the first one
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Dates</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Registered</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sorted.map((event) => {
                  const status = deriveStatus(event, event.confirmedCount, today);
                  const clashes = detectClashes(event, all);
                  return (
                    <tr key={event.id} className="align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900">{event.title}</div>
                        <div className="text-xs text-neutral-400">{event.slug}</div>
                        {clashes.length > 0 && (
                          <div
                            className="mt-1 inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20"
                            title={clashes.map((c) => c.title).join(", ")}
                          >
                            Clash: {clashes[0].title}
                            {clashes.length > 1 ? ` +${clashes.length - 1}` : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-700">
                        {formatDateRange(event.startDate, event.endDate)}
                      </td>
                      <td className="px-4 py-3 text-neutral-700">{event.city}</td>
                      <td className="px-4 py-3 text-neutral-700">
                        {event.confirmedCount} / {event.capacity}
                        {event.waitlistedCount > 0 && (
                          <span className="text-neutral-400">
                            {" "}
                            (+{event.waitlistedCount} waitlist)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip kind={status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/events/${event.id}/registrants`}
                          className="text-neutral-600 hover:text-brand"
                        >
                          Who&apos;s registered
                        </Link>
                        <span className="px-2 text-neutral-300">·</span>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="font-medium text-brand hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
