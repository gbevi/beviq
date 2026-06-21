import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrambleText } from "@/components/scramble-text";
import { SiteLink } from "@/components/works/site-link";
import { UltreyaBody } from "@/components/works/ultreya-body";
import { WorkShot } from "@/components/works/work-shot";
import { getWork, works } from "@/lib/works";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works
    .filter((work) => !work.wip)
    .map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};

  return {
    title: `${work.id} · ${work.title} · beviq`,
    description: work.intro,
  };
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work || work.wip) notFound();

  return (
    <article className="bg-fundo px-4 pb-24 pt-28 text-linha md:px-10 md:pb-40 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#trabalhos"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-poeira transition-colors hover:text-fosforo md:text-xs"
        >
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          <ScrambleText text="trabalhos" />
        </Link>

        {/* título: índice pequeno elevado + nome grande */}
        <header className="mb-7 mt-8 md:mb-9 md:mt-10">
          <h1 className="flex items-baseline gap-3 font-display text-[clamp(2.25rem,7vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] md:gap-4">
            <span className="self-start font-mono text-[0.3em] font-normal tracking-[0.15em] text-poeira">
              {work.id}
            </span>
            {work.title}
          </h1>
        </header>

        {/* subtítulo: largura quase total, 20px regular (Figma 2:387) */}
        {work.intro && (
          <p className="max-w-6xl text-xl leading-relaxed text-linha/85">
            {work.intro}
          </p>
        )}

        {work.liveUrl && <SiteLink href={work.liveUrl} className="mt-6" />}

        {/* par de heros recortados em tiles iguais (Figma 831×674) */}
        {work.hero && work.hero.length > 0 && (
          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-[3.8%]">
            {work.hero.map((image) => (
              <WorkShot
                key={image.src}
                src={image.src}
                alt={image.alt}
                ratio="831 / 674"
                sizes="(min-width: 768px) 48vw, 100vw"
              />
            ))}
          </div>
        )}

        {work.slug === "ultreya" && <UltreyaBody />}

        {work.liveUrl && (
          <div className="mt-20 border-t border-vidro pt-10 md:mt-28">
            <SiteLink href={work.liveUrl} />
          </div>
        )}
      </div>
    </article>
  );
}
