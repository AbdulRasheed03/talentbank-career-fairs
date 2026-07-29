import { z } from "zod";

// ---------------------------------------------------------------------------
// Registration: the capacity decision, input validation, and shared types.
// ---------------------------------------------------------------------------
// This file has NO database imports so the decision + validation can be unit
// tested as plain functions (tests/registration.test.ts). The server action
// that actually writes to the DB lives in register-action.ts.

// The core capacity rule (SPEC): a new sign-up is confirmed while there's room,
// and waitlisted once confirmed registrations have reached capacity. The caller
// recounts confirmed inside a transaction and passes the fresh count here.
export function decideRegistrationStatus(
  confirmedCount: number,
  capacity: number,
): "confirmed" | "waitlisted" {
  return confirmedCount >= capacity ? "waitlisted" : "confirmed";
}

// Server-side validation for the public form. Never trust the client (SPEC).
// Email is validated with a simple pattern (good enough for this demo) after
// trimming + lower-casing so duplicates match the unique (eventId, email) index.
export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Please enter a valid email address.",
    }),
  attendeeType: z.enum(["candidate", "employer"]),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export type RegisterFieldErrors = {
  name?: string;
  email?: string;
  attendeeType?: string;
};

// The state passed between the form and its server action (useActionState).
export type RegisterState =
  | { kind: "idle" }
  | { kind: "success"; outcome: "confirmed" | "waitlisted" }
  | { kind: "error"; message: string; fieldErrors?: RegisterFieldErrors };

// The unique (eventId, email) index throws when someone signs up twice. We turn
// that specific error into a friendly message instead of a 500 (SPEC).
export function isUniqueViolation(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("UNIQUE constraint failed") || msg.includes("SQLITE_CONSTRAINT")
  );
}
