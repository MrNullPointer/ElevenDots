'use client';

import { Environment } from '@react-three/drei';
import type { DestinationId, QualityTier } from '@/lib/store';

interface LightRigProps {
  qualityTier: QualityTier;
  mode: DestinationId | 'idle';
  reviewMode?: 'dark' | 'tonal' | 'clay';
}

const KEY_INTENSITY: Record<QualityTier, number> = {
  low: 0.34,
  medium: 0.4,
  high: 0.48,
};

export default function LightRig({ qualityTier, mode, reviewMode = 'dark' }: LightRigProps) {
  const pulseBoost = mode === 'pulse' ? 1 : 0;
  const axiomBoost = mode === 'axiom' ? 1 : 0;
  const aboutBoost = mode === 'about' ? 1 : 0;
  const clay = reviewMode === 'clay';
  const tonal = reviewMode === 'tonal';

  return (
    <>
      <ambientLight
        color={clay ? '#d0d4db' : tonal ? '#a5aeba' : '#8aa1bc'}
        intensity={clay ? 0.1 : tonal ? 0.055 : 0.022}
      />

      <hemisphereLight
        args={
          clay
            ? ['#c7ccd4', '#20242b', 0.11]
            : tonal
              ? ['#7f8793', '#10141b', 0.08]
              : ['#0d1728', '#04060c', 0.018]
        }
      />

      <directionalLight
        color={clay ? '#d9dde4' : tonal ? '#b9c2cf' : '#a9bdd4'}
        position={[-3.8, 2.6, -4.6]}
        intensity={
          (clay ? 0.58 : tonal ? 0.5 : KEY_INTENSITY[qualityTier]) +
          aboutBoost * (clay || tonal ? 0.02 : 0.04)
        }
      />

      <directionalLight
        color={clay ? '#aab2be' : tonal ? '#8c97ab' : '#5a6e94'}
        position={[2.7, 1.9, 1.8]}
        intensity={(clay ? 0.35 : tonal ? 0.28 : 0.22) + axiomBoost * (clay || tonal ? 0.02 : 0.05)}
      />

      <pointLight
        color={clay ? '#c2c8d2' : tonal ? '#6d7c95' : '#233650'}
        position={[0.2, 0.62, -2.74]}
        intensity={(clay ? 0.32 : tonal ? 0.26 : 0.2) + aboutBoost * (clay || tonal ? 0.02 : 0.05)}
        distance={6.8}
        decay={2}
      />

      <pointLight
        color={clay ? '#b6beca' : tonal ? '#617c99' : '#2a4f72'}
        position={[1.7, 1.12, -1.94]}
        intensity={(clay ? 0.24 : tonal ? 0.17 : 0.1) + pulseBoost * (clay || tonal ? 0.02 : 0.04)}
        distance={5.6}
        decay={2}
      />

      <pointLight
        color={clay ? '#afb7c4' : tonal ? '#78829d' : '#4e5789'}
        position={[-1.5, 0.72, -2.25]}
        intensity={(clay ? 0.2 : tonal ? 0.14 : 0.07) + axiomBoost * (clay || tonal ? 0.018 : 0.03)}
        distance={4.9}
        decay={2}
      />

      <pointLight
        color={clay ? '#e0e4e9' : tonal ? '#b5bec9' : '#9bb6ca'}
        position={[0.1, -0.2, -2.05]}
        intensity={(clay ? 0.11 : tonal ? 0.08 : 0.046) + aboutBoost * (clay || tonal ? 0.012 : 0.03)}
        distance={4.1}
        decay={2}
      />

      <Environment
        preset={clay || tonal ? 'studio' : qualityTier === 'low' ? 'studio' : 'night'}
        environmentIntensity={clay ? 0.05 : tonal ? 0.043 : qualityTier === 'high' ? 0.034 : 0.028}
      />
    </>
  );
}
