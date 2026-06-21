"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Group, Mesh } from "three";

const CLUSTERS: Array<{
  position: [number, number, number];
  radius: number;
  seed: number;
}> = [
  { position: [-0.6, 0.55, 0.1], radius: 0.32, seed: 0 },
  { position: [0.05, 0.88, -0.05], radius: 0.3, seed: 1 },
  { position: [0.7, 0.32, 0.05], radius: 0.3, seed: 2 },
  { position: [-0.32, 0.7, 0.42], radius: 0.24, seed: 3 },
  { position: [0.82, 0.5, 0.22], radius: 0.24, seed: 4 },
  { position: [0.7, 0.18, -0.22], radius: 0.22, seed: 5 },
  { position: [-0.72, 0.05, -0.35], radius: 0.22, seed: 6 },
  { position: [-0.4, 0.6, 0.58], radius: 0.2, seed: 7 },
  { position: [0.0, 1.0, -0.08], radius: 0.18, seed: 8 },
  { position: [-0.15, 0.7, 0.18], radius: 0.18, seed: 9 },
  { position: [0.35, 0.6, 0.32], radius: 0.18, seed: 10 },
];

function LeafCluster({
  position,
  radius,
  seed,
}: {
  position: [number, number, number];
  radius: number;
  seed: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const wind =
      Math.sin(t * 0.7) * 0.6 +
      Math.sin(t * 0.21 + 1) * Math.sin(t * 0.95) * 0.4;
    const localPhase = seed * 1.7;
    const localFreq = 0.85 + seed * 0.12;
    const local = Math.sin(t * localFreq + localPhase);
    m.rotation.z = wind * 0.035 + local * 0.025;
    m.position.y = position[1] + local * 0.012;
    m.scale.setScalar(1 + Math.sin(t * (1.2 + seed * 0.15) + seed) * 0.018);
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[radius, 1]} />
      <meshStandardMaterial flatShading roughness={0.85} metalness={0} color="#dcdcdc" />
    </mesh>
  );
}

type V3 = [number, number, number];

function StickFromTo({
  from,
  to,
  radiusFrom,
  radiusTo,
  color,
  segments = 6,
}: {
  from: V3;
  to: V3;
  radiusFrom: number;
  radiusTo: number;
  color: string;
  segments?: number;
}) {
  const ref = useRef<Mesh>(null);
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.hypot(dx, dy, dz);
  const mid = useMemo<V3>(
    () => [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    ],
    [from, to],
  );

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const up = new Vector3(0, 1, 0);
    const dir = new Vector3(dx, dy, dz).normalize();
    m.quaternion.setFromUnitVectors(up, dir);
  }, [dx, dy, dz]);

  return (
    <mesh ref={ref} position={mid}>
      <cylinderGeometry args={[radiusTo, radiusFrom, length, segments]} />
      <meshStandardMaterial
        flatShading
        roughness={0.95}
        metalness={0}
        color={color}
      />
    </mesh>
  );
}

const BASE_Y = -0.4;

const ROOTS: Array<{ az: number; len: number; dip: number; baseR: number; tipR: number }> = [
  { az: 0.0, len: 0.55, dip: 0.18, baseR: 0.13, tipR: 0.03 },
  { az: 0.95, len: 0.48, dip: 0.22, baseR: 0.11, tipR: 0.03 },
  { az: 1.85, len: 0.62, dip: 0.15, baseR: 0.14, tipR: 0.035 },
  { az: 2.7, len: 0.42, dip: 0.25, baseR: 0.10, tipR: 0.03 },
  { az: 3.65, len: 0.58, dip: 0.20, baseR: 0.12, tipR: 0.03 },
  { az: 4.5, len: 0.50, dip: 0.17, baseR: 0.11, tipR: 0.03 },
  { az: 5.4, len: 0.46, dip: 0.23, baseR: 0.10, tipR: 0.03 },
];

const TRUNK_SEGMENTS: Array<{ from: V3; to: V3; rFrom: number; rTo: number }> = [
  { from: [0, -0.4, 0], to: [0.08, 0.1, 0.03], rFrom: 0.22, rTo: 0.15 },
  { from: [0.08, 0.1, 0.03], to: [-0.02, 0.55, -0.05], rFrom: 0.15, rTo: 0.12 },
  { from: [-0.02, 0.55, -0.05], to: [0.05, 0.95, 0.0], rFrom: 0.12, rTo: 0.09 },
];

