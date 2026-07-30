import { AdminNav } from "@/components/AdminNav";
import { getOutbox } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export default async function OutboxPage() {
  const rows = await getOutbox();

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-serif text-3xl font-light tracking-tight">Outbox</h1>
        <p className="mt-1 text-sm text-neutral-600">
          In production these would be emails. Here they&apos;re just recorded so
          you can see what would have been sent.
        </p>

        {rows.length === 0 ? (
          <p className="mt-16 text-center text-neutral-500">
            Nothing here yet. Cancelling an event, moving its dates, or promoting
            a waitlist writes a notice here.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">To</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                      {row.recipientEmail}
                    </td>
                    <td className="px-4 py-3 text-neutral-900">{row.message}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {row.eventTitle ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
