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
  low: 72,
  medium: 128,
  high: 186,
};

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function ParticleField({ qualityTier, paused, mode }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const modeBlendRef = useRef({ pulse: 0, axiom: 0, about: 0 });
  const count = COUNTS[qualityTier];

  const { basePositions, positions, phases } = useMemo(() => {
    const random = createSeededRandom(11235813 + count);
    const nextBase = new Float32Array(count * 3);
    const nextPositions = new Float32Array(count * 3);
    const nextPhases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const spread = 15 + random() * 8;
      const angle = random() * Math.PI * 2;
      nextBase[idx] = Math.cos(angle) * spread * (0.35 + random() * 0.65);
      nextBase[idx + 1] = -0.4 + random() * 4.8;
      nextBase[idx + 2] = -13.5 + random() * 14;
      nextPositions[idx] = nextBase[idx];
      nextPositions[idx + 1] = nextBase[idx + 1];
      nextPositions[idx + 2] = nextBase[idx + 2];
      nextPhases[i] = random() * Math.PI * 2;
    }

    return {
      basePositions: nextBase,
      positions: nextPositions,
      phases: nextPhases,
    };
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const modeBlend = modeBlendRef.current;
    modeBlend.pulse += (targetPulse - modeBlend.pulse) * 0.08;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * 0.08;
    modeBlend.about += (targetAbout - modeBlend.about) * 0.08;

    const material = points.material;
    const tintR = 0.42 + modeBlend.about * 0.06 + modeBlend.axiom * 0.05;
    const tintG = 0.5 + modeBlend.pulse * 0.12 + modeBlend.about * 0.05;
    const tintB = 0.58 + modeBlend.axiom * 0.1 + modeBlend.pulse * 0.08;
    material.color.setRGB(tintR, tintG, tintB);
    material.opacity =
      0.045 + modeBlend.pulse * 0.012 + modeBlend.axiom * 0.008 + modeBlend.about * 0.01;

    if (paused) return;

    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const time = state.clock.elapsedTime * 0.08;

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const phase = phases[i];
      arr[idx] = basePositions[idx] + Math.sin(time + phase) * 0.014;
      arr[idx + 1] =
        basePositions[idx + 1] + Math.sin(time * 1.1 + phase * 1.6) * 0.017;
      arr[idx + 2] = basePositions[idx + 2] + Math.cos(time * 0.72 + phase) * 0.016;
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#72859a"
        size={qualityTier === 'low' ? 0.007 : 0.009}
        sizeAttenuation
        transparent
        opacity={0.045}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
