"use client";

import { AnimatePresence, motion } from "motion/react";

import { useLoop } from "@/hooks/use-loop";

type Props = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

export function CyclingWord({ words, intervalMs = 1800, className = "" }: Props) {
  const { key } = useLoop(intervalMs);
  const current = words[key % words.length];
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <span aria-hidden className="invisible whitespace-pre">
        {longest}
      </span>
      <span
        className="absolute inset-0"
        style={{ clipPath: "inset(-0.35em 0 -0.1em 0)" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={key}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 whitespace-pre"
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {current}
      </span>
    </span>
  );
}
