'use client';

import { useCallback, useState } from 'react';
import PosterFallback from './PosterFallback';
import TopBar from './TopBar';
import Navigation from './Navigation';
import AboutPanel from './AboutPanel';
import InfoPanel from './InfoPanel';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import styles from './HomeShell.module.css';

export default function HomeShell() {
  const { closeAboutModal } = useHashRoute();
  const [infoOpen, setInfoOpen] = useState(false);

  const toggleInfo = useCallback(() => setInfoOpen((o) => !o), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);

  return (
    <>
      <PosterFallback />
      <div className={styles.shell}>
        <TopBar onInfoToggle={toggleInfo} infoOpen={infoOpen} />
        <Navigation />
        <AboutPanel onClose={closeAboutModal} />
        <InfoPanel open={infoOpen} onClose={closeInfo} />
      </div>
    </>
  );
}
