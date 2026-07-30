import Link from "next/link";
import { notFound } from "next/navigation";
import { CapacityBar } from "@/components/CapacityBar";
import { PageBand } from "@/components/marketing/PageBand";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { RegistrationForm } from "@/components/RegistrationForm";
import { StatusChip } from "@/components/StatusChip";
import { formatDateRange, formatFullDate, todayInKL } from "@/lib/dates";
import {
  deriveStatus,
  googleCalendarUrl,
  isRegistrationOpen,
} from "@/lib/events";
import { getEventBySlug } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const user = await getCurrentUser();
  const today = todayInKL();
  const status = deriveStatus(event, event.confirmedCount, today);
  const singleDay = event.startDate === event.endDate;
  const canRegister = isRegistrationOpen(status);
  const isFull = status === "full";

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <SiteHeader user={user ? { name: user.name } : null} />

      {/* Navy title band */}
      <PageBand narrow>
        <Link href="/events" className="text-sm font-medium text-paper/60 hover:text-paper">
          ← All career fairs
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
            <h1
              className={`font-serif font-light leading-[1.1] tracking-[-0.02em] ${
                status === "cancelled" ? "text-paper/50 line-through" : ""
              }`}
              style={{ fontSize: "clamp(2rem, 4vw, 2.9rem)" }}
            >
              {event.title}
            </h1>
            <StatusChip kind={status} />
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <Fact label="When">
              {singleDay
                ? formatFullDate(event.startDate)
                : formatDateRange(event.startDate, event.endDate)}
              <span className="block text-paper/60">{event.timeLabel}</span>
            </Fact>
            <Fact label="Where">
              {event.venue}
              <span className="block text-paper/60">{event.city}</span>
            </Fact>
          </dl>
      </PageBand>

      {/* Paper body */}
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-10 lg:px-8">
        {status === "cancelled" && (
          <div className="rounded-lg border border-redx/30 bg-redx/5 p-4">
            <p className="font-semibold text-redx">This event has been cancelled.</p>
            {event.cancellationReason && (
              <p className="mt-1 text-sm text-warm-grey">{event.cancellationReason}</p>
            )}
          </div>
        )}
        {status === "past" && (
          <div className="rounded-lg border border-paper-deep bg-cream p-4">
            <p className="font-medium text-warm-grey">
              This event has already taken place.
            </p>
          </div>
        )}

        <p className="mt-2 leading-relaxed text-warm-grey">{event.description}</p>

        {canRegister && (
          <div className="mt-8 max-w-sm">
            <CapacityBar confirmed={event.confirmedCount} capacity={event.capacity} />
          </div>
        )}

        {/* Registration panel */}
        <section className="mt-8 rounded-lg border border-paper-deep bg-cream p-6">
          {canRegister ? (
            user ? (
              <RegistrationForm
                slug={event.slug}
                isFull={isFull}
                calendarUrl={googleCalendarUrl(event)}
                userName={user.name}
                userEmail={user.email}
              />
            ) : (
              <div>
                <h2 className="font-serif text-xl">Register for this event</h2>
                <p className="mt-1 text-sm text-warm-grey">
                  {isFull
                    ? "This event is full — log in to join the waitlist."
                    : "Log in or create a free account to reserve your spot."}
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/login?next=/events/${event.slug}`}
                    className="rounded-md bg-redx px-4 py-2 text-sm font-medium text-white hover:bg-redx-deep"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md border border-navy-900 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-paper"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            )
          ) : (
            <>
              <h2 className="font-serif text-xl text-warm-grey">Registration closed</h2>
              <p className="mt-1 text-sm text-warm-grey">
                {status === "cancelled"
                  ? "This event was cancelled, so registration is closed."
                  : "This event has ended, so registration is closed."}
              </p>
            </>
          )}
        </section>

        {canRegister && (
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-champagne-deep hover:underline"
          >
            Add to Google Calendar →
          </a>
        )}
      </main>
    </div>
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
      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-paper">{children}</dd>
    </div>
  );
}
