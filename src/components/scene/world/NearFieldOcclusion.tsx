'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { DestinationId } from '@/lib/store';

interface NearFieldOcclusionProps {
  paused: boolean;
  mode: DestinationId | 'idle';
  reviewMode?: 'dark' | 'tonal' | 'clay';
}

export default function NearFieldOcclusion({
  paused,
  mode,
  reviewMode = 'dark',
}: NearFieldOcclusionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.MeshBasicMaterial>(null);
  const lowerFogRef = useRef<THREE.MeshBasicMaterial>(null);
  const modeBlendRef = useRef({ pulse: 0, axiom: 0, about: 0 });

  useFrame((state, delta) => {
    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const blend = 1 - Math.exp(-delta * 2.6);
    const modeBlend = modeBlendRef.current;
    modeBlend.pulse += (targetPulse - modeBlend.pulse) * blend;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * blend;
    modeBlend.about += (targetAbout - modeBlend.about) * blend;

    if (!paused && groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = -0.92 + Math.sin(t * 0.05) * 0.015;
      groupRef.current.rotation.z = Math.sin(t * 0.035) * 0.007;
    }

    const clay = reviewMode === 'clay';
    const tonal = reviewMode === 'tonal';

    if (canopyRef.current) {
      canopyRef.current.opacity =
        (clay ? 0.11 : tonal ? 0.14 : 0.17) +
        modeBlend.about * (clay ? 0.008 : 0.012) +
        modeBlend.pulse * (clay ? 0.006 : 0.008) +
        modeBlend.axiom * (clay ? 0.006 : 0.008);
    }
    if (lowerFogRef.current) {
      lowerFogRef.current.opacity =
        (clay ? 0.08 : tonal ? 0.1 : 0.12) +
        modeBlend.about * (clay ? 0.008 : 0.012) +
        modeBlend.pulse * (clay ? 0.006 : 0.008) +
        modeBlend.axiom * (clay ? 0.006 : 0.008);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.02, -1.9]} renderOrder={20}>
      <mesh position={[0, -0.46, -0.92]} scale={[7.2, 2.2, 4.4]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshBasicMaterial
          ref={canopyRef}
          color={reviewMode === 'clay' ? '#171c24' : reviewMode === 'tonal' ? '#0f141d' : '#02050b'}
          transparent
          opacity={0.1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, -1.54, 0.12]} scale={[8.6, 3.6, 4.6]} rotation={[0.07, 0, 0]}>
        <sphereGeometry args={[1, 34, 22]} />
        <meshBasicMaterial
          ref={lowerFogRef}
          color={reviewMode === 'clay' ? '#141a22' : reviewMode === 'tonal' ? '#0d131b' : '#02050a'}
          transparent
          opacity={0.1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
