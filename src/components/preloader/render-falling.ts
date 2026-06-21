import type { FrameCtx } from "./types";

export function renderFalling(f: FrameCtx) {
  const { ctx, W, H, now, phaseStart, cells, inMask, maskMargin, clickInfo } = f;
  const elapsed = (now - phaseStart) / 1000;

  for (const c of cells) {
    if (c.targetIdx >= 0) {
      const progress = Math.min(1, elapsed / 1.7);
      const pull = progress * progress * 0.16;
      const dx = c.targetX - c.x;
      const dy = c.targetY - c.y;

      c.vx += (dx * pull) / c.mass;
      c.vy +=
        (dy * pull) / c.mass + 0.42 * c.gravityMult * (1 - progress);
      const damp = 0.86 + (1 - progress) * 0.09;
      c.vx *= damp;
      c.vy *= damp;
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vr * 0.045 * (1 - progress);
      c.rot *= 0.93;

      if (inMask(c.x, c.y, maskMargin)) continue;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const closeT = Math.max(0, Math.min(1, 1 - dist / 180));
      const drawChar = closeT > 0.5 ? c.targetChar : c.char;
      const alpha = Math.max(0.5, Math.min(1, c.intensity + 0.2));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillText(drawChar, 0, 0);
      ctx.restore();
    } else {
      c.vy += 0.42 * c.gravityMult;
      c.vx *= c.drag;
      c.vy *= c.drag;
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vr * 0.045;

      const fadeAlpha = Math.max(0, c.intensity - elapsed * 0.65);
      if (
        fadeAlpha > 0.04 &&
        c.y < H + 120 &&
        c.x > -120 &&
        c.x < W + 120 &&
        !inMask(c.x, c.y, maskMargin)
      ) {
        ctx.fillStyle = `rgba(255,255,255,${fadeAlpha})`;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillText(c.char, 0, 0);
        ctx.restore();
      }
    }
  }

  if (
    clickInfo &&
    Number.isFinite(clickInfo.x) &&
    Number.isFinite(clickInfo.y)
  ) {
    // RAF's `now` is the vsync timestamp, which can land BEFORE the
    // click event's performance.now() within the same frame. Clamp so
    // Chrome doesn't throw IndexSizeError on a negative arc radius.
    const ce = Math.max(0, (now - clickInfo.t) / 1000);
    if (ce < 1 && Number.isFinite(ce)) {
      const r1 = Math.max(0, ce * 720);
      const a1 = Math.max(0, (1 - ce) * 0.85);
      ctx.strokeStyle = `rgba(255,255,255,${a1})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(clickInfo.x, clickInfo.y, r1, 0, Math.PI * 2);
      ctx.stroke();

      const r2 = Math.max(0, ce * 1180);
      const a2 = Math.max(0, (1 - ce) * 0.35);
      ctx.strokeStyle = `rgba(255,255,255,${a2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(clickInfo.x, clickInfo.y, r2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
