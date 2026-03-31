# DEVLOG

## Session 7 — 2026-03-30

### Stage 2 — poster-first interaction system and destination modulation

**Poster-first world modulation**
- Kept the current homepage architecture intact:
  - [`src/app/page.tsx`](./src/app/page.tsx) still mounts `HomeShell`
  - `HomeShell` still orchestrates the homepage layers
  - no live 3D scene was restored to the default homepage path
- Reused the existing poster baseline instead of rebuilding composition:
  - expanded the poster into restrained state-driven layers for tonal wash, cavity glow, enclosure emphasis, and panel settling
  - destination focus now modulates the same environment through opacity, gradients, masking, and cavity/dot-field bias only
- Added distinct but non-literal environmental modes for:
  - idle
  - pulse focus
  - axiom focus
  - about focus
  - about panel open
  - reduced motion

**State discipline and shell choreography**
- Derived a single homepage destination/motion state in `HomeShell` from the existing Zustand store:
  - `activeDestination`
  - `activePanel`
  - `scenePhase`
  - `qualityTier`
  - `reducedMotion`
  - `frozen`
  - `testMode`
- Restored correct hash-driven state sync in `useHashRoute`:
  - `#pulse` and `#axiom` now focus the world reliably
  - `#about` keeps the about environment active while the panel is open
  - clearing the hash clears stale focused state
- Refined shell behavior without changing route or anchor semantics:
  - bottom nav now has restrained active/muted focus treatment
  - top-right controls sit in a calmer integrated shell surface
  - about panel transitions settle the environment instead of fighting it

**Verification**
- `npm run build` ✅ passes with static export.
- Added `tests/visual/stage2-shell.spec.ts` to capture:
  - idle
  - pulse focused
  - axiom focused
  - about focused
  - reduced-motion
- Generated desktop baselines for the Stage 2 state captures.

### Stage 2 corrective pass — stronger destination separation

**Corrective changes**
- Increased destination-visible modulation without changing composition or route/shell architecture:
  - stronger cavity scaling and glow bias for `pulse`
  - stronger enclosure/structural emphasis for `axiom`
  - quieter, more withdrawn field treatment for `about`
- Increased dormant-dot readability and field-density variation:
  - expanded poster-dot placement to all eight configured dormant dots
  - raised dot size/opacity slightly and added restrained micro-field support
- Pushed shell emphasis harder:
  - clearer active nav state and stronger muting of non-focused destinations
  - stronger top-right control and wordmark response per destination
  - calmer, deeper panel-open settling

**Verification**
- Re-ran `npm run build` ✅.
- Refreshed `tests/visual/stage2-shell.spec.ts` desktop baselines ✅.

### Stage 2 hardening follow-up — state semantics and tier correction

**State-system fixes**
- Separated `about focused` from `panel open` in the deterministic Stage 2 visual suite.
- Expanded shell settling so the settings/info panel also counts as a calm environmental panel-open state.
- Improved interaction parity:
  - hover and keyboard focus now use the same destination activation path
  - touch gets a short-lived destination preview without creating sticky mobile states
  - hover leave no longer clears a keyboard-focused destination prematurely

**Quality-tier correction**
- Fixed capability heuristics so desktop-class browsers without `navigator.deviceMemory` do not collapse into low quality by default.
- Added clearer `high` / `medium` / `low` degradation handling in poster and ambient overlay layers.

**Verification**
- `npm run build` ✅.
- Re-ran `tests/visual/stage2-shell.spec.ts` with distinct captures for:
  - idle
  - pulse focused
  - axiom focused
  - about focused
  - panel open
  - reduced motion

### Stage 2 art-direction pivot — abstract cinematic field

**Direction change**
- Kept the same homepage architecture and state system, but moved the default homepage art direction away from the observatory read.
- Reframed the poster/ambient world as a darker abstract pressure field with:
  - broader frame-scale energy bands
  - a less literal focal collapse event
  - spectral seam veils
  - stronger shell/world integration

**Poster and ambient changes**
- Expanded the poster stack with additional full-frame modulation layers:
  - `pressureBands`
  - `spectralVeil`
- Regraded the focal center to feel less like an instrument/aperture and more like a lensing/collapse event.
- Strengthened the ambient scene overlay with a new `shearField` and richer cavity/atmosphere balance.
- Preserved destination semantics:
  - `pulse` is sharper and more electrically live
  - `axiom` is colder, cleaner, and more structural
  - `about` is quieter and more inward

