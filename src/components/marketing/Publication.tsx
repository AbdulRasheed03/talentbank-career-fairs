import { publication } from "@/content/site";
import { Reveal } from "./Reveal";

export function Publication() {
  const { book } = publication;
  return (
    <section className="bg-cream text-navy-900">
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-16">
        {/* CSS book cover with a hover tilt + ground shadow */}
        <Reveal className="flex justify-center">
          <div className="group [perspective:1200px]">
            <div className="relative">
              <div className="mx-auto flex h-[380px] w-[280px] flex-col justify-between rounded-r-md border-l-4 border-champagne-deep bg-navy-900 p-8 text-paper shadow-2xl transition-transform duration-500 [transform:rotateY(-16deg)_rotateX(3deg)] group-hover:[transform:rotateY(-4deg)]">
                <div className="rounded-sm border border-gold/40 p-5">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-champagne">
                    Talentbank
                  </p>
                  <h3 className="mt-6 font-serif text-3xl font-light leading-tight">
                    {book.title} <em className="headline-italic">{book.italicWord}</em>
                  </h3>
                </div>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-paper/60">
                  {book.subtitle}
                </p>
              </div>
              {/* ground shadow */}
              <div
                aria-hidden
                className="mx-auto mt-4 h-4 w-56 rounded-[100%] bg-navy-900/20 blur-md"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
            {publication.eyebrow}
          </p>
          <h2
            className="mt-4 font-serif font-light leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
          >
            {publication.headlinePrefix}{" "}
            <em className="headline-italic">{publication.headlineItalic}</em>.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-warm-grey">{publication.body}</p>
          <div className="mt-8 flex gap-12">
            {publication.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl font-light text-navy-900">
                  {s.value}
                  {s.plus && <sup className="text-redx">+</sup>}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-warm-grey">
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
