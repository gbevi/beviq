"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ScrambleText } from "@/components/scramble-text";
import { works } from "@/lib/works";

export function SelectedWork() {
  // no mobile (sem hover) o preview abre/fecha no toque; no desktop é no hover
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section
      id="trabalhos"
      className="bg-fundo px-4 py-24 text-linha md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mb-24">
          trabalhos
        </h2>

        <ul className="border-t border-vidro">
          {works.map((work) => {
            const cover = work.hero?.[0];
            return work.wip ? (
              // projeto em construção: apagado, sem hover e sem link
              <li key={work.slug}>
                <div
                  aria-disabled="true"
                  className="flex cursor-default flex-col gap-2 border-b border-vidro py-5 opacity-40 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-6"
                >
                  <span className="flex items-baseline gap-3 text-lg text-linha md:text-xl">
                    <span className="font-mono text-sm text-poeira">
                      {work.id}
                    </span>
                    <span className="font-display tracking-tight">
                      {work.title}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-poeira md:gap-8 md:text-xs">
                    <span>{work.category}</span>
                    <span className="text-poeira/70">{work.location}</span>
                  </span>
                </div>
              </li>
            ) : (
              <li
                key={work.slug}
                className={`group border-b border-vidro ${openSlug === work.slug ? "is-open" : ""}`}
              >
                <Link
                  href={`/trabalhos/${work.slug}`}
                  onClick={(e) => {
                    // no touch: primeiro toque abre/fecha o preview, não navega
                    if (
                      cover &&
                      typeof window !== "undefined" &&
                      window.matchMedia("(hover: none)").matches
                    ) {
                      e.preventDefault();
                      setOpenSlug((cur) =>
                        cur === work.slug ? null : work.slug,
                      );
                    }
                  }}
                  className="flex flex-col gap-2 py-5 transition-colors md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-6"
                >
                  <span className="flex items-baseline gap-3 text-lg text-linha transition-colors group-hover:text-fosforo md:text-xl">
                    <span className="font-mono text-sm text-poeira transition-colors group-hover:text-brasa">
                      {work.id}
                    </span>
                    <ScrambleText
                      text={work.title}
                      className="font-display tracking-tight"
                    />
                  </span>
                  <span className="flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-poeira transition-colors group-hover:text-brasa md:gap-8 md:text-xs">
                    <span>{work.category}</span>
                    <span className="text-poeira/70">{work.location}</span>
                  </span>
                </Link>

                {/* a hero abre acomodada: no hover (desktop) ou no toque (mobile) */}
                {cover && (
                  <div className="work-reveal">
                    <div className="work-reveal-inner">
                      <div className="flex justify-start pb-6 pt-1 md:justify-end">
                        <Link
                          href={`/trabalhos/${work.slug}`}
                          aria-label={`Abrir ${work.title}`}
                          style={{
                            width: 320,
                            maxWidth: "100%",
                            position: "relative",
                            zIndex: 3,
                          }}
                          className="block"
                        >
                          <Image
                            src={cover.src}
                            alt=""
                            width={cover.width}
                            height={cover.height}
                            sizes="320px"
                            style={{ width: "100%", height: "auto" }}
                            className="block border border-vidro shadow-2xl shadow-black/40"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
