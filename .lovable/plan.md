## Changes

### `src/components/about/ProcessJourney.tsx`

1. **Delay "Discover & Design" label** until after the line passes Stakeholders (threshold 0.2):
   - Change `labelDiscover` range from `[0.11, 0.16]` to `[0.21, 0.26]`.

2. **Reposition "Discover & Design" label** — align with the left of the SVG (under where the journey begins, matching the visual column of the "How I work" eyebrow above), and move lower:
   - In its overlay div, change `left: ${xPct(280)}%` → `left: ${xPct(80)}%`.
   - Change `top: ${yPct(40)}%` → `top: ${yPct(110)}%`.
   - Update the transform to `translate(0, -50%)` (left-aligned instead of centered) so it lines up flush left with the path origin.

3. **Lower the "Rapid Iteration" label**:
   - Change its `top: ${yPct(40)}%` → `top: ${yPct(150)}%` (sits closer to the top of the loop ring rather than floating high above).

### `src/pages/About.tsx`

4. **Tighten gap between How I Work pinned section and testimonials**:
   - The `ProcessJourney` wrapper currently uses `-mt-8 mb-0`. Add an aggressive negative margin to the testimonials block to pull it up — change the container `<div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">` that follows ProcessJourney to add `-mt-24 sm:-mt-32`.
   - Alternatively (and cleaner), reduce ProcessJourney wrapper to `style={{ height: "320vh" }}` inside ProcessJourney.tsx so the pinned scroll releases sooner, and apply `-mt-16` to the testimonials wrapper.

   Final approach: set ProcessJourney height to `320vh` and apply `-mt-20` to the testimonials container.

## Files

- `src/components/about/ProcessJourney.tsx`
- `src/pages/About.tsx`
