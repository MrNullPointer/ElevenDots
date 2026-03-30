'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import PostProcessing from './PostProcessing';
import BackgroundDome from './world/BackgroundDome';
import HorizonAtmosphere from './world/HorizonAtmosphere';
import CryogenicOcean from './world/CryogenicOcean';
import DormantDots from './world/DormantDots';
import ParticleField from './world/ParticleField';
import PulseBeacon from './structures/PulseBeacon';
import AboutCore from './structures/AboutCore';
import AxiomMonolith from './structures/AxiomMonolith';
import LightRig from './lights/LightRig';

const BASE_CAMERA_POSITION = new THREE.Vector3(0, 1.85, 6);
const CAMERA_LOOK_TARGET = new THREE.Vector3(0, 0.18, -3.0);
const DEG_TO_RAD = Math.PI / 180;

function CameraDrift({ paused }: { paused: boolean }) {
  const { camera } = useThree();
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const quatRef = useRef(new THREE.Quaternion());
  const targetRef = useRef(new THREE.Vector3());
  const initializedRef = useRef(false);

  useFrame((state, delta) => {
    if (paused) {
      camera.position.copy(BASE_CAMERA_POSITION);
      camera.lookAt(CAMERA_LOOK_TARGET);
      initializedRef.current = false;
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const yaw = Math.sin(elapsed * 0.08) * (2.5 * DEG_TO_RAD);
    const pitch = Math.sin(elapsed * 0.055 + 0.9) * (1.1 * DEG_TO_RAD);

    eulerRef.current.set(pitch, yaw, 0);
    quatRef.current.setFromEuler(eulerRef.current);
    targetRef.current.copy(BASE_CAMERA_POSITION).applyQuaternion(quatRef.current);

    if (!initializedRef.current) {
      camera.position.copy(targetRef.current);
      initializedRef.current = true;
    } else {
      const easing = 1 - Math.exp(-delta * 0.95);
      camera.position.lerp(targetRef.current, easing);
    }

    camera.lookAt(CAMERA_LOOK_TARGET);
  });

  return null;
}

export default function CryogenicScene() {
  const qualityTier = useAppStore((s) => s.qualityTier);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const frozen = useAppStore((s) => s.frozen);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const testMode = useAppStore((s) => s.testMode);
  const paused = frozen || reducedMotion || testMode;

  return (
    <>
      <CameraDrift paused={paused} />

      <BackgroundDome />
      <HorizonAtmosphere />
      <LightRig qualityTier={qualityTier} />
      <CryogenicOcean qualityTier={qualityTier} paused={paused} />

      <ParticleField qualityTier={qualityTier} paused={paused} />
      <DormantDots paused={paused} />

      <group position={[-2.5, 0.16, -3]}>
        <PulseBeacon
          qualityTier={qualityTier}
          paused={paused}
          emphasis={activeDestination === 'pulse' ? 1 : 0}
        />
      </group>

      <group position={[0, 0, -2.35]}>
        <AboutCore
          qualityTier={qualityTier}
          paused={paused}
          emphasis={activeDestination === 'about' ? 1 : 0}
        />
      </group>

      <group position={[2.7, 0.12, -3.4]}>
        <AxiomMonolith
          qualityTier={qualityTier}
          paused={paused}
          emphasis={activeDestination === 'axiom' ? 1 : 0}
        />
      </group>

      <PostProcessing qualityTier={qualityTier} />
    </>
  );
}
