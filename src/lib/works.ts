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
  /** hero em coluna única e sem recorte, para telas largas que precisam ser lidas */
  heroFull?: boolean;
  /** site no ar do cliente, se houver */
  liveUrl?: string;
  /** parágrafo de abertura da página do trabalho */
  intro?: string;
  /** imagens de destaque no topo da página */
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
    category: "Desenvolvimento de pessoas",
    location: "Brasília, Brasil",
    heroFull: true,
    liveUrl: "https://nuree.com.br",
    intro:
      "Consultoria que desenvolve pessoas, lideranças e negócios, e segue junto depois que a sala esvazia. O método é da casa. O trabalho foi dar casa ao método: identidade aplicada, site institucional e um sistema de gestão construído em cima dele.",
    hero: [
      {
        src: "/trabalhos/nuree/site.png",
        alt: "Abertura do site da Nuree com a chamada sobre excelência e o ipê ilustrado",
        width: 1588,
        height: 824,
      },
      {
        src: "/trabalhos/nuree/jardim.png",
        alt: "Tela de tarefas do sistema da Nuree na visão jardim, com o ciclo aberto",
        width: 1642,
        height: 958,
      },
    ],
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}
