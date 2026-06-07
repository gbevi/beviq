"use client";

import Link from "next/link";

import { useScramble } from "@/hooks/use-scramble";

const items = [
  { href: "#trabalhos", label: "trabalhos" },
  { href: "#servicos", label: "serviços" },
  { href: "#sobre", label: "sobre" },
  { href: "#contato", label: "contato" },
];

function ScrambleNavLink({ href, label }: { href: string; label: string }) {
  const { display, onMouseEnter, onFocus } = useScramble(label);
  return (
    <a
      data-mask
      href={href}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className="text-linha transition-colors hover:text-fosforo"
    >
      {display}
    </a>
  );
}

function ScrambleLogo() {
  const { display, onMouseEnter, onFocus } = useScramble("beviq");
  return (
    <span
      data-mask
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className="font-logo text-base text-fosforo md:text-lg"
    >
      {display}
    </span>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-linha md:px-8 md:text-xs">
        <Link href="/" aria-label="beviq" className="flex items-baseline gap-2">
          <ScrambleLogo />
        </Link>
        <ul className="flex gap-3 md:gap-6">
          {items.map((it) => (
            <li key={it.href}>
              <ScrambleNavLink href={it.href} label={it.label} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
