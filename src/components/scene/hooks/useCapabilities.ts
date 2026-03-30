'use client';

import { useEffect } from 'react';
import { useAppStore, type Capabilities, type QualityTier } from '@/lib/store';

const TEST_MODE_CAPABILITIES: Capabilities = {
  webgl: true,
  webgl2: true,
  gpu: 'test',
  memory: 4,
  pixelRatio: 1,
  mobile: false,
  hoverCapable: true,
  touchOnly: false,
  backdropFilter: true,
};

function detectCapabilities(): Capabilities {
  if (typeof window === 'undefined') {
    return {
      webgl: false,
      webgl2: false,
      gpu: 'server',
      memory: 4,
      pixelRatio: 1,
      mobile: false,
      hoverCapable: false,
      touchOnly: true,
      backdropFilter: false,
    };
  }

  const canvas = document.createElement('canvas');
  const webgl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
  const webgl = (canvas.getContext('webgl') ??
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  const rendererContext: WebGLRenderingContext | WebGL2RenderingContext | null =
    webgl2 ?? webgl;

  let gpu = 'unknown';
  if (rendererContext) {
    const debugInfo = rendererContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = rendererContext.getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL,
      );
      if (typeof renderer === 'string') gpu = renderer;
    }
  }

  const memory =
    typeof navigator !== 'undefined' &&
    'deviceMemory' in navigator &&
    typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory ===
      'number'
      ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory)
      : 4;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  const mobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
  const hoverCapable = window.matchMedia('(any-hover: hover)').matches;
  const touchOnly = window.matchMedia('(pointer: coarse)').matches && !hoverCapable;
  const backdropFilter =
    typeof CSS !== 'undefined' &&
    (CSS.supports('backdrop-filter: blur(2px)') ||
      CSS.supports('-webkit-backdrop-filter: blur(2px)'));

  return {
    webgl: Boolean(webgl || webgl2),
    webgl2: Boolean(webgl2),
    gpu,
    memory,
    pixelRatio,
    mobile,
    hoverCapable,
    touchOnly,
    backdropFilter,
  };
}

function resolveInitialQualityTier(
  capabilities: Capabilities,
  reducedMotion: boolean,
): QualityTier {
  if (!capabilities.webgl2 || reducedMotion) return 'low';
  if (capabilities.mobile || capabilities.touchOnly) return 'low';
  if (capabilities.memory <= 4) return 'low';
  if (capabilities.pixelRatio > 2.3) return 'low';

  const gpu = capabilities.gpu.toLowerCase();
  if (
    gpu.includes('swiftshader') ||
    gpu.includes('llvmpipe') ||
    gpu.includes('software') ||
    gpu.includes('mali')
  ) {
    return 'low';
  }

  // Runtime performance monitor can later promote medium -> high.
  return 'medium';
}

export function useCapabilities() {
  const capabilities = useAppStore((s) => s.capabilities);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const testMode = useAppStore((s) => s.testMode);
  const setCapabilities = useAppStore((s) => s.setCapabilities);
  const setQualityTier = useAppStore((s) => s.setQualityTier);

  useEffect(() => {
    if (testMode) {
      setCapabilities(TEST_MODE_CAPABILITIES);
      setQualityTier('low');
      return;
    }

    const nextCapabilities = detectCapabilities();
    setCapabilities(nextCapabilities);
    setQualityTier(resolveInitialQualityTier(nextCapabilities, reducedMotion));
  }, [reducedMotion, setCapabilities, setQualityTier, testMode]);

  return capabilities;
}
