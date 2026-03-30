'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { QualityTier } from '@/lib/store';

interface AxiomMonolithProps {
  qualityTier: QualityTier;
  paused: boolean;
  emphasis: number;
}

export default function AxiomMonolith({
  qualityTier,
  paused,
  emphasis,
}: AxiomMonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  const seamRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const edgeLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const group = groupRef.current;
    const seam = seamRef.current;
    const halo = haloRef.current;
    const edgeLight = edgeLightRef.current;
    if (!group || !seam || !halo || !edgeLight) return;

    const seamMaterial = seam.material as THREE.MeshBasicMaterial;
    const haloMaterial = halo.material as THREE.MeshBasicMaterial;
    const boost = emphasis * 0.44;

    if (paused) {
      edgeLight.intensity = 0.46 + boost;
      seamMaterial.opacity = 0.11 + boost * 0.08;
      haloMaterial.opacity = 0.045 + boost * 0.08;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.2 + 1.1);

    group.rotation.y = -0.16 + Math.sin(t * 0.04) * 0.028;
    group.position.y = Math.sin(t * 0.1) * 0.01;

    seamMaterial.opacity = 0.08 + breath * 0.015 + boost * 0.08;
    haloMaterial.opacity = 0.035 + breath * 0.012 + boost * 0.08;
    edgeLight.intensity = 0.36 + breath * 0.04 + boost * 0.95;
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        args={[1.3, 2.48, 0.58]}
        radius={0.068}
        smoothness={qualityTier === 'high' ? 8 : 6}
      >
        <meshStandardMaterial
          color="#060b15"
          emissive="#101830"
          emissiveIntensity={0.022}
          metalness={0.62}
          roughness={0.4}
          envMapIntensity={qualityTier === 'high' ? 0.17 : 0.12}
        />
      </RoundedBox>

      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.86, 2.04, 0.02]} />
        <meshPhysicalMaterial
          color="#070d1a"
          emissive="#101938"
          emissiveIntensity={0.028}
          metalness={0.42}
          roughness={0.46}
          clearcoat={0.24}
          clearcoatRoughness={0.44}
        />
      </mesh>

      <mesh ref={seamRef} position={[0, 0.22, 0.324]}>
        <boxGeometry args={[0.64, 0.014, 0.01]} />
        <meshBasicMaterial
          color="#6f7cb3"
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, -0.5, 0.324]}>
        <boxGeometry args={[0.5, 0.014, 0.01]} />
        <meshBasicMaterial
          color="#6672a6"
          transparent
          opacity={0.07}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-0.42, 0, 0.322]}>
        <boxGeometry args={[0.012, 1.82, 0.01]} />
        <meshBasicMaterial
          color="#6976ad"
          transparent
          opacity={0.07}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0.42, 0, 0.322]}>
        <boxGeometry args={[0.012, 1.82, 0.01]} />
        <meshBasicMaterial
          color="#6976ad"
          transparent
          opacity={0.07}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.34]}>
        <boxGeometry args={[1.08, 2.22, 0.02]} />
        <meshStandardMaterial
          color="#050a12"
          emissive="#0d1630"
          emissiveIntensity={0.028}
          roughness={0.48}
          metalness={0.54}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh ref={haloRef} position={[0.88, 0.1, -0.52]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.46, 0.86, 72]} />
        <meshBasicMaterial
          color="#5f67ab"
          transparent
          opacity={0.036}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={edgeLightRef}
        color="#6468a7"
        position={[1.02, 0.44, -0.5]}
        intensity={0.36}
        distance={5.6}
        decay={2}
      />
    </group>
  );
}
