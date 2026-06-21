import { ScrambleText } from "@/components/scramble-text";

export function SiteLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-poeira transition-colors hover:text-fosforo md:text-xs${className ? ` ${className}` : ""}`}
    >
      <ScrambleText text="visite o trabalho completo" />
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
      >
        ↗
      </span>
    </a>
  );
}
