'use client';

import { type FocusEvent, type MouseEvent } from 'react';
import { DESTINATION_LIST } from '@/lib/config/site';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import { type DestinationId, useAppStore } from '@/lib/store';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { openAboutModal } = useHashRoute();
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const handleAboutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Modifier key passthrough — let browser handle natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    openAboutModal();
  };

  const handleDestinationEnter = (id: DestinationId) => () => {
    setActiveDestination(id);
  };

  const handleDestinationLeave = () => {
    setActiveDestination(null);
  };

  const handleDestinationBlur = (e: FocusEvent<HTMLAnchorElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setActiveDestination(null);
    }
  };

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {DESTINATION_LIST.map((dest) => (
        <a
          key={dest.id}
          href={dest.href}
          className={styles.anchor}
          onClick={dest.id === 'about' ? handleAboutClick : undefined}
          onMouseEnter={handleDestinationEnter(dest.id)}
          onFocus={handleDestinationEnter(dest.id)}
          onMouseLeave={handleDestinationLeave}
          onBlur={handleDestinationBlur}
          {...(dest.href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {dest.id === 'about' ? 'About me' : dest.label}
        </a>
      ))}
    </nav>
  );
}
