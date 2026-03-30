# DEVLOG

## Session 1 — 2026-03-29

### Phase 0 — Bootstrap (complete)
- Created Next.js 16.2.1 project with TypeScript, App Router, src dir
- Configured static export (`output: 'export'`, `images: { unoptimized: true }`)
- Installed R3F quartet (three 0.172.0, fiber 9.1.2, drei 10.0.4, postprocessing 3.0.4) — pinned exact
- Installed zustand 5.0.5, dev tooling (eslint, prettier, playwright)
- Created AGENTS.md with all 38 execution rules (V2–V5)
- Scaffolded full directory tree (scene/, ui/, lib/config/, lib/hooks/, styles/, about/, tests/)
- Created tokens.css: colors, typography (clamp-based), spacing, timing (with reduced-motion overrides), glass properties, z-index layers
- Created globals.css: reset, glass-mode utility classes, frozen body class, focus/selection styles
- Created Zustand store (store.ts): full v5 shape with all types, state, and actions; glassMode from localStorage → matchMedia → default; reducedMotion from matchMedia
- Created site.ts: DESTINATIONS config, ABOUT content constant, DORMANT_DOTS array (8 dots)
- Created root layout with metadata + viewport + themeColor
- Gate check: `npm run build` ✓ static export to /out

### Phase 1 — Poster Shell (complete)
- PosterFallback: full-viewport CSS-only atmospheric background with radial gradients + vignette
- TopBar: fixed header with wordmark + toggle controls area
- ToggleControls: Freeze (⏸/▶) + Audio (🔇/🔊) buttons, wired to Zustand store
- Navigation: 3 destination anchors (Pulse, Axiom, About) — real `<a>` elements with hrefs
- About anchor: click intercepted via `openAboutModal()` from useHashRoute; modifier keys pass through
- useHashRoute hook: syncs #about hash ↔ store, provides openAboutModal/closeAboutModal
- AboutPanel: glass-overlay modal with Escape close, backdrop click, focus management, ARIA
- AboutContent: shared component used by both modal panel and /about static page
- HomeShell: orchestrator component composing PosterFallback + TopBar + Navigation + AboutPanel
- Home page: dynamically imports HomeShell with `ssr: false`
- /about page: static page using shared AboutContent
- Final build: ✓ all 3 routes statically exported
