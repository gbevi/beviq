# beviq design system

## Lane

Terminal-native, monocromático puro, ASCII, sem cor de acento. Chegamos aqui depois de descartar:
- Concretismo brasileiro (laranja barro + verde mata) — rejeitado pelo user
- Amber CRT — rejeitado pelo user na rodada seguinte
- Editorial-typographic (display serif + small mono labels) — pego no critique inicial como reflex saturado

Final: **fundo near-black + chars brancos + zero cor de acento**.

## Paleta (OKLCH)

```
--color-fundo:    oklch(0.13 0.005 240)  ≈ #0F1115   (near-black cool)
--color-linha:    oklch(0.88 0.008 240)  ≈ #DADCE0   (cool off-white, body)
--color-brasa:    oklch(0.78 0.008 240)  ≈ off-white secundário (alias)
--color-fosforo:  oklch(1 0 0)           ≈ #FFFFFF   (acento branco puro)
--color-poeira:   oklch(0.42 0.005 240)  ≈ muted gray (labels)
--color-vidro:    oklch(0.21 0.006 240)  ≈ surfaces
```

Scanline CRT sutil em `body::before` com `repeating-linear-gradient` + `mix-blend-mode: multiply`.

## Tipografia (next/font/google)

- **JetBrains Mono** — body, utility, labels (NÃO IBM Plex Mono / Space Mono, ambas no reflex-reject)
- **Doto** — display CRT bitmap-style (variable, usado no logo BEVIQ)
- **Bricolage Grotesque** — manifesto/sobre (única exceção mono — pra dar respiro de prosa)

Reflex-reject list aplicada: NÃO usar Fraunces, Inter, DM Sans, Instrument Sans/Serif, IBM Plex *, Space Mono/Grotesk, Geist, Big Shoulders.

## Nav

`<header className="fixed inset-x-0 top-0 z-50">` — completamente transparente. Itens da nav recebem `data-mask` e o canvas usa `getBoundingClientRect()` em cada um pra **pular** chars que cairiam nessas regiões. Os itens viram "vazios naturais" sobre a animação, sem fundo nem borda.

## Princípios de animação

### Não-negociáveis

1. **Tudo conectado, sempre.** Nenhuma fase começa do zero. Os MESMOS bits persistem entre todas as fases.
2. **0/1 são pixels.** Quanto mais bits, mais qualidade. As formas (BEVIQ, nós da rede neural) são construídas por densidade de pixels-char, não por fonte grande.
3. **Sempre em movimento.** Nunca há um frame estático. Mesmo "em repouso" os chars dançam com oscilação orgânica.
4. **Nav é artefato imutável.** Chars passam atrás. Itens (`fazer`, `obras`, `sobre`, `contato`) nunca têm chars sobre eles.

### Princípio dos bits-como-pixels (a mudança grande)

Errado: BEVIQ formado por 68 cells (5×29 bitmap), cada cell = 1 char grande. Letras ficam retangulares, sem qualidade. Mesma coisa pra rede neural — nó = 1 char ou sub-grid 3×3 = retângulo.

Certo: BEVIQ formado por **milhares** de chars-pixel pequenos. Bitmap de alta resolução amostrado num grid fino. Letras ganham curvas reais (V tem diagonal, Q tem círculo). Rede neural com nós **redondos** preenchidos por chars amostrados dentro do círculo.

## Narrativa do preloader (5 fases conectadas)

1. **field** — chars 0/1 dançam num campo matemático (hourglass via `sin/cos`, 2 spotlights em curva Lissajous, mouse cria gaussian bump). Itens da nav já visíveis com data-mask.
2. **falling** — click dispara explosão radial. Cada char tem física individual (massa, drag, gravidade, rotação próprios). Ripple branco no ponto de click. Chars com target são puxados pra positions do BEVIQ; chars sem target caem e somem.
3. **logo** — chars formam BEVIQ pelo bitmap. Bits são os 40 caracteres ASCII binário de "beviq" (`01100010 01100101 01110110 01101001 01110001`) + extras.
4. **transition** — linha horizontal → morfo dançante → rede neural ASCII (encoder/decoder formato diamante `[4, 10, 20, 20, 10, 4] = 68 nós`). Edges são chars ASCII (`· ─ │ ╱ ╲`) com pulso fluindo.
5. **done** — preloader some, site real revela.

## O que NÃO funcionou (lições)

- **Concretismo brasileiro** — laranja/verde rejeitado, não combinava com tech-vibe
- **Amber CRT** — laranja amber também rejeitado depois de testar
- **Streams paralelos no transition** (BFS / hash / merge sort / neural net em 4 lanes) — ficou bagunçado e desconexo
- **Tokens ASM intermediários** (`MOV ADD JMP XOR` no meio da timeline) — quebrou continuidade narrativa
- **Labels narrativos no canvas** (`// 1937 · bit. dois estados`) — ruído visual
- **Streams top/bottom durante a rede neural** — distração, removidos
- **Sub-grid 3×3 de chars dentro de pixel grande** — virou retângulo de 9 chars, baixa qualidade visual
- **Transição linha (chars pequenos) ↔ BEVIQ (chars grandes)** — quebra perceptível, "muda do nada"
- **Algoritmos procedurais separados** (não compartilham chars com BEVIQ) — sente desconexão

## O que funcionou

- **Field matemático** com ampulheta + 2 spotlights orbitando em Lissajous + mouse gaussian
- **Click ripple** com 2 anéis concêntricos brancos
- **Física individual** por char (mass/drag/gravity/rotation diferentes)
- **Spring-pull crescente** trazendo chars de volta pro BEVIQ
- **Bits ASCII binário "beviq"** como conteúdo dos caracteres (não seed random)
- **Formato diamante** `[4, 10, 20, 20, 10, 4]` da rede neural
- **Edges ASCII** com chars `· ─ │ ╱ ╲` por orientação + pulso fluindo
- **Nav `data-mask`** — itens viram vazios naturais
- **Cache de bevqList/layers** evitando filter+sort por frame
- **`fixed inset-0 z-40` no canvas + `z-50` na nav** — layering correto
