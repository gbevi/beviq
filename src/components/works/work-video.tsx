"use client";

import { useEffect, useRef } from "react";

export function WorkVideo({
  name,
  ratio,
  objectPosition,
  eager = false,
  className,
}: {
  name: string;
  /** proporção do tile, ex. "542 / 303" (recorta o vídeo com object-cover) */
  ratio?: string;
  objectPosition?: string;
  /** pré-carrega o vídeo inteiro (loop sem travar); usar no carrossel */
  eager?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {});
      }
    };
    // garante o loop mesmo quando o atributo `loop` trava por falta de buffer
    const onEnded = () => {
      v.currentTime = 0;
      tryPlay();
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    // z-[3] levanta a mídia acima do overlay de scanlines global (z-2 em globals.css)
    <div
      className={`relative z-[3] w-full overflow-hidden${className ? ` ${className}` : ""}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <video
        ref={ref}
        className={
          ratio
            ? "absolute inset-0 h-full w-full object-cover"
            : "block h-auto w-full"
        }
        style={objectPosition ? { objectPosition } : undefined}
        autoPlay
        loop
        muted
        playsInline
        preload={eager ? "auto" : "metadata"}
        poster={`/videos/${name}.jpg`}
      >
        <source src={`/videos/${name}.webm`} type="video/webm" />
        <source src={`/videos/${name}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
