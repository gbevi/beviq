import { Section, SectionHeading } from "@/components/sections/primitives";

const services = [
  {
    name: "sistemas sob medida",
    desc: "Ferramentas internas, painéis, web apps, saas pequenos e mvps. Automação operacional cai aqui. Construído à mão em volta do jeito que a sua operação já funciona.",
  },
  {
    name: "sites",
    desc: "Institucionais, landing pages, presença digital. Direção de arte, design das telas e código na mesma entrega.",
  },
  {
    name: "resgate",
    desc: "Sistema, site, automação, app ou marca que já existe e precisa de mão profissional. Diagnóstico escrito, depois retomada em fases. A operação não muda de ritmo.",
  },
  {
    name: "manutenção contínua",
    desc: "Cuidado mensal do que está em operação: monitorar, atualizar, corrigir, prevenir. Um interlocutor, feito aqui ou não.",
  },
];

export function Capabilities() {
  return (
    <Section id="servicos">
      <SectionHeading className="mb-10 md:mb-14">serviços</SectionHeading>

      <p className="mb-32 max-w-[62ch] text-lg leading-relaxed text-linha/85 md:mb-48 md:text-xl">
        Sistemas e sites feitos à mão pra empresas que não querem virar
        mais um.
        <br />
        Quatro linhas de trabalho, calibradas caso a caso, pensadas pra durar.
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
    </Section>
  );
}
