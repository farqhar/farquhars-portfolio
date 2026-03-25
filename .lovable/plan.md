
# Refine timeline spacing and make the full timeline reachable on mobile/tablet

## What’s actually causing the issues

1. **Subtitle overlap on desktop and mobile**
   - The “above” card area is hardcoded to `220px`, but the actual cards are taller than that, especially on narrower screens.
   - Because those cards are bottom-aligned inside a too-short wrapper, they overflow upward and visually collide with the subtitle.

2. **Mobile/tablet can’t reach 2026+**
   - The horizontal movement is currently driven by a fixed percentage transform (`"2%"` → `"-78%"`) and a fixed section height (`400vh`).
   - That works only for some viewport sizes. On mobile/tablet, the track is effectively longer relative to the screen, so the section ends before the final card fully comes into view.

## Plan

### 1. Give the top cards enough reserved vertical space
In `src/components/TimelineCarousel.tsx` I’ll replace the single fixed `220px` top/bottom card zones with larger responsive heights so the cards no longer intrude into the subtitle area.

Planned approach:
- Use bigger reserved heights on small screens
- Keep the alternating layout
- Update the horizontal line position so it still passes through the dot centers

This fixes both:
- the subtitle overlapping the first/last visible card
- the line/dot alignment staying mathematically correct

### 2. Increase spacing under the subtitle
I’ll increase the subtitle’s bottom margin again, but this time together with the larger card-zone heights so the spacing actually holds visually.

Result:
- more breathing room under “A few moments that shaped how I think”
- no text sitting on top of preview images on desktop, tablet, or mobile

### 3. Replace the fixed percentage scroll translation with measured translation
Instead of hardcoding `x` to `"-78%"`, I’ll make the timeline travel based on the **actual rendered width** of the card track versus the visible viewport width.

Implementation approach:
- add refs for the visible timeline viewport and the moving track
- measure how many pixels the track must travel to fully reveal the last card
- map vertical scroll progress to that measured pixel distance

This makes the scroll behavior consistent across desktop, tablet, and mobile.

### 4. Increase the scroll section length responsively
Even with measured translation, smaller screens still need more vertical scroll distance to comfortably travel the full timeline.

I’ll make the wrapper height responsive so:
- desktop keeps a shorter section
- tablet gets more scroll room
- mobile gets the most scroll room

Goal:
- you can scroll all the way through to **2026+**
- only after that does the next section begin

### 5. Keep the 2026+ image framing unchanged
Per your instruction, I will **not** change the `2026+` preview image focal point.

## Files to update

### `src/components/TimelineCarousel.tsx`
Main fixes:
- enlarge responsive top/bottom card zones
- adjust line position to match new zone math
- increase subtitle bottom spacing
- switch from fixed percentage `x` translation to measured pixel translation
- make section height responsive to viewport size

## Expected outcome

After this pass:
- the subtitle will no longer overlap the timeline preview cards
- mobile will scroll through the full timeline to **2026+**
- tablet will also reach **2026+**
- desktop spacing will feel cleaner and less cramped
- the timeline line will remain aligned with the circle centers after the layout math is updated
