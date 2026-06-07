"use client";

import { useEffect, useRef, useState } from "react";
import {
  resolveFontFamilyVar,
  samplePolarPoints,
  sampleTextPixels,
  type SampledPixel,
} from "@/lib/glyph-sampler";

type Cell = {
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

type Phase = "field" | "falling" | "logo" | "transition" | "done";
type MaskRect = { left: number; right: number; top: number; bottom: number };

const CHARS_BIN = "01";
const CHARS_ASCII = "01ABCDEFabcdef$%&*+-/=<>{}[]";
const BEVIQ_BIN = "0110001001100101011101100110100101110001";

const LAYER_SIZES = [4, 10, 20, 20, 10, 4];
const nLayers = LAYER_SIZES.length;
const maxLayerSize = 20;
const layerStart: number[] = [];
{
  let cum = 0;
  for (const s of LAYER_SIZES) {
    layerStart.push(cum);
    cum += s;
  }
}
const TOTAL_NODES = LAYER_SIZES.reduce((a, b) => a + b, 0);

type Profile = {
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

function profileFor(w: number, h: number): Profile {
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

export function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>("field");
  const [hint, setHint] = useState(false);
  const phaseRef = useRef<Phase>("field");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let profile: Profile = profileFor(window.innerWidth, window.innerHeight);
    let cells: Cell[] = [];
    const mouse = { x: 0.5, y: 0.5 };
    let clickInfo: { x: number; y: number; t: number } | null = null;
    let phaseStart = performance.now();
    let raf = 0;
    const timers: number[] = [];

    const dotoFamily = resolveFontFamilyVar("--font-doto", "Doto");
    const monoFamily =
      resolveFontFamilyVar("--font-mono", "") ||
      `"JetBrains Mono", ui-monospace, monospace`;

    let bevPixels: SampledPixel[] = [];
    let bevWidth = 0;
    let bevHeight = 0;
    let bevStartX = 0;
    let bevStartY = 0;

    type NodeInfo = { cx: number; cy: number; nodeIdx: number; bit: string };
    let netNodes: NodeInfo[] = [];
    let netPositions: {
      x: number;
      y: number;
      nodeIdx: number;
    }[] = [];
    const nodeIntensities: number[] = [];

    let maskRects: MaskRect[] = [];
    const updateMasks = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-mask]");
      maskRects = [];
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          maskRects.push({
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
          });
        }
      });
    };
    const inMask = (x: number, y: number, margin = 6) => {
      for (const r of maskRects) {
        if (
          x >= r.left - margin &&
          x <= r.right + margin &&
          y >= r.top - margin &&
          y <= r.bottom + margin
        )
          return true;
      }
      return false;
    };

    const setup = () => {
      profile = profileFor(window.innerWidth, window.innerHeight);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / profile.cellW) + 1;
      const rows = Math.ceil(h / profile.cellH) + 1;
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * profile.cellW + profile.cellW / 2;
          const cy = r * profile.cellH + profile.cellH / 2;
          cells.push({
            hx: cx,
            hy: cy,
            x: cx,
            y: cy,
            vx: 0,
            vy: 0,
            vr: 0,
            rot: 0,
            mass: 0.5 + Math.random() * 1.4,
            drag: 0.987 + Math.random() * 0.011,
            gravityMult: 0.7 + Math.random() * 0.6,
            char: Math.random() < 0.5 ? "0" : "1",
            intensity: 0,
            targetIdx: -1,
            targetX: 0,
            targetY: 0,
            targetChar: "0",
            netTargetX: 0,
            netTargetY: 0,
            nodeIdx: -1,
          });
        }
      }
    };

    const computeTargets = () => {
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

      bevPixels = sample.pixels;
      bevWidth = sample.width;
      bevHeight = sample.height;
      bevStartX = (w - bevWidth) / 2;
      bevStartY = (h - bevHeight) / 2;

      const netStartX = w * profile.netStartXRatio;
      const netWidth = w * profile.netWidthRatio;
      const netLayerSpacing = netWidth / (nLayers - 1);
      const netCenterY = h * 0.5;

      netNodes = [];
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
    };

    const assignTargets = () => {
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
      netPositions = [];
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
    };

    const fontsLoaded =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts
            .load(`900 200px ${dotoFamily}`)
            .then(() => undefined)
            .catch(() => undefined)
        : Promise.resolve();

    setup();
    updateMasks();
    const initMaskTimer = window.setTimeout(updateMasks, 120);

    const onResize = () => {
      if (phaseRef.current === "field") setup();
      updateMasks();
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);

    let cachedBevqList: Cell[] | null = null;

    const trigger = async (clickX: number, clickY: number) => {
      if (!Number.isFinite(clickX) || !Number.isFinite(clickY)) return;
      if (phaseRef.current !== "field") return;
      await fontsLoaded;
      if (phaseRef.current !== "field") return;
      computeTargets();
      assignTargets();
      clickInfo = { x: clickX, y: clickY, t: performance.now() };

      for (const c of cells) {
        const dx = c.x - clickX;
        const dy = c.y - clickY;
        const dist = Math.max(20, Math.sqrt(dx * dx + dy * dy));
        const force = 320 / (dist + 100);
        c.vx = ((dx / dist) * force * 14) / c.mass + (Math.random() - 0.5) * 1.6;
        c.vy =
          ((dy / dist) * force * 14) / c.mass - 1.5 - Math.random() * 1.8;
        c.vr = (Math.random() - 0.5) * 0.4;
      }

      phaseStart = performance.now();
      phaseRef.current = "falling";
      setPhase("falling");

      timers.push(
        window.setTimeout(() => {
          phaseStart = performance.now();
          phaseRef.current = "logo";
          setPhase("logo");
        }, 2000),
      );
      timers.push(
        window.setTimeout(() => {
          // Mantemos o cache pronto pra quando a fase transition voltar.
          cachedBevqList = cells
            .filter((c) => c.targetIdx >= 0)
            .sort((a, b) => a.targetIdx - b.targetIdx);
          html.classList.remove("no-scroll");
          document.body.classList.remove("no-scroll");
          phaseRef.current = "done";
          setPhase("done");
        }, 5000),
      );
    };

    const skipToDone = () => {
      for (const tm of timers) clearTimeout(tm);
      timers.length = 0;
      html.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      phaseRef.current = "done";
      setPhase("done");
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("header")) {
        skipToDone();
        return;
      }
      void trigger(e.clientX, e.clientY);
    };
    const onKey = () => {
      const active = document.activeElement as Element | null;
      if (active?.closest("header")) {
        skipToDone();
        return;
      }
      void trigger(window.innerWidth / 2, window.innerHeight / 2);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    const t0 = performance.now();
    const fundo = "#0F1115";

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.fillStyle = fundo;
      ctx.fillRect(0, 0, W, H);

      const pixelFont = `${profile.pixelFontPx}px ${monoFamily}`;
      ctx.font = pixelFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maskMargin = Math.max(4, profile.pixelFontPx);
      const ph = phaseRef.current;

      if (ph === "field") {
        const cx = W / 2;
        const cy = H / 2;
        const sp1x = cx + Math.sin(t * 0.42) * W * 0.34;
        const sp1y = cy + Math.cos(t * 0.61) * H * 0.32;
        const sp2x = cx + Math.sin(t * 0.55 + 1.4) * W * 0.3;
        const sp2y = cy + Math.cos(t * 0.33 + 0.7) * H * 0.36;
        const mx = mouse.x * W;
        const my = mouse.y * H;

        for (const c of cells) {
          const ny = (c.y / H - 0.5) * 2;
          const hourglass = Math.pow(Math.abs(ny), 1.6) * 0.55;
          const middleBand =
            Math.exp(-ny * ny * 7) *
            Math.abs(Math.sin(t * 1.3 + (c.x / W) * Math.PI * 3));

          const d1 = (c.x - sp1x) ** 2 + (c.y - sp1y) ** 2;
          const d2 = (c.x - sp2x) ** 2 + (c.y - sp2y) ** 2;
          const dm = (c.x - mx) ** 2 + (c.y - my) ** 2;
          const i1 = Math.exp(-d1 / 55000) * 0.95;
          const i2 = Math.exp(-d2 / 60000) * 0.85;
          const im = Math.exp(-dm / 30000) * 1.4;

          c.intensity = Math.min(
            1,
            hourglass * 0.45 + middleBand * 0.55 + i1 + i2 + im,
          );

          if (t > 2.5 && Math.random() < 0.008) {
            c.char =
              CHARS_ASCII[Math.floor(Math.random() * CHARS_ASCII.length)];
          } else if (Math.random() < 0.05) {
            c.char = CHARS_BIN[Math.floor(Math.random() * 2)];
          }

          if (c.intensity > 0.04 && !inMask(c.x, c.y, maskMargin)) {
            ctx.fillStyle = `rgba(255,255,255,${c.intensity})`;
            ctx.fillText(c.char, c.x, c.y);
          }
        }
      } else if (ph === "falling") {
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
          const ce = (now - clickInfo.t) / 1000;
          if (ce < 1 && Number.isFinite(ce)) {
            const r1 = ce * 720;
            const a1 = Math.max(0, (1 - ce) * 0.85);
            ctx.strokeStyle = `rgba(255,255,255,${a1})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(clickInfo.x, clickInfo.y, r1, 0, Math.PI * 2);
            ctx.stroke();

            const r2 = ce * 1180;
            const a2 = Math.max(0, (1 - ce) * 0.35);
            ctx.strokeStyle = `rgba(255,255,255,${a2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(clickInfo.x, clickInfo.y, r2, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      } else if (ph === "logo") {
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
      } else if (ph === "transition") {
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
        if (N === 0) {
          raf = requestAnimationFrame(tick);
          return;
        }

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
        const lsStart = 0.6;
        const lsRevealDur = 7.0;
        const lsReveal = Math.max(
          0,
          Math.min(1, (elapsed - lsStart) / lsRevealDur),
        );
        if (lsReveal > 0) {
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
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hintTimer = window.setTimeout(() => setHint(true), 1700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hintTimer);
      clearTimeout(initMaskTimer);
      for (const tm of timers) clearTimeout(tm);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      html.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-40 cursor-pointer select-none bg-fundo">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {phase === "field" && hint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-12 grid place-items-center text-center text-xs uppercase tracking-[0.35em] text-fosforo md:text-sm">
          <span className="opacity-70 [animation:pulse_1.4s_ease-in-out_infinite]">
            [ click anywhere ]
          </span>
        </div>
      )}
    </div>
  );
}
