# DEVLOG

## Session 6 — 2026-03-29

### Phase 3 strategic pivot — unified observatory world (non-literal destinations)

**Concept pivot**
- Removed homepage direction that literalized destinations as three hero props.
- Reframed the scene as a single observatory field with one central instrumental phenomenon.
- Kept destination anchors (`pulse`, `axiom`, `about`) as navigation-only semantics in the DOM shell.

**Scene architecture changes**
- `CryogenicScene` no longer mounts `PulseBeacon`, `AboutCore`, `AxiomMonolith` as separate visible props.
- Added `world/ObservatoryField.tsx`:
  - central aperture/signal chamber with layered rings, membrane shader, and restrained local practical light
  - premium dark-glass/mineral material stack with non-decorative instrumental arcs
  - destination mode blending based on `activeDestination` (no literal object mapping)
- `activeDestination` now drives whole-world mode shifts:
  - `pulse`: subtle cyan signal bias
  - `axiom`: subtle structural/violet intelligence bias
  - `about`: subtle intimate/mineral core bias

**Environment rework**
- Regraded `CryogenicOcean` away from showroom floor behavior:
  - lower reflection energy, stronger black-blue absorption, slower broad motion
  - destination-aware tint response kept extremely restrained
- Reworked `BackgroundDome` and `HorizonAtmosphere`:
  - deeper upper-atmosphere depth with softer transitions
  - no hard split-band horizon treatment
  - sparse stars kept secondary
- Reduced decorative clutter in `DormantDots` and `ParticleField`:
  - lower counts/opacity
  - latent coordinate-field behavior instead of decorative accents

**Lighting and framing**
- Rebuilt `LightRig` around controlled local hierarchy instead of broad stage wash:
  - reduced global wash
  - centered key/rim logic
  - destination-aware local light personality without busy effects
- Updated camera framing and exposure to support a single central focal zone while keeping shell readability.

**Verification**
- `npm run build` ✅ passes.
- `npx playwright test tests/visual/poster-shell.spec.ts --project=desktop` executed:
  - 8 passed / 4 snapshot diffs (expected after major visual pivot and nav label/content changes).

### Phase 3 — Look-Dev: Composition + Light Identity (refinement pass)

**Composition and framing**
- Tightened hero triad spacing to feel more authored as one family:
  - pulse `[-2.46, 0.15, -3.02]`
  - about `[0.0, 0.02, -2.42]`
  - axiom `[2.62, 0.12, -3.34]`
- Kept camera framing model and shell layering unchanged.

**Ocean + atmosphere look-dev**
- Reworked ocean shading toward black-glass sea:
  - reduced floor-like reflection energy (lower env intensity, stronger metallic-dark response)
  - slower/weightier swells and distance absorption for abyssal falloff
  - controlled fresnel tint and cold emissive depth
- Refined background dome and horizon atmosphere:
  - deeper zenith crush with softer side falloff
  - adjusted haze blend to avoid hard split-band horizon
  - fog/haze tuned for depth continuity

**Structure identity refinement**
- `PulseBeacon`
  - faceted-lathe silhouette (reduced procedural smoothness)
  - refined taper/core proportions
  - restrained halo geometry and stronger apex readability
- `AboutCore`
  - shifted from orb-read toward faceted mineral shell (`dodecahedron` outer + `octahedron` inner)
  - stronger shell/core separation and internal luminous nucleus
- `AxiomMonolith`
  - increased archival edge articulation and seam readability
  - richer layered paneling and controlled violet intelligence accents
  - stronger local edge/back practical lighting for silhouette separation

**Midtone visibility rebalance**
- After initial dark-grade pass, lifted scene exposure and lighting hierarchy to recover object readability without returning to showroom floor behavior.

**PostFX**
- Postprocessing remains intentionally disabled in this session for stability (no reintroduction yet).

**Verification**
- `npm run build` ✅ passes after look-dev refinements.

