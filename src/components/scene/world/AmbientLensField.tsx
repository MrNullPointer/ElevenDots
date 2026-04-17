'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { DestinationId, QualityTier } from '@/lib/store';

interface AmbientLensFieldProps {
  qualityTier: QualityTier;
  paused: boolean;
  mode: DestinationId | 'idle';
}

const SHELL_BASE = new THREE.Color('#101824');
const SHELL_PULSE = new THREE.Color('#163448');
const SHELL_AXIOM = new THREE.Color('#2b3046');
const SHELL_ABOUT = new THREE.Color('#171d28');
const INNER_BASE = new THREE.Color('#172635');
const INNER_PULSE = new THREE.Color('#1d5062');
const INNER_AXIOM = new THREE.Color('#39456f');
const INNER_ABOUT = new THREE.Color('#24303c');
const VEIL_BASE = new THREE.Color('#243241');
const VEIL_PULSE = new THREE.Color('#347f89');
const VEIL_AXIOM = new THREE.Color('#525f93');
const VEIL_ABOUT = new THREE.Color('#3c4654');
const LIGHT_BASE = new THREE.Color('#7e94aa');
const LIGHT_PULSE = new THREE.Color('#7ce2da');
const LIGHT_AXIOM = new THREE.Color('#b3baf5');
const LIGHT_ABOUT = new THREE.Color('#d0d8e4');

type ModeBlend = {
  pulse: number;
  axiom: number;
  about: number;
};

