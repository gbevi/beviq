# @beviq/ui

Componentes de UI da beviq. Modelo copy-paste (shadcn-style): o único consumidor é o site no mesmo monorepo, via `workspace:*`. Nada é publicado no npm.

## Componentes

- `AsciiSimulation` — cena 3D renderizada como ASCII (canvas R3F + AsciiEffect). Tem fallback de árvore procedural ou aceita um `modelPath` glTF.
- `SafeAsciiRenderer` — o renderer ASCII genérico, reutilizável, que monta o `AsciiEffect` sobre o canvas do R3F.
- `ProceduralTree` — geometria procedural da árvore (tronco, galhos, folhas) com sway orgânico.

## Uso

```tsx
import { AsciiSimulation } from "@beviq/ui";

<AsciiSimulation className="h-full w-full" />;
```

## Peer dependencies

`react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei` vêm do app consumidor (instância única de `three` / reconciler do R3F). O Next compila o source via `transpilePackages: ["@beviq/ui"]`.
