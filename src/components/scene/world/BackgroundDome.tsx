'use client';

import { BackSide } from 'three';

const VERTEX_SHADER = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const FRAGMENT_SHADER = `
varying vec3 vWorldPosition;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vec3 dir = normalize(vWorldPosition - cameraPosition);

  float y = clamp((dir.y * 0.5) + 0.5, 0.0, 1.0);
  float zenith = smoothstep(0.0, 1.0, y);
  float horizonLift = exp(-pow((dir.y + 0.12) * 1.32, 2.0));
  float nearHorizon = exp(-pow((dir.y + 0.02) * 2.6, 2.0));
  float upperDepth = exp(-pow((dir.y - 0.66) * 2.2, 2.0));
  float sideFalloff = smoothstep(0.18, 1.28, length(dir.xz));

  vec3 zenithColor = vec3(0.0052, 0.0098, 0.0178);
  vec3 upperColor = vec3(0.0084, 0.0152, 0.0278);
  vec3 horizonColor = vec3(0.0104, 0.0198, 0.036);
  vec3 color = mix(horizonColor, zenithColor, zenith);
  color = mix(color, upperColor, upperDepth * 0.34);
  color += vec3(0.006, 0.011, 0.021) * horizonLift * 0.24;
  color += vec3(0.0038, 0.0072, 0.0138) * nearHorizon * 0.18;
  color += vec3(0.0032, 0.0058, 0.0102) * upperDepth * 0.32;
  color *= mix(1.0, 0.82, sideFalloff);

  vec3 starCell = floor(dir * 180.0);
  float stars = step(0.9985, hash(starCell));
  stars *= smoothstep(0.24, 0.84, y);
  color += vec3(0.038, 0.05, 0.068) * stars * 0.16;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function BackgroundDome() {
  return (
    <mesh renderOrder={-2}>
      <sphereGeometry args={[85, 48, 48]} />
      <shaderMaterial
        side={BackSide}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
