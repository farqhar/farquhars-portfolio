

# Timeline Card Image & Interaction Fixes

## Changes

### 1. Inline cards: Static first image, focused on faces
- Remove `AutoCarousel` from inline `TimelineCard` — show only the first image with `object-cover` and `object-position: top` to prioritize faces/focal points
- No cycling animation until the card is expanded

### 2. Expanded modal: Clickable carousel + auto-slideshow
- In `ExpandedCard`, add left/right arrow buttons and dot indicators (like the project modal)
- Auto-cycle every 3.5s if user doesn't click — reset timer on manual navigation
- Clicking arrows or dots advances manually

### 3. Make cards look clickable
- Add a visible "Tap to explore →" label always shown (not just on hover)
- Add a subtle border that brightens on hover: `border: 1px solid hsla(var(--indigo), 0.1)` → `0.25` on hover
- Change cursor to pointer (already set) and add a slight scale on hover (`group-hover:scale-[1.02]`)

## File
- `src/components/TimelineCarousel.tsx` — all changes in this single file

