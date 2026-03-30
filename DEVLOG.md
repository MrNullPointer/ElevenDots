# DEVLOG

## Session 2 — 2026-03-29

### Phase 1 Completion

**1.7 — /about static page**
- Rewrote /about as server-rendered page with CSS Modules (no inline styles)
- Uses shared `<AboutContent />` component, same tokens and typography
- Full-width layout with "elevendots" back link — works without JS

**1.8 — InfoPanel + static pages**
- Created InfoPanel: glass mode toggle (Full/Reduced/Opaque segmented control), reduced motion switch, audio state display, quality tier display
- Wired Info (ℹ) toggle into ToggleControls and TopBar
- Created /credits, /privacy, /accessibility as real server-rendered routes
- All share about.module.css for consistent static page styling

**1.9 — Hash deep-linking**
- Rewrote useHashRoute with full navigation behavior
- `modalOpenedViaNavRef` tracks whether modal opened via click or direct URL
- Close behavior: history.back() for click-opened, replaceState('/') for URL-opened
- Hash reading on mount: #about → panel, #pulse/#axiom → destination focus
- Dual listeners: both popstate AND hashchange for full coverage

**1.10 — Responsive layout**
- All components use CSS clamp() for fluid spacing/padding
- Navigation gap and bottom offset fluid (375px–3840px)
- AboutPanel and InfoPanel padding fluid
- Static pages use clamp-based padding
- No breakpoints — pure fluid scaling

**1.11 — Playwright visual regression**
- Installed Playwright with Chromium
- Created playwright.config.ts with platform-project snapshot paths
- poster-shell.spec.ts: 24 tests covering no-JS, default, reduced motion, opaque glass, mobile, about panel, 404
- All 24 tests pass, baselines captured in tests/visual/snapshots/

### Gate Check (passed)
- ✅ No-JS: wordmark visible, all links work, poster renders, static pages load
- ✅ JS enabled: About opens as modal, hash routing works, back button closes, Info panel toggles work
- ✅ Build: 6 routes statically exported (/, /about, /accessibility, /credits, /privacy, /_not-found)

### Phase 1.5 — Visual Bible Freeze (passed)

**visual-bible.spec.ts: 22 tests, all pass**
- 12 viewport idle screenshots (375, 390, 414, 768, 1024, 1280, 1440, 1680, 1920, 2560, 3440, 3840)
- 4 About panel screenshots at key viewports (375, 768, 1280, 1920)
- 3 glass mode screenshots (full, reduced, opaque) at 1280
- Composition checks:
  - ✅ Dark pixel ratio >75% (body bg luminance < 0.1)
  - ✅ Wordmark in upper-left safe zone (top < 80px, left < 120px)
  - ✅ Navigation in bottom center zone (centerX 0.3–0.7, bottom offset < 80px)

**No composition adjustments needed.** Poster shell is clean and balanced at all viewports.

---

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
