'use client';

import { create } from 'zustand';

/* ── Types ── */
export type DestinationId = 'pulse' | 'axiom' | 'about';
export type PanelId = 'about' | null;
export type ScenePhase = 'loading' | 'entering' | 'idle' | 'navigating';
export type AudioState = 'off' | 'ambient' | 'interactive';
export type QualityTier = 'high' | 'medium' | 'low';
export type GlassMode = 'full' | 'reduced' | 'opaque';
export type InteractionSource = 'mouse' | 'touch' | 'keyboard';

export interface Capabilities {
  webgl: boolean;
  webgl2: boolean;
  gpu: string;
  memory: number;
  pixelRatio: number;
  mobile: boolean;
}

/* ── State shape ── */
interface AppState {
  // Scene
  scenePhase: ScenePhase;
  frozen: boolean;
  qualityTier: QualityTier;
  capabilities: Capabilities | null;

  // Navigation
  activeDestination: DestinationId | null;
  activePanel: PanelId;

  // Audio
  audioState: AudioState;

  // Display
  glassMode: GlassMode;
  reducedMotion: boolean;

  // Testing
  testMode: boolean;

  // Interaction
  lastInteractionSource: InteractionSource;
}

/* ── Actions ── */
interface AppActions {
  // Scene
  setScenePhase: (phase: ScenePhase) => void;
  setFrozen: (frozen: boolean) => void;
  toggleFrozen: () => void;
  setQualityTier: (tier: QualityTier) => void;
  setCapabilities: (caps: Capabilities) => void;

  // Navigation
  setActiveDestination: (dest: DestinationId | null) => void;
  setActivePanel: (panel: PanelId) => void;

  // Audio
  setAudioState: (state: AudioState) => void;
  cycleAudioState: () => void;

  // Display
  setGlassMode: (mode: GlassMode) => void;
  cycleGlassMode: () => void;
  setReducedMotion: (reduced: boolean) => void;

  // Testing
  setTestMode: (enabled: boolean) => void;

  // Interaction
  setLastInteractionSource: (source: InteractionSource) => void;
}

/* ── Helpers ── */
const AUDIO_CYCLE: Record<AudioState, AudioState> = {
  off: 'ambient',
  ambient: 'interactive',
  interactive: 'off',
};

const GLASS_CYCLE: Record<GlassMode, GlassMode> = {
  full: 'reduced',
  reduced: 'opaque',
  opaque: 'full',
};

function getInitialGlassMode(): GlassMode {
  if (typeof window === 'undefined') return 'full';

  // 1. localStorage
  const stored = localStorage.getItem('elevendots-glass-mode');
  if (stored === 'full' || stored === 'reduced' || stored === 'opaque') return stored;

  // 2. prefers-reduced-transparency
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return 'reduced';

  // 3. default
  return 'full';
}

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Store ── */
export const useAppStore = create<AppState & AppActions>()((set) => ({
  // State
  scenePhase: 'loading',
  frozen: false,
  qualityTier: 'high',
  capabilities: null,
  activeDestination: null,
  activePanel: null,
  audioState: 'off',
  glassMode: getInitialGlassMode(),
  reducedMotion: getInitialReducedMotion(),
  testMode: false,
  lastInteractionSource: 'mouse',

  // Actions
  setScenePhase: (phase) => set({ scenePhase: phase }),
  setFrozen: (frozen) => set({ frozen }),
  toggleFrozen: () => set((s) => ({ frozen: !s.frozen })),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setCapabilities: (caps) => set({ capabilities: caps }),

  setActiveDestination: (dest) => set({ activeDestination: dest }),
  setActivePanel: (panel) => set({ activePanel: panel }),

  setAudioState: (state) => set({ audioState: state }),
  cycleAudioState: () => set((s) => ({ audioState: AUDIO_CYCLE[s.audioState] })),

  setGlassMode: (mode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('elevendots-glass-mode', mode);
    }
    set({ glassMode: mode });
  },
  cycleGlassMode: () =>
    set((s) => {
      const next = GLASS_CYCLE[s.glassMode];
      if (typeof window !== 'undefined') {
        localStorage.setItem('elevendots-glass-mode', next);
      }
      return { glassMode: next };
    }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  setTestMode: (enabled) => set({ testMode: enabled }),
  setLastInteractionSource: (source) => set({ lastInteractionSource: source }),
}));
