

# Full Upgrade — All Four Sections

## 1. Hero — Cinematic Intro Sequence

Rewrite as a multi-phase animation using `AnimatePresence` and state-driven phases:

- **Phase 1** (0s): "My name is Farquhar." fades in, centered, large white text. Holds for 2s.
- **Phase 2** (2s): That text fades out. "It's pronounced like Parker, with an F." fades in — smaller, muted color, slightly playful. Holds for 2.5s.
- **Phase 3** (4.5s): Fades out. Then the final sequence animates in and stays:
  - "Some people make things look good." slides up
  - "I make things make sense." fades in below in indigo gradient
  - Scroll indicator appears

Fix the "g" clipping: add `pb-2` and `overflow-visible` on the gradient text line.

Add floating animated gradient orbs (slow Framer Motion drift, infinite loop, 20s+ duration) instead of static positioned divs.

Use `useState` for a `phase` variable (0, 1, 2) with `useEffect` timers to drive the sequence. Each phase uses `AnimatePresence` for smooth crossfade.

## 2. Timeline — Auto-Scrolling Horizontal Marquee

Replace the click-to-navigate carousel with a continuous horizontal scroll:

- Render all 5 cards in a horizontal flex row inside an overflow container
- Use `requestAnimationFrame` loop to auto-scroll at ~0.5px/frame, wrapping seamlessly (duplicate cards array for infinite loop illusion)
- Show ~1.5 cards visible at once on desktop, ~1 on mobile
- **Hover on container**: pause auto-scroll
- **Hover on card**: scale up slightly, deepen shadow, highlight border
- **Click on card**: open a modal/overlay with full card details

Add depth to cards:
- Layered box-shadow: `0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(99,102,241,0.08)`
- Soft indigo gradient glow pseudo-element underneath each card
- A thin progress indicator dot that tracks scroll position below the cards

## 3. Project Cards — 3D Flip

Replace hover-reveal with click-triggered 3D flip using CSS `perspective` + `rotateY(180deg)` + `backface-visibility: hidden`:

- **Front**: current layout (placeholder image, category tag, title, teaser)
- **Back**: reveal question as italic heading, 2x2 image placeholder grid, "View full project" button, corner brackets
- Hover: subtle lift + glow hint. Click: full 180-degree flip with 0.6s transition.
- Add layered shadows matching timeline cards for depth.

## 4. CTA — Cinematic

- Animate gradient orbs in slow circular orbital paths (CSS keyframes, 30s, infinite)
- Text entrance: clip-path or overflow-hidden "curtain rise" — each line translates from below
- Add 6-8 floating particle dots (tiny, low opacity, random drift CSS animations with varying durations)
- Pulsing glow on the primary "See full portfolio" button using existing `pulse-glow` keyframe

## Files to modify
- `src/components/HeroSection.tsx` — full rewrite for phased intro
- `src/components/TimelineCarousel.tsx` — full rewrite to horizontal auto-scroll marquee
- `src/components/ProjectCells.tsx` — add 3D flip card logic
- `src/components/CTASection.tsx` — orbital orbs, curtain text, particles, button glow
- `src/index.css` — new keyframes for orbital motion, particle drift

