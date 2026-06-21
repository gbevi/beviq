const services = [
  {
    name: "sistemas sob medida",
    desc: "Construído à mão, calibrado caso a caso. Feito pra ser herdado.",
  },
  {
    name: "agentes",
    desc: "Voz, função e limites calibrados pra você.",
  },
  {
    name: "resgate",
    desc: "Mão profissional em sistema que já está em uso. A operação não muda de ritmo.",
  },
  {
    name: "manutenção contínua",
    desc: "Cuidado constante do que está em operação. Atualizar, ajustar, prevenir.",
  },
];

export function Capabilities() {
  return (
    <section
      id="servicos"
      className="bg-fundo px-4 py-24 text-linha md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mb-14">
          serviços
        </h2>

        <p className="mb-32 max-w-[62ch] text-lg leading-relaxed text-linha/85 md:mb-48 md:text-xl">
          Sistemas e agentes feitos à mão pra empresas que não querem virar
          mais um.
          <br />
          Assinatura própria, pensada pra durar.
        </p>

        <ul className="space-y-16 md:space-y-20">
          {services.map((s) => (
            <li
              key={s.name}
              className="grid items-baseline gap-3 md:grid-cols-12 md:gap-10"
            >
              <h3 className="font-display text-3xl font-black uppercase leading-tight tracking-[-0.02em] text-fosforo md:col-span-5 md:text-5xl">
                {s.name}
              </h3>
              <p className="text-base leading-relaxed text-linha/80 md:col-span-6 md:col-start-7 md:text-lg">
                {s.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
