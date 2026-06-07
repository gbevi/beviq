"use client";

import { useEffect, useRef } from "react";

function FeaturedVideo({ name }: { name: string }) {
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
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="block h-auto w-full"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={`/videos/${name}.jpg`}
    >
      <source src={`/videos/${name}.webm`} type="video/webm" />
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

function WorkId({ children }: { children: React.ReactNode }) {
  return (
    <header className="font-mono text-xs uppercase tracking-[0.2em] text-poeira md:text-sm">
      {children}
    </header>
  );
}

export function SelectedWork() {
  return (
    <section
      id="trabalhos"
      className="bg-fundo px-4 py-24 text-linha md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-20 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mb-32">
          trabalhos
        </h2>

        <div className="space-y-32 md:space-y-48">
          {/* ID001 — duas pilhas vídeo+texto em lados opostos */}
          <article className="space-y-20 md:space-y-32">
            <WorkId>ID001</WorkId>

            <div className="grid gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-8 md:col-start-1">
                <FeaturedVideo name="midlej1" />
              </div>
              <div className="md:col-span-5 md:col-start-1">
                <p className="text-base leading-relaxed md:text-lg">
                  repaginação de site institucional. a intenção foi trazer
                  opinião pra marca sem perder a calma.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-7 md:col-start-6">
                <FeaturedVideo name="midlej2" />
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="text-base leading-relaxed md:text-lg">
                  tipografia decidida, ritmo de leitura próprio, animações 3d
                  que carregam presença sem dominar.
                </p>
              </div>
            </div>
          </article>

          {/* ID002 — vídeo esquerda + texto direita, mesma linha */}
          <article className="space-y-14 md:space-y-20">
            <WorkId>ID002</WorkId>

            <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-8 md:col-start-1">
                <FeaturedVideo name="claraval1" />
              </div>
              <div className="md:col-span-3 md:col-start-10">
                <p className="text-sm leading-relaxed md:text-base">
                  sistema interno para gestão de contratos. a feature em
                  destaque combina medidas estratégicas, okrs e tarefas em um
                  só lugar, traduzindo um conceito normalmente difuso em uma
                  vista que qualquer pessoa do time lê de ponta a ponta.
                  aprofundamento nas regras de negócio e personalização nos
                  detalhes.
                </p>
              </div>
            </div>
          </article>

          {/* ID003 — vídeo wide, texto logo abaixo deslocado à direita */}
          <article className="space-y-8 md:space-y-12">
            <WorkId>ID003</WorkId>

            <div>
              <FeaturedVideo name="obsidian1" />
            </div>

            <div className="md:grid md:grid-cols-12">
              <p className="text-base leading-relaxed md:col-span-6 md:col-start-7 md:text-lg">
                demonstração do princípio por trás dos agentes, montada em
                obsidian. uma empresa transformada em fonte queryable para um
                agente, unificada num single source of truth, com governança
                da informação acessível a qualquer agente em custo econômico
                de tokens.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
