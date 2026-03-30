'use client';

import styles from './TopBar.module.css';
import ToggleControls from './ToggleControls';

export default function TopBar() {
  return (
    <header className={styles.topBar}>
      <span className={styles.wordmark}>elevendots</span>
      <div className={styles.controls}>
        <ToggleControls />
      </div>
    </header>
  );
}
