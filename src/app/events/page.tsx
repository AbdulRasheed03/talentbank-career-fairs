import Link from "next/link";
import { CapacityBar } from "@/components/CapacityBar";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { formatDateRange, todayInKL } from "@/lib/dates";
import { deriveStatus, groupByMonth, type StatusKind } from "@/lib/events";
import { getEventsWithCounts, type EventWithCounts } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session-server";

// Public full-year calendar. Lives at /events; styled to match the marketing
// landing (paper/navy/Fraunces) so the site reads as one piece.
export const dynamic = "force-dynamic";

type CardEvent = EventWithCounts & { statusKind: StatusKind };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city: cityFilter } = await searchParams;
  const user = await getCurrentUser();
  const today = todayInKL();

  const all = await getEventsWithCounts();
  const withStatus: CardEvent[] = all.map((e) => ({
    ...e,
    statusKind: deriveStatus(e, e.confirmedCount, today),
  }));

  const cities = [...new Set(all.map((e) => e.city))].sort((a, b) =>
    a.localeCompare(b),
  );
  const shown = cityFilter
    ? withStatus.filter((e) => e.city === cityFilter)
    : withStatus;
  const months = groupByMonth(shown);

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <SiteHeader user={user ? { name: user.name } : null} solid />

      <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-28 lg:px-16">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
          <span aria-hidden className="h-px w-8 bg-gold" />
          The 2026 calendar
        </p>
        <h1
          className="mt-4 max-w-3xl font-serif font-light leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.3rem)" }}
        >
          Career fairs across Malaysia, <em className="headline-italic">2026</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-warm-grey">
          Every Talentbank career fair this year — dates, cities and how full each
          one is. Choose a fair to see the details and register.
        </p>

        {/* City filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          <CityPill label="All cities" href="/events" active={!cityFilter} />
          {cities.map((c) => (
            <CityPill
              key={c}
              label={c}
              href={`/events?city=${encodeURIComponent(c)}`}
              active={cityFilter === c}
            />
          ))}
        </div>

        {months.length === 0 ? (
          <p className="mt-16 text-center text-warm-grey">
            No events{cityFilter ? ` in ${cityFilter}` : ""} yet.{" "}
            <Link href="/events" className="font-medium text-champagne-deep hover:underline">
              View all cities
            </Link>
          </p>
        ) : (
          <div className="mt-12 space-y-12">
            {months.map((group) => (
              <section key={group.key}>
                <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
                  {group.label}
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.events.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CityPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-navy-900 bg-navy-900 text-paper"
          : "border-paper-deep text-warm-grey hover:border-navy-900"
      }`}
    >
      {label}
    </Link>
  );
}

function EventCard({ event }: { event: CardEvent }) {
  const cancelled = event.statusKind === "cancelled";
  const upcoming = event.statusKind === "open" || event.statusKind === "full";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block h-full rounded-lg border border-paper-deep bg-cream p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-champagne-deep">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
        <StatusChip kind={event.statusKind} />
      </div>

      <h3
        className={`mt-2 font-serif text-xl leading-snug ${
          cancelled ? "text-warm-grey-light line-through" : "text-navy-900"
        }`}
      >
        {event.title}
      </h3>

      <p className="mt-1 text-sm text-warm-grey">
        {event.city} · {event.venue}
      </p>

      {upcoming && (
        <div className="mt-4">
          <CapacityBar confirmed={event.confirmedCount} capacity={event.capacity} />
        </div>
      )}
    </Link>
  );
}
