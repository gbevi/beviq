"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three-stdlib";

type SafeAsciiRendererProps = {
  characters?: string;
  resolution?: number;
  invert?: boolean;
  fgColor?: string;
  bgColor?: string;
};

function isValidSize(w: number, h: number) {
  return (
    Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0
  );
}

export function SafeAsciiRenderer({
  characters = " .:-+*=%@#",
  resolution = 0.15,
  invert = false,
  fgColor = "#FFFFFF",
  bgColor = "transparent",
}: SafeAsciiRendererProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const effectRef = useRef<AsciiEffect | null>(null);

  useLayoutEffect(() => {
    if (!isValidSize(size.width, size.height)) return;

    const effect = new AsciiEffect(gl, characters, {
      invert,
      resolution,
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
    effect.setSize(size.width, size.height);

    const parent = gl.domElement.parentNode;
    if (parent) {
      parent.appendChild(effect.domElement);
      gl.domElement.style.opacity = "0";
    }

    effectRef.current = effect;

    return () => {
      effectRef.current = null;
      if (parent && effect.domElement.parentNode === parent) {
        parent.removeChild(effect.domElement);
      }
      gl.domElement.style.opacity = "1";
    };
  }, [gl, characters, invert, resolution, fgColor, bgColor]);

  useLayoutEffect(() => {
    const effect = effectRef.current;
    if (!effect) return;
    if (!isValidSize(size.width, size.height)) return;
    effect.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    const effect = effectRef.current;
    if (!effect) return;
    if (!isValidSize(size.width, size.height)) return;
    effect.render(scene, camera);
  }, 1);

  return null;
}
