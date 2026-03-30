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
  float radial = length(dir.xy * vec2(1.02, 0.88));
  float cavity = exp(-pow(radial * 0.92, 2.0));
  float shell = smoothstep(0.22, 1.38, radial);
  float deep = smoothstep(-0.8, 0.35, -dir.z);
  float lowerAbsorb = exp(-pow((dir.y + 0.9) * 1.1, 2.0));

  vec3 base = vec3(0.005, 0.009, 0.016);
  vec3 shellLift = vec3(0.012, 0.018, 0.03);
  vec3 modeTint =
    vec3(0.015, 0.04, 0.055) * uPulse +
    vec3(0.028, 0.026, 0.048) * uAxiom +
    vec3(0.03, 0.035, 0.042) * uAbout;

  vec3 color = mix(base, shellLift, cavity * 0.45 + deep * 0.22);
  color *= mix(1.0, 0.78, shell);
  color += modeTint * (0.035 + cavity * 0.025);

  float alpha = 0.1 + cavity * 0.09 + deep * 0.06 + lowerAbsorb * 0.08;
  alpha *= mix(1.0, 0.6, shell);
  alpha += uPulse * 0.012 + uAxiom * 0.01 + uAbout * 0.012;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.24));
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
      <fog attach="fog" args={['#040812', 4.6, 29]} />
      <mesh renderOrder={-1} position={[0.1, -0.1, -3.8]}>
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
