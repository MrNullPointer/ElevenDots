'use client';

import styles from './TopBar.module.css';
import ToggleControls from './ToggleControls';
import type { WorldDestination } from '@/lib/store';

interface TopBarProps {
  onInfoToggle: () => void;
  infoOpen: boolean;
  destination: WorldDestination;
  panelOpen: boolean;
}

export default function TopBar({
  onInfoToggle,
  infoOpen,
  destination,
  panelOpen,
}: TopBarProps) {
  return (
    <header
      className={styles.topBar}
      data-destination={destination}
      data-panel={panelOpen ? 'open' : 'closed'}
    >
      <span className={styles.wordmark}>elevendots</span>
      <div className={styles.controls}>
        <ToggleControls onInfoToggle={onInfoToggle} infoOpen={infoOpen} />
      </div>
    </header>
  );
}
