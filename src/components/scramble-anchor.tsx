"use client";

import { useScramble } from "@/hooks/use-scramble";

type Props = {
  href: string;
  text: string;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function ScrambleAnchor({
  href,
  text,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
}: Props) {
  const { display, onMouseEnter, onFocus } = useScramble(text);
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel ?? text}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
    >
      {display}
    </a>
  );
}
