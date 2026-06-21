import { ImageComparison } from "@/components/works/image-comparison";
import { WorkCarousel } from "@/components/works/work-carousel";
import { WorkVideo } from "@/components/works/work-video";

const intro =
  "O ponto de partida: um site feito por IA. Fonte genérica, estrutura genérica, o padrão que o mercado já cansou de ver. Ficamos com o que importava, os dias e o método, e refizemos o resto à mão. Pra um público de mulheres em travessia terapêutica, imagem e prosa, pra sentir antes de explicar.";

const hoverCopy =
  "As fotos não ficam paradas: o mouse passa, elas respondem. Imagem por toda parte, da hero às frases de impacto. Os caminhos que se percorre com os pés e com a alma.";

const modalCopy =
  "No lugar do formulário frio, um diagnóstico curto. Calibrado com elas, duas psicólogas. Pra cada mulher reconhecer o seu momento de caminhar.";

const antesCopy =
  "Antes, só texto e tabela: nenhuma foto, nenhum vídeo, nada pra sentir. Um produto que vende um caminho pede mais. Arrasta e compara: a rota ganha vida, etapa por etapa no mapa.";

const conviteCopy =
  "Eram quatro telas quase iguais, uma por estação. Viraram uma só: escolher o seu momento. Primavera, verão, outono. Deixar ir, expandir, florescer. E o site passou a falar três línguas.";

const proseClass = "text-xl leading-relaxed text-linha/85";

export function UltreyaBody() {
  return (
    <div className="mt-16 md:mt-24">
      {/* abertura: coluna estreita à esquerda (Figma 3:403) */}
      <p className={`max-w-md ${proseClass}`}>{intro}</p>

      {/* fotos (hover): vídeo à esquerda + texto à direita */}
      <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7 md:col-start-1">
          <WorkVideo name="ultreya-hover" ratio="1836 / 1026" />
        </div>
        <p className={`md:col-span-4 md:col-start-9 md:self-center ${proseClass}`}>
          {hoverCopy}
        </p>
      </div>

      {/* diagnóstico (modal): texto à esquerda + vídeo à direita */}
      <div className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-12">
        <p
          className={`order-2 md:order-1 md:col-span-4 md:col-start-1 md:self-center ${proseClass}`}
        >
          {modalCopy}
        </p>
        <div className="order-1 md:order-2 md:col-span-7 md:col-start-6">
          <WorkVideo name="ultreya-modal" ratio="1836 / 1026" />
        </div>
      </div>

      {/* antes/depois: imagem do site antigo ↔ vídeo da jornada (no lugar do vídeo) */}
      <div className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7 md:col-start-1">
          <ImageComparison
            beforeImage="/trabalhos/ultreya/antes-dias.png"
            afterVideo="ultreya-mapa"
            altBefore="Seção da jornada no site anterior, feito por IA"
            altAfter="Seção da jornada redesenhada pela beviq, com a rota animada no mapa"
            ratio="1836 / 1026"
          />
        </div>
        <p className={`md:col-span-4 md:col-start-9 md:self-center ${proseClass}`}>
          {antesCopy}
        </p>
      </div>

      {/* fechamento: texto curto + carrossel com as 3 mídias finais */}
      <div className="mt-24 md:mt-32">
        <p className={`max-w-md ${proseClass}`}>{conviteCopy}</p>
        <WorkCarousel
          className="mt-10 md:mt-14"
          ratio="1836 / 1026"
          slides={[
            {
              type: "video",
              name: "ultreya-translation",
              alt: "Site da Ultreya com a troca de idioma",
            },
            {
              type: "video",
              name: "ultreya-componente",
              alt: "Componente de estações do site da Ultreya",
            },
            {
              type: "image",
              src: "/trabalhos/ultreya/shot-3.png",
              alt: "Tela do site da Ultreya com a página de Santiago de Compostela",
            },
            {
              type: "image",
              src: "/trabalhos/ultreya/shot-4.png",
              alt: "Tela do site da Ultreya com a seção sobre os caminhos",
            },
          ]}
        />
      </div>
    </div>
  );
}
