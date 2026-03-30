'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DORMANT_DOTS } from '@/lib/config/site';

interface DormantDotsProps {
  paused: boolean;
}

export default function DormantDots({ paused }: DormantDotsProps) {
  const coreRefs = useRef<Array<THREE.Mesh | null>>([]);
  const glowRefs = useRef<Array<THREE.Mesh | null>>([]);
  const phases = useMemo(() => DORMANT_DOTS.map((_, i) => i * 0.67), []);

  useFrame((state) => {
    if (paused) return;

    const t = state.clock.elapsedTime;
    for (let i = 0; i < DORMANT_DOTS.length; i += 1) {
      const breath = 0.5 + 0.5 * Math.sin(t * 0.27 + phases[i]);
      const core = coreRefs.current[i];
      const glow = glowRefs.current[i];

      if (core) {
        const scale = 0.92 + breath * 0.14;
        core.scale.set(scale, scale, scale);
      }
      if (glow) {
        (glow.material as THREE.MeshBasicMaterial).opacity = 0.028 + breath * 0.014;
      }
    }
  });

  return (
    <group>
      {DORMANT_DOTS.map((dot, i) => {
        const px = dot.position[0];
        const py = dot.position[1] * 0.25 - 0.42;
        const pz = dot.position[2] - 1.6;
        const radius = 0.02 + dot.depth * 0.009;
        const ringInner = 0.04 + dot.depth * 0.016;
        const ringOuter = ringInner + 0.06;

        return (
          <group key={`${dot.constellationIndex}-${i}`} position={[px, py, pz]}>
            <mesh ref={(node) => (coreRefs.current[i] = node)}>
              <sphereGeometry args={[radius, 10, 10]} />
              <meshStandardMaterial
                color="#869db3"
                emissive="#6e8ca8"
                emissiveIntensity={0.08}
                roughness={0.46}
                metalness={0.08}
                transparent
                opacity={0.3}
              />
            </mesh>

            <mesh
              ref={(node) => (glowRefs.current[i] = node)}
              position={[0, -0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[ringInner, ringOuter, 20]} />
              <meshBasicMaterial
                color="#7a96b1"
                transparent
                opacity={0.03}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
