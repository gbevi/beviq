# beviq

Estúdio solo de Gabriel Bevilaqua. Vende quatro tipos de trabalho pra empresas B2B brasileiras.

## POV

"Instrumentos que se dobram ao seu uso." Um interlocutor, um cronograma, um valor combinado. Sem corredor de aprovação, sem reunião pra resumir reunião.

## Produtos

Quatro linhas de trabalho, todas com pricing combinado caso a caso. Listadas na seção `fazer` (componente `capabilities.tsx`).

### 01 sistemas sob medida

Sites institucionais, ferramentas internas, web apps, painéis, SaaS pequenos, MVPs. Automação operacional cai aqui (é sistema com menos UI). Construído à mão, calibrado caso a caso, feito para ser herdado.

### 02 núcleos

Agentes de IA específicos, embutidos num sistema. Voz, função e limites calibrados para a casa. Nome próprio ("núcleo") pra se distanciar do registro genérico de "agente IA" do mercado.

### 03 resgate

Sistema que já existe e precisa de mão profissional. Site, SaaS, automação, app — qualquer coisa. A operação continua enquanto o código volta ao lugar. Ponto único do brand.

### 04 manutenção contínua

Cuidado mensal do sistema em operação. Atualizar, ajustar, prevenir. Um valor combinado por mês, um interlocutor. Recurring revenue separado do resgate por decisão estratégica.

## Voz das descrições

Princípios validados em sessão de brainstorming:

- **Não** usar em-dash (`—`) na copy
- **Não** fazer afirmações soltas, comparações ou ataques a concorrente
- **Não** tentar vender — descrever calmamente o que existe
- Frases curtas, ritmo enxuto, última linha de cada bloco respira
- Lowercase consistente em body e bullets
- Tooling concreto em bullets (next.js, anthropic) é OK porque é factual
- Palavra-chave do tom: **elegância**. Confiança + quietude

## Público

Empresas B2B brasileiras precisando de:

- Sites institucionais e ferramentas funcionais
- Agentes de IA específicos pra um problema do negócio
- Resgate de sistema existente
- Cuidado contínuo de operação

## Inspirações citadas

- **aino.agency** — narrativa contínua no preloader, itens da nav como "artefato imutável", tom calmo e editorial

## Idioma

Português apenas (PT-BR). Copy em minúsculas pra reforçar voz autoral.

## Stack

- Next.js 16 + TypeScript + App Router
- Tailwind v4 com tokens OKLCH
- Canvas 2D (sem 3D/R3F)
- next/font: JetBrains Mono + Doto + Bricolage Grotesque + Familjen Grotesk (em teste)

## Tipografia (em iteração)

Roles atuais:

- **font-logo** → Doto (logo "beviq" na nav)
- **font-mono** → JetBrains Mono (header, boot-log, inventário de obras)
- **font-display / font-prose / font-body** → Familjen Grotesk (em teste — humanista sueco)

Famílias testadas e rejeitadas: Ease Geometric A TRIAL (substituída por gratuitas), Newsreader (editorial demais), Khand (geométrico narrow demais), Bricolage solo (humanista demais), Funnel Display ("até vai" mas não fechou).

## Estrutura do site

1. **Preloader** (canvas, fases: field → falling → BEVIQ logo → done). Fase `transition` (rede neural + landscape ASCII) preservada no código mas desativada por decisão.
2. **Hero** — manifesto + boot log
3. **Fazer** — quatro produtos (sistemas / núcleos / resgate / manutenção contínua)
4. **Obras** — 3 cases destacados com vídeos + inventário em lista
   - 001 m. (2026) — repaginação institucional, 2 vídeos
   - 002 c. (2025) — sistema de gestão de contratos
   - 003 c. (2025) — ensaio de núcleo / governança queryable (montado em obsidian)
5. **Sobre** — manifesto longo
6. **Contato** — email gigante

## Cases conhecidos

- **midlej (m.)** — site institucional repaginado, 3D + tipografia + elegância
- **claraval (c.)** — sistema interno de gestão de contratos, feature de medidas estratégicas + okrs + tarefas
- **ensaio (c.)** — demonstração do princípio dos núcleos via graph view de Obsidian

Nomes anonimizados por inicial até confirmação de autorização com clientes.

## Aprendizados acumulados

- **Animações** (preloader): 0/1 são pixels de bitmap, não caracteres. Densidade alta de fonte pequena. Continuidade total entre fases (mesmos chars persistem). Detalhes em [feedback-pixels-as-bits](memory) e [feedback-animation-continuity](memory).
- **Header skip**: click em qualquer pixel do `<header>` pula a animação inteira pra `done`, libera scroll síncrono, browser navega pro anchor. Keyboard (Enter em link focado) também pula.
- **Vídeos**: `.mp4` + `.webm` + `poster.jpg` no frame 0, `autoplay loop muted playsInline preload="auto"`, com `useEffect` defensivo chamando `play()` no mount pra cobrir browsers que recusam autoplay silenciosamente.
- **Auditoria** como produto: rejeitada. "Besteira."
- **Agente IA** como termo genérico: rejeitado. Adotado **núcleo**.
- **Pricing fixo / pacotes**: rejeitado. Sempre "valor combinado caso a caso".

## Arquivos de referência

- `src/app/layout.tsx` — fontes via next/font
- `src/app/globals.css` — tokens OKLCH + variáveis `--font-*`
- `src/components/nav.tsx` — header com `font-mono`, logo em `font-logo`
- `src/components/preloader.tsx` — canvas das 4 fases
- `src/components/sections/capabilities.tsx` — produtos (`fazer`)
- `src/components/sections/selected-work.tsx` — obras destacadas + inventário
- `DESIGN.md` — sistema de design completo
