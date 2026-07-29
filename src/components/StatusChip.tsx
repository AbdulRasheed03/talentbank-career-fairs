import type { StatusKind } from "@/lib/events";

// Small status pill. Colours carry meaning (SPEC design direction):
//   Open = green, Full = amber, Cancelled = red, Past = grey.
const CHIP: Record<StatusKind, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-green-50 text-green-700 ring-green-600/20",
  },
  full: {
    label: "Full",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-brand ring-brand/20",
  },
  past: {
    label: "Past",
    className: "bg-neutral-100 text-neutral-500 ring-neutral-500/20",
  },
};

export function StatusChip({ kind }: { kind: StatusKind }) {
  const { label, className } = CHIP[kind];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}
