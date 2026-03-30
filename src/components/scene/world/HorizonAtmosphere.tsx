'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BackSide, type ShaderMaterial } from 'three';
import type { DestinationId } from '@/lib/store';

interface HorizonAtmosphereProps {
  mode: DestinationId | 'idle';
}

const VERTEX_SHADER = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const FRAGMENT_SHADER = `
uniform float uPulse;
uniform float uAxiom;
uniform float uAbout;
varying vec3 vWorldPosition;

void main() {
  vec3 dir = normalize(vWorldPosition - cameraPosition);
  float lowerBand = exp(-pow((dir.y + 0.24) * 1.35, 2.0));
  float middleBand = exp(-pow((dir.y + 0.03) * 1.95, 2.0));
  float upperBand = exp(-pow((dir.y - 0.5) * 2.1, 2.0));
  float side = 1.0 - smoothstep(0.58, 1.32, length(dir.xz));

  vec3 base = vec3(0.012, 0.022, 0.038);
  vec3 modeTint = vec3(0.012, 0.03, 0.042) * uPulse + vec3(0.02, 0.02, 0.044) * uAxiom + vec3(0.022, 0.028, 0.036) * uAbout;
  float alpha = (lowerBand * 0.12 + middleBand * 0.09 + upperBand * 0.06) * side;
  alpha += uPulse * lowerBand * 0.018 + uAxiom * middleBand * 0.016 + uAbout * upperBand * 0.014;

  gl_FragColor = vec4(base + modeTint * 0.08, alpha);
}
`;

export default function HorizonAtmosphere({ mode }: HorizonAtmosphereProps) {
  const shaderRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uPulse: { value: 0 },
      uAxiom: { value: 0 },
      uAbout: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uPulse.value = mode === 'pulse' ? 1 : 0;
    shaderRef.current.uniforms.uAxiom.value = mode === 'axiom' ? 1 : 0;
    shaderRef.current.uniforms.uAbout.value = mode === 'about' ? 1 : 0;
  });

  return (
    <>
      <fog attach="fog" args={['#070e1b', 6.8, 42]} />
      <mesh renderOrder={-1} position={[0, -1.12, -2.8]}>
        <sphereGeometry args={[62, 60, 60]} />
        <shaderMaterial
          ref={shaderRef}
          side={BackSide}
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
