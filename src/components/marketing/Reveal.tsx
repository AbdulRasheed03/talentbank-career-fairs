"use client";

import { motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Wrap the marketing sections so every Framer animation respects the user's
// reduced-motion setting (brief hard requirement).
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Children fade up 24px, once, when 20% in view (brief §6).
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}
