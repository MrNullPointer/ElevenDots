'use client';

import styles from './TopBar.module.css';
import ToggleControls from './ToggleControls';

interface TopBarProps {
  onInfoToggle: () => void;
  infoOpen: boolean;
}

export default function TopBar({ onInfoToggle, infoOpen }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <span className={styles.wordmark}>elevendots</span>
      <div className={styles.controls}>
        <ToggleControls onInfoToggle={onInfoToggle} infoOpen={infoOpen} />
      </div>
    </header>
  );
}
