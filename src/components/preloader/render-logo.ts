import type { FrameCtx } from "./types";

export function renderLogo(f: FrameCtx) {
  const { ctx, now, phaseStart, cells, profile, monoFamily, inMask, maskMargin } = f;
  const elapsed = (now - phaseStart) / 1000;
  const fadeOut =
    elapsed > 2.55 ? Math.max(0, 1 - (elapsed - 2.55) / 0.45) : 1;
  const flickerTick = Math.floor(elapsed * 4);

  // Fonte do logo: casa com o pixelStep do sampler pra não ter overlap
  const logoFontPx = Math.max(3, profile.bevPixelStep + 1);
  ctx.font = `${logoFontPx}px ${monoFamily}`;

  for (const c of cells) {
    if (c.targetIdx < 0) continue;
    c.x += (c.targetX - c.x) * 0.28;
    c.y += (c.targetY - c.y) * 0.28;
    c.vx *= 0.5;
    c.vy *= 0.5;
    c.rot *= 0.85;

    const pulse =
      (Math.sin(elapsed * 1.8 + c.targetIdx * 0.05) + 1) / 2;
    const alpha =
      (0.75 + pulse * 0.25) * fadeOut * Math.min(1, elapsed * 2);
    if (alpha < 0.05) continue;
    if (inMask(c.x, c.y, maskMargin)) continue;

    const seed = (c.targetIdx * 7 + flickerTick) % 13;
    const drawChar =
      seed < 11 ? c.targetChar : c.targetChar === "0" ? "1" : "0";
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillText(drawChar, c.x, c.y);
  }
}
