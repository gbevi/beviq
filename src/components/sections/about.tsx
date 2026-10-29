import { Section, SectionHeading } from "@/components/sections/primitives";

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
          <p>
            Nunca consegui largar um bom problema. O que mais me prende é o
            que ninguém vê, como os dados se organizam, como as partes
            conversam, o que segura um sistema de pé. No fim, tudo vira
            escolha entre trade-offs, e escolher bem é a parte de programar
            de que eu mais gosto.
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
    </Section>
  );
}
