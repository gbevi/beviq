import Link from "next/link";

import { ScrambleText } from "@/components/scramble-text";

const items = [
  { href: "/#trabalhos", label: "trabalhos" },
  { href: "/#servicos", label: "serviços" },
  { href: "/#sobre", label: "sobre" },
  { href: "/#contato", label: "contato" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-linha md:px-8 md:text-xs">
        <Link href="/" aria-label="beviq" className="flex items-baseline gap-2">
          <ScrambleText
            data-mask
            text="beviq"
            className="font-logo text-base text-fosforo md:text-lg"
          />
        </Link>
        <ul className="flex gap-2 md:gap-4">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                data-mask
                href={it.href}
                className="text-linha transition-colors hover:text-fosforo"
              >
                <ScrambleText text={it.label} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
