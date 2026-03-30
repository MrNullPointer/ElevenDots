'use client';

import { Environment } from '@react-three/drei';
import type { QualityTier } from '@/lib/store';

interface LightRigProps {
  qualityTier: QualityTier;
}

const KEY_INTENSITY: Record<QualityTier, number> = {
  low: 0.58,
  medium: 0.66,
  high: 0.74,
};

export default function LightRig({ qualityTier }: LightRigProps) {
  return (
    <>
      <ambientLight color="#9bb0ca" intensity={0.024} />

      <hemisphereLight args={['#0f1a2d', '#141019', 0.026]} />

      <directionalLight
        color="#c7daf5"
        position={[3.1, 4.8, -1.4]}
        intensity={KEY_INTENSITY[qualityTier]}
      />

      <directionalLight
        color="#8194be"
        position={[-5.2, 1.8, -6.8]}
        intensity={0.28}
      />

      <pointLight
        color="#1a1520"
        position={[0, -1.5, -2.4]}
        intensity={0.07}
        distance={12}
        decay={2}
      />

      <Environment
        preset={qualityTier === 'low' ? 'apartment' : 'city'}
        environmentIntensity={qualityTier === 'high' ? 0.2 : 0.14}
      />
    </>
  );
}
