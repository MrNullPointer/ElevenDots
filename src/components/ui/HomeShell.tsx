'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import PosterFallback from './PosterFallback';
import TopBar from './TopBar';
import Navigation from './Navigation';
import AboutPanel from './AboutPanel';
import InfoPanel from './InfoPanel';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import { useAppStore } from '@/lib/store';
import styles from './HomeShell.module.css';

const SceneCanvas = dynamic(() => import('@/components/scene/SceneCanvas'), {
  ssr: false,
});

export default function HomeShell() {
  const { closeAboutModal } = useHashRoute();
  const [infoOpen, setInfoOpen] = useState(false);
  const frozen = useAppStore((s) => s.frozen);

  const toggleInfo = useCallback(() => setInfoOpen((o) => !o), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('frozen', frozen);
    return () => document.body.classList.remove('frozen');
  }, [frozen]);

  return (
    <>
      <PosterFallback />
      <SceneCanvas />
      <div className={styles.shell}>
        <TopBar onInfoToggle={toggleInfo} infoOpen={infoOpen} />
        <Navigation />
        <AboutPanel onClose={closeAboutModal} />
        <InfoPanel open={infoOpen} onClose={closeInfo} />
      </div>
    </>
  );
}
