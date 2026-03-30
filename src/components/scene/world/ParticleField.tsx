'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { DestinationId, QualityTier } from '@/lib/store';

interface ParticleFieldProps {
  qualityTier: QualityTier;
  paused: boolean;
  mode: DestinationId | 'idle';
}

const COUNTS: Record<QualityTier, number> = {
  low: 20,
  medium: 34,
  high: 48,
};

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function ParticleField({ qualityTier, paused, mode }: ParticleFieldProps) {
  const linesRef = useRef<THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>>(
    null,
  );
  const modeBlendRef = useRef({ pulse: 0, axiom: 0, about: 0 });
  const count = COUNTS[qualityTier];

  const { baseCenters, axisOffsets, positions, phases } = useMemo(() => {
    const random = createSeededRandom(27182818 + count);
    const nextBaseCenters = new Float32Array(count * 3);
    const nextAxisOffsets = new Float32Array(count * 3);
    const nextPositions = new Float32Array(count * 6);
    const nextPhases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const centerIdx = i * 3;
      const posIdx = i * 6;
      const spread = 2.4 + random() * 5.8;
      const angle = random() * Math.PI * 2;

      const cx = Math.cos(angle) * spread;
      const cy = -1.5 + random() * 4.0;
      const cz = -8.2 + random() * 4.9;

      const dx = random() * 2 - 1;
      const dy = random() * 2 - 1;
      const dz = random() * 2 - 1;
      const norm = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const length = 0.14 + random() * 0.34;

      const ox = (dx / norm) * length;
      const oy = (dy / norm) * length;
      const oz = (dz / norm) * length;

      nextBaseCenters[centerIdx] = cx;
      nextBaseCenters[centerIdx + 1] = cy;
      nextBaseCenters[centerIdx + 2] = cz;

      nextAxisOffsets[centerIdx] = ox;
      nextAxisOffsets[centerIdx + 1] = oy;
      nextAxisOffsets[centerIdx + 2] = oz;
      nextPhases[i] = random() * Math.PI * 2;

      nextPositions[posIdx] = cx - ox;
      nextPositions[posIdx + 1] = cy - oy;
      nextPositions[posIdx + 2] = cz - oz;
      nextPositions[posIdx + 3] = cx + ox;
      nextPositions[posIdx + 4] = cy + oy;
      nextPositions[posIdx + 5] = cz + oz;
    }

    return {
      baseCenters: nextBaseCenters,
      axisOffsets: nextAxisOffsets,
      positions: nextPositions,
      phases: nextPhases,
    };
  }, [count]);

  useFrame((state) => {
    const lines = linesRef.current;
    if (!lines) return;

    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const modeBlend = modeBlendRef.current;
    modeBlend.pulse += (targetPulse - modeBlend.pulse) * 0.08;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * 0.08;
    modeBlend.about += (targetAbout - modeBlend.about) * 0.08;

    const material = lines.material;
    material.color.setRGB(
      0.36 + modeBlend.about * 0.05 + modeBlend.axiom * 0.06,
      0.42 + modeBlend.pulse * 0.08 + modeBlend.about * 0.05,
      0.5 + modeBlend.axiom * 0.08 + modeBlend.pulse * 0.06,
    );
    material.opacity =
      0.054 + modeBlend.pulse * 0.01 + modeBlend.axiom * 0.008 + modeBlend.about * 0.01;

    if (paused) return;

    const attr = lines.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime * 0.08;

    for (let i = 0; i < count; i += 1) {
      const centerIdx = i * 3;
      const posIdx = i * 6;
      const phase = phases[i];

      const cx = baseCenters[centerIdx] + Math.sin(t + phase) * 0.04;
      const cy = baseCenters[centerIdx + 1] + Math.cos(t * 1.2 + phase * 1.4) * 0.034;
      const cz = baseCenters[centerIdx + 2] + Math.sin(t * 0.9 + phase * 0.8) * 0.024;

      const ox = axisOffsets[centerIdx];
      const oy = axisOffsets[centerIdx + 1];
      const oz = axisOffsets[centerIdx + 2];

      arr[posIdx] = cx - ox;
      arr[posIdx + 1] = cy - oy;
      arr[posIdx + 2] = cz - oz;
      arr[posIdx + 3] = cx + ox;
      arr[posIdx + 4] = cy + oy;
      arr[posIdx + 5] = cz + oz;
    }

    attr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#5f7288" transparent opacity={0.054} depthWrite={false} />
    </lineSegments>
  );
}
