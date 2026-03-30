'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { QualityTier } from '@/lib/store';

interface ParticleFieldProps {
  qualityTier: QualityTier;
  paused: boolean;
}

const COUNTS: Record<QualityTier, number> = {
  low: 92,
  medium: 196,
  high: 286,
};

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function ParticleField({ qualityTier, paused }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const count = COUNTS[qualityTier];

  const { basePositions, positions, phases } = useMemo(() => {
    const random = createSeededRandom(11235813 + count);
    const nextBase = new Float32Array(count * 3);
    const nextPositions = new Float32Array(count * 3);
    const nextPhases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      nextBase[idx] = (random() - 0.5) * 24;
      nextBase[idx + 1] = -0.95 + random() * 5.6;
      nextBase[idx + 2] = -18 + random() * 20;
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
    if (paused) return;
    const points = pointsRef.current;
    if (!points) return;

    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const time = state.clock.elapsedTime * 0.12;

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const phase = phases[i];
      arr[idx] = basePositions[idx] + Math.sin(time + phase) * 0.022;
      arr[idx + 1] =
        basePositions[idx + 1] + Math.sin(time * 1.33 + phase * 1.7) * 0.028;
      arr[idx + 2] = basePositions[idx + 2] + Math.cos(time * 0.82 + phase) * 0.024;
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
        color="#7d94aa"
        size={qualityTier === 'low' ? 0.009 : 0.011}
        sizeAttenuation
        transparent
        opacity={0.08}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
