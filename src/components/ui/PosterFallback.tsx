'use client';

import { useAppStore } from '@/lib/store';
import styles from './PosterFallback.module.css';

export default function PosterFallback() {
  const scenePhase = useAppStore((s) => s.scenePhase);

  return (
    <div className={styles.poster} data-phase={scenePhase} aria-hidden="true">
      <div className={styles.gradient} />
      <div className={styles.vignette} />
    </div>
  );
}
