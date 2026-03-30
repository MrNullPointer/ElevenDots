'use client';

import { useAppStore } from '@/lib/store';
import styles from './ToggleControls.module.css';

export default function ToggleControls() {
  const frozen = useAppStore((s) => s.frozen);
  const toggleFrozen = useAppStore((s) => s.toggleFrozen);
  const setFrozen = useAppStore((s) => s.setFrozen);
  const testMode = useAppStore((s) => s.testMode);
  const audioState = useAppStore((s) => s.audioState);
  const cycleAudioState = useAppStore((s) => s.cycleAudioState);

  const handleFreeze = () => {
    if (testMode) {
      setFrozen(true);
    } else {
      toggleFrozen();
    }
  };

  return (
    <>
      <button
        className={styles.toggle}
        onClick={handleFreeze}
        aria-pressed={frozen}
        aria-label={frozen ? 'Resume animations' : 'Pause animations'}
        title={frozen ? 'Resume' : 'Pause'}
      >
        {frozen ? '▶' : '⏸'}
      </button>
      <button
        className={styles.toggle}
        onClick={cycleAudioState}
        aria-pressed={audioState !== 'off'}
        aria-label={`Audio: ${audioState}`}
        title={`Audio: ${audioState}`}
      >
        {audioState === 'off' ? '🔇' : '🔊'}
      </button>
    </>
  );
}
