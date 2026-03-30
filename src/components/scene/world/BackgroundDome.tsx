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
  float radial = length(dir.xy * vec2(1.03, 0.9));
  float centralCavity = exp(-pow(radial * 0.9, 2.0));
  float shellFalloff = smoothstep(0.22, 1.34, radial);
  float depthBias = smoothstep(-0.76, 0.4, -dir.z);
  float overheadDamp = smoothstep(0.28, 0.86, dir.y);

  vec3 darkBase = vec3(0.0038, 0.007, 0.0128);
  vec3 chamberLift = vec3(0.0082, 0.0138, 0.0235);
  vec3 color = mix(darkBase, chamberLift, centralCavity * 0.42 + depthBias * 0.24);
  color *= mix(1.0, 0.76, shellFalloff);
  color *= mix(1.0, 0.94, overheadDamp);

  vec3 grainCell = floor((dir + vec3(1.4)) * 34.0);
  float grain = hash(grainCell);
  color += vec3(0.0007, 0.0011, 0.0018) * grain * 0.14;

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
