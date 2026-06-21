"use client";

import { useEffect, useRef, useState } from "react";
import { resolveFontFamilyVar, type SampledPixel } from "@/lib/glyph-sampler";
import { type Profile, profileFor } from "./preloader/profiles";
import { assignTargets, computeTargets } from "./preloader/targets";
import { renderField } from "./preloader/render-field";
import { renderFalling } from "./preloader/render-falling";
import { renderLogo } from "./preloader/render-logo";
import { renderTransition } from "./preloader/render-transition";
import type {
  Cell,
  ClickInfo,
  FrameCtx,
  MaskRect,
  NodeInfo,
  Phase,
} from "./preloader/types";

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
    let clickInfo: ClickInfo | null = null;
    let phaseStart = performance.now();
    let raf = 0;
    const timers: number[] = [];

    const dotoFamily = resolveFontFamilyVar("--font-doto", "Doto");
    const monoFamily =
      resolveFontFamilyVar("--font-mono", "") ||
      `"JetBrains Mono", ui-monospace, monospace`;

    let bevPixels: SampledPixel[] = [];
    let bevStartX = 0;
    let bevStartY = 0;

    let netNodes: NodeInfo[] = [];
    const nodeIntensities: number[] = [];

    let maskRects: MaskRect[] = [];
    const updateMasks = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-mask]");
      maskRects = [];
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          // Shrink the vertical mask to the glyph cap-height (≈ 50% of the line-box).
          // Line boxes include leading above/below the actual ink, which leaves a
          // visible gap of un-rendered chars above/below the visible text otherwise.
          const midY = (r.top + r.bottom) / 2;
          const halfH = (r.bottom - r.top) * 0.28;
          maskRects.push({
            left: r.left,
            right: r.right,
            top: midY - halfH,
            bottom: midY + halfH,
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
    // Re-mask after the click hint appears (setHint fires at 250ms) so the
    // binary rain doesn't render behind its text.
    const hintMaskTimer = window.setTimeout(updateMasks, 320);

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
      const tg = computeTargets(profile, dotoFamily);
      bevPixels = tg.bevPixels;
      bevStartX = tg.bevStartX;
      bevStartY = tg.bevStartY;
      netNodes = tg.netNodes;
      assignTargets(
        cells,
        profile,
        bevPixels,
        bevStartX,
        bevStartY,
        netNodes,
        nodeIntensities,
      );
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

      const maskMargin = Math.max(2, profile.pixelFontPx / 2);
      const ph = phaseRef.current;

      const frame: FrameCtx = {
        ctx,
        W,
        H,
        now,
        t,
        phaseStart,
        profile,
        cells,
        mouse,
        monoFamily,
        pixelFont,
        maskMargin,
        inMask,
        clickInfo,
        netNodes,
        nodeIntensities,
        cachedBevqList,
      };

      if (ph === "field") {
        renderField(frame);
      } else if (ph === "falling") {
        renderFalling(frame);
      } else if (ph === "logo") {
        renderLogo(frame);
      } else if (ph === "transition") {
        renderTransition(frame);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hintTimer = window.setTimeout(() => setHint(true), 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hintTimer);
      clearTimeout(initMaskTimer);
      clearTimeout(hintMaskTimer);
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
        <div className="pointer-events-none absolute inset-x-0 bottom-12 grid place-items-center text-center font-mono text-[11px] uppercase tracking-[0.4em] text-fosforo md:bottom-16 md:text-xs">
          <span
            data-mask
            className="[animation:pulse_1.4s_ease-in-out_infinite]"
          >
            [ clique em qualquer lugar ]
          </span>
        </div>
      )}
    </div>
  );
}
