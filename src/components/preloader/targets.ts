import {
  samplePolarPoints,
  sampleTextPixels,
  type SampledPixel,
} from "@/lib/glyph-sampler";
import type { Profile } from "./profiles";
import type { Cell, NodeInfo } from "./types";

// Bits ASCII binário de "beviq" (ver DESIGN.md), usados como conteúdo dos chars.
export const BEVIQ_BIN = "0110001001100101011101100110100101110001";

// Rede neural em formato diamante encoder/decoder: [4, 10, 20, 20, 10, 4] = 68 nós.
export const LAYER_SIZES = [4, 10, 20, 20, 10, 4];
export const nLayers = LAYER_SIZES.length;
export const maxLayerSize = 20;
export const layerStart: number[] = [];
{
  let cum = 0;
  for (const s of LAYER_SIZES) {
    layerStart.push(cum);
    cum += s;
  }
}
export const TOTAL_NODES = LAYER_SIZES.reduce((a, b) => a + b, 0);

export type TargetsResult = {
  bevPixels: SampledPixel[];
  bevWidth: number;
  bevHeight: number;
  bevStartX: number;
  bevStartY: number;
  netNodes: NodeInfo[];
};

export function computeTargets(
  profile: Profile,
  dotoFamily: string,
): TargetsResult {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const targetWidth = w * profile.bevTargetWidthRatio;
  const fontStack = `${dotoFamily}, "JetBrains Mono", ui-monospace, monospace`;

  let bevFontSize = Math.min(w * 0.18, h * 0.42);
  bevFontSize = Math.max(48, bevFontSize);

  let sample = sampleTextPixels({
    text: "BEVIQ",
    fontFamily: fontStack,
    fontWeight: 900,
    fontSize: bevFontSize,
    pixelStep: profile.bevPixelStep,
    charPattern: BEVIQ_BIN,
  });

  if (sample.width > 0) {
    const scale = targetWidth / sample.width;
    bevFontSize = Math.max(40, Math.min(h * 0.6, bevFontSize * scale));
    sample = sampleTextPixels({
      text: "BEVIQ",
      fontFamily: fontStack,
      fontWeight: 900,
      fontSize: bevFontSize,
      pixelStep: profile.bevPixelStep,
      charPattern: BEVIQ_BIN,
    });
  }

  const bevPixels = sample.pixels;
  const bevWidth = sample.width;
  const bevHeight = sample.height;
  const bevStartX = (w - bevWidth) / 2;
  const bevStartY = (h - bevHeight) / 2;

  const netStartX = w * profile.netStartXRatio;
  const netWidth = w * profile.netWidthRatio;
  const netLayerSpacing = netWidth / (nLayers - 1);
  const netCenterY = h * 0.5;

  const netNodes: NodeInfo[] = [];
  for (let li = 0; li < nLayers; li++) {
    const ls = LAYER_SIZES[li];
    const layerX = netStartX + li * netLayerSpacing;
    const sizeRatio = ls / maxLayerSize;
    const localH = profile.netHeightPx * (0.32 + 0.68 * sizeRatio);
    for (let p = 0; p < ls; p++) {
      const yFrac = ls === 1 ? 0.5 : p / (ls - 1);
      const nodeIdx = layerStart[li] + p;
      netNodes.push({
        cx: layerX,
        cy: netCenterY + (yFrac - 0.5) * localH,
        nodeIdx,
        bit: nodeIdx % 2 === 0 ? "0" : "1",
      });
    }
  }

  return { bevPixels, bevWidth, bevHeight, bevStartX, bevStartY, netNodes };
}

export function assignTargets(
  cells: Cell[],
  profile: Profile,
  bevPixels: SampledPixel[],
  bevStartX: number,
  bevStartY: number,
  netNodes: NodeInfo[],
  nodeIntensities: number[],
) {
  for (const c of cells) {
    c.targetIdx = -1;
    c.nodeIdx = -1;
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h / 2;
  const sorted = cells.slice().sort((a, b) => {
    const sa = a.intensity * 1100 - Math.hypot(a.x - cx, a.y - cy);
    const sb = b.intensity * 1100 - Math.hypot(b.x - cx, b.y - cy);
    return sb - sa;
  });

  const n = Math.min(bevPixels.length, sorted.length);
  const pixelsForCells: SampledPixel[] = new Array(n);
  if (bevPixels.length === n) {
    for (let i = 0; i < n; i++) pixelsForCells[i] = bevPixels[i];
  } else {
    const stride = bevPixels.length / n;
    for (let i = 0; i < n; i++) {
      pixelsForCells[i] = bevPixels[Math.floor(i * stride)];
    }
  }

  const charsPerNode = Math.max(1, Math.floor(n / TOTAL_NODES));
  const netPositions: { x: number; y: number; nodeIdx: number }[] = [];
  for (let ni = 0; ni < TOTAL_NODES; ni++) {
    const node = netNodes[ni];
    const polar = samplePolarPoints(
      node.cx,
      node.cy,
      profile.nodeRadius,
      charsPerNode,
    );
    for (let pi = 0; pi < polar.length; pi++) {
      netPositions.push({
        x: polar[pi].x,
        y: polar[pi].y,
        nodeIdx: ni,
      });
    }
  }
  while (netPositions.length < n) {
    const node = netNodes[netPositions.length % TOTAL_NODES];
    const p = samplePolarPoints(node.cx, node.cy, profile.nodeRadius, 1)[0];
    netPositions.push({ x: p.x, y: p.y, nodeIdx: node.nodeIdx });
  }

  nodeIntensities.length = 0;
  for (let ni = 0; ni < TOTAL_NODES; ni++) {
    const h0 = Math.abs(Math.sin(ni * 91.13 + 17.5));
    const fr = h0 - Math.floor(h0);
    nodeIntensities.push(fr > 0.58 ? 0.95 : 0.32);
  }

  for (let i = 0; i < n; i++) {
    const cell = sorted[i];
    const bev = pixelsForCells[i];
    cell.targetIdx = i;
    cell.targetX = bevStartX + bev.x;
    cell.targetY = bevStartY + bev.y;
    cell.targetChar = bev.char;

    const np = netPositions[i];
    cell.netTargetX = np.x;
    cell.netTargetY = np.y;
    cell.nodeIdx = np.nodeIdx;
  }
}
