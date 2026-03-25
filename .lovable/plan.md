

# Fix Timeline Line Alignment, Focal Points, and Card Connectors

## Problem Analysis

The horizontal timeline line is misaligned because `mb-3` on above-card wrappers adds 12px that the line position formula doesn't account for. Above-card dot center is at 272px but the line is at 260px.

Additionally, the cards lack a clear visual connection to their timeline dots — the user wants a visible connector line from each circle to its card, plus an outline border around the card content.

## Layout Fix

Restructure `TimelineCard` so both above and below cards use identical spacing before the dot:

```text
┌─────────────┐
│  Top zone    │  ← fixed 220px, padding-bottom instead of margin
│  (card if    │
│   above)     │
├─────────────┤
│  stem 32px   │  ← connector line (more visible)
│  ● dot 16px  │  ← center at exactly 220 + 32 + 8 = 260px
│  stem 32px   │
├─────────────┤
│  year label  │
├─────────────┤
│  Bottom zone │  ← padding-top instead of margin
│  (card if    │
│   below)     │
└─────────────┘
```

Line position: `top: 260px` — no margin offsets to miscalculate.

## Visual Connector + Card Border

- Make the vertical stems (w-px) slightly thicker or more opaque so they read as a clear connector from dot to card
- Add a persistent subtle indigo border around the entire card glass container (already has one at 0.1 opacity — bump to 0.15 and make the connector stems match)
- The stems + dot + card border create a clear visual link

## Focal Point Adjustments

- Card 02 (cave): `"center 55%"` still too low from the screenshot — try `"center 40%"` to get the orange-shirt subject
- Card 04 (Dubai): `"center 45%"` crops to buildings — try `"center 35%"` to get more of the skyline top

## All Changes — Single File

`src/components/TimelineCarousel.tsx`:

1. **TimelineCard layout**: Replace `mb-3`/`mt-3` with `pb-3`/`pt-3` inside the fixed-height wrappers so dot position math is consistent
2. **Connector stems**: Increase opacity from 0.25 to 0.4 for clearer visual connection
3. **Card border**: Keep existing border, ensure it's always visible (not just on hover)
4. **Focal points**: Card 02 → `"center 40%"`, Card 04 → `"center 35%"`
5. **Line position**: Confirm `calc(220px + 32px + 8px)` = 260px works with the new padding-based layout

