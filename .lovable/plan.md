

# Refine Boondi carousel — fix GIF flash, reduce to 3 steps, update copy

## Issues to fix

1. **GIF flashes on every step change** — the carousel re-renders the GIF even when navigating away and back; need to reset `currentStep` properly and only show the GIF on step 1.
2. **Reduce from 4 steps to 3** — drop the bus wrap (step 4), keep it focused on thinking/process.
3. **Update captions to be more ambiguous/intriguing** — drive curiosity toward "View full project."
4. **Update step 2 and 3 descriptions** per brief.

## Changes in `src/components/ProjectCells.tsx`

### Remove bus wrap import
Delete the `boondiBus` import (line 8) since step 4 is being removed.

### Update Boondi steps array (lines 18-23)
Replace 4 steps with 3:

```js
steps: [
  { image: boondiHero, caption: "A living mark — movement, rhythm, and place." },
  { image: boondiShapeDev, caption: "Researching cultural landmarks — Aboriginal and Western — to extract the shapes behind the system." },
  { image: boondiTypeSystem, caption: "Applying those shapes to build a typeface and icon set ready for brand use." },
],
```

### Update teaser and reveal copy to be more ambiguous
- `teaser`: "A typeface rooted in place, shaped by culture."
- `reveal`: "What happens when geography becomes a glyph?"
- `details`: "Cultural research, shape systems, and a typeface born from the land it represents."

### Fix GIF flash on carousel navigation
In the `ProjectModal` component, add `key={currentStep}` to the image container's `<img>` tag only when the source changes, or better: avoid re-mounting the GIF by keeping all images mounted but only showing the active one via opacity/display. I'll use a simpler approach — just ensure the image element doesn't remount unnecessarily by keying on the image source rather than the step index.

## Files to update
- `src/components/ProjectCells.tsx`

