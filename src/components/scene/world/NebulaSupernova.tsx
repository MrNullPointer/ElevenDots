'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { QualityTier, WorldDestination } from '@/lib/store';

interface NebulaSupernovaProps {
  qualityTier: QualityTier;
  mode: WorldDestination;
  paused: boolean;
}

type ModeBlend = {
  pulse: number;
  axiom: number;
  about: number;
};

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
varying vec2 vUv;

uniform float uTime;
uniform float uPulse;
uniform float uAxiom;
uniform float uAbout;
uniform float uQuality;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.82, -0.57, 0.57, 0.82);

  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = rot * p * 2.03 + 17.17;
    amp *= 0.52;
  }

  return value;
}

float starLayer(vec2 uv, float density, float size) {
  vec2 grid = uv * density;
  vec2 id = floor(grid);
  vec2 cell = fract(grid) - 0.5;
  float h = hash21(id);
  vec2 offset = vec2(hash21(id + 7.13), hash21(id + 19.91)) - 0.5;
  float dist = length(cell - offset);
  float star = smoothstep(size, 0.0, dist) * step(0.986, h);
  return star * mix(0.55, 1.0, hash21(id + 2.7));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= 1.58;

  float t = uTime;
  float qualityLift = mix(0.82, 1.0, uQuality);
  float active = clamp(uPulse + uAxiom + uAbout, 0.0, 1.0);

  vec2 corePos = vec2(0.42 - uAxiom * 0.1 + uAbout * 0.04, -0.03 + uPulse * 0.03);
  vec2 coreVector = p - corePos;
  float coreDistance = length(coreVector * vec2(1.0, 1.18));
  float supernovaBreath = 0.9 + sin(t * 0.07) * 0.045 + sin(t * 0.031 + 1.7) * 0.025;
  float core = exp(-coreDistance * coreDistance * 23.0) * supernovaBreath;
  float corona = exp(-coreDistance * coreDistance * 5.6) * (0.92 + supernovaBreath * 0.08);

  float swirlStrength = (1.0 - smoothstep(0.18, 1.2, coreDistance)) * (0.26 + active * 0.12);
  float swirlAngle = swirlStrength + sin(t * 0.018) * 0.045;
  float swirlSin = sin(swirlAngle);
  float swirlCos = cos(swirlAngle);
  vec2 swirledP = corePos + mat2(swirlCos, -swirlSin, swirlSin, swirlCos) * coreVector;

  vec2 driftA = vec2(t * 0.0032, -t * 0.0024);
  vec2 driftB = vec2(-t * 0.002, t * 0.0028);
  float cloudA = fbm(swirledP * 1.16 + driftA + vec2(1.7, 2.3));
  float cloudB = fbm(swirledP * 2.18 + driftB + vec2(7.4, 3.1));
  float cloudC = fbm((swirledP + coreVector * 0.24) * 3.2 + vec2(2.1, 8.9));
  float nebula = smoothstep(0.44, 1.03, cloudA + cloudB * 0.38 + cloudC * 0.18);

  float dustLane = smoothstep(0.16, 0.72, fbm(swirledP * vec2(1.2, 2.8) + vec2(-2.0, 4.0)));
  dustLane *= smoothstep(0.98, 0.1, abs(p.y + p.x * 0.18));
  nebula *= mix(0.7, 1.22, dustLane);

  float ringRadius = 0.42 + sin(t * 0.021) * 0.01 + uPulse * 0.03 - uAbout * 0.03;
  float innerRingRadius = 0.24 + sin(t * 0.027 + 1.2) * 0.007;
  float shock = 1.0 - smoothstep(0.0, 0.026, abs(coreDistance - ringRadius));
  float outerShock = 1.0 - smoothstep(0.0, 0.018, abs(coreDistance - ringRadius * 1.58));
  float innerShock = 1.0 - smoothstep(0.0, 0.014, abs(coreDistance - innerRingRadius));
  shock *= 0.34 + active * 0.18;
  outerShock *= 0.12 + uAxiom * 0.1;
  innerShock *= 0.1 + uPulse * 0.08;

  float starsNear = starLayer(uv + vec2(0.0, t * 0.00016), 155.0, 0.03);
  float starsFar = starLayer(uv * 1.04 + vec2(0.13, -0.08), 92.0, 0.024);
  float stars = (starsNear * 0.62 + starsFar * 0.38) * qualityLift;

  vec3 deepSpace = vec3(0.004, 0.008, 0.017);
  vec3 frost = vec3(0.72, 0.86, 1.0);
  vec3 cyan = vec3(0.14, 0.82, 0.78);
  vec3 mineral = vec3(0.46, 0.56, 0.9);
  vec3 ember = vec3(1.0, 0.34, 0.26);

  vec3 nebulaColor = mix(vec3(0.08, 0.18, 0.28), vec3(0.24, 0.44, 0.58), cloudB);
  nebulaColor = mix(nebulaColor, cyan, uPulse * 0.42);
  nebulaColor = mix(nebulaColor, mineral, uAxiom * 0.38);
  nebulaColor = mix(nebulaColor, frost, uAbout * 0.16);

  vec3 coreColor = mix(frost, cyan, 0.28 + uPulse * 0.34);
  coreColor = mix(coreColor, mineral, uAxiom * 0.22);
  coreColor = mix(coreColor, ember, 0.18 + uAbout * 0.08);

  vec3 color = deepSpace;
  color += nebulaColor * nebula * (0.34 + active * 0.12) * qualityLift;
  color += coreColor * core * (1.2 + uPulse * 0.42) * qualityLift;
  color += mix(cyan, ember, 0.36) * corona * (0.22 + active * 0.08);
  color += frost * stars * 0.5;
  color += coreColor * shock * 0.36;
  color += mineral * outerShock * 0.22;
  color += frost * innerShock * 0.18;

  float aperture = smoothstep(1.42, 0.22, length(p * vec2(0.86, 1.04)));
  float alpha = clamp((nebula * 0.58 + corona * 0.42 + core * 0.9 + stars * 0.36 + shock * 0.28 + innerShock * 0.14) * aperture, 0.0, 0.92);

  gl_FragColor = vec4(color, alpha);
}
`;

function getQualityValue(qualityTier: QualityTier) {
  if (qualityTier === 'high') return 1;
  if (qualityTier === 'medium') return 0.72;
  return 0.42;
}

export default function NebulaSupernova({
  qualityTier,
  mode,
  paused,
}: NebulaSupernovaProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const modeBlendRef = useRef<ModeBlend>({ pulse: 0, axiom: 0, about: 0 });
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uAxiom: { value: 0 },
      uAbout: { value: 0 },
      uQuality: { value: getQualityValue(qualityTier) },
    }),
    [qualityTier],
  );

  useFrame((state, delta) => {
    uniforms.uQuality.value = getQualityValue(qualityTier);

    if (!paused) {
      const t = state.clock.elapsedTime;
      uniforms.uTime.value = t;

      if (meshRef.current) {
        meshRef.current.position.x = 0.35 + Math.sin(t * 0.014) * 0.035;
        meshRef.current.position.y = 0.06 + Math.sin(t * 0.011 + 1.1) * 0.02;
        meshRef.current.rotation.z = Math.sin(t * 0.012) * 0.009;
        meshRef.current.scale.set(
          9.8 + Math.sin(t * 0.009 + 0.4) * 0.1,
          6.2 + Math.sin(t * 0.01 + 1.6) * 0.07,
          1,
        );
      }
    }

    const targetPulse = mode === 'pulse' ? 1 : 0;
    const targetAxiom = mode === 'axiom' ? 1 : 0;
    const targetAbout = mode === 'about' ? 1 : 0;
    const blend = 1 - Math.exp(-delta * (paused ? 8 : 1.45));
    const modeBlend = modeBlendRef.current;

    modeBlend.pulse += (targetPulse - modeBlend.pulse) * blend;
    modeBlend.axiom += (targetAxiom - modeBlend.axiom) * blend;
    modeBlend.about += (targetAbout - modeBlend.about) * blend;

    uniforms.uPulse.value = modeBlend.pulse;
    uniforms.uAxiom.value = modeBlend.axiom;
    uniforms.uAbout.value = modeBlend.about;
  });

  return (
    <mesh ref={meshRef} position={[0.35, 0.06, -7.8]} scale={[9.8, 6.2, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
