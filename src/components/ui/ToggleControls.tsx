'use client';

import { useAppStore } from '@/lib/store';
import styles from './ToggleControls.module.css';

interface ToggleControlsProps {
  onInfoToggle: () => void;
  infoOpen: boolean;
}

export default function ToggleControls({ onInfoToggle, infoOpen }: ToggleControlsProps) {
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
        {frozen ? '\u25B6' : '\u23F8'}
      </button>
      <button
        className={styles.toggle}
        onClick={cycleAudioState}
        aria-pressed={audioState !== 'off'}
        aria-label={`Audio: ${audioState}`}
        title={`Audio: ${audioState}`}
      >
        {audioState === 'off' ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
      </button>
      <button
        className={styles.toggle}
        onClick={onInfoToggle}
        aria-pressed={infoOpen}
        aria-label={infoOpen ? 'Close settings' : 'Open settings'}
        title="Settings"
      >
        {'\u2139'}
      </button>
    </>
  );
}
