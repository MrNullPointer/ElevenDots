'use client';

import {
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { DESTINATION_LIST } from '@/lib/config/site';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import { type DestinationId, type WorldDestination, useAppStore } from '@/lib/store';
import styles from './Navigation.module.css';

interface NavigationProps {
  activeDestination: WorldDestination;
  panelOpen: boolean;
}

export default function Navigation({ activeDestination, panelOpen }: NavigationProps) {
  const { openAboutModal } = useHashRoute();
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const setLastInteractionSource = useAppStore((s) => s.setLastInteractionSource);
  const activeId = activeDestination === 'idle' ? null : activeDestination;
  const navRef = useRef<HTMLElement>(null);
  const touchPreviewTimeoutRef = useRef<number | null>(null);

  const clearTouchPreview = useCallback(() => {
    if (touchPreviewTimeoutRef.current !== null) {
      window.clearTimeout(touchPreviewTimeoutRef.current);
      touchPreviewTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTouchPreview(), [clearTouchPreview]);

  const handleAboutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Modifier key passthrough — let browser handle natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    clearTouchPreview();
    setActiveDestination('about');
    openAboutModal();
  };

  const handleDestinationEnter = (id: DestinationId) => () => {
    clearTouchPreview();
    setLastInteractionSource('mouse');
    setActiveDestination(id);
  };

  const handleDestinationFocus = (id: DestinationId) => () => {
    clearTouchPreview();
    setLastInteractionSource('keyboard');
    setActiveDestination(id);
  };

  const handleDestinationLeave = () => {
    if (navRef.current?.contains(document.activeElement)) {
      return;
    }

    clearTouchPreview();
    setActiveDestination(null);
  };

  const handleDestinationBlur = (e: FocusEvent<HTMLAnchorElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      clearTouchPreview();
      setActiveDestination(null);
    }
  };

  const handleDestinationPointerDown =
    (id: DestinationId) => (e: PointerEvent<HTMLAnchorElement>) => {
      if (e.pointerType !== 'touch') {
        return;
      }

      clearTouchPreview();
      setLastInteractionSource('touch');
      setActiveDestination(id);

      if (id === 'about') {
        return;
      }

      touchPreviewTimeoutRef.current = window.setTimeout(() => {
        setActiveDestination(null);
        touchPreviewTimeoutRef.current = null;
      }, 820);
    };

  return (
    <nav
      ref={navRef}
      className={styles.nav}
      data-active={activeId ?? 'idle'}
      data-panel={panelOpen ? 'open' : 'closed'}
      aria-label="Main navigation"
    >
      {DESTINATION_LIST.map((dest) => (
        <a
          key={dest.id}
          href={dest.href}
          className={styles.anchor}
          data-active={activeId === dest.id}
          data-muted={activeId !== null && activeId !== dest.id}
          onClick={dest.id === 'about' ? handleAboutClick : undefined}
          onMouseEnter={handleDestinationEnter(dest.id)}
          onFocus={handleDestinationFocus(dest.id)}
          onMouseLeave={handleDestinationLeave}
          onBlur={handleDestinationBlur}
          onPointerDown={handleDestinationPointerDown(dest.id)}
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
