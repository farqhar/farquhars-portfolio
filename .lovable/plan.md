# Fixes and Upgrades

## 1. Project Cards — Expand to Full-Width Modal Instead of Flip Back

**Problem**: The flip card back face is too small; the "View full project" button gets clipped; no room for side-by-side images.

**Solution**: Keep the flip animation on the front cards, but instead of showing details on the back face, clicking a card flips a card and opens a **full-width modal overlay** (like the timeline's `ExpandedCard` but much bigger):

- Modal width: `max-w-5xl` (~1024px), not full height — auto height with max-height and scroll
- Top section: the reveal question as an italic gradient heading
- **Image gallery**: a flexible grid that supports side-by-side images (2-column layout for process shots, full-width for hero images). Placeholder slots with dashed borders for now — structured as rows where each row can be 1 or 2 images
- Details text below the gallery
- "View full project →" button at the bottom, fully visible

## 2. Timeline — Scroll-Triggered Linear Progression

**Problem**: The auto-scrolling marquee doesn't convey a clear start-to-end journey.

**Solution**: Replace with a scroll-driven horizontal timeline:

- A visible horizontal line running across the section with year markers/dots on it
- Cards appear **above or below** the line, connected by vertical stems
- As the user scrolls the page (vertical scroll), the timeline progresses left-to-right using Framer Motion's `useScroll` with the section's scroll progress
- Each card animates in (fade + slide up) as its position on the timeline is reached
- Cards use glass morphism styling with the soft gradient glow underneath
- Show ~2-3 cards at once on desktop, with the line drawing itself as you scroll
- The section should be tall enough (sticky or just long) to give room for the scroll progression
- Keep the click-to-expand modal for detailed view
- Add a space to input an image to showcase that period of life

## Summary of Changes


| File                   | Change                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ProjectCells.tsx`     | Remove flip back face; click opens a large full-width modal with side-by-side image grid and visible CTA button                                  |
| `TimelineCarousel.tsx` | Replace auto-scroll marquee with scroll-driven horizontal timeline showing clear start→end progression; glass morphism cards with gradient glows |
| `HeroSection.tsx`      | No change — "an F" is grammatically correct (F is pronounced "eff", vowel sound)                                                                 |


**Note on "an F" vs "a F"**: "An F" is the correct grammar. The word "F" is pronounced "eff," which begins with a vowel sound, so "an" is used. No change needed.