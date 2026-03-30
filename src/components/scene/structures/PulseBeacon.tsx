'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide } from 'three';
import * as THREE from 'three';
import type { QualityTier } from '@/lib/store';

interface PulseBeaconProps {
  qualityTier: QualityTier;
  paused: boolean;
  emphasis: number;
}

export default function PulseBeacon({ qualityTier, paused, emphasis }: PulseBeaconProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const apexLightRef = useRef<THREE.PointLight>(null);
  const shellProfile = useMemo(
    () => [
      new THREE.Vector2(0.28, -1.06),
      new THREE.Vector2(0.24, -0.9),
      new THREE.Vector2(0.17, -0.5),
      new THREE.Vector2(0.12, 0.16),
      new THREE.Vector2(0.08, 0.86),
      new THREE.Vector2(0.055, 1.18),
    ],
    [],
  );
  const coreProfile = useMemo(
    () => [
      new THREE.Vector2(0.03, -0.8),
      new THREE.Vector2(0.045, -0.4),
      new THREE.Vector2(0.038, 0.54),
      new THREE.Vector2(0.016, 1.04),
    ],
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    const ring = ringRef.current;
    const apexLight = apexLightRef.current;
    if (!group || !ring || !apexLight) return;

    const ringMaterial = ring.material as THREE.MeshBasicMaterial;
    const boost = emphasis * 0.44;

    if (paused) {
      apexLight.intensity = 0.86 + boost;
      ringMaterial.opacity = 0.03 + boost * 0.09;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.32 + 0.5);

    group.rotation.y = -0.12 + Math.sin(t * 0.05) * 0.026;
    group.position.y = Math.sin(t * 0.1) * 0.012;

    apexLight.intensity = 0.72 + breath * 0.13 + boost * 0.96;
    ringMaterial.opacity = 0.022 + breath * 0.012 + boost * 0.09;
    ring.scale.setScalar(1 + breath * 0.035 + boost * 0.05);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.18, 6]} />
        <meshStandardMaterial
          color="#060a13"
          emissive="#0a1423"
          emissiveIntensity={0.05}
          roughness={0.3}
          metalness={0.74}
        />
      </mesh>

      <mesh>
        <latheGeometry args={[shellProfile, qualityTier === 'high' ? 14 : 10]} />
        <meshPhysicalMaterial
          color="#6f8ca0"
          roughness={0.2}
          metalness={0.08}
          transmission={0.62}
          thickness={1.26}
          ior={1.4}
          clearcoat={0.74}
          clearcoatRoughness={0.22}
          envMapIntensity={qualityTier === 'high' ? 0.18 : 0.12}
          transparent
          opacity={0.34}
          flatShading
        />
      </mesh>

      <mesh>
        <latheGeometry args={[coreProfile, 10]} />
        <meshStandardMaterial
          color="#7aa9be"
          emissive="#84d3e8"
          emissiveIntensity={0.4}
          roughness={0.28}
          metalness={0.02}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <octahedronGeometry args={[0.12, qualityTier === 'high' ? 1 : 0]} />
        <meshPhysicalMaterial
          color="#b3ccde"
          emissive="#c8e8fa"
          emissiveIntensity={0.2}
          roughness={0.16}
          metalness={0}
          transmission={0.48}
          thickness={0.62}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.082, 0.012, 10, 18]} />
        <meshStandardMaterial
          color="#121b2a"
          emissive="#1b2d43"
          emissiveIntensity={0.05}
          roughness={0.38}
          metalness={0.54}
        />
      </mesh>

      {[0, 2.094, 4.188].map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 0.11, 0.08, Math.sin(angle) * 0.11]}
          rotation={[0, -angle, 0.08]}
        >
          <boxGeometry args={[0.028, 1.26, 0.012]} />
          <meshStandardMaterial
            color="#121d2d"
            emissive="#1a2f46"
            emissiveIntensity={0.04}
            roughness={0.38}
            metalness={0.46}
          />
        </mesh>
      ))}

      <mesh ref={ringRef} position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.24, 42]} />
        <meshBasicMaterial
          color="#7ebdd0"
          transparent
          opacity={0.03}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.24, 0]}>
        <octahedronGeometry args={[0.05, 0]} />
        <meshBasicMaterial
          color="#ccecff"
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={apexLightRef}
        color="#9adcf0"
        position={[0, 1.18, 0]}
        intensity={0.86}
        distance={5.6}
        decay={2}
      />
    </group>
  );
}
