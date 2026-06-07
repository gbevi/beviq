export function Manifesto() {
  return (
    <section
      id="sobre"
      className="bg-fundo px-4 py-24 text-linha md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mb-14">
          sobre
        </h2>
        <div className="grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:gap-20">
          <div className="max-w-3xl space-y-6 text-base leading-relaxed text-linha md:text-lg">
            <p>
              a beviq surgiu de um cansaço: sites iguais, sistemas iguais,
              digital descartável que se acumula na era agêntica.
            </p>
            <p>
              foi moldada pela engenharia de software. processo pensado,
              escalabilidade desde o desenho, qualidade que se mede no tempo.
            </p>
            <p>
              o trabalho começa com uma pergunta antes da proposta. cada peça
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
      </div>
    </section>
  );
}
