import { z } from "zod";

// ---------------------------------------------------------------------------
// Admin form validation + small pure helpers (no DB — unit tested).
// ---------------------------------------------------------------------------

// Turn a title into a URL-safe slug. Used to pre-fill the slug on the new-event
// form ("Talentbank KL Fair" -> "talentbank-kl-fair").
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// When capacity is raised, how many waitlisted people we can promote: fill the
// gap up to the new capacity, but never more than are actually waiting.
// (SPEC rule 6 — promote oldest first; this decides HOW MANY.)
export function slotsToPromote(
  confirmedCount: number,
  newCapacity: number,
  waitlistedCount: number,
): number {
  return Math.max(0, Math.min(waitlistedCount, newCapacity - confirmedCount));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Server-side validation for create/edit (SPEC rule 7 — never trust the client).
export const eventSchema = z
  .object({
    title: z.string().trim().min(3, "Give the event a clear title."),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only use lowercase letters, numbers and hyphens.",
      ),
    startDate: z.string().regex(ISO_DATE, "Pick a start date."),
    endDate: z.string().regex(ISO_DATE, "Pick an end date."),
    timeLabel: z.string().trim().min(3, "Add a time, e.g. 10:00 AM – 6:00 PM."),
    venue: z.string().trim().min(2, "Where is it being held?"),
    city: z.string().trim().min(2, "Which city?"),
    description: z.string().trim().min(10, "Add a short description."),
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .positive("Capacity must be more than zero."),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "The end date can't be before the start date.",
    path: ["endDate"],
  });

export type EventInput = z.infer<typeof eventSchema>;

// Field-keyed errors surfaced back to the form.
export type EventFieldErrors = Partial<Record<keyof EventInput, string>>;

export type EventFormState =
  | { kind: "idle" }
  | { kind: "error"; message: string; fieldErrors?: EventFieldErrors };
