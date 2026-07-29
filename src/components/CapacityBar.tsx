// A simple "87 of 120 registered" bar. The fill colour tracks how full it is:
// green with room, amber when nearly full (>= 90%), brand red when full.
export function CapacityBar({
  confirmed,
  capacity,
}: {
  confirmed: number;
  capacity: number;
}) {
  const pct = capacity > 0 ? Math.min(100, Math.round((confirmed / capacity) * 100)) : 0;
  const full = confirmed >= capacity;
  const nearlyFull = pct >= 90;

  const fillColor = full
    ? "bg-brand"
    : nearlyFull
      ? "bg-amber-500"
      : "bg-green-600";

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-neutral-900">
          {confirmed} of {capacity} registered
        </span>
        <span className="text-neutral-500">{pct}%</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-valuenow={confirmed}
        aria-valuemin={0}
        aria-valuemax={capacity}
      >
        <div
          className={`h-full rounded-full ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
