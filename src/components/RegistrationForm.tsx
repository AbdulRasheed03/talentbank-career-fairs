"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { registerForEvent } from "@/lib/register-action";
import type { RegisterState } from "@/lib/registration";

const INITIAL: RegisterState = { kind: "idle" };

// Shown only to a logged-in public user. Registration is one click — the
// server action uses their account identity. A confirmed spot pops a
// confirmation with "Add to Google Calendar".
export function RegistrationForm({
  slug,
  isFull,
  calendarUrl,
  userName,
  userEmail,
}: {
  slug: string;
  isFull: boolean;
  calendarUrl: string;
  userName: string;
  userEmail: string;
}) {
  const [state, formAction, pending] = useActionState(registerForEvent, INITIAL);
  const [modalClosed, setModalClosed] = useState(false);

  const success = state.kind === "success";
  const confirmed = success && state.outcome === "confirmed";
  const showModal = success && !modalClosed;

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModalClosed(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  if (success) {
    return (
      <>
        <div
          className={`rounded-md border p-4 ${
            confirmed ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className="font-semibold text-neutral-900">
            {confirmed ? "You're registered!" : "You're on the waitlist"}
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            {confirmed
              ? "See you there. In production a confirmation email would be sent to you."
              : "This event is full, so we've added you to the waitlist. We'll be in touch if a spot opens up."}
          </p>
          {confirmed && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-brand hover:underline"
            >
              Add to Google Calendar →
            </a>
          )}
        </div>

        {showModal && (
          <ConfirmationModal
            confirmed={confirmed}
            calendarUrl={calendarUrl}
            onClose={() => setModalClosed(true)}
          />
        )}
      </>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Register for this event</h2>
      <p className="mt-1 text-sm text-neutral-600">
        {isFull
          ? "This event is full. Register to join the waitlist — we'll let you know if a spot opens up."
          : "Free entry. Reserve your spot in one click."}
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        Registering as <span className="font-medium text-neutral-700">{userName}</span> ({userEmail})
      </p>

      <form action={formAction} className="mt-4">
        <input type="hidden" name="slug" value={slug} />
        {state.kind === "error" && (
          <p className="mb-3 text-sm font-medium text-brand">{state.message}</p>
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

function ConfirmationModal({
  confirmed,
  calendarUrl,
  onClose,
}: {
  confirmed: boolean;
  calendarUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-neutral-900/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 id="reg-modal-title" className="text-lg font-bold text-neutral-900">
          {confirmed ? "You're registered!" : "You're on the waitlist"}
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {confirmed
            ? "Your spot is reserved. Add it to your calendar so it's in your week."
            : "This event is full, so we've added you to the waitlist. We'll be in touch if a spot opens up."}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {confirmed && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-brand px-4 py-2 text-center font-medium text-white hover:bg-brand-dark"
            >
              Add to Google Calendar
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2 font-medium text-neutral-700 hover:border-neutral-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
