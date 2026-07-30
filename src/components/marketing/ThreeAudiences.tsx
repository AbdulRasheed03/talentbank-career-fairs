import Link from "next/link";
import { audiences } from "@/content/site";
import { Reveal } from "./Reveal";

export function ThreeAudiences() {
  return (
    <section className="bg-cream text-navy-900">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <div className="grid gap-y-12 sm:grid-cols-3 sm:gap-x-0">
          {audiences.map((a, i) => (
            <Reveal
              key={a.no}
              delay={i * 0.08}
              className={`px-0 sm:px-10 ${i > 0 ? "sm:border-l sm:border-paper-deep" : ""}`}
            >
              <p className="font-serif text-3xl font-light text-champagne-deep">
                No. {a.no}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-navy-900">{a.title}</h3>
              <p className="mt-3 leading-relaxed text-warm-grey">{a.body}</p>
              <Link
                href={a.href}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-navy-900"
              >
                <span className="border-b border-transparent group-hover:border-navy-900">
                  Learn more
                </span>
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
