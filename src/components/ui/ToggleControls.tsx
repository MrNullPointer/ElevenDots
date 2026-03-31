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

  const freezeIcon = frozen ? (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7.5L16.5 12L9 16.5V7.5Z" fill="currentColor" />
    </svg>
  ) : (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7.25" y="6.5" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="13.75" y="6.5" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );

  const audioIcon =
    audioState === 'off' ? (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10.25 8.5L7.75 10.5H5.5V13.5H7.75L10.25 15.5V8.5Z"
          fill="currentColor"
        />
        <path
          d="M15.25 8.75L19.25 14.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19.25 8.75L15.25 14.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ) : audioState === 'ambient' ? (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10.25 8.5L7.75 10.5H5.5V13.5H7.75L10.25 15.5V8.5Z"
          fill="currentColor"
        />
        <path
          d="M14.5 10C15.4 10.65 15.95 11.62 15.95 12.7C15.95 13.78 15.4 14.75 14.5 15.4"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ) : (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10.25 8.5L7.75 10.5H5.5V13.5H7.75L10.25 15.5V8.5Z"
          fill="currentColor"
        />
        <path
          d="M14.25 9.2C15.35 10 16 11.25 16 12.7C16 14.15 15.35 15.4 14.25 16.2"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16.7 7.35C18.3 8.6 19.25 10.5 19.25 12.7C19.25 14.9 18.3 16.8 16.7 18.05"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );

  const infoIcon = (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.2" r="1.2" fill="currentColor" />
      <path
        d="M12 10.75V16.15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      <button
        className={styles.toggle}
        onClick={handleFreeze}
        aria-pressed={frozen}
        aria-label={frozen ? 'Resume animations' : 'Pause animations'}
        title={frozen ? 'Resume' : 'Pause'}
      >
        <span className={styles.iconWrap}>{freezeIcon}</span>
      </button>
      <button
        className={styles.toggle}
        onClick={cycleAudioState}
        aria-pressed={audioState !== 'off'}
        aria-label={`Audio: ${audioState}`}
        title={`Audio: ${audioState}`}
      >
        <span className={styles.iconWrap}>{audioIcon}</span>
      </button>
      <button
        className={styles.toggle}
        onClick={onInfoToggle}
        aria-pressed={infoOpen}
        aria-label={infoOpen ? 'Close settings' : 'Open settings'}
        title="Settings"
      >
        <span className={styles.iconWrap}>{infoIcon}</span>
      </button>
    </>
  );
}
