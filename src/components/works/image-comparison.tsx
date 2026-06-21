"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeImage: string;
  /** depois como imagem estática (use afterVideo pra vídeo) */
  afterImage?: string;
  /** depois como vídeo (nome base em /videos, ex. "ultreya-mapa") */
  afterVideo?: string;
  altBefore?: string;
  altAfter?: string;
  /** proporção do palco, ex. "1836 / 1026" */
  ratio?: string;
  /** âncora do recorte das imagens (object-position) */
  objectPosition?: string;
  className?: string;
};

/**
 * Slider antes/depois. À esquerda do cabo fica o "antes" (imagem), à direita o
 * "depois" (imagem ou vídeo). Arraste ou clique em qualquer ponto pra mover.
 * z-[3] levanta acima do overlay de scanlines global (z-2 em globals.css).
 */
export function ImageComparison({
  beforeImage,
  afterImage,
  afterVideo,
  altBefore = "Antes",
  altAfter = "Depois",
  ratio = "16 / 9",
  objectPosition = "top",
  className,
}: Props) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const move = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const next = ((clientX - el.getBoundingClientRect().left) / el.offsetWidth) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  // autoplay robusto do vídeo "depois"
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    };
    const onEnded = () => {
      v.currentTime = 0;
      tryPlay();
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("ended", onEnded);
    };
  }, [afterVideo]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) move(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4));
  };

  const labelClass =
    "pointer-events-none absolute top-3 z-10 bg-fundo/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fosforo";

  return (
    <div
      ref={containerRef}
      className={`relative z-[3] w-full cursor-ew-resize touch-none select-none overflow-hidden${className ? ` ${className}` : ""}`}
      style={{ aspectRatio: ratio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* depois (base): vídeo ou imagem */}
      {afterVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={`/videos/${afterVideo}.jpg`}
        >
          <source src={`/videos/${afterVideo}.webm`} type="video/webm" />
          <source src={`/videos/${afterVideo}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={afterImage}
          alt={altAfter}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      )}

      {/* antes (camada superior, revelada da esquerda até o cabo) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt={altBefore}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </div>

      <span className={`${labelClass} left-3`}>antes</span>
      <span className={`${labelClass} right-3`}>depois</span>

      {/* cabo do slider */}
      <div
        role="slider"
        aria-label="Comparar antes e depois"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute bottom-0 top-0 z-10 -ml-0.5 w-1 cursor-ew-resize bg-fosforo/90 outline-none"
        style={{ left: `${position}%` }}
      >
        <div
          className={`absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fosforo text-fundo shadow-lg transition-transform duration-200 ${dragging ? "scale-110" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="15" y1="18" x2="9" y2="12" />
            <line x1="9" y1="6" x2="15" y2="12" />
            <line x1="9" y1="18" x2="15" y2="12" />
            <line x1="15" y1="6" x2="9" y2="12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
