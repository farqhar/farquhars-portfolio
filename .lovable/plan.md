## Goal
Keep the existing two-column modal layout, but in the **right column** stack a **hero image on top** and the **auto-scrolling supporting carousel directly underneath it**. The carousel should visually extend (animate) across to flow under the text/left column too — i.e. it's wider than the right column, breaking out beneath the left text.

## Current layout (`src/components/ProjectDeck.tsx`, ~lines 502–627)
```text
┌─────────────────────┬──────────────────────┐
│ Title, tagline,     │  Auto-scroll         │
│ problem, solution,  │  marquee gallery     │
│ stats, tags         │  (full right col)    │
└─────────────────────┴──────────────────────┘
```

## New layout
```text
┌─────────────────────┬──────────────────────┐
│ Title, tagline,     │   HERO IMAGE         │
│ problem, solution,  │   (fills right col,  │
│ stats, tags         │    ~4:3 / 16:10)     │
│                     │                      │
│                     ├──────────────────────┤
│   ← marquee carousel scrolls under both → │
│      (full width, breaks out of grid)      │
└────────────────────────────────────────────┘
```

The hero stays inside the right column. The marquee sits beneath the hero **but spans the full modal width**, so it visually animates underneath the left text column as well as the right.

## Changes — `src/components/ProjectDeck.tsx`

### Right column (`pd-detail-right`, ~lines 559–626)
Replace the current "marquee or hero-fallback" block with **just the hero**:
- Render `openProject.hero` if set (image or video, using the existing `.pd-hero` class — `aspect-ratio: 16/10; border-radius: 20px; box-shadow: …`).
- Fallback to `openProject.cover`, then to a div with `background: openProject.heroBackground`.
- Drop the right-column marquee wrapper entirely.

### New full-width marquee row (after the grid closes, ~line 627)
Add a sibling block **outside** `.pd-detail-grid` but inside `.pd-detail-wrap`, only when `openProject.gallery.length > 0`:
```tsx
{openProject.gallery.length > 0 && (
  <div className="pd-marquee-fullwidth">
    <div className="pd-marquee">
      <div className="pd-marquee-track">
        {[...openProject.gallery, ...openProject.gallery].map((img, i) => ( … existing item markup … ))}
      </div>
    </div>
  </div>
)}
```
This keeps the existing marquee item / lightbox click behavior unchanged.

### Sticky left column
Currently `.pd-detail-left` is `position: sticky; top: 80px;`. Remove the sticky so the left column ends naturally and the marquee underneath reads as a band crossing both columns. (Sticky would cause the text to float over the marquee on long scrolls.)

## CSS adjustments (same `<style>` block in `ProjectDeck.tsx`)

- `.pd-detail-wrap` — keep current `max-width: 1320px`. Add `display: flex; flex-direction: column; gap: 56px;` so the grid and the full-width marquee stack with breathing room.
- `.pd-detail-left { position: static; }` — drop the sticky.
- `.pd-marquee-fullwidth` — new wrapper: `width: 100%;` (already inside the 1320px wrap, so it will span both columns).
- `.pd-marquee-item` — bump height from `320px` to ~`280px` so it feels like a supporting band rather than the main visual.
- Mobile `@media (max-width: 900px)`: existing rule already collapses the grid to one column; add `.pd-marquee-item { height: 200px; }`. Hero appears, then marquee underneath naturally.

## Behavior preserved
- Hover-pause on the marquee (`.pd-marquee:hover .pd-marquee-track { animation-play-state: paused; }`).
- Edge fade mask on the marquee.
- Click any marquee item → opens lightbox at correct index (unchanged logic).
- Lightbox prev/next/close (unchanged).

## Out of scope
- `src/pages/CaseStudy.tsx` (separate route, not the modal the user is referring to).
- Admin / `ProjectEditor.tsx` — hero + gallery fields already exist.
- Data schema — uses existing `hero`, `cover`, `heroBackground`, `gallery`.

## Verification
- Project with hero + gallery → right column shows hero; marquee scrolls full-width below, visually passing under the left text column.
- Project with hero only → hero shows in right column; no marquee band rendered.
- Project with no hero + gallery → right column shows the gradient `heroBackground`; marquee still spans full width below.
- Mobile width → grid collapses; hero sits between the text and the marquee.
- Click marquee item → lightbox opens at correct index, prev/next still work.