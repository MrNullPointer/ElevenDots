'use client';

import dynamic from 'next/dynamic';

const HomeShell = dynamic(() => import('@/components/ui/HomeShell'), {
  ssr: false,
});

export default function Home() {
  return <HomeShell />;
}
