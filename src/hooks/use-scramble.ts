"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "01!<>=+*/?#$%[]{}-_";
const PRESERVED = new Set([" ", "\n", "\t"]);

export function useScramble(text: string, durationMs = 500) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const start = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const startTime = performance.now();
    const chars = Array.from(text);
    const len = chars.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const revealCount = Math.floor(progress * len);

      let next = "";
      for (let i = 0; i < len; i++) {
        const ch = chars[i];
        if (i < revealCount || PRESERVED.has(ch)) {
          next += ch;
        } else {
          next +=
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      setDisplay(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [text, durationMs]);

  return { display, onMouseEnter: start, onFocus: start };
}
