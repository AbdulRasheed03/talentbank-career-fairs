import { getEventById, getRegistrationsForEvent } from "@/lib/admin-queries";

// Escape a value for a CSV cell: wrap in quotes and double any inner quotes.
function cell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

// GET /admin/events/[id]/registrants/csv — streams a spreadsheet of everyone
// registered (confirmed first, then waitlist). Guarded by the admin middleware.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const eventId = Number(id);
  const event = await getEventById(eventId);
  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const { confirmed, waitlisted } = await getRegistrationsForEvent(eventId);
  const all = [...confirmed, ...waitlisted];

  const header = ["Name", "Email", "Attendee type", "Status", "Registered at"];
  const lines = [
    header.join(","),
    ...all.map((r) =>
      [cell(r.name), cell(r.email), r.attendeeType, r.status, r.createdAt].join(","),
    ),
  ];
  const csv = lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}-registrants.csv"`,
    },
  });
}
