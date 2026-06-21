"use client";

import { useEffect, useRef } from "react";

import { useScramble } from "@/hooks/use-scramble";

type Props = {
  text: string;
  className?: string;
  durationMs?: number;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * Wrapper global do efeito de embaralhar texto no hover.
 * Solte-o dentro de QUALQUER elemento clicável (link, botão, etc.): ele
 * encontra o clicável ancestral e dispara o efeito ao passar o mouse / focar
 * em qualquer parte dele. Se não houver ancestral clicável, usa o próprio span.
 */
export function ScrambleText({ text, className, durationMs, ...rest }: Props) {
  const { display, onMouseEnter, onFocus } = useScramble(text, durationMs);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const target =
      node.closest("a, button, [role='button'], label, summary") ?? node;
    const handleEnter = () => onMouseEnter();
    const handleFocus = () => onFocus();
    target.addEventListener("mouseenter", handleEnter);
    target.addEventListener("focusin", handleFocus);
    return () => {
      target.removeEventListener("mouseenter", handleEnter);
      target.removeEventListener("focusin", handleFocus);
    };
  }, [onMouseEnter, onFocus]);

  return (
    <span ref={ref} className={className} {...rest}>
      {display}
    </span>
  );
}