const BRANCHES: Array<{ from: V3; to: V3; rFrom: number; rTo: number }> = [
  { from: [0, 0, 0], to: [-0.48, 0.45, 0.15], rFrom: 0.08, rTo: 0.028 },
  { from: [0, 0, 0], to: [0.18, 0.65, -0.1], rFrom: 0.075, rTo: 0.026 },
  { from: [0, 0, 0], to: [0.6, 0.3, 0.12], rFrom: 0.07, rTo: 0.025 },
  { from: [0, 0, 0], to: [-0.28, 0.45, 0.5], rFrom: 0.06, rTo: 0.022 },
  { from: [0, 0, 0], to: [-0.6, 0.1, -0.32], rFrom: 0.058, rTo: 0.022 },
  { from: [0, 0, 0], to: [0.42, 0.55, 0.28], rFrom: 0.055, rTo: 0.02 },
  { from: [-0.48, 0.45, 0.15], to: [-0.62, 0.58, 0.05], rFrom: 0.028, rTo: 0.014 },
  { from: [-0.48, 0.45, 0.15], to: [-0.4, 0.6, 0.42], rFrom: 0.026, rTo: 0.013 },
  { from: [0.18, 0.65, -0.1], to: [0.02, 0.92, -0.08], rFrom: 0.026, rTo: 0.013 },
  { from: [0.18, 0.65, -0.1], to: [0.1, 1.0, -0.1], rFrom: 0.022, rTo: 0.011 },
  { from: [0.6, 0.3, 0.12], to: [0.82, 0.5, 0.22], rFrom: 0.025, rTo: 0.013 },
  { from: [0.6, 0.3, 0.12], to: [0.72, 0.18, -0.2], rFrom: 0.025, rTo: 0.013 },
  { from: [-0.6, 0.1, -0.32], to: [-0.74, 0.02, -0.42], rFrom: 0.022, rTo: 0.012 },
  { from: [-0.28, 0.45, 0.5], to: [-0.42, 0.62, 0.6], rFrom: 0.022, rTo: 0.012 },
  { from: [0.42, 0.55, 0.28], to: [0.36, 0.62, 0.36], rFrom: 0.02, rTo: 0.011 },
];

const TRUNK_COLOR = "#909090";
const BRANCH_COLOR = "#888888";

export function ProceduralTree() {
  const treeRef = useRef<Group>(null);
  const canopyRef = useRef<Group>(null);
  useFrame((state, dt) => {
    const tree = treeRef.current;
    const canopy = canopyRef.current;
    if (!tree || !canopy) return;
    const t = state.clock.elapsedTime;

    tree.rotation.y += dt * 0.1;
    const baseSway = Math.sin(t * 0.7) * 0.025;
    const gust = (0.4 + 0.6 * Math.sin(t * 0.13)) * Math.sin(t * 1.2) * 0.02;
    tree.rotation.z = baseSway + gust;
    tree.rotation.x = Math.sin(t * 0.55 + 1.1) * 0.012;
    tree.position.y = -0.5 + Math.sin(t * 0.4) * 0.025;

    canopy.rotation.z = Math.sin(t * 0.85 + 0.4) * 0.035;
    canopy.rotation.x = Math.cos(t * 0.7) * 0.022;
    canopy.scale.setScalar(1 + Math.sin(t * 0.5) * 0.012);
  });
  return (
    <group ref={treeRef}>
      {ROOTS.map((r, i) => {
        const tipBase: V3 = [
          Math.cos(r.az) * r.len,
          BASE_Y - r.dip,
          Math.sin(r.az) * r.len,
        ];
        const tipEnd: V3 = [
          Math.cos(r.az + 0.18) * (r.len + 0.22),
          BASE_Y - r.dip - 0.16,
          Math.sin(r.az + 0.18) * (r.len + 0.22),
        ];
        return (
          <group key={`root-${i}`}>
            <StickFromTo
              from={[0, BASE_Y, 0]}
              to={tipBase}
              radiusFrom={r.baseR}
              radiusTo={r.tipR}
              color={TRUNK_COLOR}
            />
            <StickFromTo
              from={tipBase}
              to={tipEnd}
              radiusFrom={r.tipR}
              radiusTo={0.018}
              color={TRUNK_COLOR}
            />
          </group>
        );
      })}

      {TRUNK_SEGMENTS.map((s, i) => (
        <StickFromTo
          key={`trunk-${i}`}
          from={s.from}
          to={s.to}
          radiusFrom={s.rFrom}
          radiusTo={s.rTo}
          color={TRUNK_COLOR}
          segments={12}
        />
      ))}

      <group ref={canopyRef} position={[0.05, 0.95, 0]}>
        {BRANCHES.map((b, i) => (
          <StickFromTo
            key={`branch-${i}`}
            from={b.from}
            to={b.to}
            radiusFrom={b.rFrom}
            radiusTo={b.rTo}
            color={BRANCH_COLOR}
          />
        ))}

        {CLUSTERS.map((c) => (
          <LeafCluster key={c.seed} {...c} />
        ))}
      </group>
    </group>
  );
}
