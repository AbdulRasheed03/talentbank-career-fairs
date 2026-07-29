"use server";

import { and, asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events, notifications, registrations } from "@/db/schema";
import { eventSchema, slotsToPromote, type EventFieldErrors, type EventFormState } from "@/lib/admin";
import { formatDateRange } from "@/lib/dates";
import { isUniqueViolation } from "@/lib/registration";

const now = () => new Date().toISOString();

// Pull the event fields off the form and validate them (SPEC rule 7).
function parseEvent(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    timeLabel: formData.get("timeLabel"),
    venue: formData.get("venue"),
    city: formData.get("city"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
  });
}

function collectFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): EventFieldErrors {
  const fieldErrors: EventFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof EventFieldErrors;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

// --- Create -----------------------------------------------------------------
export async function createEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const parsed = parseEvent(formData);
  if (!parsed.success) {
    return {
      kind: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  let newId: number;
  try {
    const [row] = await db
      .insert(events)
      .values({ ...parsed.data, status: "scheduled", createdAt: now(), updatedAt: now() })
      .returning({ id: events.id });
    newId = row.id;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        kind: "error",
        message: "That slug is already taken — choose another.",
        fieldErrors: { slug: "This slug is already in use." },
      };
    }
    throw err;
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  // Land on the edit page so any clash warning is shown straight away (SPEC).
  redirect(`/admin/events/${newId}/edit?saved=1`);
}

// --- Edit (also handles moves + capacity raises) ----------------------------
export async function updateEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    return { kind: "error", message: "Something went wrong — missing event id." };
  }

  const parsed = parseEvent(formData);
  if (!parsed.success) {
    return {
      kind: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }
  const data = parsed.data;

  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) {
    return { kind: "error", message: "That event no longer exists." };
  }

  const datesChanged =
    existing.startDate !== data.startDate || existing.endDate !== data.endDate;
  const capacityRaised = data.capacity > existing.capacity;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(events)
        .set({ ...data, updatedAt: now() })
        .where(eq(events.id, id));

      // Moving an event: tell everyone who signed up (SPEC rule 3).
      if (datesChanged) {
        const people = await tx
          .select({ email: registrations.email })
          .from(registrations)
          .where(eq(registrations.eventId, id));
        if (people.length > 0) {
          const oldRange = formatDateRange(existing.startDate, existing.endDate);
          const newRange = formatDateRange(data.startDate, data.endDate);
          await tx.insert(notifications).values(
            people.map((p) => ({
              eventId: id,
              recipientEmail: p.email,
              message: `Date changed for ${data.title}: ${oldRange} → ${newRange}`,
              createdAt: now(),
            })),
          );
        }
      }

      // Raising capacity promotes the oldest waitlisters (SPEC rule 6).
      if (capacityRaised) {
        const [c] = await tx
          .select({ n: sql<number>`count(*)` })
          .from(registrations)
          .where(and(eq(registrations.eventId, id), eq(registrations.status, "confirmed")));
        const confirmedCount = Number(c?.n ?? 0);

        const waiting = await tx
          .select()
          .from(registrations)
          .where(and(eq(registrations.eventId, id), eq(registrations.status, "waitlisted")))
          .orderBy(asc(registrations.id)); // oldest first

        const promoteN = slotsToPromote(confirmedCount, data.capacity, waiting.length);
        const toPromote = waiting.slice(0, promoteN);

        for (const r of toPromote) {
          await tx
            .update(registrations)
            .set({ status: "confirmed" })
            .where(eq(registrations.id, r.id));
        }
        if (toPromote.length > 0) {
          await tx.insert(notifications).values(
            toPromote.map((r) => ({
              eventId: id,
              recipientEmail: r.email,
              message: `A spot opened up — you're now confirmed for ${data.title}.`,
              createdAt: now(),
            })),
          );
        }
      }
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        kind: "error",
        message: "That slug is already taken — choose another.",
        fieldErrors: { slug: "This slug is already in use." },
      };
    }
    throw err;
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath("/");
  redirect(`/admin/events/${id}/edit?saved=1`);
}

// --- Cancel (soft) ----------------------------------------------------------
export type CancelState = { error?: string };

export async function cancelEvent(
  _prev: CancelState,
  formData: FormData,
): Promise<CancelState> {
  const id = Number(formData.get("id"));
  const reason = String(formData.get("reason") ?? "").trim();

  if (!Number.isInteger(id)) return { error: "Missing event id." };
  if (reason.length < 10) {
    return { error: "Please give a clear reason (at least 10 characters)." };
  }

  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) return { error: "That event no longer exists." };
  if (existing.status === "cancelled") return { error: "This event is already cancelled." };

  await db.transaction(async (tx) => {
    // Soft cancel — keep the row and its registrations (SPEC rule 2).
    await tx
      .update(events)
      .set({ status: "cancelled", cancellationReason: reason, updatedAt: now() })
      .where(eq(events.id, id));

    // One outbox row per confirmed registrant.
    const confirmed = await tx
      .select({ email: registrations.email })
      .from(registrations)
      .where(and(eq(registrations.eventId, id), eq(registrations.status, "confirmed")));

    if (confirmed.length > 0) {
      await tx.insert(notifications).values(
        confirmed.map((r) => ({
          eventId: id,
          recipientEmail: r.email,
          message: `Event cancelled: ${existing.title} — ${reason}`,
          createdAt: now(),
        })),
      );
    }
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath("/");
  revalidatePath(`/events/${existing.slug}`);
  redirect("/admin/events?cancelled=1");
}
