'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { DORMANT_DOTS } from '@/lib/config/site';
import { useAppStore } from '@/lib/store';
import styles from './PosterFallback.module.css';

const POSTER_DOTS = [
  { sourceIndex: 1, x: '33.5%', y: '28%', driftX: '0.06rem', driftY: '-0.12rem' },
  { sourceIndex: 0, x: '48.4%', y: '23.8%', driftX: '-0.04rem', driftY: '-0.1rem' },
  { sourceIndex: 3, x: '68.2%', y: '30.4%', driftX: '0.05rem', driftY: '-0.12rem' },
  { sourceIndex: 4, x: '38.6%', y: '54.8%', driftX: '-0.03rem', driftY: '-0.08rem' },
  { sourceIndex: 5, x: '60.8%', y: '49.6%', driftX: '0.04rem', driftY: '-0.07rem' },
] as const;

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
      <div className={styles.grain} />
      <div className={styles.canopy} />
      <div className={`${styles.sideMass} ${styles.sideMassLeft}`} />
      <div className={`${styles.sideMass} ${styles.sideMassRight}`} />
      <div className={styles.chamberShadow} />
      <div className={styles.apertureField}>
        <div className={styles.apertureSheath} />
        <div className={styles.apertureCore} />
        <div className={styles.apertureAccent} />
      </div>
      <div className={styles.dotField}>
        {POSTER_DOTS.map((posterDot, index) => {
          const dot = DORMANT_DOTS[posterDot.sourceIndex];

          return (
            <span
              key={`${dot.constellationIndex}-${index}`}
              className={styles.dot}
              style={
                {
                  '--dot-x': posterDot.x,
                  '--dot-y': posterDot.y,
                  '--dot-size': `${2.4 + dot.depth * 1.8}px`,
                  '--dot-delay': `${index * 1.4}s`,
                  '--dot-opacity': `${0.07 + dot.depth * 0.07}`,
                  '--dot-drift-x': posterDot.driftX,
                  '--dot-drift-y': posterDot.driftY,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
      <div className={styles.lowerDepth} />
      <div className={styles.vignette} />
    </div>
  );
}
