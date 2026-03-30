'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { DORMANT_DOTS } from '@/lib/config/site';
import { useAppStore } from '@/lib/store';
import styles from './PosterFallback.module.css';

function mapDotX(x: number) {
  return `${((x + 4.8) / 9.6) * 100}%`;
}

function mapDotY(y: number) {
  return `${((y + 3.2) / 6.6) * 100}%`;
}

export default function PosterFallback() {
  const scenePhase = useAppStore((s) => s.scenePhase);
  const qualityTier = useAppStore((s) => s.qualityTier);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const [exposure, setExposure] = useState<'base' | 'lift'>('base');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExposure(params.get('exposure') === 'lift' ? 'lift' : 'base');
  }, []);

  return (
    <div
      className={styles.poster}
      data-phase={scenePhase}
      data-quality={qualityTier}
      data-destination={activeDestination ?? 'idle'}
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-exposure={exposure}
      aria-hidden="true"
    >
      <div className={styles.base} />
      <div className={styles.farField} />
      <div className={styles.texture} />
      <div className={styles.overheadShell} />
      <div className={`${styles.sideWall} ${styles.sideWallLeft}`} />
      <div className={`${styles.sideWall} ${styles.sideWallRight}`} />
      <div className={styles.midField} />
      <div className={styles.apertureField}>
        <div className={styles.apertureHalo} />
        <div className={styles.apertureRing} />
        <div className={styles.apertureCore} />
      </div>
      <div className={styles.signalTraces} />
      <div className={styles.dotField}>
        {DORMANT_DOTS.map((dot, index) => (
          <span
            key={`${dot.constellationIndex}-${index}`}
            className={styles.dot}
            style={
              {
                '--dot-x': mapDotX(dot.position[0]),
                '--dot-y': mapDotY(dot.position[1]),
                '--dot-size': `${4 + dot.depth * 4}px`,
                '--dot-delay': `${index * 0.8}s`,
                '--dot-opacity': `${0.12 + dot.depth * 0.12}`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className={styles.lowerDepth} />
      <div className={styles.vignette} />
    </div>
  );
}
