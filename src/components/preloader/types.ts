import type { Profile } from "./profiles";

export type Cell = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  rot: number;
  mass: number;
  drag: number;
  gravityMult: number;
  char: string;
  intensity: number;
  targetIdx: number;
  targetX: number;
  targetY: number;
  targetChar: string;
  netTargetX: number;
  netTargetY: number;
  nodeIdx: number;
};

export type Phase = "field" | "falling" | "logo" | "transition" | "done";
export type MaskRect = { left: number; right: number; top: number; bottom: number };
export type NodeInfo = { cx: number; cy: number; nodeIdx: number; bit: string };
export type ClickInfo = { x: number; y: number; t: number };

// Shared per-frame context handed to each phase renderer. The mutable state
// (cells, netNodes, nodeIntensities, ...) is created once in the Preloader
// effect and threaded through every phase, so the SAME bits persist across
// phases (see DESIGN.md: "Tudo conectado, sempre").
export type FrameCtx = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  now: number;
  t: number;
  phaseStart: number;
  profile: Profile;
  cells: Cell[];
  mouse: { x: number; y: number };
  monoFamily: string;
  pixelFont: string;
  maskMargin: number;
  inMask: (x: number, y: number, margin: number) => boolean;
  clickInfo: ClickInfo | null;
  netNodes: NodeInfo[];
  nodeIntensities: number[];
  cachedBevqList: Cell[] | null;
};
