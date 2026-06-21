import { ScrambleText } from "@/components/scramble-text";

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
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel ?? text}
    >
      <ScrambleText text={text} />
    </a>
  );
}
