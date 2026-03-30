'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { QualityTier } from '@/lib/store';

interface AboutCoreProps {
  qualityTier: QualityTier;
  paused: boolean;
  emphasis: number;
}

export default function AboutCore({ qualityTier, paused, emphasis }: AboutCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const innerLayerRef = useRef<THREE.Mesh>(null);
  const filamentRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const group = groupRef.current;
    const shell = shellRef.current;
    const innerLayer = innerLayerRef.current;
    const filament = filamentRef.current;
    const halo = haloRef.current;
    const light = lightRef.current;
    if (!group || !shell || !innerLayer || !filament || !halo || !light) return;

    const filamentMaterial = filament.material as THREE.MeshBasicMaterial;
    const haloMaterial = halo.material as THREE.MeshBasicMaterial;
    const boost = emphasis * 0.38;

    if (paused) {
      light.intensity = 0.66 + boost * 0.9;
      filamentMaterial.opacity = 0.05 + boost * 0.08;
      haloMaterial.opacity = 0.032 + boost * 0.075;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.24 + 0.6);

    group.position.y = Math.sin(t * 0.11) * 0.012;
    shell.rotation.y = t * 0.07;
    innerLayer.rotation.y = -t * 0.1;

    light.intensity = 0.58 + breath * 0.08 + boost * 0.9;
    filamentMaterial.opacity = 0.035 + breath * 0.012 + boost * 0.08;
    haloMaterial.opacity = 0.026 + breath * 0.01 + boost * 0.08;
    halo.scale.setScalar(1 + breath * 0.05);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.86, qualityTier === 'high' ? 3 : 2]} />
        <meshPhysicalMaterial
          color="#7f8ea7"
          roughness={0.2}
          metalness={0.05}
          transmission={0.58}
          thickness={1.3}
          ior={1.34}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={qualityTier === 'high' ? 0.2 : 0.14}
          transparent
          opacity={0.33}
        />
      </mesh>

      <mesh ref={innerLayerRef}>
        <icosahedronGeometry args={[0.63, 1]} />
        <meshPhysicalMaterial
          color="#5f7396"
          emissive="#6d80a4"
          emissiveIntensity={0.08}
          roughness={0.22}
          metalness={0.02}
          transmission={0.34}
          thickness={0.9}
          transparent
          opacity={0.26}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.2, 30, 30]} />
        <meshStandardMaterial
          color="#d2e3f3"
          emissive="#d3e9ff"
          emissiveIntensity={0.42}
          roughness={0.24}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={filamentRef} rotation={[0.56, 0.1, 0.22]}>
        <torusGeometry args={[0.3, 0.009, 12, 88]} />
        <meshBasicMaterial
          color="#e8bb96"
          transparent
          opacity={0.035}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
        <ringGeometry args={[0.46, 0.9, 72]} />
        <meshBasicMaterial
          color="#a6bfd4"
          transparent
          opacity={0.024}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#d5e8ff"
        intensity={0.58}
        distance={5}
        decay={2}
      />
    </group>
  );
}
