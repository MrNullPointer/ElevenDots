'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, type RootState } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import CryogenicScene from './CryogenicScene';
import { useCapabilities } from './hooks/useCapabilities';
import styles from './SceneCanvas.module.css';

const IDLE_DELAY_MS = 480;

export default function SceneCanvas() {
  const scenePhase = useAppStore((s) => s.scenePhase);
  const setScenePhase = useAppStore((s) => s.setScenePhase);
  const qualityTier = useAppStore((s) => s.qualityTier);
  const testMode = useAppStore((s) => s.testMode);
  const capabilities = useCapabilities();
  const idleTimeoutRef = useRef<number | null>(null);

  const dpr = useMemo<number | [number, number]>(() => {
    if (testMode) return 1;
    if (qualityTier === 'low') return 0.9;
    if (qualityTier === 'medium') return 1;
    return 1.2;
  }, [qualityTier, testMode]);

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!capabilities?.webgl2) return;
    if (scenePhase === 'loading') {
      setScenePhase('entering');
    }
  }, [capabilities?.webgl2, scenePhase, setScenePhase]);

  const handleCreated = useCallback(
    (state: RootState) => {
      const { gl } = state;
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.62;
      gl.setClearColor('#040813', 1);

      setScenePhase('entering');

      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = window.setTimeout(() => {
        setScenePhase('idle');
      }, IDLE_DELAY_MS);
    },
    [setScenePhase],
  );

  if (!capabilities || !capabilities.webgl2) return null;

  return (
    <div className={styles.sceneFrame} data-phase={scenePhase} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        dpr={dpr}
        camera={{ position: [0, 1.52, 5.34], fov: 44, near: 0.1, far: 100 }}
        gl={{
          alpha: false,
          antialias: qualityTier !== 'low',
          powerPreference: qualityTier === 'high' ? 'high-performance' : 'default',
          preserveDrawingBuffer: testMode,
        }}
        aria-label="Cryogenic Tide scene canvas"
        role="img"
        onCreated={handleCreated}
      >
        <Suspense fallback={null}>
          {!testMode ? (
            <PerformanceMonitor
              factor={qualityTier === 'high' ? 0.75 : 0.5}
              bounds={() => [42, 58]}
              flipflops={2}
            />
          ) : null}
          <CryogenicScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
