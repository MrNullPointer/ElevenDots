'use client';

import PosterFallback from './PosterFallback';
import TopBar from './TopBar';
import Navigation from './Navigation';
import AboutPanel from './AboutPanel';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import styles from './HomeShell.module.css';

export default function HomeShell() {
  const { closeAboutModal } = useHashRoute();

  return (
    <>
      <PosterFallback />
      <div className={styles.shell}>
        <TopBar />
        <Navigation />
        <AboutPanel onClose={closeAboutModal} />
      </div>
    </>
  );
}
