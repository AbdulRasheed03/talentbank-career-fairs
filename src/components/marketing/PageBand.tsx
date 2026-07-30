import type { ReactNode } from "react";

// Shared navy title band used across the non-landing pages (/events, event
// detail, /login, /register, /coming-soon). One component = one consistent
// height everywhere, so the pages read as a set. Sits behind the fixed header
// (pt clears it); content is pinned to the bottom for a consistent baseline.
export function PageBand({
  children,
  narrow = false,
}: {
  children: ReactNode;
  // Narrower content column (reading pages like event detail); the band height
  // stays identical either way.
  narrow?: boolean;
}) {
  const inner = narrow
    ? "max-w-3xl px-6 lg:px-8"
    : "max-w-[1280px] px-6 lg:px-16";
  return (
    <section className="bg-navy-900 text-paper">
      <div className={`mx-auto flex min-h-[440px] flex-col justify-end pb-14 pt-32 ${inner}`}>
        {children}
      </div>
    </section>
  );
}
