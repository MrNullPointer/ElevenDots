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

void main() {
  vec3 dir = normalize(vWorldPosition - cameraPosition);

  float y = clamp((dir.y * 0.5) + 0.5, 0.0, 1.0);
  float zenith = smoothstep(0.0, 1.0, y);
  float horizonLift = exp(-pow((dir.y + 0.065) * 2.2, 2.0));
  float cornerDark = smoothstep(0.28, 1.25, length(dir.xz));
  float vignette = smoothstep(0.1, 1.0, 1.0 - y);

  vec3 zenithColor = vec3(0.004, 0.008, 0.016);
  vec3 horizonColor = vec3(0.012, 0.022, 0.044);
  vec3 color = mix(horizonColor, zenithColor, zenith);
  color += vec3(0.012, 0.02, 0.036) * horizonLift * 0.16;
  color *= mix(1.0, 0.7, cornerDark);
  color *= mix(0.96, 0.82, vignette);

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
