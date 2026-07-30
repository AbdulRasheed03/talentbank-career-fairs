"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { statsBand } from "@/content/site";

export function StatsBand() {
  return (
    <section className="border-y border-navy-700 bg-navy-800 text-paper">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 px-6 py-20 lg:grid-cols-4 lg:px-16">
        {statsBand.map((s, i) => (
          <div
            key={s.label}
            className={`px-2 text-center lg:px-8 ${
              i > 0 ? "lg:border-l lg:border-gold/25" : ""
            }`}
          >
            <p className="font-serif text-5xl font-light tracking-[-0.02em] text-champagne tabular-nums">
              <CountUp target={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-paper/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setN(target);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const duration = 1200;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, reduce]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