**Shell integration**
- Increased shell surface definition so the top bar and bottom nav feel authored into the same world rather than floating over a poster.
- Kept real anchor semantics, the same `HomeShell` orchestration, and the same poster-first fallback behavior.

**Amplitude correction**
- Increased the visibility of the new abstract field so it reads in frozen screenshots:
  - brighter frame-scale pressure bands
  - larger, more legible focal collapse
  - more present dormant-dot field
  - clearer Axiom structural state separation

**About sync follow-up**
- Brought the About-focused homepage state into the same art direction so it no longer collapses back to near-idle.
- Restyled the About panel and standalone `/about` page to use the same pressure-field and dark-card treatment as the homepage world.

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

## Session 3 — 2026-03-30

### Phase 1B/1C — Observatory Chamber Silhouette Reset (in progress)

- Reworked scene composition away from center-object read toward chamber enclosure:
  - removed floor/ocean from live scene composition
  - reduced center complexity and removed center-crossing decorative slash behavior
  - moved mass to periphery with top/side chamber framing geometry
  - strengthened near-field lower-frame occlusion for depth falloff
- Re-authored `ObservatoryField` for periphery-first chamber structure and smaller recessed aperture cavity.
- Suppressed pasted-pattern behavior in backdrop/atmosphere shaders.
- Added optional review exposure capture support via `?exposure=lift` in `SceneCanvas` renderer setup.
- Preserved shell architecture and route semantics (HomeShell orchestration, poster/scene/DOM stack, anchor behavior, standalone `/about`, shared Zustand model).
- Validation:
  - `npm run build` passes with static export routes.
  - Local dev server running on `127.0.0.1:6001` for review captures.

### Phase 1D — Poster Composition Lock Pass (complete)

- Preserved the poster-first shell contract:
  - `/src/app/page.tsx` still mounts `HomeShell`
  - `HomeShell` remains the orchestrator for poster + scene veil + UI
  - real anchor navigation and standalone `/about` behavior unchanged
  - Zustand store, destination config, reduced-motion support, and static-export architecture preserved
- Rebuilt the homepage poster as a controlled observatory title card instead of a generic atmospheric wallpaper:
  - replaced the broader center-glow language with a smaller recessed aperture treatment positioned slightly above center
  - removed decorative ring/crosshair traces from the poster composition
  - replaced wallpaper-like striping with restrained tonal grain and softer field density
  - tuned side and canopy masses into lower-contrast chamber enclosure shapes
  - reduced the dormant-dot field to a smaller, more deliberate measurement layout on the poster
  - strengthened the lower-frame depth falloff without introducing a floor or horizon line
- Added restrained material cues only where useful:
  - subtle liquid-glass/crystal micro-highlights concentrated at the aperture
  - `SceneCanvas` CSS veil retuned to support the poster instead of flattening it with a broad center glow
- Validation:
  - `npm run build` passes
  - production captures rendered from built `out/` export via local static server on `127.0.0.1:6002`

### Phase 1E — Poster Lock Refinement Pass (complete)

- Reduced remaining decorative/radial read in the poster layers and simplified the scene veil further so the homepage stays poster-first without reintroducing live 3D.
- Replaced mapped dot scattering with a smaller, hand-placed five-dot measurement field derived from the shared dormant-dot config.
- Tightened chamber composition with softer canopy and sidewall masses, then smoothed the remaining hard transition at the lower basin/sidewall handoff.
- Rebuilt the lower-depth field as a feathered basin so the frame continues downward instead of visibly terminating at a horizontal seam.
- Replaced bounded sidewall/basin overlays with full-frame anchored gradients to eliminate residual left-edge and lower-edge blend seams.
- Flattened the remaining left/right mid-field blobs by simplifying `farField`, reducing sidewall mass visibility, and collapsing the chamber-shadow layer into a softer single depression.
- Validation:
  - `npm run build` passes after refinement
  - updated production and lifted review captures regenerated from the built `out/` export

### Phase 2C — State Refinement and Nav Handoff (complete)

- Sharpened the poster-first focal event without changing the homepage architecture:
  - added an `edgeMute` layer to suppress the lingering upper-corner arc read
  - introduced a restrained internal `apertureSeam` so the central collapse reads as one authored event instead of a diffuse glow
  - tuned scene veil blur and structural emphasis per destination so Pulse/Axiom/About separate more cleanly in frozen frames
