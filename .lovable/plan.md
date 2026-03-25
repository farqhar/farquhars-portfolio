

# Fix Timeline Line Alignment and Focal Points

## Problem 1: Timeline line cuts through cards
The horizontal progress line is hardcoded at `top: calc(220px + 32px + 8px)` (260px). This assumes above-cards are exactly 220px tall, but they're actually taller (image + text + tags). So the line slices through the card content instead of passing through the dot centers.

**Fix**: Use a layout where above-cards get a fixed-height wrapper matching the below-card spacer (220px), and position the line to align with the dot centers. The card content will need to be bottom-aligned within that fixed wrapper so it sits just above the connector line.

Specifically:
- Above cards: wrap in a container with `h-[220px]` and use `flex flex-col justify-end` so the card anchors to the bottom, near the dot
- The horizontal line position stays at `calc(220px + 32px + 8px)` which now correctly hits the dot center for both above and below cards

## Problem 2: Focal points for cards 02 and 04
- Card 02 (2020-2023): The cave image's subject (orange shirt) is slightly below center. Change `objectPosition` from `"center center"` to `"center 55%"` to pull the crop down
- Card 04 (2024-25): Dubai skyline image needs a lower focal point in the inline view. Change from `"center 30%"` to `"center 45%"`

These may need further fine-tuning once visible, but this gets them closer.

## Changes — single file: `src/components/TimelineCarousel.tsx`

1. **Line 36**: Card 02 `objectPosition` → `"center 55%"`
2. **Line 57**: Card 04 `objectPosition` → `"center 45%"`
3. **Line 250**: Above-card wrapper — change from `<div className="mb-3">` to `<div className="h-[220px] flex flex-col justify-end mb-3">`
4. **Line 265**: Below-card wrapper — keep `<div className="mt-3">` as-is (the 220px spacer above already aligns it)

