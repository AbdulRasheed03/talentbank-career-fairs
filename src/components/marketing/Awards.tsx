import { awards } from "@/content/site";
import { Reveal } from "./Reveal";

export function Awards() {
  return (
    <section className="bg-navy-900 text-paper">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
            {awards.eyebrow}
          </p>
          <h2
            className="mt-4 font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
          >
            {awards.headlinePrefix}{" "}
            <em className="headline-italic">{awards.headlineItalic}</em>.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-navy-700 border-y border-navy-700">
          {awards.entries.map((e, i) => (
            <Reveal key={e.no} delay={i * 0.05}>
              <div className="grid items-center gap-4 py-7 sm:grid-cols-[auto_1fr_auto]">
                <div className="flex items-center gap-5">
                  <span className="font-serif text-2xl font-light text-champagne">No. {e.no}</span>
                  <span className="rounded-full border border-gold/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-champagne">
                    {e.relation}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-paper">
                    {e.title}
                    {e.badge && (
                      <span className="ml-3 rounded-full border border-gold px-2 py-0.5 align-middle text-[0.6rem] uppercase tracking-[0.1em] text-champagne">
                        {e.badge}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-paper/70">{e.desc}</p>
                </div>
                <span className="text-sm font-medium text-champagne sm:text-right">{e.stat}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
