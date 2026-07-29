import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { EventForm } from "@/components/EventForm";
import { createEvent } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/admin/events" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to events
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Add event</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Fill in the details. You&apos;ll see a clash warning if it overlaps
          another fair in the same city.
        </p>
        <div className="mt-6">
          <EventForm action={createEvent} submitLabel="Create event" />
        </div>
      </main>
    </>
  );
}