- Smoothed shell choreography at the navigation rail:
  - moved idle reset behavior from per-link boundaries to whole-nav exit/blur handling
  - added a short destination clear delay so pointer travel between tabs no longer flashes through idle
  - preserved hover, focus-visible, touch preview, real anchor semantics, and About modal interception rules
- Added direct standalone `/about` visual coverage:
  - new Playwright capture in `tests/visual/about-page.spec.ts`
- Validation:
  - `npm run build` passes
  - `npx playwright test tests/visual/stage2-shell.spec.ts tests/visual/about-page.spec.ts --project=desktop --config=.tmp-playwright-6001.config.ts --update-snapshots` passes against local dev server on `localhost:6001`

### Phase 2D — Collapse Silhouette and Coverage Expansion (complete)

- Tightened the homepage center into a more singular collapse event without changing the poster-first architecture:
  - added a recessed `aperturePocket` layer inside the existing focal field
  - parameterized the inner shell, lens, pocket, core, and accent insets so Pulse, Axiom, and About can change character through shape rather than only wash/opacity
  - kept the world coherent by reusing the same focal stack and only modulating its emphasis per destination
- Strengthened destination separation in the ambient veil:
  - pulse now carries a narrower, more energized signal cluster
  - axiom reads more exact through a tighter structural core
  - about opens into a softer, deeper center with reduced signal density
- Expanded visual coverage beyond desktop-high:
  - added desktop `medium` and `low` pulse baselines
  - added mobile homepage baselines for shared Stage 2 states plus mobile-specific pulse/about captures
  - added mobile `/about` coverage alongside the existing desktop capture
- Validation:
  - `next build` passes via direct Node invocation
  - Playwright visual suite passes on `desktop` and `mobile` against `localhost:6001`

### Phase 2E — Premium Shell Recovery and Overlay Restraint (in progress)

- Started a clean recovery pass from `origin/main` in separate branch `rishi/premium-ui-recovery` to avoid inheriting the unresolved local visual experiments from the main workspace.
- Re-authored the shell surfaces to reduce the generic glass/UI-kit feel:
  - replaced Unicode control glyphs in `ToggleControls.tsx` with inline SVG icons
  - tightened control-rail/button materials, shadows, and focus states
  - rebuilt the bottom nav as a three-track rail with a shared sliding active plate instead of per-link jump emphasis
  - slowed and softened shell transitions with dedicated shell easing variables
- Reduced the ambient overlay from primary image-maker to secondary modulation layer:
  - cut global `SceneCanvas` opacity and simplified signal/cavity/structural fields
  - shifted side-structure emphasis downward so it stops leaking obvious corner arcs
  - preserved destination identity while degrading by detail rather than by losing state meaning
- Reworked the poster focal stack toward subtraction instead of additive haze:
  - inserted `focalOcclusion` to carve a darker authored center
  - tightened `farField`, `pressureBands`, `tonePlane`, and `cavityGlow` so the frame does not collapse back into one broad oval wash
  - retuned Pulse/Axiom/About to separate more by focal hierarchy and enclosure feel than by color wash alone
- Validation:
  - `next build --webpack` passes from the clean worktree
  - local dev server is running on `http://127.0.0.1:6001` using webpack mode
  - `playwright test tests/visual/stage2-shell.spec.ts --project=desktop --config=.tmp-playwright-6001.config.ts --update-snapshots` passes
  - `playwright test tests/visual/about-page.spec.ts --project=desktop --config=.tmp-playwright-6001.config.ts --update-snapshots` passes

### Phase 2F — Route Transition Stability Fix (complete)

- Diagnosed the page-switch flash as a transition-system issue rather than a rendering issue:
  - the first route wrapper was fading the whole page down too aggressively
  - it was also mounted through a `Suspense` fallback because of `useSearchParams()`, which made the handoff visually unstable during navigation
- Rebuilt the internal route transition layer to be more conservative:
  - removed `useSearchParams()` so the provider only keys off pathname changes
  - removed the `Suspense` wrapper from the root layout
  - changed page transitions from heavy fade/blur to a much steadier opacity/transform settle with a restrained scrim
  - limited interception to real same-origin pathname transitions only, so hash changes and same-page interactions are left alone
- Validation:
  - `next build --webpack` passes after the route-transition fix
