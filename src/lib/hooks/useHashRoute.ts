'use client';

import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function useHashRoute() {
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const activePanel = useAppStore((s) => s.activePanel);

  // Sync hash → store on mount and hashchange
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === '#about') {
        setActivePanel('about');
      } else {
        setActivePanel(null);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [setActivePanel]);

  const openAboutModal = useCallback(() => {
    window.history.pushState(null, '', '#about');
    setActivePanel('about');
  }, [setActivePanel]);

  const closeAboutModal = useCallback(() => {
    // Remove hash without adding history entry
    window.history.pushState(null, '', window.location.pathname);
    setActivePanel(null);
  }, [setActivePanel]);

  return { activePanel, openAboutModal, closeAboutModal };
}
