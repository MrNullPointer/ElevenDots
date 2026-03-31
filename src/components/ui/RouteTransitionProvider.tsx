'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './RouteTransitionProvider.module.css';

const ROUTE_EXIT_MS = 220;
const ROUTE_ENTER_MS = 520;

type RoutePhase = 'idle' | 'leaving' | 'entering';

function isModifiedEvent(event: MouseEvent | ReactMouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function RouteTransitionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<RoutePhase>('idle');
  const mountedRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const leaveTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current !== null) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
      if (enterTimeoutRef.current !== null) {
        window.clearTimeout(enterTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setPhase('entering');
    pendingHrefRef.current = null;

    if (enterTimeoutRef.current !== null) {
      window.clearTimeout(enterTimeoutRef.current);
    }

    enterTimeoutRef.current = window.setTimeout(() => {
      setPhase('idle');
      enterTimeoutRef.current = null;
    }, ROUTE_ENTER_MS);
  }, [pathname]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedEvent(event) || phase === 'leaving') {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== '_self') {
        return;
      }

      if (anchor.hasAttribute('download')) {
        return;
      }

      const rel = anchor.getAttribute('rel');
      if (rel?.includes('external')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextHref === currentHref) {
        return;
      }

      if (url.pathname === window.location.pathname) {
        return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        event.preventDefault();
        router.push(nextHref);
        return;
      }

      event.preventDefault();
      pendingHrefRef.current = nextHref;
      setPhase('leaving');

      if (leaveTimeoutRef.current !== null) {
        window.clearTimeout(leaveTimeoutRef.current);
      }

      leaveTimeoutRef.current = window.setTimeout(() => {
        if (pendingHrefRef.current) {
          router.push(pendingHrefRef.current);
        }
        leaveTimeoutRef.current = null;
      }, ROUTE_EXIT_MS);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [phase, router]);

  return (
    <div className={styles.stage} data-route-phase={phase}>
      {children}
    </div>
  );
}
