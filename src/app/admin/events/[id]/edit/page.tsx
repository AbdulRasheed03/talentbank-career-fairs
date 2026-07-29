import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { CancelEventForm } from "@/components/CancelEventForm";
import { EventForm } from "@/components/EventForm";
import { detectClashes } from "@/lib/clashes";
import { formatDateRange } from "@/lib/dates";
import { updateEvent } from "@/lib/admin-actions";
import { getEventById } from "@/lib/admin-queries";
import { getEventsWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const eventId = Number(id);
  const event = await getEventById(eventId);
  if (!event) notFound();

  // Non-blocking clash check against every other event (SPEC rule 1).
  const all = await getEventsWithCounts();
  const clashes = detectClashes(event, all);
  const cancelled = event.status === "cancelled";

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/admin/events" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to events
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{event.title}</h1>

        {saved && (
          <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            Saved.
          </p>
        )}

        {clashes.length > 0 && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Heads up — this clashes with {clashes.length === 1 ? "another fair" : "other fairs"} in {event.city}:
            </p>
            <ul className="mt-1 list-inside list-disc text-sm text-amber-800">
              {clashes.map((c) => (
                <li key={c.id}>
                  {c.title} ({formatDateRange(c.startDate, c.endDate)})
                </li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-amber-700">
              That can be intentional — this is only a warning, not a block.
            </p>
          </div>
        )}

        {cancelled && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-brand">This event is cancelled.</p>
            {event.cancellationReason && (
              <p className="mt-1 text-sm text-neutral-700">{event.cancellationReason}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          <EventForm action={updateEvent} event={event} submitLabel="Save changes" />
        </div>

        {/* Danger zone — soft cancel with a reason (SPEC rule 2). */}
        {!cancelled && (
          <section className="mt-10 rounded-lg border border-red-200 p-5">
            <h2 className="text-lg font-semibold text-brand">Cancel event</h2>
            <p className="mt-1 text-sm text-neutral-600">
              The event stays visible with a cancelled banner, registrations are
              kept, and everyone confirmed gets an outbox notice.
            </p>
            <div className="mt-4">
              <CancelEventForm eventId={event.id} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
