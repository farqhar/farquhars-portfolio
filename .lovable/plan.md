

# Fix Timeline Image Focal Points

## Problem
`object-position: top` is applied uniformly to all images, but each photo has a different focal point. The airport photo crops to the ceiling, the red carpet photo crops to hands/torso, etc. A single CSS rule can't fix all images.

## Solution
Add a per-card `objectPosition` property to control where `object-cover` anchors. Each image gets a custom focal point (e.g., `center 30%` for faces near the top, `center` for centered subjects).

### Card focal points
| Card | Inline `objectPosition` | Notes |
|------|------------------------|-------|
| 01 Arrival | `center 25%` | Faces in upper third |
| 02 Exploration | `center 40%` | Nature scenes, fairly centered |
| 03 Office | `center 60%` | Office/bridge scene |
| 04 Dubai/RedCarpet | `center 30%` per image | Faces near top |
| 05 Presenting | `center 30%` | Person presenting |

### Changes in `TimelineCarousel.tsx`
1. Add `objectPosition: string` field to each card data object (default `"center"`)
2. `StaticImage` component: use the card's `objectPosition` instead of hardcoded `object-top`
3. `ExpandedCarousel`: use the same `objectPosition`, and increase image height from `h-48` to `h-64` so more of the photo is visible in the modal
4. Pass `objectPosition` through to both `StaticImage` and `ExpandedCarousel` via props

Single file change: `src/components/TimelineCarousel.tsx`

