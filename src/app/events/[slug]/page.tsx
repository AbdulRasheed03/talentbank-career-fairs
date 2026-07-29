import Link from "next/link";
import { notFound } from "next/navigation";
import { CapacityBar } from "@/components/CapacityBar";
import { StatusChip } from "@/components/StatusChip";
import { formatDateRange, formatFullDate, todayInKL } from "@/lib/dates";
import {
  deriveStatus,
  googleCalendarUrl,
  isRegistrationOpen,
} from "@/lib/events";
import { getEventBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const today = todayInKL();
  const status = deriveStatus(event, event.confirmedCount, today);
  const singleDay = event.startDate === event.endDate;
  const canRegister = isRegistrationOpen(status);
  const isFull = status === "full";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
      >
        ← All career fairs
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1
          className={`text-3xl font-bold tracking-tight ${
            status === "cancelled" ? "text-neutral-500 line-through" : ""
          }`}
        >
          {event.title}
        </h1>
        <StatusChip kind={status} />
      </div>

      {/* State banners */}
      {status === "cancelled" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-brand">This event has been cancelled.</p>
          {event.cancellationReason && (
            <p className="mt-1 text-sm text-neutral-700">
              {event.cancellationReason}
            </p>
          )}
        </div>
      )}
      {status === "past" && (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="font-medium text-neutral-700">
            This event has already taken place.
          </p>
        </div>
      )}

      {/* Facts */}
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Fact label="When">
          {singleDay
            ? formatFullDate(event.startDate)
            : formatDateRange(event.startDate, event.endDate)}
          <span className="block text-neutral-500">{event.timeLabel}</span>
        </Fact>
        <Fact label="Where">
          {event.venue}
          <span className="block text-neutral-500">{event.city}</span>
        </Fact>
      </dl>

      <p className="mt-6 leading-relaxed text-neutral-700">
        {event.description}
      </p>

      {/* Capacity — meaningful only for upcoming events */}
      {canRegister && (
        <div className="mt-8 max-w-sm">
          <CapacityBar
            confirmed={event.confirmedCount}
            capacity={event.capacity}
          />
        </div>
      )}

      {/* Registration panel */}
      <section className="mt-8 rounded-lg border border-neutral-200 p-5">
        {canRegister ? (
          <>
            <h2 className="text-lg font-semibold">Register for this event</h2>
            <p className="mt-1 text-sm text-neutral-600">
              {isFull
                ? "This event is full. New sign-ups join the waitlist and we'll let you know if a spot opens up."
                : "Free entry. Reserve your spot in a few seconds."}
            </p>
            {/* The working form + transaction arrive in Milestone 3. */}
            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-md bg-brand px-4 py-2 font-medium text-white opacity-60"
            >
              {isFull ? "Join the waitlist" : "Register"}
            </button>
            <p className="mt-2 text-xs text-neutral-400">
              The registration form goes live in Milestone 3.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-neutral-700">
              Registration closed
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {status === "cancelled"
                ? "This event was cancelled, so registration is closed."
                : "This event has ended, so registration is closed."}
            </p>
          </>
        )}
      </section>

      {/* Add to Google Calendar — only useful for upcoming events */}
      {canRegister && (
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
        >
          Add to Google Calendar →
        </a>
      )}
    </main>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-neutral-900">{children}</dd>
    </div>
  );
}
