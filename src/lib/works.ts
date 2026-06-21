export type WorkImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Work = {
  slug: string;
  /** índice exibido na lista, ex. "001" */
  id: string;
  /** nome do projeto, ex. "ULTREYA" */
  title: string;
  /** categoria/setor, ex. "Wellness" */
  category: string;
  /** praça de atuação, ex. "Brasília, Brasil" */
  location: string;
  /** projeto existe mas ainda em construção: listado apagado e sem link */
  wip?: boolean;
  /** site no ar do cliente, se houver */
  liveUrl?: string;
  /** parágrafo de abertura da página do trabalho */
  intro?: string;
  /** par de imagens de destaque no topo da página */
  hero?: WorkImage[];
};

export const works: Work[] = [
  {
    slug: "ultreya",
    id: "001",
    title: "ULTREYA",
    category: "Wellness",
    location: "Brasília, Brasil",
    liveUrl: "https://ultreyajornada.com.br",
    intro:
      "Caminhadas femininas pelo Caminho de Santiago. A Ultreya leva grupos de mulheres pela rota a pé, unindo o trajeto a um trabalho de condução terapêutica.",
    hero: [
      {
        src: "/trabalhos/ultreya/hero-1.png",
        alt: "Página inicial do site da Ultreya com o título sobre o Caminho de Santiago",
        width: 1908,
        height: 1023,
      },
      {
        src: "/trabalhos/ultreya/hero-2.png",
        alt: "Seção do site da Ultreya apresentando as etapas do percurso",
        width: 1906,
        height: 1029,
      },
    ],
  },
  {
    slug: "dode",
    id: "002",
    title: "DôDe",
    category: "Gaming",
    location: "Brasília, Brasil",
    wip: true,
  },
  {
    slug: "nuree",
    id: "003",
    title: "Nuree",
    category: "Wellness",
    location: "Brasília, Brasil",
    wip: true,
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}
