import type { ReactNode } from "react";

import { ScrambleAnchor } from "@/components/scramble-anchor";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SectionProps = {
  id?: string;
  /** Responsive vertical padding. Defaults to the standard rhythm. */
  py?: string;
  className?: string;
  children: ReactNode;
};

// Shell repetido por todas as seções: fundo, padding e largura máxima do container.
export function Section({
  id,
  py = "md:py-40",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cx("bg-fundo px-4 py-24 text-linha md:px-10", py, className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  className?: string;
  children: ReactNode;
};

// <h2> display em CAIXA ALTA (uppercase via CSS), com a margem vinda por className.
export function SectionHeading({ className, children }: SectionHeadingProps) {
  return (
    <h2
      className={cx(
        "font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

type MonoLabelProps = {
  as?: "p" | "footer" | "span";
  className?: string;
  children: ReactNode;
};

// Rótulo mono pequeno em CAIXA ALTA, reutilizado nos rótulos do contato.
export function MonoLabel({ as: Tag = "p", className, children }: MonoLabelProps) {
  return (
    <Tag
      className={cx(
        "font-mono text-xs uppercase tracking-[0.2em] text-poeira",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

const bigLinkClass =
  "block font-display text-[clamp(2rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-fosforo transition-opacity hover:opacity-80";

type ContactLinkProps = {
  href: string;
  text: string;
  target?: string;
  rel?: string;
};

// Link grande do contato (text-fosforo), idêntico em e-mail e whatsapp.
export function ContactLink({ href, text, target, rel }: ContactLinkProps) {
  return (
    <ScrambleAnchor
      href={href}
      text={text}
      target={target}
      rel={rel}
      className={bigLinkClass}
    />
  );
}