### Phase 3 follow-up — visibility correction after review

- User review flagged underexposed/cartoony output.
- Applied visibility rebalance:
  - raised ACES exposure and midtone fill
  - increased key/rim/environment contributions for structure readability
  - lifted horizon haze/fog slightly while preserving dark mood
  - reworked About/Pulse/Axiom materials to reduce flat primitive read
- Kept ocean in dark cryogenic range while reducing neutral stage reflection behavior.
- Re-verified with `npm run build` ✅.

### Phase 3 follow-up 2 — aggressive readability correction

- Raised ACES exposure and boosted structure-focused lighting (not a global white wash).
- Increased local practical intensity for Pulse/About/Axiom so forms read clearly at idle.
- Reduced ocean floor-like reflectivity while adding controlled depth-lift to prevent dead-black horizon strip.
- Refined About form language away from generic smooth orb toward faceted mineral silhouette.
- Improved Axiom seam/edge readability and violet intelligence response.
- Re-verified with `npm run build` ✅.

### Phase 3 follow-up 3 — floor/void/orb corrective pass

- Removed stage-like side wash by cutting extra lateral fill lights in `LightRig`.
- Rebalanced lighting back to controlled key/rim + local practical identity.
- Ocean shader/material adjusted for stronger black-blue absorption and lower showroom reflection energy.
- Upper atmosphere regraded:
  - deeper but not dead top
  - softer horizon transition
  - sparse micro-star support for scale
- About core shifted to stronger faceted mineral read (reduced generic orb behavior).
- Pulse beacon reshaped away from lamp silhouette via slimmer faceted spire language.
- Axiom gained explicit edge articulation via silhouette edges and richer seam readability.
- Re-verified with `npm run build` ✅.

### Phase 3 follow-up 4 — tonal separation + material identity refinement

- Increased local tonal separation while keeping world-dark grading:
  - reduced broad/global wash
  - strengthened structure-local readability (without global brighten)
- Ocean regraded further toward cryogenic black-glass sea:
  - lower showroom reflection energy
  - stronger abyssal absorption
  - controlled cold highlight behavior
- Atmosphere refined to avoid dead upper void and hard horizon split:
  - deeper dome gradient layering
  - softer, wider fog/haze transition band
  - sparse micro-star depth support
- AboutCore refined toward authored mineral read:
  - stronger shell/core stratification
  - crystalline/transmission layering tuned for internal precision
- PulseBeacon refined away from lamp/procedural prop read:
  - slimmer faceted spire profile
  - improved taper/apex logic
  - subtle structural fins for engineered signal silhouette
- AxiomMonolith articulation increased:
  - richer seams and edge logic
  - improved archival surface intelligence while staying severe/quiet
- `npm run build` ✅ still passes.

## Session 5 — 2026-03-29

### Phase 2 — Step 3 Hard Correction (anti-cartoon + flicker stabilization)

**Stability fixes**
- Removed unstable runtime quality-flip behavior in `SceneCanvas` (no reactive tier downgrades during render loop).
- Lowered scene exposure and stabilized first-paint phase transitions.
- Temporarily disabled postprocessing composer pass in `PostProcessing.tsx` to eliminate renderer instability/flicker while locking base look quality.

**World/look re-authoring**
- Rebuilt the ocean material/shader pass:
  - darker base/emissive palette
  - slower, broader displacement waves
  - fresnel-driven cold edge response
  - larger surface footprint and y-position retune for abyssal read
- Reworked sky/atmosphere:
  - deeper background dome gradient with reduced hard horizon split
  - adjusted fog envelope and horizon haze falloff for edge masking
- Rebuilt global light hierarchy:
  - stronger cool key, real rim separation, restrained ambient fill, warm underfill
  - reintroduced low-intensity environment contribution for controlled reflections

**Structure quality pass**
- `PulseBeacon`:
  - moved from cone-stick language to lathed cryogenic spire profile
  - glass shell + internal emissive core + refined apex lens + restrained halo system
