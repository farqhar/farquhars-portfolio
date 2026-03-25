

# Add Timeline Images and Adjust Years

## Year Changes
- Card 01: "2018" → "2018–2020"
- Card 02: "2018–21" → "2020–2023"
- Card 03: "2023" stays
- Card 04: "2024–25" stays
- Card 05: "2026" stays (label can say "2026 and beyond")

## Image Mapping
| Card | Images | Display |
|------|--------|---------|
| 01 (2018–2020) | Image 1 (airport) | Single image |
| 02 (2020–2023) | Images 2-6 (waterfall, cave, sailing, desert, diving) | Auto-cycling carousel |
| 03 (2023) | Image 7 (office/bridge) | Single image |
| 04 (2024–25) | Images 8-9 (Dubai laptop, red carpet) | Auto-cycling carousel |
| 05 (2026+) | Image 10 (presenting) | Single image |

## Implementation
- Copy all 10 images to `src/assets/timeline/`
- Add an `images` array field to each card in the data
- For cards with multiple images, render a small auto-cycling carousel inside the card (crossfade every 3s using `setInterval` + `AnimatePresence`)
- For single images, render the image directly with `object-cover` and rounded corners
- Replace the current dashed placeholder boxes with the actual images
- Images shown in both the inline card and the expanded modal

## Files
- `src/components/TimelineCarousel.tsx` — update card data with new years and image imports, add mini carousel component for multi-image cards

