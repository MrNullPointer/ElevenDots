'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import type { DestinationId } from '@/lib/store';

const HASH_DESTINATIONS: Record<string, DestinationId> = {
  '#pulse': 'pulse',
  '#axiom': 'axiom',
  '#about': 'about',
};

export function useHashRoute() {
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const activePanel = useAppStore((s) => s.activePanel);

  // Track whether modal was opened via in-page navigation (click)
  // vs. direct URL load, so we know whether to history.back() or replaceState
  const modalOpenedViaNavRef = useRef(false);

  // Sync hash → store
  const syncHash = useCallback(() => {
    const hash = window.location.hash;
    const dest = HASH_DESTINATIONS[hash];

    if (hash === '#about') {
      setActivePanel('about');
    } else {
      setActivePanel(null);
    }

    if (dest && dest !== 'about') {
      setActiveDestination(dest);
    }
  }, [setActivePanel, setActiveDestination]);

  // Read hash on mount + listen for changes
  useEffect(() => {
    syncHash();

    const handleHashChange = () => syncHash();
    const handlePopState = () => syncHash();

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncHash]);

  const openAboutModal = useCallback(() => {
    modalOpenedViaNavRef.current = true;
    window.history.pushState(null, '', '/#about');
    setActivePanel('about');
  }, [setActivePanel]);

  const closeAboutModal = useCallback(() => {
    if (modalOpenedViaNavRef.current) {
      // Opened via in-page nav click → go back in history
      modalOpenedViaNavRef.current = false;
      window.history.back();
    } else {
      // Opened via direct URL → replace state to remove hash
      window.history.replaceState(null, '', '/');
      setActivePanel(null);
    }
  }, [setActivePanel]);

  return { activePanel, openAboutModal, closeAboutModal };
}
