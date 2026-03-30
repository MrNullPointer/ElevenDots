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
      new THREE.Vector2(0.38, -1.08),
      new THREE.Vector2(0.34, -0.95),
      new THREE.Vector2(0.26, -0.52),
      new THREE.Vector2(0.19, 0.22),
      new THREE.Vector2(0.12, 0.86),
      new THREE.Vector2(0.08, 1.18),
    ],
    [],
  );
  const coreProfile = useMemo(
    () => [
      new THREE.Vector2(0.06, -0.86),
      new THREE.Vector2(0.08, -0.4),
      new THREE.Vector2(0.06, 0.46),
      new THREE.Vector2(0.03, 1.02),
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
      apexLight.intensity = 0.74 + boost;
      ringMaterial.opacity = 0.05 + boost * 0.08;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.32 + 0.5);

    group.rotation.y = -0.1 + Math.sin(t * 0.06) * 0.035;
    group.position.y = Math.sin(t * 0.12) * 0.018;

    apexLight.intensity = 0.62 + breath * 0.12 + boost * 0.95;
    ringMaterial.opacity = 0.035 + breath * 0.015 + boost * 0.08;
    ring.scale.setScalar(1 + breath * 0.045 + boost * 0.05);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.24, 18]} />
        <meshStandardMaterial
          color="#060b14"
          emissive="#0a1423"
          emissiveIntensity={0.04}
          roughness={0.34}
          metalness={0.72}
        />
      </mesh>

      <mesh>
        <latheGeometry args={[shellProfile, qualityTier === 'high' ? 32 : 22]} />
        <meshPhysicalMaterial
          color="#6f8ea1"
          roughness={0.15}
          metalness={0.1}
          transmission={0.5}
          thickness={1.1}
          ior={1.36}
          clearcoat={0.72}
          clearcoatRoughness={0.18}
          envMapIntensity={qualityTier === 'high' ? 0.2 : 0.14}
          transparent
          opacity={0.34}
        />
      </mesh>

      <mesh>
        <latheGeometry args={[coreProfile, 18]} />
        <meshStandardMaterial
          color="#7eb4c9"
          emissive="#8adcf1"
          emissiveIntensity={0.28}
          roughness={0.24}
          metalness={0.02}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <octahedronGeometry args={[0.12, qualityTier === 'high' ? 1 : 0]} />
        <meshPhysicalMaterial
          color="#b4d0df"
          emissive="#ccecff"
          emissiveIntensity={0.24}
          roughness={0.18}
          metalness={0}
          transmission={0.42}
          thickness={0.7}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.44, 56]} />
        <meshBasicMaterial
          color="#79bdce"
          transparent
          opacity={0.035}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.011, 12, 64]} />
        <meshBasicMaterial
          color="#74b8c9"
          transparent
          opacity={0.048}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={apexLightRef}
        color="#93d6ea"
        position={[0, 1.18, 0]}
        intensity={0.62}
        distance={5.8}
        decay={2}
      />
    </group>
  );
}