- `AboutCore`:
  - upgraded to layered mineral shell with transmission/thickness
  - reduced muddy read, refined nucleus + restrained filament + soft halo ring
- `AxiomMonolith`:
  - denser body stack and front/back panel layering
  - subdued intelligence seams + non-card side halo/back separation

**Noise/clutter reduction**
- Reduced particle prominence (count/size/opacity tuning by tier).
- Reduced dormant-dot brightness and breathing amplitude.

**Verification**
- `npm run build` ✅ passes.
- `npx playwright test tests/visual/poster-shell.spec.ts --project=desktop` runs; 8 passed / 4 snapshot diffs (expected after substantial visual changes).

## Session 4 — 2026-03-29

### Phase 2 — Step 3 Correction Pass (Cryogenic Tide base scene + guards)

**Scene quality correction**
- Reworked scene art direction away from bright studio-floor look:
  - reduced exposure and bloom, deepened sky/ocean palette, lowered particle brightness
  - removed visible square/rectangle halo artifacts by replacing sprite/card-like halos with ring-based geometry
  - replaced hard horizon split treatment with non-rectangular atmospheric layers + fog for edge masking
- Re-authored hero structures for less placeholder geometry:
  - `PulseBeacon`: tapered beacon body + internal core + dual ring halos + practical apex light
  - `AboutCore`: faceted layered shell, nucleus, restrained filament, ring halo, internal practical light
  - `AxiomMonolith`: denser beveled body with sparse edge intelligence seams and non-card back-glow ring

**Performance and capability guards (Step 3 requirement)**
- Extended store capability shape to include:
  - `hoverCapable`
  - `touchOnly`
  - `backdropFilter`
- Updated `useCapabilities`:
  - conservative detection for hover/touch/backdrop-filter and renderer class
  - initial tier policy is now conservative (`low`/`medium` only)
  - no immediate promotion to `high`; high is runtime-promoted only
- Updated scene mounting policy in `SceneCanvas`:
  - scene requires WebGL2 (`!webgl2 => no scene mount`)
  - poster remains as fallback when scene is unavailable
- Added runtime performance controls in canvas:
  - `AdaptiveDpr`
  - `PerformanceMonitor` with incline/decline callbacks driving tier up/down
- Updated default store `qualityTier` from `high` -> `medium` to prevent aggressive startup quality.

**Composition + camera baseline alignment**
- Camera baseline aligned to plan:
  - position `[0, 1.85, 6.0]`, target `[0, 0.18, -3.0]`, `fov 44`
- Destination structure anchors aligned closer to required coordinates:
  - pulse `[-2.5, 0.16, -3.0]`
  - about `[0.0, 0.0, -2.35]`
  - axiom `[2.7, 0.12, -3.4]`

**Determinism and control compatibility**
- Frozen / reduced-motion / test-mode pauses are preserved across:
  - camera drift
  - ocean time uniform
  - particle and dormant-dot motion
  - object animation pulsing
- Test mode continues to pin deterministic quality behavior.

**Verification**
- `npm run build` ✅ passes after corrective patch set.

### Step 3 visual correction (follow-up)
- Performed a deeper art-direction pass after qualitative review:
  - reduced stylized/cartoon read by simplifying emissive accents and removing decorative outline language
  - replaced previous atmosphere geometry stack with shader-based horizon haze (no readable helper cards/planes)
  - retuned ocean reflectance and roughness to avoid bright showroom floor behavior
  - tightened postFX (less bloom/noise) to keep emissives restrained
  - rebuilt all three hero structures again with lower-saturation material hierarchy
- Performance/guard layer remains active:
  - WebGL2-only mount
  - conservative initial quality tiering
  - `AdaptiveDpr` + `PerformanceMonitor` runtime scaling
- Re-verified with `npm run build` ✅.

## Session 3 — 2026-03-29

