'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { MeshPhysicalMaterial } from 'three';
import type { QualityTier } from '@/lib/store';

interface CryogenicOceanProps {
  qualityTier: QualityTier;
  paused: boolean;
}

type CompiledShader = {
  uniforms: Record<string, { value: number }>;
  vertexShader: string;
  fragmentShader: string;
};

const OCEAN_CONFIG: Record<
  QualityTier,
  {
    segments: number;
    envMapIntensity: number;
    primaryAmp: number;
    secondaryAmp: number;
    tertiaryAmp: number;
  }
> = {
  low: {
    segments: 96,
    envMapIntensity: 0.08,
    primaryAmp: 0.1,
    secondaryAmp: 0.05,
    tertiaryAmp: 0.024,
  },
  medium: {
    segments: 140,
    envMapIntensity: 0.12,
    primaryAmp: 0.12,
    secondaryAmp: 0.06,
    tertiaryAmp: 0.03,
  },
  high: {
    segments: 184,
    envMapIntensity: 0.16,
    primaryAmp: 0.14,
    secondaryAmp: 0.07,
    tertiaryAmp: 0.036,
  },
};

export default function CryogenicOcean({ qualityTier, paused }: CryogenicOceanProps) {
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const shaderRef = useRef<CompiledShader | null>(null);

  const config = OCEAN_CONFIG[qualityTier];
  const segments = useMemo(() => config.segments, [config.segments]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uPrimaryAmp = { value: config.primaryAmp };
      shader.uniforms.uSecondaryAmp = { value: config.secondaryAmp };
      shader.uniforms.uTertiaryAmp = { value: config.tertiaryAmp };

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
uniform float uPrimaryAmp;
uniform float uSecondaryAmp;
uniform float uTertiaryAmp;
`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
float waveA = sin((position.x * 0.05) + (uTime * 0.18));
float waveB = sin((position.z * 0.045) - (uTime * 0.14));
float waveC = sin(((position.x + position.z) * 0.09) + (uTime * 0.24));
transformed.y += (waveA * uPrimaryAmp) + (waveB * uSecondaryAmp) + (waveC * uTertiaryAmp);
`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
float fresnel = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.3);
vec3 cryoFresnel = vec3(0.038, 0.07, 0.11) * fresnel * 0.16;
float micro = sin((vViewPosition.x + uTime * 2.0) * 0.08) * sin((vViewPosition.y - uTime * 1.4) * 0.08);
vec3 underTint = vec3(0.006, 0.014, 0.024) * (0.4 + 0.6 * micro);
totalEmissiveRadiance += cryoFresnel + underTint * 0.22;
`,
        );

      shaderRef.current = shader as CompiledShader;
    };

    material.needsUpdate = true;
  }, [config.primaryAmp, config.secondaryAmp, config.tertiaryAmp]);

  useFrame((state) => {
    if (paused) return;
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[280, 280, segments, segments]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#040a14"
        emissive="#051020"
        emissiveIntensity={0.045}
        roughness={0.36}
        metalness={0.2}
        clearcoat={0.82}
        clearcoatRoughness={0.38}
        reflectivity={0.62}
        envMapIntensity={config.envMapIntensity}
        sheen={0.04}
        sheenColor="#5e7e9c"
      />
    </mesh>
  );
}
