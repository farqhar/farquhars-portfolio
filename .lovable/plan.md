

# Timeline Image Fixes

## Changes in `src/components/TimelineCarousel.tsx`

1. **Remove waterfall image** — Drop `img02Waterfall` import and from card 02's `images` array (becomes: cave, sailing, desert, diving)

2. **Fix card 02 focal point** — Change `objectPosition` from `"center 40%"` to `"center center"` so the person in orange shirt is visible

3. **Expanded modal image: square** — Change `ExpandedCarousel` class from `h-64` to `aspect-square` so clicked-in images display as 1:1

4. **Inline cards stay as-is** — Keep the current `h-28` rectangle for unexpanded timeline cards

Single file: `src/components/TimelineCarousel.tsx`

