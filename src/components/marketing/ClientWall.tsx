import { clientWall } from "@/content/site";
import { Reveal } from "./Reveal";

const MASK =
  "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)";

export function ClientWall() {
  return (
    <section className="bg-paper text-navy-900">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
            {clientWall.eyebrow}
          </p>
          <h2
            className="mt-4 font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
          >
            {clientWall.headlinePrefix}{" "}
            <em className="headline-italic">{clientWall.headlineItalic}</em>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-warm-grey">{clientWall.lede}</p>
        </Reveal>

        {/* Auto-scrolling, masked marquee (duplicated list for a seamless loop). */}
        <div
          className="marquee-pause relative mt-14 h-[380px] overflow-hidden"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        >
          <div className="marquee-up">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3"
              >
                {clientWall.names.map((name) => (
                  <li
                    key={`${copy}-${name}`}
                    className="flex items-center justify-center rounded-lg border border-paper-deep bg-cream px-4 py-6 text-center font-serif text-lg text-warm-grey"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
