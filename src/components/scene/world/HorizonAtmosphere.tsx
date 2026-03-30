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
  float horizon = exp(-pow((dir.y + 0.03) * 2.05, 2.0));
  float band = smoothstep(-0.28, -0.01, dir.y) * (1.0 - smoothstep(0.0, 0.08, dir.y));
  float edgeFade = 1.0 - smoothstep(0.66, 1.25, length(dir.xz));
  float intensity = (horizon * 0.52 + band * 0.48) * edgeFade;

  vec3 haze = vec3(0.022, 0.036, 0.062);
  gl_FragColor = vec4(haze, intensity * 0.14);
}
`;

export default function HorizonAtmosphere() {
  return (
    <>
      <fog attach="fog" args={['#050912', 7.9, 33]} />
      <mesh renderOrder={-1} position={[0, -1.4, 0]}>
        <sphereGeometry args={[58, 52, 52]} />
        <shaderMaterial
          side={BackSide}
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
