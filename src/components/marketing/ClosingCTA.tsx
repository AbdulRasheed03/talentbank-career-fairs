import Link from "next/link";
import { closing } from "@/content/site";
import { Reveal } from "./Reveal";

export function ClosingCTA() {
  return (
    <section className="bg-paper text-navy-900">
      <div className="mx-auto max-w-[1280px] px-6 py-28 lg:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            className="font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.3rem)" }}
          >
            {closing.headlinePrefix}{" "}
            <em className="headline-italic">{closing.headlineItalic}</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-warm-grey">{closing.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={closing.primary.href}
              className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-7 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-paper transition-colors hover:bg-navy-800"
            >
              {closing.primary.label} <span aria-hidden>→</span>
            </Link>
            <Link
              href={closing.secondary.href}
              className="group inline-flex items-center gap-1 text-sm font-medium text-navy-900"
            >
              <span className="border-b border-transparent group-hover:border-navy-900">
                {closing.secondary.label}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        {/* Flagship feature card */}
        <Reveal delay={0.1} className="mt-16">
          <Link
            href={closing.feature.href}
            className="group flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy-900 p-10 text-paper transition-transform hover:-translate-y-1 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
                Coming soon
              </p>
              <h3 className="mt-3 font-serif text-2xl font-light">{closing.feature.title}</h3>
              <p className="mt-2 max-w-xl text-paper/70">{closing.feature.desc}</p>
            </div>
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 text-lg transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
