export type Profile = {
  cellW: number;
  cellH: number;
  pixelFontPx: number;
  bevPixelStep: number;
  bevTargetWidthRatio: number;
  nodeRadius: number;
  netStartXRatio: number;
  netWidthRatio: number;
  netHeightPx: number;
  edgeStepPx: number;
};

export function profileFor(w: number, h: number): Profile {
  if (w < 768) {
    return {
      cellW: 11,
      cellH: 15,
      pixelFontPx: 8,
      bevPixelStep: 3,
      bevTargetWidthRatio: 0.82,
      nodeRadius: 9,
      netStartXRatio: 0.04,
      netWidthRatio: 0.92,
      netHeightPx: Math.min(h * 0.5, 320),
      edgeStepPx: 18,
    };
  }
  if (w < 1280) {
    return {
      cellW: 14,
      cellH: 19,
      pixelFontPx: 9,
      bevPixelStep: 4,
      bevTargetWidthRatio: 0.66,
      nodeRadius: 12,
      netStartXRatio: 0.08,
      netWidthRatio: 0.84,
      netHeightPx: Math.min(h * 0.6, 420),
      edgeStepPx: 22,
    };
  }
  return {
    cellW: 18,
    cellH: 24,
    pixelFontPx: 10,
    bevPixelStep: 4,
    bevTargetWidthRatio: 0.52,
    nodeRadius: 14,
    netStartXRatio: 0.12,
    netWidthRatio: 0.76,
    netHeightPx: Math.min(h * 0.62, 460),
    edgeStepPx: 26,
  };
}
