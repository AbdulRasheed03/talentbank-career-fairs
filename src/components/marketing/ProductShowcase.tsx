import { showcase } from "@/content/site";
import { Reveal } from "./Reveal";

export function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-paper">
      {/* Faint concentric arcs in the background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, transparent 55%, #C9A66B 56%, transparent 58%, transparent 70%, #C9A66B 71%, transparent 73%)" }}
      />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-16">
        {/* Left: copy */}
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
            {showcase.eyebrow}
          </p>
          <h2
            className="mt-4 font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
          >
            {showcase.headlinePrefix}{" "}
            <em className="headline-italic">{showcase.headlineItalic}</em>.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-paper/80">{showcase.body}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-champagne">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-champagne" />
            {showcase.pill}
          </span>
        </Reveal>

        {/* Right: faux app window */}
        <Reveal delay={0.1}>
          <AppWindow />
        </Reveal>
      </div>
    </section>
  );
}

function AppWindow() {
  return (
    <div className="overflow-hidden rounded-2xl bg-cream text-navy-900 shadow-2xl ring-1 ring-black/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-paper-deep bg-paper px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-warm-grey-light">Talent Platform</span>
      </div>

      <div className="space-y-5 p-5">
        {/* Readiness ring */}
        <div className="flex items-center gap-4">
          <Ring value={82} />
          <div>
            <p className="text-sm font-semibold">Career readiness</p>
            <p className="text-xs text-warm-grey">Strong — 3 gaps to close</p>
          </div>
        </div>

        {/* Top matches */}
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-champagne-deep">
            Top employer matches
          </p>
          <div className="mt-2 space-y-2">
            {[
              { name: "Maybank", pct: 94 },
              { name: "Petronas", pct: 88 },
              { name: "Grab", pct: 81 },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="w-20 text-xs">{m.name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-deep">
                  <span className="block h-full rounded-full bg-navy-900" style={{ width: `${m.pct}%` }} />
                </span>
                <span className="w-8 text-right text-xs tabular-nums text-warm-grey">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2">
          {["Data", "Comms", "Python", "Finance", "Leadership"].map((s) => (
            <span key={s} className="rounded-full border border-paper-deep px-2.5 py-1 text-[0.7rem] text-warm-grey">
              {s}
            </span>
          ))}
        </div>

        {/* Applications */}
        <div className="space-y-2">
          {[
            { day: "22", mon: "AUG", role: "Engineering Fair · KL", status: "Interview", tone: "green" },
            { day: "05", mon: "SEP", role: "Kuching Career Fair", status: "In review", tone: "amber" },
          ].map((a) => (
            <div key={a.role} className="flex items-center gap-3 rounded-lg border border-paper-deep p-2.5">
              <span className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-navy-900 text-paper">
                <span className="text-sm font-semibold leading-none">{a.day}</span>
                <span className="text-[0.55rem] leading-none opacity-80">{a.mon}</span>
              </span>
              <span className="flex-1 text-xs">{a.role}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                  a.tone === "green" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>

        {/* Mentors */}
        <div className="flex items-center gap-2 border-t border-paper-deep pt-3">
          {["AR", "MT", "JL"].map((i) => (
            <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne-soft text-[0.6rem] font-semibold text-champagne-deep">
              {i}
            </span>
          ))}
          <span className="text-xs text-warm-grey">3 mentors ready to chat</span>
        </div>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E8E0CE" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#9A7942"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-lg text-navy-900">
        {value}
      </span>
    </div>
  );
}
