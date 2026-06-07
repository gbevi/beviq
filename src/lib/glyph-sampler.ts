export type SampledPixel = { x: number; y: number; char: string };

export type TextSampleResult = {
  pixels: SampledPixel[];
  width: number;
  height: number;
};

export type TextSampleOptions = {
  text: string;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: number;
  pixelStep: number;
  charPattern: string;
  alphaThreshold?: number;
};

export function sampleTextPixels(opts: TextSampleOptions): TextSampleResult {
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    pixelStep,
    charPattern,
    alphaThreshold = 96,
  } = opts;

  if (typeof document === "undefined") {
    return { pixels: [], width: 0, height: 0 };
  }

  const off = document.createElement("canvas");
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { pixels: [], width: 0, height: 0 };

  const fontStr = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = fontStr;
  const measured = ctx.measureText(text);
  const ascent = measured.actualBoundingBoxAscent || fontSize * 0.82;
  const descent = measured.actualBoundingBoxDescent || fontSize * 0.22;

  const padX = 6;
  const padY = 4;
  const w = Math.max(1, Math.ceil(measured.width) + padX * 2);
  const h = Math.max(1, Math.ceil(ascent + descent) + padY * 2);

  off.width = w;
  off.height = h;

  ctx.font = fontStr;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, padX, padY + ascent);

  let img: ImageData;
  try {
    img = ctx.getImageData(0, 0, w, h);
  } catch {
    return { pixels: [], width: w, height: h };
  }
  const data = img.data;

  const step = Math.max(1, Math.floor(pixelStep));
  const pixels: SampledPixel[] = [];
  let counter = 0;
  const cp = charPattern.length > 0 ? charPattern : "01";

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > alphaThreshold) {
        pixels.push({ x, y, char: cp[counter % cp.length] });
        counter++;
      }
    }
  }

  return { pixels, width: w, height: h };
}

export function samplePolarPoints(
  cx: number,
  cy: number,
  radius: number,
  count: number,
): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * radius;
    const theta = Math.random() * Math.PI * 2;
    out.push({ x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r });
  }
  return out;
}

export function resolveFontFamilyVar(varName: string, fallback: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return fallback;
  }
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return v || fallback;
}
