"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { events, registrations } from "@/db/schema";
import { todayInKL } from "@/lib/dates";
import {
  decideRegistrationStatus,
  isUniqueViolation,
  registrationSchema,
  type RegisterFieldErrors,
  type RegisterState,
} from "@/lib/registration";

// Server action behind the public registration form. Runs on every submit.
// The form passes the event slug as a hidden field; everything else is
// validated server-side because we never trust client input (SPEC rule 7).
export async function registerForEvent(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const slug = String(formData.get("slug") ?? "");

  const parsed = registrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    attendeeType: formData.get("attendeeType"),
  });

  if (!parsed.success) {
    const fieldErrors: RegisterFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "attendeeType") {
        fieldErrors[field] ??= issue.message;
      }
    }
    return {
      kind: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const { name, email, attendeeType } = parsed.data;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!event) {
    return { kind: "error", message: "Sorry, that event could not be found." };
  }

  // Re-check the registration window server-side (matches deriveStatus on the
  // page): cancelled and past events are closed.
  if (event.status === "cancelled") {
    return {
      kind: "error",
      message: "This event was cancelled, so registration is closed.",
    };
  }
  if (event.endDate < todayInKL()) {
    return {
      kind: "error",
      message: "This event has ended, so registration is closed.",
    };
  }

  try {
    // One transaction: recount confirmed, decide confirmed vs waitlisted, then
    // insert — so the capacity check and the write see a consistent snapshot.
    const outcome = await db.transaction(async (tx) => {
      const [row] = await tx
        .select({ n: sql<number>`count(*)` })
        .from(registrations)
        .where(
          and(
            eq(registrations.eventId, event.id),
            eq(registrations.status, "confirmed"),
          ),
        );

      const confirmedCount = Number(row?.n ?? 0);
      const decided = decideRegistrationStatus(confirmedCount, event.capacity);

      await tx.insert(registrations).values({
        eventId: event.id,
        name,
        email,
        attendeeType,
        status: decided,
      });

      return decided;
    });

    // Refresh the pages whose numbers just changed.
    revalidatePath(`/events/${slug}`);
    revalidatePath("/");

    return { kind: "success", outcome };
  } catch (err) {
    // Duplicate sign-up (unique on eventId+email) → friendly message, not a 500.
    if (isUniqueViolation(err)) {
      return {
        kind: "error",
        message: "You're already registered for this event with this email.",
      };
    }
    throw err;
  }
}
