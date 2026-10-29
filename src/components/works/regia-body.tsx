import { WorkShot } from "@/components/works/work-shot";

const intro =
  "Encaminhamento ambulatorial volta quando falta dado ou quando o caso não segue a Nota Técnica. O reg.IA conversa com o profissional antes disso: pergunta o que falta, valida o quadro e classifica o caso como pendente, finalizado ou não elegível.";

const casosCopy =
  "Dois casos. Hipertensão resistente a três drogas, com sinal de lesão em órgão-alvo: encaminhamento validado e classificado por risco. Uma pinta antiga, pequena e regular: o sistema não encaminha e sugere a conduta na atenção primária.";

const arquiteturaCopy =
  "Por trás, um agente por especialidade: cardiologia, dermatologia e endocrinologia. A cada mensagem, o RAG busca no pgvector até três trechos das Notas Técnicas, em vez de colar o documento inteiro no prompt. As respostas saem de uma cascata de LLMs pelo OpenRouter, que passa ao próximo modelo quando um falha ou devolve lixo.";

const redesenhoCopy =
  "Minha parte mais visível foi redesenhar o front-end como reg.IA, junto com a migração para TypeScript, Tailwind e shadcn. A paleta saiu amostrada pixel a pixel da capa do material do curso. Duas medições mudaram o desenho: o dourado da marca e o amarelo de risco eram a mesma cor a olho nu, e sob daltonismo o vermelho e o verde de risco viravam o mesmo oliva. A ação ficou azul, e todo selo de risco passou a ter cor, rótulo e forma.";

const vozesCopy =
  "Três vozes tipográficas, com uma regra só: serifada é o que o sistema diz, sem serifa é o que o profissional digita, mono é o que vai para o SISREG.";

const proseClass = "text-xl leading-relaxed text-linha/85";

export function RegiaBody() {
  return (
    <div className="mt-16 md:mt-24">
      <p className={`max-w-md ${proseClass}`}>{intro}</p>

      {/* casos: as duas conversas empilhadas à esquerda + texto à direita */}
      <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-12">
        <div className="space-y-4 md:col-span-7 md:col-start-1 md:space-y-6">
          <WorkShot
            src="/trabalhos/regia/cardiologia.png"
            alt="Conversa em que o reg.IA valida um encaminhamento para cardiologia e classifica o risco como amarelo"
            ratio="1198 / 412"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
          <WorkShot
            src="/trabalhos/regia/dermatologia.png"
            alt="Conversa em que o reg.IA não indica encaminhamento para dermatologia e sugere conduta na atenção primária"
            ratio="1207 / 382"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
        </div>
        <p className={`md:col-span-4 md:col-start-9 md:self-center ${proseClass}`}>
          {casosCopy}
        </p>
      </div>

      {/* arquitetura: diagrama em largura total + legenda curta */}
      <div className="mt-24 md:mt-32">
        <WorkShot
          src="/trabalhos/regia/arquitetura.png"
          alt="Diagrama da arquitetura: chat web e WhatsApp chegam ao backend, que aciona o agente da especialidade, o RAG com pgvector e embeddings, e a cascata de LLMs"
          ratio="2352 / 1101"
          sizes="100vw"
        />
        <p className={`mt-8 max-w-2xl md:mt-10 ${proseClass}`}>
          {arquiteturaCopy}
        </p>
      </div>

      {/* redesenho: o que eu fiz no projeto */}
      <div className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-12">
        <p className={`md:col-span-7 md:col-start-1 ${proseClass}`}>
          {redesenhoCopy}
        </p>
        <p
          className={`md:col-span-4 md:col-start-9 md:self-end text-linha/60 ${proseClass}`}
        >
          {vozesCopy}
        </p>
      </div>
    </div>
  );
}
