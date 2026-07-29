"use client";

import { useActionState } from "react";
import { registerForEvent } from "@/lib/register-action";
import type { RegisterState } from "@/lib/registration";

const INITIAL: RegisterState = { kind: "idle" };

const inputClass =
  "block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
  "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function RegistrationForm({
  slug,
  isFull,
}: {
  slug: string;
  isFull: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    registerForEvent,
    INITIAL,
  );

  // After a successful submit, replace the form with a clear confirmation.
  if (state.kind === "success") {
    const waitlisted = state.outcome === "waitlisted";
    return (
      <div
        className={`rounded-md border p-4 ${
          waitlisted
            ? "border-amber-200 bg-amber-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        <p className="font-semibold text-neutral-900">
          {waitlisted ? "You're on the waitlist" : "You're registered!"}
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          {waitlisted
            ? "This event is full, so we've added you to the waitlist. We'll be in touch if a spot opens up."
            : "See you there. In production a confirmation email would be sent to you."}
        </p>
      </div>
    );
  }

  const fieldErrors = state.kind === "error" ? state.fieldErrors : undefined;

  return (
    <div>
      <h2 className="text-lg font-semibold">Register for this event</h2>
      <p className="mt-1 text-sm text-neutral-600">
        {isFull
          ? "This event is full. Sign up to join the waitlist — we'll let you know if a spot opens up."
          : "Free entry. Reserve your spot in a few seconds."}
      </p>

      <form action={formAction} className="mt-4 space-y-4" noValidate>
        <input type="hidden" name="slug" value={slug} />

        <Field label="Full name" error={fieldErrors?.name}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <Field label="Email" error={fieldErrors?.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        </Field>

        <Field label="I'm registering as" error={fieldErrors?.attendeeType}>
          <select name="attendeeType" defaultValue="candidate" className={inputClass}>
            <option value="candidate">A candidate (job seeker)</option>
            <option value="employer">An employer</option>
          </select>
        </Field>

        {state.kind === "error" && (
          <p className="text-sm font-medium text-brand">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting…" : isFull ? "Join the waitlist" : "Register"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs font-medium text-brand">{error}</p>}
    </label>
  );
}
