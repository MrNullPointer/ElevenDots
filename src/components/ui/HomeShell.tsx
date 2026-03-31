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
    const root = document.documentElement;

    if (motionMode === 'reduced') {
      root.style.setProperty('--depth-x', '0');
      root.style.setProperty('--depth-y', '0');
      return;
    }

    const pointerQuery = window.matchMedia('(pointer: fine)');
    if (!pointerQuery.matches) {
      root.style.setProperty('--depth-x', '0');
      root.style.setProperty('--depth-y', '0');
      return;
    }

    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      root.style.setProperty('--depth-x', currentX.toFixed(4));
      root.style.setProperty('--depth-y', currentY.toFixed(4));

      if (
        Math.abs(targetX - currentX) > 0.0008 ||
        Math.abs(targetY - currentY) > 0.0008
      ) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const queueRender = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return;
      }

      targetX = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      targetY = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1));
      queueRender();
    };

    const resetDepth = () => {
      targetX = 0;
      targetY = 0;
      queueRender();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetDepth);
    window.addEventListener('blur', resetDepth);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', resetDepth);
      window.removeEventListener('blur', resetDepth);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      root.style.setProperty('--depth-x', '0');
      root.style.setProperty('--depth-y', '0');
    };
  }, [motionMode]);

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
