"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { events, registrations } from "@/db/schema";
import { todayInKL } from "@/lib/dates";
import {
  decideRegistrationStatus,
  isUniqueViolation,
  type RegisterState,
} from "@/lib/registration";
import { getCurrentUser } from "@/lib/session-server";

// Register the logged-in user for an event. Identity (name/email/type) comes
// from their account — never from the client — so we only need the event slug.
export async function registerForEvent(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "user") {
    return { kind: "error", message: "Please log in to register." };
  }

  const slug = String(formData.get("slug") ?? "");
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!event) {
    return { kind: "error", message: "Sorry, that event could not be found." };
  }
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
    // One transaction: recount confirmed, decide confirmed vs waitlisted, insert.
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
      const decided = decideRegistrationStatus(
        Number(row?.n ?? 0),
        event.capacity,
      );
      await tx.insert(registrations).values({
        eventId: event.id,
        name: user.name,
        email: user.email,
        attendeeType: user.attendeeType,
        status: decided,
      });
      return decided;
    });

    revalidatePath(`/events/${slug}`);
    revalidatePath("/");
    return { kind: "success", outcome };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        kind: "error",
        message: "You're already registered for this event.",
      };
    }
    throw err;
  }
}
