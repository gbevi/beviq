import { CyclingWord } from "@/components/cycling-word";
import { AsciiSimulation } from "@/components/v1/ascii-simulation";

const WORDS = ["gosto", "opinião", "criatividade", "elegância", "escolha"];

export function Hero() {
  return (
    <section
      id="topo"
      className="relative min-h-dvh w-full overflow-hidden bg-fundo text-linha"
    >
      <div className="relative flex min-h-dvh flex-col px-4 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14">
        <div className="flex flex-1 items-center justify-center py-2 md:py-4">
          <div className="aspect-square h-[40vh] md:h-[44vh]">
            <AsciiSimulation className="h-full w-full" />
          </div>
        </div>

        <div className="max-w-[68rem]">
          <h1 className="font-display text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-linha">
            nascidos da engenharia,
            <br />
            movidos por{" "}
            <CyclingWord words={WORDS} className="text-fosforo" />.
          </h1>
          <p className="mt-8 max-w-[44ch] text-base leading-relaxed text-linha/85 md:text-lg">
            Sistemas e <span className="text-brasa">agentes</span> sob medida.
            <br />
            Feitos à mão, calibrados caso a caso.
          </p>
        </div>
      </div>
    </section>
  );
}
