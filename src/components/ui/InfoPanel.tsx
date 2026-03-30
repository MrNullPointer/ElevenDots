'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import type { GlassMode } from '@/lib/store';
import styles from './InfoPanel.module.css';

interface InfoPanelProps {
  open: boolean;
  onClose: () => void;
}

const GLASS_CLASS: Record<string, string> = {
  full: 'glass-full',
  reduced: 'glass-reduced',
  opaque: 'glass-opaque',
};

const GLASS_OPTIONS: GlassMode[] = ['full', 'reduced', 'opaque'];

export default function InfoPanel({ open, onClose }: InfoPanelProps) {
  const glassMode = useAppStore((s) => s.glassMode);
  const setGlassMode = useAppStore((s) => s.setGlassMode);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);
  const audioState = useAppStore((s) => s.audioState);
  const qualityTier = useAppStore((s) => s.qualityTier);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  return (
    <div
      className={styles.overlay}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      aria-hidden={!open}
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`${styles.panel} ${GLASS_CLASS[glassMode]}`}
        tabIndex={-1}
      >
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Close settings panel"
        >
          &times;
        </button>
        <h2 className={styles.heading}>Settings</h2>

        <div className={styles.section}>
          <p className={styles.label}>Glass mode</p>
          <div className={styles.segmented} role="radiogroup" aria-label="Glass mode">
            {GLASS_OPTIONS.map((mode) => (
              <button
                key={mode}
                className={styles.segmentBtn}
                data-active={glassMode === mode}
                role="radio"
                aria-checked={glassMode === mode}
                onClick={() => setGlassMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.toggleRow}>
            <span className={styles.label}>Reduced motion</span>
            <button
              className={styles.switch}
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle reduced motion"
              onClick={() => setReducedMotion(!reducedMotion)}
            >
              <span className={styles.switchThumb} />
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.label}>Audio</span>
            <span className={styles.value}>{audioState}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.label}>Quality</span>
            <span className={styles.value}>{qualityTier}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
