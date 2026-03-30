'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { DestinationId, QualityTier } from '@/lib/store';

interface ObservatoryFieldProps {
  qualityTier: QualityTier;
  paused: boolean;
  mode: DestinationId | 'idle';
}

type ModeBlend = { pulse: number; axiom: number; about: number };

const BASE_LIGHT_COLOR = new THREE.Color('#a9bed2');
const PULSE_LIGHT_COLOR = new THREE.Color('#7cc8d6');
const AXIOM_LIGHT_COLOR = new THREE.Color('#7f85c2');
const ABOUT_LIGHT_COLOR = new THREE.Color('#d0dde8');

const MEMBRANE_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MEMBRANE_FRAGMENT_SHADER = `
uniform float uTime;
uniform float uPulse;
uniform float uAxiom;
uniform float uAbout;
varying vec2 vUv;

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float radius = length(p);
  float mask = smoothstep(1.03, 0.18, radius);
  float edge = smoothstep(0.98, 0.78, radius);
  float center = exp(-pow(radius * 3.2, 2.0));

  float baseWave = sin((p.x * 8.0) + (uTime * 0.12));
  float crossWave = sin((p.y * 8.6) - (uTime * 0.1));
  float membrane = 0.5 + 0.5 * (baseWave * crossWave);

  float pulseSweep = exp(-pow((p.x * 1.35) + sin(uTime * 0.22) * 0.45, 2.0) * 16.0);
  float axiomGrid = abs(sin((p.x + p.y) * 28.0) * sin((p.x - p.y) * 28.0));
  axiomGrid = pow(axiomGrid, 6.0);
  float aboutCore = exp(-pow(radius * 2.8, 2.0));

  vec3 baseColor = vec3(0.038, 0.07, 0.12) * (0.46 + membrane * 0.54);
  vec3 pulseColor = vec3(0.11, 0.26, 0.34) * pulseSweep * uPulse;
  vec3 axiomColor = vec3(0.17, 0.19, 0.33) * axiomGrid * uAxiom;
  vec3 aboutColor = vec3(0.2, 0.24, 0.29) * aboutCore * uAbout;
  vec3 rimColor = vec3(0.07, 0.12, 0.18) * edge;

  vec3 color = baseColor + pulseColor + axiomColor + aboutColor + rimColor;
  float alpha = (0.36 + edge * 0.42 + center * 0.22) * mask;

  gl_FragColor = vec4(color, alpha);
}
`;

