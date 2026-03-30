'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { MeshPhysicalMaterial } from 'three';
import type { DestinationId, QualityTier } from '@/lib/store';

interface CryogenicOceanProps {
  qualityTier: QualityTier;
  paused: boolean;
  mode: DestinationId | 'idle';
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
    segments: 72,
    envMapIntensity: 0.016,
    primaryAmp: 0.05,
    secondaryAmp: 0.026,
    tertiaryAmp: 0.016,
  },
  medium: {
    segments: 110,
    envMapIntensity: 0.02,
    primaryAmp: 0.06,
    secondaryAmp: 0.03,
    tertiaryAmp: 0.018,
  },
  high: {
    segments: 144,
    envMapIntensity: 0.024,
    primaryAmp: 0.065,
    secondaryAmp: 0.034,
    tertiaryAmp: 0.02,
  },
};

export default function CryogenicOcean({ qualityTier, paused, mode }: CryogenicOceanProps) {
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
      shader.uniforms.uPulse = { value: 0 };
      shader.uniforms.uAxiom = { value: 0 };
      shader.uniforms.uAbout = { value: 0 };

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
uniform float uPrimaryAmp;
uniform float uSecondaryAmp;
uniform float uTertiaryAmp;
varying vec3 vWorldPosCryo;
`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
float waveA = sin((position.x * 0.03) + (uTime * 0.1));
float waveB = sin((position.z * 0.028) - (uTime * 0.08));
float waveC = sin(((position.x + position.z) * 0.048) + (uTime * 0.13));
transformed.y += (waveA * uPrimaryAmp) + (waveB * uSecondaryAmp) + (waveC * uTertiaryAmp);
vWorldPosCryo = (modelMatrix * vec4(transformed, 1.0)).xyz;
`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
uniform float uPulse;
uniform float uAxiom;
uniform float uAbout;
varying vec3 vWorldPosCryo;
`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
float fresnel = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 3.2);
float viewDist = length(vWorldPosCryo - cameraPosition);
float distanceAbsorb = smoothstep(3.0, 48.0, viewDist);
float micro = sin((vWorldPosCryo.x + uTime * 0.5) * 0.05) * sin((vWorldPosCryo.z - uTime * 0.45) * 0.05);
float pulseBand = exp(-pow(vWorldPosCryo.x * 0.095 + sin(uTime * 0.18) * 0.2, 2.0) * 8.0) * uPulse;
float axiomBand = exp(-pow(vWorldPosCryo.z * 0.082 + cos(uTime * 0.14) * 0.12, 2.0) * 8.0) * uAxiom;
float aboutBloom = exp(-pow(length(vWorldPosCryo.xz - vec2(0.0, -2.9)) * 0.18, 2.0)) * uAbout;
vec3 abyss = vec3(0.0026, 0.0065, 0.013);
vec3 depthTint = vec3(0.0035, 0.0105, 0.022);
vec3 fresnelTint = vec3(0.015, 0.032, 0.052) * fresnel;
vec3 modeTint = vec3(0.01, 0.03, 0.04) * pulseBand + vec3(0.016, 0.018, 0.036) * axiomBand + vec3(0.018, 0.023, 0.03) * aboutBloom;
vec3 absorbed = mix(abyss, depthTint, clamp(micro * 0.45 + 0.5, 0.0, 1.0));
diffuseColor.rgb = mix(diffuseColor.rgb, absorbed, distanceAbsorb * 0.92);
totalEmissiveRadiance += fresnelTint * 0.24 + absorbed * 0.1 + modeTint * 0.28;
`,
        );

      shaderRef.current = shader as CompiledShader;
    };

    material.needsUpdate = true;
  }, [config.primaryAmp, config.secondaryAmp, config.tertiaryAmp]);

  useFrame((state) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = paused ? 0 : state.clock.elapsedTime;
    shaderRef.current.uniforms.uPulse.value = mode === 'pulse' ? 1 : 0;
    shaderRef.current.uniforms.uAxiom.value = mode === 'axiom' ? 1 : 0;
    shaderRef.current.uniforms.uAbout.value = mode === 'about' ? 1 : 0;
  });

  return (
    <mesh position={[0, -1.12, -3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[340, 340, segments, segments]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#02060e"
        emissive="#020814"
        emissiveIntensity={0.028}
        roughness={0.84}
        metalness={0.22}
        clearcoat={0.08}
        clearcoatRoughness={0.9}
        reflectivity={0.035}
        envMapIntensity={config.envMapIntensity}
        sheen={0.01}
        sheenColor="#30425a"
        specularIntensity={0.05}
      />
    </mesh>
  );
}
