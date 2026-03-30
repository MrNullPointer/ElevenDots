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
        const scale = 0.94 + breath * 0.05;
        core.scale.set(scale, scale, scale);
      }
      if (glow) {
        (glow.material as THREE.MeshBasicMaterial).opacity = 0.012 + breath * 0.006;
      }
    }
  });

  return (
    <group>
      {DORMANT_DOTS.map((dot, i) => {
        const px = dot.position[0];
        const py = dot.position[1] * 0.23 - 0.26;
        const pz = dot.position[2] - 1.4;
        const radius = 0.011 + dot.depth * 0.006;
        const glowRadius = 0.05 + dot.depth * 0.02;

        return (
          <group key={`${dot.constellationIndex}-${i}`} position={[px, py, pz]}>
            <mesh ref={(node) => (coreRefs.current[i] = node)}>
              <sphereGeometry args={[radius, 10, 10]} />
              <meshStandardMaterial
                color="#7b90a6"
                emissive="#597797"
                emissiveIntensity={0.04}
                roughness={0.52}
                metalness={0.06}
                transparent
                opacity={0.18}
              />
            </mesh>

            <mesh
              ref={(node) => (glowRefs.current[i] = node)}
              position={[0, 0, 0]}
            >
              <sphereGeometry args={[glowRadius, 12, 12]} />
              <meshBasicMaterial
                color="#5f7692"
                transparent
                opacity={0.012}
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
