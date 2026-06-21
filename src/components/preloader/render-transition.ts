import { LAYER_SIZES, layerStart, nLayers } from "./targets";
import type { FrameCtx } from "./types";

export function renderTransition(f: FrameCtx) {
  const {
    ctx,
    W,
    H,
    now,
    phaseStart,
    profile,
    monoFamily,
    pixelFont,
    inMask,
    maskMargin,
    netNodes,
    nodeIntensities,
    cachedBevqList,
  } = f;
  const elapsed = (now - phaseStart) / 1000;
  const totalDur = 10.0;
  const fadeIn = Math.min(1, elapsed / 0.3);
  const fadeOut =
    elapsed > totalDur - 0.6
      ? Math.max(0, 1 - (elapsed - (totalDur - 0.6)) / 0.6)
      : 1;
  const alpha = fadeIn * fadeOut;

  const bevqList = cachedBevqList ?? [];
  const N = bevqList.length;
  if (N === 0) return;

  const ss = (tt: number) => tt * tt * (3 - 2 * tt);

  // Morph BEVIQ -> net positions (0..2s), then drift continuously to the left
  const morphDur = 2.0;
  const morphE = ss(Math.min(1, elapsed / morphDur));

  const driftStart = 1.0;
  const driftEndAt = totalDur - 0.4;
  const driftDistance = W * 1.05;
  const driftRaw =
    elapsed > driftStart
      ? ((elapsed - driftStart) / (driftEndAt - driftStart)) *
        driftDistance
      : 0;
  const drift = Math.max(0, Math.min(driftDistance, driftRaw));

  // Cell positions
  for (const c of bevqList) {
    const fromX = c.targetX;
    const fromY = c.targetY;
    const toX = c.netTargetX - drift;
    const toY = c.netTargetY;
    let tx = fromX + (toX - fromX) * morphE;
    let ty = fromY + (toY - fromY) * morphE;
    const danceAmp = 2.2;
    tx += Math.sin(elapsed * 1.7 + c.targetIdx * 0.33) * danceAmp;
    ty +=
      Math.cos(elapsed * 2.1 + c.targetIdx * 0.27) * danceAmp * 0.7;
    c.x += (tx - c.x) * 0.25;
    c.y += (ty - c.y) * 0.25;
  }

  // ── Edges between drifted node centers ───────────────────
  if (morphE > 0.2 && netNodes.length > 0) {
    const edgeReveal = Math.min(1, (morphE - 0.2) / 0.35);
    const flow = (elapsed * 1.6) % 1;
    const edgeFontPx = Math.max(10, profile.pixelFontPx + 2);
    ctx.font = `${edgeFontPx}px ${monoFamily}`;

    for (let li = 0; li < nLayers - 1; li++) {
      const startA = layerStart[li];
      const sizeA = LAYER_SIZES[li];
      const startB = layerStart[li + 1];
      const sizeB = LAYER_SIZES[li + 1];

      for (let ai = 0; ai < sizeA; ai++) {
        const aNode = netNodes[startA + ai];
        const aCx = aNode.cx - drift;
        const aCy = aNode.cy;
        if (aCx < -40 || aCx > W + 40) continue;
        const aInt = nodeIntensities[aNode.nodeIdx] ?? 0.5;

        for (let bi = 0; bi < sizeB; bi++) {
          const bNode = netNodes[startB + bi];
          const bCx = bNode.cx - drift;
          const bCy = bNode.cy;
          if (bCx < -40 || bCx > W + 40) continue;
          const bInt = nodeIntensities[bNode.nodeIdx] ?? 0.5;

          const link = (aInt + bInt) / 2;
          const baseEdgeAlpha = 0.55 * alpha * edgeReveal * link;
          if (baseEdgeAlpha < 0.05) continue;

          const dx = bCx - aCx;
          const dy = bCy - aCy;
          const dist = Math.hypot(dx, dy);
          const stepSize = profile.edgeStepPx;
          const steps = Math.max(2, Math.floor(dist / stepSize));

          const ang = Math.atan2(dy, dx);
          const ax = Math.abs(ang);
          let edgeChar = "·";
          if (link > 0.6) {
            if (ax < 0.25 || ax > Math.PI - 0.25) edgeChar = "─";
            else if (Math.abs(ax - Math.PI / 2) < 0.25) edgeChar = "│";
            else if (ang > 0) edgeChar = "╲";
            else edgeChar = "╱";
          }

          for (let s = 1; s < steps; s++) {
            const tt = s / steps;
            const px = aCx + dx * tt;
            const py = aCy + dy * tt;
            const localPulse =
              0.4 +
              0.6 *
                Math.max(
                  0,
                  Math.sin((tt - flow) * Math.PI * 2 + li * 0.4),
                );
            ctx.fillStyle = `rgba(255,255,255,${
              baseEdgeAlpha * localPulse
            })`;
            ctx.fillText(edgeChar, px, py);
          }
        }
      }
    }
  }

  // ── Cells (nodes) with binary light/dark intensity ─────────
  ctx.font = pixelFont;
  for (const c of bevqList) {
    if (c.x < -20 || c.x > W + 20) continue;
    if (inMask(c.x, c.y, maskMargin)) continue;
    const nInt = nodeIntensities[c.nodeIdx] ?? 0.5;
    ctx.fillStyle = `rgba(255,255,255,${alpha * nInt})`;
    ctx.fillText(c.targetChar, c.x, c.y);
  }

  // ── ASCII landscape (top-right area, unfolds over time) ────
  renderLandscape(f, alpha, elapsed);
}