### Phase 2 — Cryogenic Tide Scene Integration (first production pass)

**Scene architecture + shell integration**
- Created full `src/components/scene/` structure:
  - `SceneCanvas.tsx`, `SceneCanvas.module.css`, `CryogenicScene.tsx`, `PostProcessing.tsx`
  - `world/BackgroundDome.tsx`, `world/HorizonAtmosphere.tsx`, `world/CryogenicOcean.tsx`, `world/ParticleField.tsx`, `world/DormantDots.tsx`
  - `structures/PulseBeacon.tsx`, `structures/AboutCore.tsx`, `structures/AxiomMonolith.tsx`
  - `lights/LightRig.tsx`
  - `hooks/useCapabilities.ts`
- Inserted `SceneCanvas` into `HomeShell` beneath `PosterFallback` and behind DOM shell.
- Kept navigation and panel architecture intact (`TopBar`, `Navigation`, `AboutPanel`, `InfoPanel` unchanged structurally).
- Kept About as real anchor with `openAboutModal()` behavior.

**Poster/scene phase behavior**
- `PosterFallback` now reads Zustand `scenePhase` and fades out when scene reaches `idle`.
- `SceneCanvas` drives scene phase progression:
  - boot/start -> `entering`
  - ready -> `idle`
- Scene and poster are both layered with tokenized z-indexes (`poster` 0, `scene` 10, UI above).

**Visual direction + composition**
- Camera set to cinematic first-pass framing:
  - position `[0, 1.9, 6.1]`, target `[0, 0.18, -3.0]`, `fov: 44`
  - slow drift only; drift disabled in frozen/reduced-motion/test mode.
- Implemented cryogenic world foundations:
  - large displaced ocean plane (220x220) with slow macro swells and no hard visible horizon edge
  - gradient background dome + layered horizon atmosphere + fog
  - sparse cold particle field and subdued dormant dots from `DORMANT_DOTS`
- Replaced placeholder structures with authored trio:
  - `PulseBeacon`: crystalline taper, inner emissive core, apex practical light + halo
  - `AboutCore`: mineral shell, luminous center, restrained warm filament detail + inner light
  - `AxiomMonolith`: beveled dark slab, sparse violet intelligence seams + rear/edge glow
- Added lighting hierarchy:
  - cool key + rim/back separation
  - minimal ambient fill
  - subtle warm underfill
  - low-intensity environment reflections (city/apartment preset based on tier)
- Added restrained postprocessing:
  - bloom (thresholded), vignette, subtle grain
  - ACES tone mapping configured in canvas renderer

**State + interaction**
- Reused existing store (`src/lib/store.ts`) with no second store.
- Added conservative capability detection hook (`scene/hooks/useCapabilities.ts`) to drive:
  - `capabilities`
  - `qualityTier` (`high` / `medium` / `low`)
- Respected `frozen`, `reducedMotion`, and `testMode` gates throughout scene motion.
- Navigation now sets `activeDestination` on hover/focus (anchor semantics preserved) for subtle object emphasis.
- `HomeShell` now syncs body-level frozen class with store (`body.frozen`).

**Routing/rendering adjustment**
- `src/app/page.tsx` now mounts `HomeShell` directly (removed page-level dynamic no-SSR wrapper).
- WebGL tree remains dynamically imported at `HomeShell -> SceneCanvas` boundary with `ssr: false`.

**Verification**
- `npm run build` ✅ passes with static export routes generated.
- Playwright visual suite executed (`poster-shell.spec.ts`, desktop project):
  - 8 passed, 4 failed due expected snapshot diffs after major visual redesign
  - fixed one real test issue: non-unique `text=elevendots` locator now targets top-bar wordmark specifically.

**Local hosting note**
- `next dev --port 6000` is blocked by Next.js reserved-port rule (6000/X11).
- Hosted built static export via Python HTTP server on `127.0.0.1:6000` instead.

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
