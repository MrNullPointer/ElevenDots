'use client';

import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { ABOUT, DESTINATION_LIST } from '@/lib/config/site';
import { useHashRoute } from '@/lib/hooks/useHashRoute';
import { type DestinationId, type WorldDestination, useAppStore } from '@/lib/store';
import styles from './HeroSignal.module.css';

interface HeroSignalProps {
  activeDestination: WorldDestination;
  panelOpen: boolean;
}

const DESTINATION_COPY: Record<DestinationId, string> = {
  pulse: 'Technical writing, systems notes, and signal threads.',
  axiom: 'Projects, experiments, and applied proof.',
  about: 'Background, motives, and contact.',
};

const HERO_NAME_LINES = ['PARIKSHIT', 'DUBEY'] as const;

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function HeroSignal({ activeDestination, panelOpen }: HeroSignalProps) {
  const { openAboutModal } = useHashRoute();
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const setLastInteractionSource = useAppStore((s) => s.setLastInteractionSource);
  const activeId = activeDestination === 'idle' ? null : activeDestination;
  const heroRef = useRef<HTMLElement>(null);
  const clearTimeoutRef = useRef<number | null>(null);
  const touchTimeoutRef = useRef<number | null>(null);

  const clearTouchPreview = useCallback(() => {
    if (touchTimeoutRef.current !== null) {
      window.clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  }, []);

  const clearPendingReset = useCallback(() => {
    if (clearTimeoutRef.current !== null) {
      window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
  }, []);

  const scheduleIdleReturn = useCallback(
    (delay = 120) => {
      clearPendingReset();
      clearTimeoutRef.current = window.setTimeout(() => {
        if (heroRef.current?.contains(document.activeElement)) {
          clearTimeoutRef.current = null;
          return;
        }

        setActiveDestination(null);
        clearTimeoutRef.current = null;
      }, delay);
    },
    [clearPendingReset, setActiveDestination],
  );

  useEffect(
    () => () => {
      clearTouchPreview();
      clearPendingReset();
    },
    [clearPendingReset, clearTouchPreview],
  );

  const handleEnter = (id: DestinationId) => () => {
    clearPendingReset();
    clearTouchPreview();
    setLastInteractionSource('mouse');
    setActiveDestination(id);
  };

  const handleFocus = (id: DestinationId) => () => {
    clearPendingReset();
    clearTouchPreview();
    setLastInteractionSource('keyboard');
    setActiveDestination(id);
  };

  const handleBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    if (heroRef.current?.contains(event.relatedTarget as Node | null)) {
      return;
    }

    clearTouchPreview();
    scheduleIdleReturn();
  };

  const handleLeave = () => {
    if (heroRef.current?.contains(document.activeElement)) {
      return;
    }

    clearTouchPreview();
    scheduleIdleReturn();
  };

  const handlePointerDown =
    (id: DestinationId) => (event: PointerEvent<HTMLAnchorElement>) => {
      if (event.pointerType !== 'touch') {
        return;
      }

      clearPendingReset();
      clearTouchPreview();
      setLastInteractionSource('touch');
      setActiveDestination(id);

      if (id === 'about') {
        return;
      }

      touchTimeoutRef.current = window.setTimeout(() => {
        setActiveDestination(null);
        touchTimeoutRef.current = null;
      }, 820);
    };

  const handleAboutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(event)) {
      return;
    }

    event.preventDefault();
    clearPendingReset();
    clearTouchPreview();
    setActiveDestination('about');
    openAboutModal();
  };

  return (
    <main
      ref={heroRef}
      className={styles.hero}
      data-active={activeId ?? 'idle'}
      data-panel={panelOpen ? 'open' : 'closed'}
      aria-label="ElevenDots home"
      onMouseLeave={handleLeave}
    >
      <p className={styles.eyebrow}>ElevenDots</p>
      <h1 className={styles.title} aria-label={ABOUT.heading}>
        {HERO_NAME_LINES.map((line, lineIndex) => (
          <span className={styles.titleLine} key={line}>
            {Array.from(line).map((letter, letterIndex) => (
              <span
                className={styles.titleLetter}
                key={`${line}-${letterIndex}`}
                aria-hidden="true"
                style={
                  {
                    '--letter-index': lineIndex * 9 + letterIndex,
                  } as CSSProperties
                }
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className={styles.dek}>{ABOUT.subheading}</p>
      <p className={styles.statement}>
        First-principles work across silicon, systems, performance, and intelligent
        machines.
      </p>

      <div className={styles.instrument} aria-hidden="true">
        <span className={styles.instrumentPlate} />
        <span className={styles.instrumentRing} />
        <span className={styles.instrumentArc} />
        <span className={styles.instrumentSweep} />
      </div>

      <nav className={styles.destinations} aria-label="Featured destinations">
        {DESTINATION_LIST.map((dest, index) => (
          <a
            key={dest.id}
            href={dest.href}
            className={styles.destination}
            data-active={activeId === dest.id}
            data-muted={activeId !== null && activeId !== dest.id}
            onClick={dest.id === 'about' ? handleAboutClick : undefined}
            onMouseEnter={handleEnter(dest.id)}
            onFocus={handleFocus(dest.id)}
            onBlur={handleBlur}
            onPointerDown={handlePointerDown(dest.id)}
            {...(dest.href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <span className={styles.marker} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={styles.destinationCopy}>
              <span className={styles.destinationLabel}>{dest.label}</span>
              <span className={styles.destinationDescription}>
                {DESTINATION_COPY[dest.id]}
              </span>
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}
