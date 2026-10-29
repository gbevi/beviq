import { MonoLabel, Section, SectionHeading } from "@/components/sections/primitives";

const path = [
  {
    when: "2025 — hoje",
    what: "PET-Saúde · Ministério da Saúde",
    role: "Pesquisa: chatbot com RAG para encaminhamentos de pacientes no SUS",
  },
  {
    when: "2025 — 2026",
    what: "Academia Claraval",
    role: "Engenharia de software: plataforma SaaS construída do zero",
  },
  {
    when: "2025 — 2026",
    what: "Zago Consultoria Ambiental",
    role: "Tecnologia: sistema de gestão ambiental, do app de campo aos relatórios",
  },
  {
    when: "2024 — 2025",
    what: "CJR · Empresa Júnior de Computação",
    role: "Desenvolvimento fullstack e gestão de projetos",
  },
  {
    when: "2023 — 2027",
    what: "Universidade de Brasília",
    role: "Bacharelado em Engenharia de Software · TCC sobre IA na verificação de requisitos",
  },
  {
    when: "2020 — 2022",
    what: "International Baccalaureate",
    role: "IB Diploma em Linköping, Suécia",
  },
];

export function About() {
  return (
    <Section id="sobre">
      <SectionHeading className="mb-10 md:mb-14">sobre</SectionHeading>
      <div className="grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-20">
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-linha md:text-lg">
          <p>
            Engenheiro de software em formação pela Universidade de Brasília.
            Nascido em Roraima, criado em Brasília.
          </p>
          <p className="text-linha/70">
            A formação em engenharia é o que separa um sistema que funciona na
            demonstração de um sistema que aguenta o segundo ano de operação.
          </p>
        </div>
        <div className="justify-self-start md:justify-self-end">
          <img
            src="/gabriel.jpg"
            alt="Gabriel Bevilaqua sentado ao lado da sua mesa de trabalho"
            width={749}
            height={1000}
            className="relative z-[3] h-auto w-[240px] border border-vidro md:w-[320px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <MonoLabel className="mt-24 mb-6 md:mt-32 md:text-sm">trajetória</MonoLabel>
      <ul className="border-t border-vidro">
        {path.map((p) => (
          <li
            key={p.what}
            className="grid gap-1 border-b border-vidro py-5 md:grid-cols-12 md:gap-8 md:py-6"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-poeira md:col-span-2 md:text-sm">
              {p.when}
            </span>
            <span className="font-display text-lg tracking-tight text-fosforo md:col-span-4 md:text-xl">
              {p.what}
            </span>
            <span className="text-base leading-relaxed text-linha/80 md:col-span-6">
              {p.role}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
