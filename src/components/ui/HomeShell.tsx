'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import PosterFallback from './PosterFallback';
import TopBar from './TopBar';
import Navigation from './Navigation';
import AboutPanel from './AboutPanel';
import InfoPanel from './InfoPanel';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import { useCapabilities } from '@/components/scene/hooks/useCapabilities';
import { type MotionMode, type WorldDestination, useAppStore } from '@/lib/store';
import styles from './HomeShell.module.css';

const SceneCanvas = dynamic(() => import('@/components/scene/SceneCanvas'), {
  ssr: false,
});

const IDLE_DELAY_MS = 420;

declare global {
  interface Window {
    __ZUSTAND_STORE__?: typeof useAppStore;
  }
}

export default function HomeShell() {
  const { closeAboutModal } = useHashRoute();
  const [infoOpen, setInfoOpen] = useState(false);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const activePanel = useAppStore((s) => s.activePanel);
  const scenePhase = useAppStore((s) => s.scenePhase);
  const setScenePhase = useAppStore((s) => s.setScenePhase);
  const qualityTier = useAppStore((s) => s.qualityTier);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const frozen = useAppStore((s) => s.frozen);
  const testMode = useAppStore((s) => s.testMode);

  useCapabilities();

  const toggleInfo = useCallback(() => setInfoOpen((o) => !o), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);
  const aboutPanelOpen = activePanel === 'about';
  const shellPanelOpen = aboutPanelOpen || infoOpen;
  const destination: WorldDestination = aboutPanelOpen
    ? 'about'
    : activeDestination ?? 'idle';
  const motionMode: MotionMode = reducedMotion || frozen || testMode ? 'reduced' : 'full';

  useEffect(() => {
    document.body.classList.toggle('frozen', frozen || testMode);
    return () => document.body.classList.remove('frozen');
  }, [frozen, testMode]);

  useEffect(() => {
    window.__ZUSTAND_STORE__ = useAppStore;
    return () => {
      delete window.__ZUSTAND_STORE__;
    };
  }, []);

  useEffect(() => {
    setScenePhase('entering');
    const timeoutId = window.setTimeout(() => {
      setScenePhase('idle');
    }, IDLE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [setScenePhase]);

  useEffect(() => {
    if (scenePhase === 'loading' || scenePhase === 'entering') {
      return;
    }

    const nextPhase = shellPanelOpen || destination !== 'idle' ? 'navigating' : 'idle';
    if (scenePhase !== nextPhase) {
      setScenePhase(nextPhase);
    }
  }, [destination, scenePhase, setScenePhase, shellPanelOpen]);

  return (
    <>
      <PosterFallback
        scenePhase={scenePhase}
        qualityTier={qualityTier}
        destination={destination}
        motionMode={motionMode}
        panelOpen={shellPanelOpen}
      />
      <SceneCanvas
        scenePhase={scenePhase}
        qualityTier={qualityTier}
        destination={destination}
        motionMode={motionMode}
        panelOpen={shellPanelOpen}
      />
      <div
        className={styles.shell}
        data-phase={scenePhase}
        data-quality={qualityTier}
        data-destination={destination}
        data-motion={motionMode}
        data-panel={shellPanelOpen ? 'open' : 'closed'}
      >
        <TopBar
          onInfoToggle={toggleInfo}
          infoOpen={infoOpen}
          destination={destination}
          panelOpen={shellPanelOpen}
        />
        <Navigation activeDestination={destination} panelOpen={shellPanelOpen} />
        <AboutPanel
          onClose={closeAboutModal}
          isOpen={aboutPanelOpen}
          destination={destination}
        />
        <InfoPanel open={infoOpen} onClose={closeInfo} />
      </div>
    </>
  );
}
