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
      light.intensity = 0.94 + boost * 0.9;
      filamentMaterial.opacity = 0.038 + boost * 0.08;
      haloMaterial.opacity = 0.03 + boost * 0.075;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.24 + 0.6);

    group.position.y = Math.sin(t * 0.1) * 0.009;
    shell.rotation.y = t * 0.05;
    innerLayer.rotation.y = -t * 0.08;

    light.intensity = 0.86 + breath * 0.12 + boost * 0.92;
    filamentMaterial.opacity = 0.028 + breath * 0.01 + boost * 0.08;
    haloMaterial.opacity = 0.014 + breath * 0.007 + boost * 0.08;
    halo.scale.setScalar(1 + breath * 0.04);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={shellRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          color="#8ea0ba"
          roughness={0.2}
          metalness={0.02}
          transmission={0.74}
          thickness={1.72}
          ior={1.38}
          clearcoat={0.78}
          clearcoatRoughness={0.24}
          envMapIntensity={qualityTier === 'high' ? 0.22 : 0.16}
          transparent
          opacity={0.3}
          flatShading
        />
      </mesh>

      <mesh ref={innerLayerRef} rotation={[0.24, 0.34, 0]}>
        <octahedronGeometry args={[0.54, 0]} />
        <meshPhysicalMaterial
          color="#7389ab"
          emissive="#7d9cc2"
          emissiveIntensity={0.3}
          roughness={0.16}
          metalness={0.02}
          transmission={0.46}
          thickness={1.08}
          transparent
          opacity={0.26}
          flatShading
        />
      </mesh>

      <mesh scale={[1, 1.12, 0.9]} rotation={[0.15, 0.2, 0.1]}>
        <octahedronGeometry args={[0.24, 1]} />
        <meshPhysicalMaterial
          color="#d7e8f8"
          emissive="#e2f3ff"
          emissiveIntensity={1.12}
          roughness={0.1}
          metalness={0}
          transmission={0.24}
          thickness={0.42}
          toneMapped={false}
          flatShading
        />
      </mesh>

      <mesh scale={[1, 1.02, 0.96]} rotation={[0.2, -0.14, 0.24]}>
        <icosahedronGeometry args={[0.33, 0]} />
        <meshPhysicalMaterial
          color="#a1b8d0"
          roughness={0.22}
          metalness={0}
          transmission={0.4}
          thickness={0.82}
          transparent
          opacity={0.14}
          toneMapped={false}
          flatShading
        />
      </mesh>

      <mesh rotation={[0.34, 0.2, 0.58]}>
        <torusGeometry args={[0.36, 0.006, 12, 96]} />
        <meshBasicMaterial
          color="#b2cce2"
          transparent
          opacity={0.03}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={filamentRef} rotation={[0.56, 0.1, 0.22]}>
        <torusGeometry args={[0.29, 0.006, 12, 92]} />
        <meshBasicMaterial
          color="#e8bb96"
          transparent
          opacity={0.028}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
        <ringGeometry args={[0.42, 0.88, 72]} />
        <meshBasicMaterial
          color="#a6bfd4"
          transparent
          opacity={0.014}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#dcecff"
        intensity={0.86}
        distance={5.9}
        decay={2}
      />
    </group>
  );
}
