'use client';

import { Environment } from '@react-three/drei';
import type { DestinationId, QualityTier } from '@/lib/store';

interface LightRigProps {
  qualityTier: QualityTier;
  mode: DestinationId | 'idle';
}

const KEY_INTENSITY: Record<QualityTier, number> = {
  low: 0.44,
  medium: 0.5,
  high: 0.58,
};

export default function LightRig({ qualityTier, mode }: LightRigProps) {
  const pulseBoost = mode === 'pulse' ? 1 : 0;
  const axiomBoost = mode === 'axiom' ? 1 : 0;
  const aboutBoost = mode === 'about' ? 1 : 0;

  return (
    <>
      <ambientLight color="#8ea4bf" intensity={0.026} />

      <hemisphereLight args={['#0f1a2d', '#090b14', 0.016]} />

      <directionalLight
        color="#b6cbe6"
        position={[0.7, 3.3, 2.2]}
        intensity={KEY_INTENSITY[qualityTier] + aboutBoost * 0.04}
      />

      <directionalLight
        color="#556994"
        position={[-1.9, 1.7, -5.2]}
        intensity={0.2 + axiomBoost * 0.06}
      />

      <pointLight
        color="#1a1520"
        position={[0, -1.72, -2.5]}
        intensity={0.072}
        distance={11}
        decay={2}
      />

      <pointLight
        color="#274364"
        position={[0, 1.35, 1.65]}
        intensity={0.11 + pulseBoost * 0.045}
        distance={6.2}
        decay={2}
      />

      <pointLight
        color="#41467a"
        position={[1.7, 0.48, -2.6]}
        intensity={0.055 + axiomBoost * 0.04}
        distance={5.8}
        decay={2}
      />

      <pointLight
        color="#9eb8cf"
        position={[-0.8, 0.56, -2.1]}
        intensity={0.045 + aboutBoost * 0.045}
        distance={4.8}
        decay={2}
      />

      <Environment
        preset={qualityTier === 'low' ? 'apartment' : 'city'}
        environmentIntensity={qualityTier === 'high' ? 0.048 : 0.04}
      />
    </>
  );
}
