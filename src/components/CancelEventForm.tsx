"use client";

import { useActionState } from "react";
import { cancelEvent, type CancelState } from "@/lib/admin-actions";

const INITIAL: CancelState = {};

// "Danger zone" cancel form. Cancelling is soft (the event stays, registrations
// are kept, everyone confirmed gets an outbox notice) and requires a reason.
export function CancelEventForm({ eventId }: { eventId: number }) {
  const [state, action, pending] = useActionState(cancelEvent, INITIAL);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={eventId} />
      <label className="block">
        <span className="text-sm font-medium text-neutral-800">
          Reason for cancelling
        </span>
        <textarea
          name="reason"
          rows={3}
          placeholder="e.g. Venue double-booked; rebooking for Q1 2027."
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </label>

      {state.error && (
        <p className="text-sm font-medium text-brand">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-60"
      >
        {pending ? "Cancelling…" : "Cancel this event"}
      </button>
    </form>
  );
}
