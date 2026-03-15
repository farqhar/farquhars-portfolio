

# Add Sticky Glass Nav Bar + Floating CTA Button

## What We're Building
Two persistent elements that reinforce the core goal — driving visitors to the full portfolio:

1. **Sticky glass morphism nav bar** — appears after scrolling past the hero. Slim bar with "FARQUHAR MACDOUGALL" on the left, "See full portfolio →" button on the right. Glass morphism styling matching the site's card aesthetic. Fades in/out with Framer Motion based on scroll position.

2. **Floating CTA pill button** — fixed bottom-right, glass morphism with indigo gradient background, subtle pulse animation. Always visible after the hero section. Text: "See full portfolio →". Links to placeholder `#`.

## Technical Approach
- Create `StickyNav` component: uses `useScroll` / `useMotionValueEvent` from Framer Motion to detect when user scrolls past `100vh`. Renders a fixed top bar with `backdrop-blur(20px)`, `rgba(255,255,255,0.6)` background (switches to `rgba(10,10,26,0.6)` when over dark sections).
- Create `FloatingCTA` component: fixed `bottom-6 right-6`, glass morphism pill with indigo gradient, gentle CSS pulse keyframe on the border glow. Appears after hero with fade-in.
- Both components added to `Index.tsx` at the page level.
- On mobile: nav bar name text shrinks, floating button goes `bottom-4 right-4` and slightly smaller.

