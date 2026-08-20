# Butterfly Portfolio — Visual Transformation Foundation

## Problem

The metamorphosis system (caterpillar → cocoon → butterfly) currently works as isolated decorative SVGs placed next to each section. There is no continuous environmental evolution as the user scrolls, no visual thread connecting sections, and the butterfly in the Hero feels like a separate element from the metamorphosis journey in the content sections.

## Goal

Make the portfolio feel like one continuous transformation journey by building:
1. A scroll-linked environmental evolution system
2. A subtle visual thread connecting all sections
3. More premium SVG stages with organic depth
4. Clear 3D-ready placeholder slots

## Architecture

### New Files

| File | Purpose |
|---|---|
| `src/context/ScrollJourney.jsx` | React context tracking scroll progress (0-1) and current metamorphosis stage, updating CSS custom properties on `:root` |
| `src/components/JourneyThread/JourneyThread.jsx` + `.css` | Decorative vertical vine/thread visible on the left side of all sections, evolving from stem→leaf→wing as user scrolls |
| `src/components/SectionConnector/SectionConnector.jsx` + `.css` | Small organic decorative elements between sections (leaf veins, silk threads, wing tips) |
| `src/components/ThreeDPlaceholder/ThreeDPlaceholder.jsx` + `.css` | Invisible wrapper divs with `data-3d-slot` attributes marking future Blender/GLB integration points |

### Modified Files

| File | Change |
|---|---|
| `src/App.jsx` | Wrap in `<ScrollJourney>` provider |
| `src/index.css` | Add CSS custom properties for journey progression (`--journey-progress`, `--env-bg-tint`, `--env-glow-intensity`, etc.) |
| `src/components/Metamorphosis/Metamorphosis.jsx` | Add `data-3d-slot` attributes to key stages, refine SVG details |
| `src/components/Metamorphosis/Metamorphosis.css` | Add styles for 3D placeholder slots |
| `src/components/Background/Background.jsx` + `.css` | Respond to journey CSS variables for dynamic orb colors/positions |
| `src/components/About/About.css` | Add leaf-texture overlay responding to `--journey-progress` |
| `src/components/Experience/Experience.css` | Add golden warmth overlay |
| `src/components/Skills/Skills.css` | Add cocoon enclosure atmosphere |
| `src/components/Projects/Projects.css` | Add emerging light atmosphere |
| `src/components/Contact/Contact.css` | Add butterfly-flight expansive glow |

---

## Implementation Details

### 1. ScrollJourney Context (`src/context/ScrollJourney.jsx`)

Tracks `scrollYProgress` via Framer Motion's `useScroll()` and computes:
- `progress`: 0-1 float through the entire page
- `stage`: which metamorphosis stage the viewport center is in
- CSS custom properties set on `document.documentElement`:
  - `--journey-progress`: 0-1
  - `--journey-stage`: "seed" | "caterpillar" | "cocoon" | "emerging" | "butterfly"
  - `--env-leaf-opacity`: 1→0 (strong in About, fades by Skills)
  - `--env-branch-opacity`: 0.8→0 (strong in About/Experience, fades by Projects)
  - `--env-cocoon-opacity`: 0→1→0 (peaks in Skills)
  - `--env-wing-opacity`: 0→0.5→1 (emerges in Projects, full in Contact)
  - `--env-warmth`: controls overall color temperature shift

### 2. JourneyThread Component

A fixed-position vertical line on the left side (desktop) that:
- Runs from Hero to Footer
- Early sections: thin sage-colored stem with tiny leaf buds at intervals
- Middle sections: stem with small organic nodes
- Late sections: stem transitions to wing-vein pattern with small wing-shaped markers
- Subtle opacity: 0.15-0.3 (barely visible, felt more than seen)
- Hidden on mobile (<900px)

### 3. Section Connectors

Small decorative elements placed between sections:
- Hero→About: A tiny leaf fragment falling (CSS animated, very subtle)
- About→Experience: A small branch/node mark
- Experience→Skills: Silk thread strands
- Skills→Projects: A crack/light emerging motif
- Projects→Contact: Small wing-tip silhouette

