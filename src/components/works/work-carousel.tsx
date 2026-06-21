"use client";

import { useState } from "react";

import { ScrambleText } from "@/components/scramble-text";
import { WorkShot } from "@/components/works/work-shot";
import { WorkVideo } from "@/components/works/work-video";

export type CarouselSlide =
  | { type: "video"; name: string; alt: string }
  | { type: "image"; src: string; alt: string };

export function WorkCarousel({
  slides,
  ratio = "16 / 9",
  className,
}: {
  slides: CarouselSlide[];
  /** proporção do palco do carrossel */
  ratio?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];
  const next = () => setIndex((prev) => (prev + 1) % total);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={className}>
      {/* palco: monta só a mídia ativa (o vídeo recomeça ao virar o slide) */}
      {slide.type === "video" ? (
        <WorkVideo key={slide.name} name={slide.name} ratio={ratio} eager />
      ) : (
        <WorkShot
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          ratio={ratio}
          sizes="(min-width: 768px) 90vw, 100vw"
        />
      )}

      {/* controles: contador 01/03 à esquerda, seta de próxima à direita */}
      <div className="mt-5 flex items-center justify-between md:mt-6">
        <span className="font-mono text-sm tracking-[0.2em] text-poeira tabular-nums">
          {pad(index + 1)} / {pad(total)}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Próxima mídia"
          className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-poeira transition-colors hover:text-fosforo md:text-xs"
        >
          <ScrambleText text="próxima" />
          <span
            aria-hidden
            className="text-base transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>
    </div>
  );
}
