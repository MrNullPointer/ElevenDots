'use client';

import { type MouseEvent } from 'react';
import { DESTINATION_LIST } from '@/lib/config/site';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { openAboutModal } = useHashRoute();

  const handleAboutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Modifier key passthrough — let browser handle natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    openAboutModal();
  };

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {DESTINATION_LIST.map((dest) => (
        <a
          key={dest.id}
          href={dest.href}
          className={styles.anchor}
          onClick={dest.id === 'about' ? handleAboutClick : undefined}
          {...(dest.href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {dest.label}
          <span className={styles.description}>{dest.description}</span>
        </a>
      ))}
    </nav>
  );
}
