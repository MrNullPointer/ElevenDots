'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import type { MotionMode, QualityTier, ScenePhase, WorldDestination } from '@/lib/store';
import { useAppStore } from '@/lib/store';
import AmbientFieldScene from './AmbientFieldScene';
import styles from './SceneCanvas.module.css';

function getExposureMode() {
  if (typeof window === 'undefined') return 'base';
  return new URLSearchParams(window.location.search).get('exposure') === 'lift' ? 'lift' : 'base';
}

interface SceneCanvasProps {
  scenePhase: ScenePhase;
  qualityTier: QualityTier;
  destination: WorldDestination;
  motionMode: MotionMode;
  panelOpen: boolean;
}

export default function SceneCanvas({
  scenePhase,
  qualityTier,
  destination,
  motionMode,
  panelOpen,
}: SceneCanvasProps) {
  const [exposure, setExposure] = useState<'base' | 'lift'>('base');
  const [liveAmbientEnabled, setLiveAmbientEnabled] = useState(false);
  const capabilities = useAppStore((s) => s.capabilities);
  const hasWebgl = capabilities?.webgl ?? true;
  const dpr: number | [number, number] =
    qualityTier === 'high' ? [1, 1.8] : qualityTier === 'medium' ? [1, 1.4] : 1;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExposure(getExposureMode());
    setLiveAmbientEnabled(params.get('ambient') !== 'off');
  }, []);

  return (
    <div
      className={styles.sceneFrame}
      data-phase={scenePhase}
      data-quality={qualityTier}
      data-destination={destination}
      data-motion={motionMode}
      data-panel={panelOpen ? 'open' : 'closed'}
      data-exposure={exposure}
    >
      {hasWebgl && liveAmbientEnabled ? (
        <div className={styles.canvasLayer}>
          <Canvas
            dpr={dpr}
            frameloop={motionMode === 'reduced' ? 'demand' : 'always'}
            aria-label="Interactive cryogenic field"
            gl={{
              antialias: qualityTier !== 'low',
              alpha: false,
              powerPreference: qualityTier === 'high' ? 'high-performance' : 'default',
            }}
            camera={{ position: [0.2, 0.72, 5.22], fov: 22, near: 0.1, far: 100 }}
            onCreated={({ gl }) => {
              gl.setClearColor(exposure === 'lift' ? '#07101a' : '#040812', 1);
              gl.outputColorSpace = SRGBColorSpace;
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = exposure === 'lift' ? 1.08 : 1;
            }}
          >
            <AmbientFieldScene
              qualityTier={qualityTier}
              destination={destination}
              motionMode={motionMode}
            />
          </Canvas>
        </div>
      ) : null}

      <div className={styles.ambientVeil} />
      <div className={styles.shearField} />
      <div className={styles.signalField} />
      <div className={styles.cavityHalo} />
      <div className={styles.structuralField} />
      <div className={styles.atmosphere} />
    </div>
  );
}
