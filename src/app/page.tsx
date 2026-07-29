import Link from "next/link";
import { CapacityBar } from "@/components/CapacityBar";
import { StatusChip } from "@/components/StatusChip";
import { formatDateRange, todayInKL } from "@/lib/dates";
import {
  deriveStatus,
  groupByMonth,
  type StatusKind,
} from "@/lib/events";
import { getEventsWithCounts, type EventWithCounts } from "@/lib/queries";

// Public full-year view. Rendered per request so it always reflects the live
// database (and "today" for the past/upcoming split).
export const dynamic = "force-dynamic";

type CardEvent = EventWithCounts & { statusKind: StatusKind };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city: cityFilter } = await searchParams;
  const today = todayInKL();

  const all = await getEventsWithCounts();

  // Attach the derived public status to each event once, up front.
  const withStatus: CardEvent[] = all.map((e) => ({
    ...e,
    statusKind: deriveStatus(e, e.confirmedCount, today),
  }));

  // City filter (optional convenience). Distinct cities, alphabetical.
  const cities = [...new Set(all.map((e) => e.city))].sort((a, b) =>
    a.localeCompare(b),
  );
  const shown = cityFilter
    ? withStatus.filter((e) => e.city === cityFilter)
    : withStatus;

  const months = groupByMonth(shown);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Career fairs across Malaysia, 2026
        </h1>
        <p className="mt-3 text-neutral-600">
          Every Talentbank career fair this year — dates, cities and how full
          each one is. Tap an event to see details and register.
        </p>
      </div>

      {/* City filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <CityPill label="All cities" href="/" active={!cityFilter} />
        {cities.map((c) => (
          <CityPill
            key={c}
            label={c}
            href={`/?city=${encodeURIComponent(c)}`}
            active={cityFilter === c}
          />
        ))}
      </div>

      {/* Month sections */}
      {months.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          No events{cityFilter ? ` in ${cityFilter}` : ""} yet.{" "}
          <Link href="/" className="font-medium text-brand hover:underline">
            View all cities
          </Link>
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {months.map((group) => (
            <section key={group.key}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {group.label}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
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
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
      }`}
    >
      {label}
    </Link>
  );
}

function EventCard({ event }: { event: CardEvent }) {
  const cancelled = event.statusKind === "cancelled";
  const upcoming =
    event.statusKind === "open" || event.statusKind === "full";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block h-full rounded-lg border border-neutral-200 p-4 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-neutral-500">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
        <StatusChip kind={event.statusKind} />
      </div>

      <h3
        className={`mt-1 font-semibold leading-snug ${
          cancelled ? "text-neutral-500 line-through" : "text-neutral-900"
        }`}
      >
        {event.title}
      </h3>

      <p className="mt-1 text-sm text-neutral-600">
        {event.city} · {event.venue}
      </p>

      {/* Show a capacity bar only where it's meaningful (upcoming events). */}
      {upcoming && (
        <div className="mt-3">
          <CapacityBar
            confirmed={event.confirmedCount}
            capacity={event.capacity}
          />
        </div>
      )}
    </Link>
  );
}