function renderLandscape(f: FrameCtx, alpha: number, elapsed: number) {
  const { ctx, W, H, monoFamily } = f;
  const lsStart = 0.6;
  const lsRevealDur = 7.0;
  const lsReveal = Math.max(
    0,
    Math.min(1, (elapsed - lsStart) / lsRevealDur),
  );
  if (lsReveal <= 0) return;

  const isMobileVp = W < 768;
  const lsFontPx = isMobileVp ? 11 : 16;
  const step = lsFontPx;
  const lsRight = W - step * 1.2;
  const lsTop = step * 1.6;
  const lsBottom = lsTop + Math.min(H * 0.42, step * 11);

  ctx.font = `${lsFontPx}px ${monoFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Sun: top-right corner
  const sunCx = lsRight - step * 1.8;
  const sunCy = lsTop + step * 1.5;
  const sunFade = alpha * Math.min(1, lsReveal / 0.15);

  ctx.fillStyle = `rgba(255,255,255,${sunFade})`;
  ctx.fillText("*", sunCx, sunCy);
  ctx.fillStyle = `rgba(255,255,255,${sunFade * 0.78})`;
  ctx.fillText("○", sunCx, sunCy - step);
  ctx.fillText("○", sunCx, sunCy + step);
  ctx.fillText("○", sunCx - step, sunCy);
  ctx.fillText("○", sunCx + step, sunCy);
  ctx.fillStyle = `rgba(255,255,255,${sunFade * 0.5})`;
  ctx.fillText("╲", sunCx - step * 0.85, sunCy - step * 0.85);
  ctx.fillText("╱", sunCx + step * 0.85, sunCy - step * 0.85);
  ctx.fillText("╱", sunCx - step * 0.85, sunCy + step * 0.85);
  ctx.fillText("╲", sunCx + step * 0.85, sunCy + step * 0.85);

  if (lsReveal > 0.1) {
    const rayAlpha =
      sunFade * 0.42 * Math.min(1, (lsReveal - 0.1) / 0.2);
    ctx.fillStyle = `rgba(255,255,255,${rayAlpha})`;
    ctx.fillText("│", sunCx, sunCy - step * 2.4);
    ctx.fillText("│", sunCx, sunCy + step * 2.4);
    ctx.fillText("─", sunCx - step * 2.4, sunCy);
    ctx.fillText("─", sunCx + step * 2.4, sunCy);
  }

  // Mountains: fixed positions relative to lsRight; fade in one by one
  const mountains = isMobileVp
    ? [
        { offset: step * 7, height: 5, halfStep: 1 },
        { offset: step * 14, height: 4, halfStep: 1 },
      ]
    : [
        { offset: step * 9, height: 6, halfStep: 1 },
        { offset: step * 17, height: 4, halfStep: 1 },
        { offset: step * 24, height: 5, halfStep: 1 },
        { offset: step * 31, height: 3, halfStep: 1 },
      ];

  for (let mi = 0; mi < mountains.length; mi++) {
    const showAt = 0.22 + mi * 0.13;
    if (lsReveal < showAt) break;
    const mFade =
      alpha * Math.min(1, (lsReveal - showAt) / 0.18);
    const m = mountains[mi];
    const mTipX = lsRight - m.offset;
    const mTipY = lsBottom - m.height * step;

    ctx.fillStyle = `rgba(255,255,255,${mFade})`;
    for (let row = 0; row < m.height; row++) {
      const y = mTipY + row * step;
      const off = (row + 0.5) * step;
      ctx.fillText("╱", mTipX - off, y);
      ctx.fillText("╲", mTipX + off, y);
    }
  }

  // Terrain ground line: spreads leftward over time
  if (lsReveal > 0.5) {
    const terFade =
      alpha * Math.min(1, (lsReveal - 0.5) / 0.35);
    const terY = lsBottom + step * 0.2;
    const maxTerWidth = isMobileVp ? step * 22 : step * 38;
    const terGrow =
      maxTerWidth *
      Math.min(1, (lsReveal - 0.5) / 0.45);
    const terLeft = lsRight - terGrow;
    const pattern = "_·~·";
    let i = 0;
    ctx.fillStyle = `rgba(255,255,255,${terFade * 0.7})`;
    for (let x = lsRight; x >= terLeft; x -= step * 0.85) {
      ctx.fillText(pattern[i % pattern.length], x, terY);
      i++;
    }
  }
}
