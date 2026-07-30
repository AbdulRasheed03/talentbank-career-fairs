import Link from "next/link";
import { contact, footer, wordmark } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-paper">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Brand + contact */}
          <div>
            <p className="font-serif text-4xl font-light italic tracking-tight">
              {wordmark}
            </p>
            <p className="mt-4 max-w-xs text-sm text-paper/70">{footer.positioning}</p>
            <div className="mt-6 space-y-1 text-sm text-paper/70">
              <p>{contact.address}</p>
              <p>{contact.whatsapp}</p>
              <p>{contact.email}</p>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footer.columns.map((col) => (
              <div key={col.heading}>
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-champagne">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-navy-700 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {footer.legal.reg}</p>
          <p>{footer.legal.links.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
