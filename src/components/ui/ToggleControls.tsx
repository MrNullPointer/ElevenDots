'use client';

import { useAppStore } from '@/lib/store';
import styles from './ToggleControls.module.css';

interface ToggleControlsProps {
  onInfoToggle: () => void;
  infoOpen: boolean;
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="2.5" height="10" rx="0.75" fill="currentColor" />
      <rect x="8.5" y="2" width="2.5" height="10" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4 2.5L11 7L4 11.5V2.5Z" fill="currentColor" />
    </svg>
  );
}

function AudioOnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 5.5H4L7 3V11L4 8.5H2V5.5Z" fill="currentColor" />
      <path d="M9 4.5C9.8 5.2 10.2 6 10.2 7C10.2 8 9.8 8.8 9 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10.5 3C11.8 4.1 12.5 5.5 12.5 7C12.5 8.5 11.8 9.9 10.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AudioOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 5.5H4L7 3V11L4 8.5H2V5.5Z" fill="currentColor" />
      <line x1="9" y1="5" x2="12.5" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12.5" y1="5" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1V3M7 11V13M1 7H3M11 7H13M2.8 2.8L4.2 4.2M9.8 9.8L11.2 11.2M11.2 2.8L9.8 4.2M4.2 9.8L2.8 11.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
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
        {frozen ? <PlayIcon /> : <PauseIcon />}
      </button>
      <button
        className={styles.toggle}
        onClick={cycleAudioState}
        aria-pressed={audioState !== 'off'}
        aria-label={`Audio: ${audioState}`}
        title={`Audio: ${audioState}`}
      >
        {audioState === 'off' ? <AudioOffIcon /> : <AudioOnIcon />}
      </button>
      <button
        className={styles.toggle}
        onClick={onInfoToggle}
        aria-pressed={infoOpen}
        aria-label={infoOpen ? 'Close settings' : 'Open settings'}
        title="Settings"
      >
        <SettingsIcon />
      </button>
    </>
  );
}
