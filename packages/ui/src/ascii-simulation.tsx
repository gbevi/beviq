"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";

import { SafeAsciiRenderer } from "./ascii-renderer";
import { ProceduralTree } from "./procedural-tree";

type AsciiSimulationProps = {
  modelPath?: string;
  className?: string;
  characters?: string;
  resolution?: number;
  fgColor?: string;
  bgColor?: string;
};

function GltfSubject({ path }: { path: string }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(path);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.18;
  });
  return <primitive ref={ref} object={scene} />;
}

export function AsciiSimulation({
  modelPath,
  className = "",
  characters = " 01",
  resolution = 0.2,
  fgColor = "#FFFFFF",
  bgColor = "transparent",
}: AsciiSimulationProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 7, 4]} intensity={1.4} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Suspense fallback={<ProceduralTree />}>
          {modelPath ? <GltfSubject path={modelPath} /> : <ProceduralTree />}
        </Suspense>
        <SafeAsciiRenderer
          fgColor={fgColor}
          bgColor={bgColor}
          characters={characters}
          resolution={resolution}
          invert={false}
        />
      </Canvas>
    </div>
  );
}
