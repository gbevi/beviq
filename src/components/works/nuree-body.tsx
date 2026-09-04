import { WorkCarousel } from "@/components/works/work-carousel";
import { WorkShot } from "@/components/works/work-shot";
import { WorkVideo } from "@/components/works/work-video";

const intro =
  "O trabalho veio em três frentes, nessa ordem: marca, site, sistema. A marca primeiro, porque as outras duas se apoiam nela.";

const sistemaCopy =
  "A Nuree já trabalhava com método ágil, gerenciamento pelas diretrizes, OKRs, rotinas e planos de ação, cada disciplina em uma ferramenta diferente. O sistema juntou as cinco em uma base só. O vocabulário veio do método, não do software: ciclo no lugar de sprint, jardim no lugar de backlog, sementeira, colheita. A mesma base tem quatro visões: jardim, kanban, lista e calendário.";

const specsCopy =
  "As telas foram desenhadas antes, no Figma. Desktop e mobile lado a lado, os overlays de filtro e de novo ciclo, os estados vazios. O que ficou na prancha é o que entrou no código.";

const authCopy =
  "A marca saiu num style tile antes de qualquer tela: cor, tipografia, grid pela sequência de Fibonacci, componentes e um jardim vetorial inteiro, desenhado com pincelada em vez de preenchimento. O jardim não ficou preso à identidade. Ele entrou no produto, e é a primeira coisa que se vê ao entrar.";

const adminCopy =
  "Atrás do app existe um console de administração: empresas, programas, ciclos, usuários, formulários, jornadas e trilhas. Multiempresa desde o começo, porque a Nuree atende várias empresas ao mesmo tempo e o dado de uma não encosta no da outra. Está em operação, com os ciclos reais da casa rodando dentro.";

const proseClass = "text-xl leading-relaxed text-linha/85";

export function NureeBody() {
  return (
    <div className="mt-16 md:mt-24">
      {/* abertura: coluna estreita à esquerda, mesmo compasso da ultreya */}
      <p className={`max-w-md ${proseClass}`}>{intro}</p>

      {/* sistema: texto à esquerda + vídeo das quatro visões à direita */}
      <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-12">
        <p
          className={`order-2 md:order-1 md:col-span-4 md:col-start-1 md:self-center ${proseClass}`}
        >
          {sistemaCopy}
        </p>
        <div className="order-1 md:order-2 md:col-span-7 md:col-start-6">
          <WorkVideo name="nuree-sistema" ratio="1642 / 958" />
        </div>
      </div>

      {/* desenho: prancha de specs à esquerda + texto à direita */}
      <div className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7 md:col-start-1">
          <WorkShot
            src="/trabalhos/nuree/specs.png"
            alt="Prancha de especificação das telas de tarefas da Nuree, em desktop, mobile e overlays"
            ratio="900 / 885"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
        </div>
        <p className={`md:col-span-4 md:col-start-9 md:self-center ${proseClass}`}>
          {specsCopy}
        </p>
      </div>

      {/* entrada: faixa larga com as telas de auth + legenda curta */}
      <div className="mt-24 md:mt-32">
        <WorkShot
          src="/trabalhos/nuree/auth.png"
          alt="Telas de entrada da Nuree em desktop e mobile, com login e confirmação por código"
          ratio="1052 / 340"
          sizes="100vw"
        />
        <p className={`mt-8 max-w-md md:mt-10 ${proseClass}`}>{authCopy}</p>
      </div>

      {/* fechamento: texto curto + carrossel com as telas do produto */}
      <div className="mt-24 md:mt-32">
        <p className={`max-w-md ${proseClass}`}>{adminCopy}</p>
        <WorkCarousel
          className="mt-10 md:mt-14"
          ratio="1642 / 958"
          slides={[
            {
              type: "image",
              src: "/trabalhos/nuree/kanban.png",
              alt: "Visão kanban do sistema da Nuree, com as colunas a fazer, fazendo e feita",
            },
            {
              type: "image",
              src: "/trabalhos/nuree/calendario.png",
              alt: "Visão calendário do sistema da Nuree, com as tarefas sem prazo na lateral",
            },
            {
              type: "image",
              src: "/trabalhos/nuree/admin.png",
              alt: "Painel administrativo da Nuree com a lista de empresas, programas e usuários",
            },
          ]}
        />
      </div>
    </div>
  );
}
