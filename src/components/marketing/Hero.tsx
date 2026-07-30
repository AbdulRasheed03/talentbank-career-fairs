"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hero } from "@/content/site";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Fade-up reveal for hero children, staggered.
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.1 + i * 0.08 },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-navy-900 text-paper">
      {/* Background: navy wash with a soft top-left highlight (a real workplace
          photo would sit here behind an 88% navy overlay). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 0%, #1E3A6F 0%, #122A55 38%, #0A1F44 72%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col justify-center px-6 pb-24 pt-32 lg:px-16">
        <div className="max-w-4xl">
          <motion.p
            custom={0}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-champagne"
          >
            <span aria-hidden className="h-px w-8 bg-gold" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            custom={1}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-6 font-serif font-light leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
          >
            {hero.headlinePrefix} <RotatingWord words={hero.rotatingBrands} />{" "}
            {hero.headlineSuffix}{" "}
            <em className="headline-italic">{hero.headlineItalic}</em>.
          </motion.h1>

          <motion.p
            custom={2}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80"
          >
            {hero.sub}
          </motion.p>

          {/* Stat row separated by pipes */}
          <motion.div
            custom={3}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {hero.stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <span aria-hidden className="text-gold/50">|</span>}
                <span className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-light text-champagne">
                    {s.value}
                  </span>
                  <span className="text-sm text-paper/70">{s.label}</span>
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            custom={4}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-12"
          >
            <Link
              href={hero.cta.href}
              className="group inline-flex items-center gap-2 rounded-full border border-paper/50 px-7 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-navy-900"
            >
              {hero.cta.label}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Vertical SCROLL label with a gold line + looping sweep */}
      <div className="pointer-events-none absolute bottom-10 right-8 hidden flex-col items-center gap-3 lg:flex">
        <span className="vertical-rl text-[0.7rem] uppercase tracking-[0.2em] text-paper/60">
          Scroll
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-gold/30">
          <motion.span
            className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-transparent via-gold to-transparent"
            animate={{ y: ["-100%", "260%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}

// The highlighted token cycling through partner names, each in a solid red box.
function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2500);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    // Grid-stack every word in one cell so the box sizes to the widest — no
    // layout shift as it cycles (brief hard requirement).
    <span className="relative inline-grid align-baseline">
      {words.map((word, i) => (
        <motion.span
          key={word}
          style={{ gridArea: "1 / 1" }}
          animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 4 }}
          transition={{ duration: 0.45, ease: EASE_EXPO }}
          aria-hidden={i !== index}
          className="whitespace-nowrap rounded-md bg-redx px-3 pb-1 text-white"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
