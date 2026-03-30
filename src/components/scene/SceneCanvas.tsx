'use client';

import { useEffect, useState } from 'react';
import type { MotionMode, QualityTier, ScenePhase, WorldDestination } from '@/lib/store';
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

  useEffect(() => {
    setExposure(getExposureMode());
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
      aria-hidden="true"
    >
      <div className={styles.ambientVeil} />
      <div className={styles.shearField} />
      <div className={styles.signalField} />
      <div className={styles.cavityHalo} />
      <div className={styles.structuralField} />
      <div className={styles.atmosphere} />
    </div>
  );
}
