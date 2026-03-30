'use client';

import { Edges, RoundedBox } from '@react-three/drei';
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
  const backLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const group = groupRef.current;
    const seam = seamRef.current;
    const halo = haloRef.current;
    const edgeLight = edgeLightRef.current;
    const backLight = backLightRef.current;
    if (!group || !seam || !halo || !edgeLight || !backLight) return;

    const seamMaterial = seam.material as THREE.MeshBasicMaterial;
    const haloMaterial = halo.material as THREE.MeshBasicMaterial;
    const boost = emphasis * 0.44;

    if (paused) {
      edgeLight.intensity = 0.84 + boost;
      backLight.intensity = 0.42 + boost * 0.42;
      seamMaterial.opacity = 0.16 + boost * 0.08;
      haloMaterial.opacity = 0.04 + boost * 0.08;
      return;
    }

    const t = state.clock.elapsedTime;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.2 + 1.1);

    group.rotation.y = -0.15 + Math.sin(t * 0.035) * 0.022;
    group.position.y = Math.sin(t * 0.09) * 0.008;

    seamMaterial.opacity = 0.12 + breath * 0.02 + boost * 0.08;
    haloMaterial.opacity = 0.03 + breath * 0.01 + boost * 0.08;
    edgeLight.intensity = 0.7 + breath * 0.08 + boost * 0.95;
    backLight.intensity = 0.3 + breath * 0.04 + boost * 0.42;
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        args={[1.3, 2.48, 0.58]}
        radius={0.068}
        smoothness={qualityTier === 'high' ? 8 : 6}
      >
        <meshPhysicalMaterial
          color="#0d1628"
          emissive="#1a2a4a"
          emissiveIntensity={0.084}
          metalness={0.7}
          roughness={0.22}
          clearcoat={0.22}
          clearcoatRoughness={0.44}
          envMapIntensity={qualityTier === 'high' ? 0.28 : 0.22}
        />
        <Edges color="#8b97d4" threshold={28} scale={1.004} />
      </RoundedBox>

      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.86, 2.04, 0.02]} />
        <meshPhysicalMaterial
          color="#070d1a"
          emissive="#16274a"
          emissiveIntensity={0.09}
          metalness={0.5}
          roughness={0.3}
          clearcoat={0.36}
          clearcoatRoughness={0.32}
        />
      </mesh>

      <mesh ref={seamRef} position={[0, 0.22, 0.324]}>
        <boxGeometry args={[0.64, 0.014, 0.01]} />
        <meshBasicMaterial
          color="#7482bf"
          transparent
          opacity={0.1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.72, 0.324]}>
        <boxGeometry args={[0.52, 0.01, 0.01]} />
        <meshBasicMaterial color="#8b98d6" transparent opacity={0.07} toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.82, 0.324]}>
        <boxGeometry args={[0.46, 0.01, 0.01]} />
        <meshBasicMaterial color="#8090cc" transparent opacity={0.06} toneMapped={false} />
      </mesh>

      <mesh position={[0, -0.5, 0.324]}>
        <boxGeometry args={[0.5, 0.014, 0.01]} />
        <meshBasicMaterial
          color="#6976af"
          transparent
          opacity={0.09}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-0.42, 0, 0.322]}>
        <boxGeometry args={[0.012, 1.82, 0.01]} />
        <meshBasicMaterial
          color="#6f7db8"
          transparent
          opacity={0.1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0.42, 0, 0.322]}>
        <boxGeometry args={[0.012, 1.82, 0.01]} />
        <meshBasicMaterial
          color="#6f7db8"
          transparent
          opacity={0.1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.0, 0.326]}>
        <boxGeometry args={[0.01, 1.96, 0.01]} />
        <meshBasicMaterial color="#8f9ad7" transparent opacity={0.06} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0.326]}>
        <boxGeometry args={[1.02, 2.28, 0.01]} />
        <meshBasicMaterial color="#93a0dc" transparent opacity={0.16} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.34]}>
        <boxGeometry args={[1.08, 2.22, 0.02]} />
        <meshStandardMaterial
          color="#091223"
          emissive="#1a2b50"
          emissiveIntensity={0.08}
          roughness={0.42}
          metalness={0.5}
          transparent
          opacity={0.94}
        />
      </mesh>

      <mesh ref={haloRef} position={[0.92, 0.12, -0.56]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.4, 0.82, 72]} />
        <meshBasicMaterial
          color="#5f67ab"
          transparent
          opacity={0.022}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={edgeLightRef}
        color="#7e86d0"
        position={[1.04, 0.46, -0.52]}
        intensity={0.7}
        distance={5.8}
        decay={2}
      />

      <pointLight
        ref={backLightRef}
        color="#5e6ca7"
        position={[-0.7, 0.34, -1.02]}
        intensity={0.3}
        distance={4.6}
        decay={2}
      />
    </group>
  );
}
