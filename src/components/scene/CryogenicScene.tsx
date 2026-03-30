'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import PostProcessing from './PostProcessing';
import LightRig from './lights/LightRig';
import BackgroundDome from './world/BackgroundDome';
import DormantDots from './world/DormantDots';
import HorizonAtmosphere from './world/HorizonAtmosphere';
import NearFieldOcclusion from './world/NearFieldOcclusion';
import ObservatoryField from './world/ObservatoryField';

const BASE_CAMERA_POSITION = new THREE.Vector3(0.22, 0.94, 4.68);
const CAMERA_LOOK_TARGET = new THREE.Vector3(0.02, 0.42, -2.84);
const DEG_TO_RAD = Math.PI / 180;

interface CryogenicSceneProps {
  reviewMode?: 'dark' | 'tonal' | 'clay';
}

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
    const yaw = Math.sin(elapsed * 0.05) * (0.9 * DEG_TO_RAD);
    const pitch = Math.sin(elapsed * 0.037 + 0.7) * (0.55 * DEG_TO_RAD);
    const roll = Math.sin(elapsed * 0.043 + 1.2) * (0.08 * DEG_TO_RAD);

    eulerRef.current.set(pitch, yaw, roll);
    quatRef.current.setFromEuler(eulerRef.current);
    targetRef.current.copy(BASE_CAMERA_POSITION).applyQuaternion(quatRef.current);

    if (!initializedRef.current) {
      camera.position.copy(targetRef.current);
      initializedRef.current = true;
    } else {
      const easing = 1 - Math.exp(-delta * 0.8);
      camera.position.lerp(targetRef.current, easing);
    }

    camera.lookAt(CAMERA_LOOK_TARGET);
  });

  return null;
}

export default function CryogenicScene({ reviewMode = 'dark' }: CryogenicSceneProps) {
  const qualityTier = useAppStore((s) => s.qualityTier);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const frozen = useAppStore((s) => s.frozen);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const testMode = useAppStore((s) => s.testMode);
  const paused = frozen || reducedMotion || testMode;
  const mode = activeDestination ?? 'idle';

  return (
    <>
      <CameraDrift paused={paused} />

      <BackgroundDome />
      <HorizonAtmosphere mode={mode} />
      <LightRig qualityTier={qualityTier} mode={mode} reviewMode={reviewMode} />

      <DormantDots paused={paused} />
      <ObservatoryField
        qualityTier={qualityTier}
        paused={paused}
        mode={mode}
        reviewMode={reviewMode}
      />
      <NearFieldOcclusion paused={paused} mode={mode} reviewMode={reviewMode} />

      <PostProcessing qualityTier={qualityTier} />
    </>
  );
}
