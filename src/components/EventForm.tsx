"use client";

import { useActionState } from "react";
import type { Event } from "@/db/schema";
import type { EventFieldErrors, EventFormState } from "@/lib/admin";

type EventAction = (
  prev: EventFormState,
  formData: FormData,
) => Promise<EventFormState>;

const inputClass =
  "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
  "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: EventAction;
  event?: Event;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    action,
    { kind: "idle" },
  );
  const errors: EventFieldErrors | undefined =
    state.kind === "error" ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {event && <input type="hidden" name="id" value={event.id} />}

      <Field label="Title" error={errors?.title}>
        <input name="title" type="text" defaultValue={event?.title} className={inputClass} />
      </Field>

      <Field label="Slug (public URL)" error={errors?.slug} hint="lowercase-with-hyphens">
        <input name="slug" type="text" defaultValue={event?.slug} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date" error={errors?.startDate}>
          <input name="startDate" type="date" defaultValue={event?.startDate} className={inputClass} />
        </Field>
        <Field label="End date" error={errors?.endDate}>
          <input name="endDate" type="date" defaultValue={event?.endDate} className={inputClass} />
        </Field>
      </div>

      <Field label="Time" error={errors?.timeLabel} hint="e.g. 10:00 AM – 6:00 PM">
        <input name="timeLabel" type="text" defaultValue={event?.timeLabel} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Venue" error={errors?.venue}>
          <input name="venue" type="text" defaultValue={event?.venue} className={inputClass} />
        </Field>
        <Field label="City" error={errors?.city}>
          <input name="city" type="text" defaultValue={event?.city} className={inputClass} />
        </Field>
      </div>

      <Field label="Capacity" error={errors?.capacity}>
        <input
          name="capacity"
          type="number"
          min={1}
          defaultValue={event?.capacity}
          className={inputClass}
        />
      </Field>

      <Field label="Description" error={errors?.description}>
        <textarea
          name="description"
          rows={4}
          defaultValue={event?.description}
          className={inputClass}
        />
      </Field>

      {state.kind === "error" && (
        <p className="text-sm font-medium text-brand">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      {hint && <span className="ml-2 text-xs text-neutral-400">{hint}</span>}
      {children}
      {error && <p className="mt-1 text-xs font-medium text-brand">{error}</p>}
    </label>
  );
}
