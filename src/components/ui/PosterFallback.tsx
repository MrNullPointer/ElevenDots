'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { DORMANT_DOTS } from '@/lib/config/site';
import type { MotionMode, QualityTier, ScenePhase, WorldDestination } from '@/lib/store';
import styles from './PosterFallback.module.css';

const POSTER_DOTS = [
  { sourceIndex: 1, x: '33.5%', y: '28%', driftX: '0.06rem', driftY: '-0.12rem' },
  { sourceIndex: 0, x: '47.2%', y: '24.2%', driftX: '-0.04rem', driftY: '-0.1rem' },
  { sourceIndex: 3, x: '68.2%', y: '30.4%', driftX: '0.05rem', driftY: '-0.12rem' },
  { sourceIndex: 2, x: '55.8%', y: '34.8%', driftX: '0.02rem', driftY: '-0.06rem' },
  { sourceIndex: 4, x: '38.6%', y: '54.8%', driftX: '-0.03rem', driftY: '-0.08rem' },
  { sourceIndex: 5, x: '60.8%', y: '49.6%', driftX: '0.04rem', driftY: '-0.07rem' },
  { sourceIndex: 6, x: '72.6%', y: '58.2%', driftX: '0.05rem', driftY: '-0.05rem' },
  { sourceIndex: 7, x: '28.2%', y: '63.8%', driftX: '-0.04rem', driftY: '-0.06rem' },
] as const;

interface PosterFallbackProps {
  scenePhase: ScenePhase;
  qualityTier: QualityTier;
  destination: WorldDestination;
  motionMode: MotionMode;
  panelOpen: boolean;
}

export default function PosterFallback({
  scenePhase,
  qualityTier,
  destination,
  motionMode,
  panelOpen,
}: PosterFallbackProps) {
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
      data-destination={destination}
      data-motion={motionMode}
      data-panel={panelOpen ? 'open' : 'closed'}
      data-exposure={exposure}
      aria-hidden="true"
    >
      <div className={styles.base} />
      <div className={styles.farField} />
      <div className={styles.pressureBands} />
      <div className={styles.nebulaCloud} />
      <div className={styles.shockwave} />
      <div className={styles.edgeMute} />
      <div className={styles.tonePlane} />
      <div className={styles.grain} />
      <div className={styles.starSea} />
      <div className={styles.canopy} />
      <div className={`${styles.sideMass} ${styles.sideMassLeft}`} />
      <div className={`${styles.sideMass} ${styles.sideMassRight}`} />
      <div className={styles.chamberShadow} />
      <div className={styles.apertureField}>
        <div className={styles.apertureSheath} />
        <div className={styles.aperturePocket} />
        <div className={styles.apertureCore} />
        <div className={styles.apertureAccent} />
        <div className={styles.apertureSeam} />
      </div>
      <div className={styles.coreOcclusion} />
      <div className={styles.cavityGlow} />
      <div className={styles.supernovaCore} />
      <div className={styles.enclosureVeil} />
      <div className={styles.spectralVeil} />
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
                  '--dot-size': `${3.4 + dot.depth * 2.8}px`,
                  '--dot-delay': `${index * 1.15}s`,
                  '--dot-opacity': `${0.16 + dot.depth * 0.16}`,
                  '--dot-drift-x': posterDot.driftX,
                  '--dot-drift-y': posterDot.driftY,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
      <div className={styles.destinationWash} />
      <div className={styles.panelSettle} />
      <div className={styles.lowerDepth} />
      <div className={styles.vignette} />
    </div>
  );
}