export default function ObservatoryField({ qualityTier, paused, mode }: ObservatoryFieldProps) {
  const chamberGroupRef = useRef<THREE.Group>(null);
  const shellMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const outerRingMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const innerRingMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const arcMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const membraneMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const signalLightRef = useRef<THREE.PointLight>(null);
  const modeBlendRef = useRef<ModeBlend>({ pulse: 0, axiom: 0, about: 0 });
  const mixedColorRef = useRef(new THREE.Color());

  const ringSegments = qualityTier === 'low' ? 72 : qualityTier === 'medium' ? 108 : 144;
  const chamberSegments = qualityTier === 'low' ? 36 : qualityTier === 'medium' ? 56 : 72;

  const membraneUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uAxiom: { value: 0 },
      uAbout: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const blend = 1 - Math.exp(-delta * 3.2);
    const modeBlend = modeBlendRef.current;

    modeBlend.pulse += (targetPulse - modeBlend.pulse) * blend;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * blend;
    modeBlend.about += (targetAbout - modeBlend.about) * blend;

    if (membraneMaterialRef.current) {
      const uniforms = membraneMaterialRef.current.uniforms;
      uniforms.uPulse.value = modeBlend.pulse;
      uniforms.uAxiom.value = modeBlend.axiom;
      uniforms.uAbout.value = modeBlend.about;
      uniforms.uTime.value = paused ? 0 : state.clock.elapsedTime;
    }

    if (chamberGroupRef.current && !paused) {
      const t = state.clock.elapsedTime;
      chamberGroupRef.current.rotation.y = Math.sin(t * 0.04) * 0.08;
      chamberGroupRef.current.rotation.x = -0.04 + Math.sin(t * 0.06) * 0.01;
      chamberGroupRef.current.position.y = 0.2 + Math.sin(t * 0.09) * 0.012;
    }

    if (signalLightRef.current) {
      mixedColorRef.current.copy(BASE_LIGHT_COLOR);
      mixedColorRef.current.lerp(PULSE_LIGHT_COLOR, modeBlend.pulse * 0.55);
      mixedColorRef.current.lerp(AXIOM_LIGHT_COLOR, modeBlend.axiom * 0.55);
      mixedColorRef.current.lerp(ABOUT_LIGHT_COLOR, modeBlend.about * 0.42);
      signalLightRef.current.color.copy(mixedColorRef.current);
      signalLightRef.current.intensity =
        0.24 + modeBlend.pulse * 0.12 + modeBlend.axiom * 0.09 + modeBlend.about * 0.12;
    }

    if (outerRingMaterialRef.current) {
      outerRingMaterialRef.current.emissiveIntensity =
        0.08 + modeBlend.pulse * 0.06 + modeBlend.axiom * 0.045 + modeBlend.about * 0.045;
    }

    if (innerRingMaterialRef.current) {
      innerRingMaterialRef.current.emissiveIntensity =
        0.055 + modeBlend.pulse * 0.03 + modeBlend.axiom * 0.05 + modeBlend.about * 0.045;
    }

    if (shellMaterialRef.current) {
      shellMaterialRef.current.emissiveIntensity =
        0.028 + modeBlend.pulse * 0.02 + modeBlend.axiom * 0.025 + modeBlend.about * 0.03;
      shellMaterialRef.current.transmission =
        0.26 + modeBlend.about * 0.08 + modeBlend.pulse * 0.03;
    }

    if (arcMaterialRef.current) {
      arcMaterialRef.current.emissiveIntensity =
        0.025 + modeBlend.axiom * 0.04 + modeBlend.pulse * 0.015;
    }

    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity =
        0.075 + modeBlend.about * 0.03 + modeBlend.pulse * 0.018 + modeBlend.axiom * 0.015;
    }
  });

  return (
    <group ref={chamberGroupRef} position={[0, 0.28, -2.68]} rotation={[-0.04, 0, 0]} scale={1.14}>
      <mesh position={[0, 0, -0.04]}>
        <cylinderGeometry args={[0.92, 1.08, 0.56, chamberSegments, 1, true]} />
        <meshPhysicalMaterial
          ref={shellMaterialRef}
          color="#0a111d"
          emissive="#111c30"
          emissiveIntensity={0.028}
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.45}
          transmission={0.26}
          thickness={0.72}
          ior={1.25}
          envMapIntensity={0.045}
          transparent
          opacity={0.74}
        />
      </mesh>

      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[1.52, 0.062, 24, ringSegments]} />
        <meshPhysicalMaterial
          ref={outerRingMaterialRef}
          color="#0a1322"
          emissive="#17314b"
          emissiveIntensity={0.08}
          roughness={0.34}
          metalness={0.42}
          clearcoat={0.38}
          clearcoatRoughness={0.5}
          envMapIntensity={0.055}
        />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <torusGeometry args={[0.86, 0.045, 20, ringSegments]} />
        <meshPhysicalMaterial
          ref={innerRingMaterialRef}
          color="#0a1020"
          emissive="#1c2f45"
          emissiveIntensity={0.055}
          roughness={0.4}
          metalness={0.35}
          clearcoat={0.34}
          clearcoatRoughness={0.56}
          envMapIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.2]}>
        <circleGeometry args={[0.74, ringSegments]} />
        <shaderMaterial
          ref={membraneMaterialRef}
          uniforms={membraneUniforms}
          vertexShader={MEMBRANE_VERTEX_SHADER}
          fragmentShader={MEMBRANE_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.01, 0.02]}>
        <circleGeometry args={[0.62, ringSegments]} />
        <meshPhysicalMaterial
          color="#111a2c"
          emissive="#16253a"
          emissiveIntensity={0.03}
          roughness={0.46}
          metalness={0.16}
          transmission={0.22}
          thickness={0.42}
          clearcoat={0.46}
          clearcoatRoughness={0.45}
          transparent
          opacity={0.56}
          envMapIntensity={0.03}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.24, 0.06]}>
        <ringGeometry args={[0.6, 0.86, ringSegments]} />
        <meshBasicMaterial
          ref={haloMaterialRef}
          color="#33547a"
          transparent
          opacity={0.06}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[0.38, 0.9, 0.18]} position={[0, 0.03, -0.18]}>
        <torusGeometry args={[1.95, 0.016, 12, ringSegments, Math.PI * 1.12]} />
        <meshStandardMaterial
          ref={arcMaterialRef}
          color="#151e31"
          emissive="#213451"
          emissiveIntensity={0.025}
          roughness={0.48}
          metalness={0.32}
        />
      </mesh>

      <mesh rotation={[-0.34, -0.86, -0.14]} position={[0.02, -0.04, -0.24]}>
        <torusGeometry args={[1.82, 0.012, 12, ringSegments, Math.PI * 1.08]} />
        <meshStandardMaterial
          color="#11192b"
          emissive="#1e3048"
          emissiveIntensity={0.02}
          roughness={0.52}
          metalness={0.26}
        />
      </mesh>

      <mesh position={[0, 0.01, 0.27]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#c0d2e1"
          emissive="#84a9c7"
          emissiveIntensity={0.45}
          roughness={0.24}
          metalness={0.08}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={signalLightRef}
        color="#a9bed2"
        position={[0, 0.01, 0.29]}
        intensity={0.24}
        distance={5.2}
        decay={2}
      />
    </group>
  );
}