Each connector is ~20-40px tall, centered, and at very low opacity (0.15-0.25).

### 4. Environmental Evolution (CSS)

Each section's `::before` and `::after` pseudo-elements are enhanced to respond to journey CSS variables:

**Hero (seed):**
- Current aurora/grids stay
- Add: subtle leaf-vein texture at very low opacity
- Add: `data-3d-slot` marker around the hero butterfly

**About (caterpillar):**
- Warm earthy atmosphere: brown-green radial gradients
- Leaf vein pattern texture overlay
- Glow: sage-tinted

**Experience (growing):**
- Golden warmth increases
- Branch-like organic texture appears
- Glow shifts toward gold

**Skills (cocoon):**
- Environment darkens slightly (more enclosed feeling)
- Cocoon-shaped radial glow in center
- Branch texture fades, replaced by silk-thread texture
- Grid pattern becomes more organic (curved lines instead of straight)

**Projects (emerging):**
- Light begins expanding from center
- Wing-shaped light patterns at edges
- First hint of full wing gradient in backgrounds

**Contact (butterfly):**
- Most expansive, luminous atmosphere
- Full wing-gradient glow
- Sparkle/particle density increases
- The butterfly SVG feels like the culmination

### 5. 3D Placeholder Slots

Invisible wrapper divs with:
```html
<div class="three-d-slot" data-3d-slot="hero-butterfly" data-3d-asset="" aria-hidden="true">
  <!-- Future: <Canvas><Suspense><Model /></Suspense></Canvas> -->
</div>
```

Placed at:
- Hero butterfly area (replacing or wrapping current SVG butterfly)
- Skills cocoon area (wrapping current CocoonStage SVG)
- Contact butterfly area (wrapping current ButterflyStage SVG)

### 6. Metamorphosis SVG Refinements

Small, targeted improvements to existing SVGs (no rewrites):

**CaterpillarStage:**
- Add a second, smaller leaf behind the main one (depth)
- Subtle leaf-shadow beneath the caterpillar
- Make the branch slightly thicker with a highlight stroke

**CocoonStage:**
- Add 2-3 tiny silk threads extending beyond the main thread
- Make the inner pulse more prominent (wider glow)
- Add a faint wing-shape hint inside the cocoon (very subtle, 0.05 opacity)

**EmergingStage:**
- More light particles (5 instead of 3)
- Add a faint golden glow around the emerging butterfly
- Make the crack more pronounced

**ButterflyStage:**
- Add 2-3 additional sparkle particles
- Make the wing gradients slightly more vibrant
- Add a subtle trail/path behind the butterfly

---

## File Change Order

1. `src/index.css` — Add journey CSS custom properties
2. `src/context/ScrollJourney.jsx` — New: scroll tracking context
3. `src/App.jsx` — Wrap in ScrollJourney provider
4. `src/components/JourneyThread/JourneyThread.jsx` + `.css` — New: visual thread
5. `src/components/SectionConnector/SectionConnector.jsx` + `.css` — New: section transitions
6. `src/components/ThreeDPlaceholder/ThreeDPlaceholder.jsx` + `.css` — New: 3D slots
7. `src/components/Background/Background.jsx` + `.css` — Respond to journey variables
8. `src/components/About/About.css` — Environmental enhancement
9. `src/components/Experience/Experience.css` — Environmental enhancement
10. `src/components/Skills/Skills.css` — Environmental enhancement
11. `src/components/Projects/Projects.css` — Environmental enhancement
12. `src/components/Contact/Contact.css` — Environmental enhancement
13. `src/components/Metamorphosis/Metamorphosis.jsx` — Add 3D slots, refine SVGs
14. `src/components/Metamorphosis/Metamorphosis.css` — 3D slot styles
15. `src/pages/Home/Home.jsx` — Add SectionConnectors between sections

---

## Constraints

- All existing content stays unchanged
- All existing functionality (theme toggle, navigation, hover effects, mobile menu) stays working
- No new npm dependencies (Framer Motion already has `useScroll`)
- No cartoon-like elements
- No generic gradients or 3D effects
- Typography unchanged
- Reduced motion support maintained
- Mobile responsive (JourneyThread and Connectors hidden on small screens)