export default function AmbientLensField({
  qualityTier,
  paused,
  mode,
}: AmbientLensFieldProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerShellRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerShellRef = useRef<THREE.MeshStandardMaterial>(null);
  const veilRef = useRef<THREE.MeshBasicMaterial>(null);
  const seamRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.MeshBasicMaterial>(null);
  const leftFlankRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightFlankRef = useRef<THREE.MeshStandardMaterial>(null);
  const cavityRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreRef = useRef<THREE.MeshStandardMaterial>(null);
  const centerLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const cavityMeshRef = useRef<THREE.Mesh>(null);
  const seamMeshRef = useRef<THREE.Mesh>(null);
  const haloMeshRef = useRef<THREE.Mesh>(null);
  const modeBlendRef = useRef<ModeBlend>({ pulse: 0, axiom: 0, about: 0 });
  const scratchColorRef = useRef(new THREE.Color());
  const scratchLightColorRef = useRef(new THREE.Color());

  const lensSegments = qualityTier === 'high' ? 42 : qualityTier === 'medium' ? 34 : 26;
  const discSegments = qualityTier === 'high' ? 72 : qualityTier === 'medium' ? 56 : 40;

  useFrame((state, delta) => {
    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const blend = 1 - Math.exp(-delta * 2.6);
    const modeBlend = modeBlendRef.current;

    modeBlend.pulse += (targetPulse - modeBlend.pulse) * blend;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * blend;
    modeBlend.about += (targetAbout - modeBlend.about) * blend;

    if (rootRef.current) {
      if (paused) {
        rootRef.current.position.y = 0.14;
        rootRef.current.rotation.x = 0.04;
        rootRef.current.rotation.y = -0.08;
      } else {
        const t = state.clock.elapsedTime;
        rootRef.current.position.y = 0.14 + Math.sin(t * 0.08) * 0.008;
        rootRef.current.rotation.x = 0.04 + Math.sin(t * 0.05 + 0.4) * 0.006;
        rootRef.current.rotation.y = -0.08 + Math.sin(t * 0.04) * 0.009;
      }
    }

    if (outerShellRef.current) {
      const shellColor = scratchColorRef.current;
      shellColor.copy(SHELL_BASE);
      shellColor.lerp(SHELL_PULSE, modeBlend.pulse * 0.52);
      shellColor.lerp(SHELL_AXIOM, modeBlend.axiom * 0.44);
      shellColor.lerp(SHELL_ABOUT, modeBlend.about * 0.34);
      outerShellRef.current.emissive.copy(shellColor);
      outerShellRef.current.emissiveIntensity =
        0.22 + modeBlend.pulse * 0.12 + modeBlend.axiom * 0.08 + modeBlend.about * 0.04;
      outerShellRef.current.opacity =
        0.5 + modeBlend.pulse * 0.08 + modeBlend.axiom * 0.06 - modeBlend.about * 0.06;
    }

    if (innerShellRef.current) {
      const innerColor = scratchColorRef.current;
      innerColor.copy(INNER_BASE);
      innerColor.lerp(INNER_PULSE, modeBlend.pulse * 0.6);
      innerColor.lerp(INNER_AXIOM, modeBlend.axiom * 0.48);
      innerColor.lerp(INNER_ABOUT, modeBlend.about * 0.38);
      innerShellRef.current.emissive.copy(innerColor);
      innerShellRef.current.emissiveIntensity =
        0.3 + modeBlend.pulse * 0.18 + modeBlend.axiom * 0.1 + modeBlend.about * 0.06;
      innerShellRef.current.opacity =
        0.42 + modeBlend.pulse * 0.14 + modeBlend.axiom * 0.08 - modeBlend.about * 0.04;
    }

    if (veilRef.current) {
      const veilColor = scratchColorRef.current;
      veilColor.copy(VEIL_BASE);
      veilColor.lerp(VEIL_PULSE, modeBlend.pulse * 0.62);
      veilColor.lerp(VEIL_AXIOM, modeBlend.axiom * 0.54);
      veilColor.lerp(VEIL_ABOUT, modeBlend.about * 0.42);
      veilRef.current.color.copy(veilColor);
      veilRef.current.opacity =
        0.18 + modeBlend.pulse * 0.1 + modeBlend.axiom * 0.07 + modeBlend.about * 0.04;
    }

    if (seamRef.current && seamMeshRef.current) {
      const seamLight = scratchLightColorRef.current;
      seamLight.copy(LIGHT_BASE);
      seamLight.lerp(LIGHT_PULSE, modeBlend.pulse * 0.52);
      seamLight.lerp(LIGHT_AXIOM, modeBlend.axiom * 0.44);
      seamLight.lerp(LIGHT_ABOUT, modeBlend.about * 0.3);
      seamRef.current.color.copy(seamLight);
      seamRef.current.opacity =
        0.16 + modeBlend.pulse * 0.12 + modeBlend.axiom * 0.1 + modeBlend.about * 0.036;
      seamMeshRef.current.scale.set(
        1.08 + modeBlend.pulse * 0.08 + modeBlend.axiom * 0.1 - modeBlend.about * 0.02,
        0.62 + modeBlend.about * 0.05 + modeBlend.axiom * 0.03,
        0.075 + modeBlend.axiom * 0.01,
      );
    }

    if (haloRef.current && haloMeshRef.current) {
      const haloColor = scratchLightColorRef.current;
      haloColor.copy(LIGHT_BASE);
      haloColor.lerp(LIGHT_PULSE, modeBlend.pulse * 0.42);
      haloColor.lerp(LIGHT_AXIOM, modeBlend.axiom * 0.34);
      haloColor.lerp(LIGHT_ABOUT, modeBlend.about * 0.36);
      haloRef.current.color.copy(haloColor);
      haloRef.current.opacity =
        0.14 + modeBlend.pulse * 0.08 + modeBlend.axiom * 0.06 + modeBlend.about * 0.05;
      haloMeshRef.current.scale.setScalar(
        1 + modeBlend.pulse * 0.05 - modeBlend.axiom * 0.02 + modeBlend.about * 0.04,
      );
    }

    if (leftFlankRef.current) {
      leftFlankRef.current.opacity =
        0.56 + modeBlend.axiom * 0.08 - modeBlend.pulse * 0.04 - modeBlend.about * 0.05;
      leftFlankRef.current.emissiveIntensity = 0.04 + modeBlend.axiom * 0.04;
    }

    if (rightFlankRef.current) {
      rightFlankRef.current.opacity =
        0.52 + modeBlend.pulse * 0.08 + modeBlend.axiom * 0.04 - modeBlend.about * 0.05;
      rightFlankRef.current.emissiveIntensity =
        0.035 + modeBlend.pulse * 0.05 + modeBlend.axiom * 0.02;
    }

    if (cavityRef.current && cavityMeshRef.current) {
      cavityRef.current.opacity =
        0.94 - modeBlend.pulse * 0.08 - modeBlend.axiom * 0.04 + modeBlend.about * 0.02;
      cavityMeshRef.current.scale.set(
        0.92 + modeBlend.pulse * 0.08 - modeBlend.about * 0.05,
        0.45 - modeBlend.pulse * 0.05 + modeBlend.about * 0.06,
        0.18 + modeBlend.axiom * 0.03,
      );
    }

    if (coreRef.current) {
      coreRef.current.opacity =
        0.94 - modeBlend.pulse * 0.1 - modeBlend.axiom * 0.04 + modeBlend.about * 0.03;
      coreRef.current.emissiveIntensity =
        0.015 + modeBlend.pulse * 0.03 + modeBlend.axiom * 0.02 + modeBlend.about * 0.012;
    }

    if (centerLightRef.current) {
      const lightColor = scratchLightColorRef.current;
      lightColor.copy(LIGHT_BASE);
      lightColor.lerp(LIGHT_PULSE, modeBlend.pulse * 0.64);
      lightColor.lerp(LIGHT_AXIOM, modeBlend.axiom * 0.46);
      lightColor.lerp(LIGHT_ABOUT, modeBlend.about * 0.38);
      centerLightRef.current.color.copy(lightColor);
      centerLightRef.current.intensity =
        0.48 + modeBlend.pulse * 0.34 + modeBlend.axiom * 0.18 + modeBlend.about * 0.12;
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity =
        0.24 + modeBlend.pulse * 0.12 + modeBlend.axiom * 0.16 + modeBlend.about * 0.06;
    }
  });

  return (
    <group ref={rootRef} position={[0.08, 0.14, -3.86]} rotation={[0.04, -0.08, 0]}>
      <mesh position={[-4.6, 0.2, -1.65]} scale={[2.9, 3.4, 2.4]} renderOrder={1}>
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={leftFlankRef}
          color="#060a11"
          emissive="#101824"
          emissiveIntensity={0.04}
          roughness={0.86}
          metalness={0.08}
          transparent
          opacity={0.64}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[4.3, 0.12, -1.4]} scale={[2.7, 3.1, 2.2]} renderOrder={1}>
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={rightFlankRef}
          color="#070b12"
          emissive="#111b29"
          emissiveIntensity={0.035}
          roughness={0.84}
          metalness={0.08}
          transparent
          opacity={0.6}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0.12, 0.02, -0.42]} scale={[3.08, 1.64, 0.34]} renderOrder={2}>
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={outerShellRef}
          color="#09111a"
          emissive="#101824"
          emissiveIntensity={0.22}
          roughness={0.34}
          metalness={0.12}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0.08, 0.01, -0.12]} scale={[1.92, 1.02, 0.24]} renderOrder={3}>
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={innerShellRef}
          color="#0f1824"
          emissive="#172635"
          emissiveIntensity={0.3}
          roughness={0.28}
          metalness={0.06}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[0.04, 0.01, -0.18]}
        scale={[1.98, 1.04, 1]}
        rotation={[0, 0, -0.02]}
        renderOrder={4}
      >
        <circleGeometry args={[1, discSegments]} />
        <meshBasicMaterial
          ref={veilRef}
          color="#243241"
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={seamMeshRef}
        position={[0.06, 0.01, 0.07]}
        scale={[1.08, 0.62, 0.075]}
        rotation={[0, 0.04, 0]}
        renderOrder={5}
      >
        <torusGeometry args={[0.74, 0.06, 18, discSegments]} />
        <meshBasicMaterial
          ref={seamRef}
          color="#7e94aa"
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={haloMeshRef}
        position={[0.03, 0.02, -0.12]}
        scale={[1.38, 0.74, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={4}
      >
        <ringGeometry args={[0.46, 0.98, discSegments]} />
        <meshBasicMaterial
          ref={haloRef}
          color="#7e94aa"
          transparent
          opacity={0.14}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={cavityMeshRef}
        position={[0.02, 0.02, 0.11]}
        scale={[0.92, 0.45, 0.18]}
        renderOrder={6}
      >
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={cavityRef}
          color="#010307"
          emissive="#070b12"
          emissiveIntensity={0.02}
          roughness={0.92}
          metalness={0.02}
          transparent
          opacity={0.94}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0.02, 0.02, 0.16]} scale={[0.44, 0.18, 0.08]} renderOrder={7}>
        <sphereGeometry args={[1, lensSegments, lensSegments]} />
        <meshStandardMaterial
          ref={coreRef}
          color="#02050a"
          emissive="#121923"
          emissiveIntensity={0.015}
          roughness={0.94}
          metalness={0}
          transparent
          opacity={0.94}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={centerLightRef}
        color="#7e94aa"
        position={[0.08, 0.1, -0.18]}
        intensity={0.48}
        distance={4.8}
        decay={2}
      />

      <pointLight
        ref={rimLightRef}
        color="#8291a6"
        position={[1.36, 0.5, -0.42]}
        intensity={0.24}
        distance={4.2}
        decay={2}
      />
    </group>
  );
}
