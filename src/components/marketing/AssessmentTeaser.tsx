import Link from "next/link";
import { assessment } from "@/content/site";
import { Reveal } from "./Reveal";

export function AssessmentTeaser() {
  return (
    <section className="bg-paper text-navy-900">
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
            {assessment.eyebrow}
          </p>
          <h2
            className="mt-4 font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
          >
            {assessment.question}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-warm-grey">
            {assessment.explainer}
          </p>
          <ul className="mt-6 space-y-3">
            {assessment.discover.map((d) => (
              <li key={d} className="flex items-start gap-3 text-navy-900">
                <span aria-hidden className="mt-1 text-champagne-deep">◆</span>
                {d}
              </li>
            ))}
          </ul>
          <Link
            href={assessment.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-redx px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-redx-deep"
          >
            {assessment.cta.label} <span aria-hidden>→</span>
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-gold/30 shadow-xl">
            {assessment.stats.map((s) => (
              <div key={s.label} className="bg-navy-900 px-4 py-10 text-center text-paper">
                <p className="font-serif text-4xl font-light text-champagne">{s.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-paper/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
