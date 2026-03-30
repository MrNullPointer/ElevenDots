'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import styles from './SceneCanvas.module.css';

const IDLE_DELAY_MS = 420;

function getExposureMode() {
  if (typeof window === 'undefined') return 'base';
  return new URLSearchParams(window.location.search).get('exposure') === 'lift' ? 'lift' : 'base';
}

export default function SceneCanvas() {
  const scenePhase = useAppStore((s) => s.scenePhase);
  const setScenePhase = useAppStore((s) => s.setScenePhase);
  const qualityTier = useAppStore((s) => s.qualityTier);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const [exposure, setExposure] = useState<'base' | 'lift'>('base');

  useEffect(() => {
    setExposure(getExposureMode());
  }, []);

  useEffect(() => {
    setScenePhase('entering');
    const timeoutId = window.setTimeout(() => {
      setScenePhase('idle');
    }, IDLE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [setScenePhase]);

  return (
    <div
      className={styles.sceneFrame}
      data-phase={scenePhase}
      data-quality={qualityTier}
      data-destination={activeDestination ?? 'idle'}
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-exposure={exposure}
      aria-hidden="true"
    >
      <div className={styles.ambientVeil} />
      <div className={styles.signalField} />
      <div className={styles.atmosphere} />
    </div>
  );
}
