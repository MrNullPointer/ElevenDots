# elevendots.dev — Cryogenic Tide Architecture

## Project Overview
Ultra-premium personal website. Static export via Next.js App Router. Three.js WebGL scene with R3F. Zustand for state. CSS Modules + design tokens. No Tailwind.

## Execution Rules (V2–V5)

### Architecture (V2)
1. **Static export only** — `output: 'export'` and `images: { unoptimized: true }` in next.config.ts. Every page must be statically exportable. No `getServerSideProps`, no API routes, no server actions.
2. **R3F quartet pinned** — three, @react-three/fiber, @react-three/drei, @react-three/postprocessing must use exact (no ^ or ~) matching versions tested together. Never upgrade one without testing all four.
3. **Zustand single store** — One store in `src/lib/store.ts`. All shared state lives here. Components read via selectors; never pass store values as props through more than one level.
4. **CSS Modules for all component styles** — No inline styles except for dynamic values computed at runtime. Design tokens in `tokens.css`, consumed via `var()`.
5. **No Tailwind, no CSS-in-JS** — Pure CSS Modules + custom properties. This is a hard rule.
6. **src directory structure** — `src/components/scene/` for WebGL, `src/components/ui/` for DOM, `src/lib/` for logic/config/hooks, `src/styles/` for global CSS, `src/app/` for routes.

### Performance (V2)
7. **'use client' boundary** — Only add 'use client' to components that need it (hooks, browser APIs, event handlers). Keep it as low in the tree as possible.
8. **Dynamic imports for WebGL** — The entire Canvas/scene tree must be dynamically imported with `next/dynamic` and `ssr: false`. The poster fallback renders server-side.
9. **Prefers-reduced-motion** — All animations must respect `prefers-reduced-motion: reduce`. Store tracks `reducedMotion` boolean. CSS uses `@media (prefers-reduced-motion: reduce)`.
10. **Quality tiers** — Three tiers: 'high', 'medium', 'low'. Detected from device capabilities (GPU, memory, pixel ratio). Stored in Zustand. Scene components read tier and adjust complexity.
11. **Frame budget: 16ms** — Target 60fps. Use `useFrame` wisely. No allocations in render loops. Pre-allocate vectors/quaternions outside the loop.

### Visual Design (V3)
12. **Color palette** — Obsidian navy `#0a0e1a` (background), cryogenic blue `#1a3a5c` (mid), frost white `#e8f0ff` (text/glow), accent cyan `#4ecdc4`, warm accent `#ff6b6b`. All as CSS custom properties.
13. **Typography** — System font stack with clamp-based fluid sizing. Display: 'Inter' or system-ui. Minimum 16px body, maximum readable line length.
14. **Glass morphism** — Three modes: 'full' (backdrop-filter + transparency), 'reduced' (semi-opaque, no blur), 'opaque' (solid background). User toggle + prefers-reduced-transparency detection.
15. **Z-index layers** — poster: 0, scene: 10, ui-base: 100, navigation: 200, overlay: 300, modal: 400, toast: 500. Defined as tokens.
16. **Spacing scale** — 4px base unit. Tokens: --space-1 (4px) through --space-12 (48px). Use clamp for responsive spacing.

### Interaction (V3)
17. **Freeze mode** — Pauses all WebGL animation. Toggle button (⏸/▶). `frozen` boolean in store. `useFrame` callbacks check `frozen` before animating. CSS class on body for non-WebGL animations.
18. **Audio state machine** — Three states: 'off' → 'ambient' → 'interactive' → 'off'. Cycle with toggle button. Audio context created on first user gesture only.
19. **Hash routing for About** — About panel opens as `#about` overlay. `<a href="/about">` is always a real link. JS intercepts click → pushState('#about') → opens panel. Direct navigation to /about renders full page.
20. **Modifier key passthrough** — All link click handlers must check metaKey, ctrlKey, shiftKey, altKey, button !== 0. If any are true, let the browser handle it natively.

### Scene (V4)
21. **Dormant dots** — 8 constellation dots at fixed positions. Each has position [x,y,z], depth, and constellationIndex. They float gently when not frozen.
22. **Depth-of-field** — Scene uses DOF post-processing. Focus distance varies by active destination. Each destination config has a `dofFocusDistance` value.
23. **Scene phases** — 'loading' → 'entering' → 'idle' → 'navigating'. Stored in Zustand. Components transition based on phase.
24. **No allocations in useFrame** — Pre-allocate all Three.js objects (Vector3, Quaternion, Color, etc.) outside component scope or in refs. Never use `new` inside useFrame callback.

### Navigation (V4)
25. **Three destinations** — 'pulse' (blog/newsletter), 'axiom' (projects), 'about' (bio panel). Each has label, href, description, gridZone, dofFocusDistance.
26. **Diegetic nav** — Navigation is part of the scene aesthetic. Anchors are real `<a>` elements with actual hrefs. JS enhances with transitions but links work without JS.
27. **About is always an anchor** — `<a href="/about">` must never be replaced with a button or div. The click handler calls `openAboutModal()` from the hash routing hook. Never inline pushState logic in the click handler.
28. **Grid zones** — Each destination occupies a zone in the layout grid. Used for positioning both DOM elements and corresponding scene elements.

### Accessibility (V4)
29. **Keyboard navigation** — All interactive elements reachable via Tab. Focus styles visible. Escape closes modals/panels.
30. **ARIA labels** — Scene canvas gets `aria-label`. Toggle buttons get `aria-pressed`. Modal panel gets `role="dialog"`, `aria-modal="true"`, `aria-label`.
31. **Color contrast** — All text meets WCAG AA (4.5:1 for normal text, 3:1 for large). Frost white on obsidian navy passes. Test all glass modes.
32. **No seizure triggers** — No flashing >3 times/second. Reduced motion disables all particle effects and transitions.

### Testing & Quality (V5)
33. **Test mode** — `testMode: boolean` in store. When true, disables animations, sets deterministic state. Playwright tests set this before assertions.
34. **Visual regression** — Playwright tests capture screenshots in `tests/visual/snapshots/`. Compare against baselines. Run in CI.
35. **Build must pass** — `npm run build` must succeed with static export at every commit. Never commit if build fails.
36. **No console errors** — Zero console.error in production builds. Warnings reviewed and resolved or intentionally suppressed.
37. **Lighthouse targets** — Performance >90, Accessibility 100, Best Practices 100, SEO 100. Test on every deploy.
38. **Bundle size budget** — Monitor JS bundle size. Three.js is the big dependency — tree-shake aggressively. Total initial JS <250KB gzipped target.

## File Tree
```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── about/
│       └── page.tsx        # /about static page
├── components/
│   ├── scene/              # WebGL/R3F components
│   │   ├── CryogenicScene.tsx
│   │   ├── DormantDots.tsx
│   │   └── PostProcessing.tsx
│   └── ui/                 # DOM components
│       ├── HomeShell.tsx
│       ├── TopBar.tsx
│       ├── PosterFallback.tsx
│       ├── AboutPanel.tsx
│       ├── AboutContent.tsx
│       └── ToggleControls.tsx
├── lib/
│   ├── store.ts            # Zustand store
│   ├── config/
│   │   └── site.ts         # Destinations, content, dots
│   └── hooks/
│       ├── useHashRoute.ts
│       └── useCapabilities.ts
└── styles/
    ├── tokens.css           # Design tokens
    └── globals.css          # Global styles
tests/
└── visual/
    └── snapshots/           # Playwright visual baselines
```

## Session Tracking
Each session logs progress in DEVLOG.md at project root.
