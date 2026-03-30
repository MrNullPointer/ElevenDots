'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { DestinationId, QualityTier } from '@/lib/store';

interface ObservatoryFieldProps {
  qualityTier: QualityTier;
  paused: boolean;
  mode: DestinationId | 'idle';
  reviewMode?: 'dark' | 'tonal' | 'clay';
}

type ModeBlend = {
  pulse: number;
  axiom: number;
  about: number;
};

const APERTURE_BASE = new THREE.Color('#223348');
const APERTURE_PULSE = new THREE.Color('#2f5f79');
const APERTURE_AXIOM = new THREE.Color('#5a5f8b');
const APERTURE_ABOUT = new THREE.Color('#5f6a73');
const CORE_BASE = new THREE.Color('#7f8c9a');
const CORE_PULSE = new THREE.Color('#97c3cc');
const CORE_AXIOM = new THREE.Color('#a5abd0');
const CORE_ABOUT = new THREE.Color('#b5bcc3');

export default function ObservatoryField({
  qualityTier,
  paused,
  mode,
  reviewMode = 'dark',
}: ObservatoryFieldProps) {
  const chamberRef = useRef<THREE.Group>(null);
  const overheadRef = useRef<THREE.MeshStandardMaterial>(null);
  const leftWallRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightWallRef = useRef<THREE.MeshStandardMaterial>(null);
  const midRef = useRef<THREE.MeshStandardMaterial>(null);
  const apertureRingRef = useRef<THREE.MeshStandardMaterial>(null);
  const apertureLipRef = useRef<THREE.MeshStandardMaterial>(null);
  const apertureMembraneRef = useRef<THREE.MeshStandardMaterial>(null);
  const apertureCoreRef = useRef<THREE.MeshStandardMaterial>(null);
  const apertureLightRef = useRef<THREE.PointLight>(null);
  const modeBlendRef = useRef<ModeBlend>({ pulse: 0, axiom: 0, about: 0 });
  const scratchColorRef = useRef(new THREE.Color());

  const shellSegments = qualityTier === 'low' ? 10 : qualityTier === 'medium' ? 14 : 18;
  const apertureSegments = qualityTier === 'low' ? 40 : qualityTier === 'medium' ? 56 : 72;
  const clay = reviewMode === 'clay';
  const tonal = reviewMode === 'tonal';

  useFrame((state, delta) => {
    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const blend = 1 - Math.exp(-delta * 2.8);
    const modeBlend = modeBlendRef.current;

    modeBlend.pulse += (targetPulse - modeBlend.pulse) * blend;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * blend;
    modeBlend.about += (targetAbout - modeBlend.about) * blend;

    if (chamberRef.current && !paused) {
      const t = state.clock.elapsedTime;
      chamberRef.current.position.y = 0.15 + Math.sin(t * 0.05) * 0.012;
      chamberRef.current.rotation.y = Math.sin(t * 0.036) * 0.038;
      chamberRef.current.rotation.x = -0.02 + Math.sin(t * 0.04 + 0.6) * 0.006;
    }

    const enclosureBase = clay ? 0.052 : tonal ? 0.034 : 0.022;
    if (overheadRef.current && leftWallRef.current && rightWallRef.current && midRef.current) {
      const enclosureBoost =
        modeBlend.pulse * 0.006 + modeBlend.axiom * 0.01 + modeBlend.about * 0.008;
      overheadRef.current.emissiveIntensity = enclosureBase * 0.92 + enclosureBoost * 0.65;
      leftWallRef.current.emissiveIntensity = enclosureBase + enclosureBoost;
      rightWallRef.current.emissiveIntensity = enclosureBase * 0.96 + enclosureBoost * 0.92;
      midRef.current.emissiveIntensity = enclosureBase * 1.08 + enclosureBoost * 0.7;
    }

    if (apertureRingRef.current && apertureLipRef.current && apertureMembraneRef.current && apertureCoreRef.current) {
      const apertureBase = clay ? 0.072 : tonal ? 0.056 : 0.044;
      apertureRingRef.current.emissiveIntensity = apertureBase + modeBlend.axiom * 0.012;
      apertureLipRef.current.emissiveIntensity = apertureBase * 1.08 + modeBlend.about * 0.012;
      apertureMembraneRef.current.emissiveIntensity =
        apertureBase * 1.24 + modeBlend.pulse * 0.014 + modeBlend.about * 0.01;
      apertureCoreRef.current.emissiveIntensity =
        apertureBase * 1.5 + modeBlend.pulse * 0.018 + modeBlend.axiom * 0.01;
    }

    if (apertureMembraneRef.current && !clay) {
      const emissive = scratchColorRef.current;
      emissive.copy(APERTURE_BASE);
      emissive.lerp(APERTURE_PULSE, modeBlend.pulse * 0.5);
      emissive.lerp(APERTURE_AXIOM, modeBlend.axiom * 0.5);
      emissive.lerp(APERTURE_ABOUT, modeBlend.about * 0.4);
      apertureMembraneRef.current.emissive.copy(emissive);
    }

    if (apertureCoreRef.current) {
      const coreColor = scratchColorRef.current;
      coreColor.copy(CORE_BASE);
      coreColor.lerp(CORE_PULSE, modeBlend.pulse * 0.5);
      coreColor.lerp(CORE_AXIOM, modeBlend.axiom * 0.45);
      coreColor.lerp(CORE_ABOUT, modeBlend.about * 0.42);
      apertureCoreRef.current.emissive.copy(coreColor);
    }

    if (apertureLightRef.current) {
      apertureLightRef.current.intensity =
        (clay ? 0.16 : tonal ? 0.14 : 0.11) +
        modeBlend.pulse * 0.03 +
        modeBlend.about * 0.024 +
        modeBlend.axiom * 0.02;
    }
  });

  return (
    <group ref={chamberRef} position={[0.08, 0.15, -2.9]} rotation={[-0.02, 0.014, 0]}>
      <mesh position={[0.26, 3.34, -3.34]} rotation={[0.2, 0.06, 0.02]} scale={[8.2, 2.8, 6.2]}>
        <sphereGeometry args={[1, shellSegments, shellSegments]} />
        <meshStandardMaterial
          ref={overheadRef}
          color={clay ? '#323841' : tonal ? '#1a212b' : '#070c15'}
          emissive={clay ? '#6f7886' : tonal ? '#4d5868' : '#1a2a3d'}
          roughness={clay ? 0.9 : tonal ? 0.84 : 0.75}
          metalness={clay ? 0.03 : tonal ? 0.08 : 0.18}
          flatShading={clay}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-5.08, 0.42, -3.32]} rotation={[0.02, 0.26, 0.06]} scale={[3.2, 4.6, 3.4]}>
        <sphereGeometry args={[1, shellSegments, shellSegments]} />
        <meshStandardMaterial
          ref={leftWallRef}
          color={clay ? '#2d333c' : tonal ? '#181f29' : '#060a13'}
          emissive={clay ? '#6a7380' : tonal ? '#4a5665' : '#182639'}
          roughness={clay ? 0.9 : tonal ? 0.83 : 0.74}
          metalness={clay ? 0.03 : tonal ? 0.09 : 0.2}
          flatShading={clay}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[5.72, 0.5, -3.56]} rotation={[-0.03, -0.3, -0.08]} scale={[3.0, 4.2, 3.2]}>
        <sphereGeometry args={[1, shellSegments, shellSegments]} />
        <meshStandardMaterial
          ref={rightWallRef}
          color={clay ? '#2d333d' : tonal ? '#18202a' : '#060a13'}
          emissive={clay ? '#6b7380' : tonal ? '#4b5665' : '#18263b'}
          roughness={clay ? 0.9 : tonal ? 0.83 : 0.74}
          metalness={clay ? 0.03 : tonal ? 0.09 : 0.2}
          flatShading={clay}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0.18, 0.5, -4.22]} rotation={[0.01, -0.05, 0.01]}>
        <ringGeometry args={[0.5, 0.66, apertureSegments, 1, Math.PI * 0.22, Math.PI * 1.36]} />
        <meshStandardMaterial
          ref={midRef}
          color={clay ? '#444b55' : tonal ? '#202734' : '#0c1321'}
          emissive={clay ? '#7c8592' : tonal ? '#536074' : '#24364d'}
          roughness={clay ? 0.86 : tonal ? 0.8 : 0.68}
          metalness={clay ? 0.03 : tonal ? 0.1 : 0.24}
          flatShading={clay}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[0.15, 0.48, -3.98]} rotation={[0.016, -0.034, 0.006]}>
        <mesh>
          <ringGeometry args={[0.28, 0.37, apertureSegments]} />
          <meshStandardMaterial
            ref={apertureRingRef}
            color={clay ? '#555c66' : tonal ? '#263142' : '#0d1626'}
            emissive={clay ? '#9ca6b2' : tonal ? '#5b6a80' : '#2a405b'}
            roughness={clay ? 0.84 : tonal ? 0.72 : 0.5}
            metalness={clay ? 0.02 : tonal ? 0.1 : 0.26}
            flatShading={clay}
          />
        </mesh>

        <mesh position={[0, 0, -0.07]}>
          <ringGeometry args={[0.12, 0.21, apertureSegments]} />
          <meshStandardMaterial
            ref={apertureLipRef}
            color={clay ? '#5f6671' : tonal ? '#2f3a4b' : '#101a2b'}
            emissive={clay ? '#a7b0bb' : tonal ? '#66758b' : '#314962'}
            roughness={clay ? 0.82 : tonal ? 0.7 : 0.48}
            metalness={clay ? 0.02 : tonal ? 0.09 : 0.22}
            flatShading={clay}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[0.12, apertureSegments]} />
          <meshStandardMaterial
            ref={apertureMembraneRef}
            color={clay ? '#6a717b' : tonal ? '#334052' : '#121f31'}
            emissive={clay ? '#b4bcc6' : tonal ? '#6d7d95' : '#2d4661'}
            roughness={clay ? 0.8 : tonal ? 0.68 : 0.46}
            metalness={clay ? 0.02 : tonal ? 0.08 : 0.18}
            flatShading={clay}
          />
        </mesh>

        <mesh position={[0, 0, -0.145]}>
          <circleGeometry args={[0.07, apertureSegments]} />
          <meshStandardMaterial
            ref={apertureCoreRef}
            color={clay ? '#747b86' : tonal ? '#3f4d62' : '#162538'}
            emissive={clay ? '#c1c8d0' : tonal ? '#7a8ca4' : '#3a5674'}
            roughness={clay ? 0.78 : tonal ? 0.66 : 0.45}
            metalness={clay ? 0.01 : tonal ? 0.06 : 0.14}
            flatShading={clay}
          />
        </mesh>

        <pointLight
          ref={apertureLightRef}
          color={clay ? '#d6dbe2' : tonal ? '#b5bfcc' : '#7f8c9a'}
          position={[0, 0, -0.12]}
          intensity={0.11}
          distance={3.4}
          decay={2}
        />
      </group>
    </group>
  );
}
