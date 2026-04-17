'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MotionMode, QualityTier, WorldDestination } from '@/lib/store';
import LightRig from './lights/LightRig';
import BackgroundDome from './world/BackgroundDome';
import DormantDots from './world/DormantDots';
import HorizonAtmosphere from './world/HorizonAtmosphere';
import NearFieldOcclusion from './world/NearFieldOcclusion';
import AmbientLensField from './world/AmbientLensField';
import NebulaSupernova from './world/NebulaSupernova';

const BASE_CAMERA_POSITION = new THREE.Vector3(0.2, 0.72, 5.22);
const LOOK_TARGET = new THREE.Vector3(0.08, 0.2, -3.86);

interface AmbientFieldSceneProps {
  qualityTier: QualityTier;
  destination: WorldDestination;
  motionMode: MotionMode;
}

function CameraRig({ paused }: { paused: boolean }) {
  const { camera } = useThree();
  const currentPointerXRef = useRef(0);
  const currentPointerYRef = useRef(0);
  const targetPointerXRef = useRef(0);
  const targetPointerYRef = useRef(0);
  const targetPositionRef = useRef(BASE_CAMERA_POSITION.clone());
  const lookTargetRef = useRef(LOOK_TARGET.clone());

  useEffect(() => {
    if (paused) {
      currentPointerXRef.current = 0;
      currentPointerYRef.current = 0;
      targetPointerXRef.current = 0;
      targetPointerYRef.current = 0;
      return;
    }

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    if (!finePointerQuery.matches) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return;
      }

      targetPointerXRef.current = Math.max(
        -1,
        Math.min(1, event.clientX / window.innerWidth * 2 - 1),
      );
      targetPointerYRef.current = Math.max(
        -1,
        Math.min(1, event.clientY / window.innerHeight * 2 - 1),
      );
    };

    const resetPointer = () => {
      targetPointerXRef.current = 0;
      targetPointerYRef.current = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetPointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
    };
  }, [paused]);

  useFrame((_, delta) => {
    const pointerBlend = 1 - Math.exp(-delta * (paused ? 10 : 4.2));
    currentPointerXRef.current +=
      (targetPointerXRef.current - currentPointerXRef.current) * pointerBlend;
    currentPointerYRef.current +=
      (targetPointerYRef.current - currentPointerYRef.current) * pointerBlend;

    targetPositionRef.current.set(
      BASE_CAMERA_POSITION.x + currentPointerXRef.current * 0.025,
      BASE_CAMERA_POSITION.y + currentPointerYRef.current * -0.015,
      BASE_CAMERA_POSITION.z,
    );
    lookTargetRef.current.set(
      LOOK_TARGET.x + currentPointerXRef.current * 0.012,
      LOOK_TARGET.y + currentPointerYRef.current * -0.008,
      LOOK_TARGET.z,
    );

    const cameraBlend = 1 - Math.exp(-delta * (paused ? 10 : 1.2));
    camera.position.lerp(targetPositionRef.current, cameraBlend);
    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

export default function AmbientFieldScene({
  qualityTier,
  destination,
  motionMode,
}: AmbientFieldSceneProps) {
  const paused = motionMode === 'reduced';
  const mode = destination;

  return (
    <>
      <CameraRig paused={paused} />
      <BackgroundDome />
      <NebulaSupernova qualityTier={qualityTier} paused={paused} mode={mode} />
      <HorizonAtmosphere mode={mode} />
      <LightRig qualityTier={qualityTier} mode={mode} />
      <AmbientLensField qualityTier={qualityTier} paused={paused} mode={mode} />
      <DormantDots paused={paused || qualityTier === 'low'} />
      <NearFieldOcclusion paused={paused} mode={mode} />
    </>
  );
}
