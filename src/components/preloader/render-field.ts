import type { FrameCtx } from "./types";

const CHARS_BIN = "01";
const CHARS_ASCII = "01ABCDEFabcdef$%&*+-/=<>{}[]";

export function renderField(f: FrameCtx) {
  const { ctx, W, H, t, cells, mouse, inMask, maskMargin } = f;
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
}
