'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import AboutContent from './AboutContent';
import styles from './AboutPanel.module.css';

interface AboutPanelProps {
  onClose: () => void;
}

const GLASS_CLASS: Record<string, string> = {
  full: 'glass-full',
  reduced: 'glass-reduced',
  opaque: 'glass-opaque',
};

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const activePanel = useAppStore((s) => s.activePanel);
  const glassMode = useAppStore((s) => s.glassMode);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = activePanel === 'about';

  // Escape key closes panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: focus panel on open
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={styles.overlay}
      data-open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="About"
      aria-hidden={!isOpen}
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
          aria-label="Close about panel"
        >
          ×
        </button>
        <AboutContent />
      </div>
    </div>
  );
}
