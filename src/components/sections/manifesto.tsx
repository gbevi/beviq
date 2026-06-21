import { Section, SectionHeading } from "@/components/sections/primitives";

export function Manifesto() {
  return (
    <Section id="sobre">
      <SectionHeading className="mb-10 md:mb-14">sobre</SectionHeading>
      <div className="grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:gap-20">
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-linha md:text-lg">
          <p>
            A beviq surgiu de um cansaço: sites iguais, sistemas iguais,
            digital descartável que se acumula na era agêntica.
          </p>
          <p>
            Foi moldada pela engenharia de software. Processo pensado,
            escalabilidade desde o desenho, qualidade que se mede no tempo.
          </p>
          <p>
            O trabalho começa com uma pergunta antes da proposta. Cada peça
            é calibrada à mão, feita pra ser herdada.
          </p>
        </div>
        <div className="self-end justify-self-start md:justify-self-end">
          <img
            src="/sobre-mark.png"
            alt=""
            width={1048}
            height={1446}
            className="h-auto w-[180px] opacity-40 invert md:w-[240px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Section>
  );
}
