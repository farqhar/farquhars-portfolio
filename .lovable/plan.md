

# Three Fixes: Timeline, Project Modal, and Spacing

## 1. Timeline — Horizontal Scroll with Sticky Section

**Problem**: You scroll past the timeline before seeing all of it, and the line doesn't go through the circle centers.

**Solution**: Make the timeline section use CSS `position: sticky` inside a tall wrapper div. As you scroll vertically, the timeline content stays pinned and the cards translate horizontally from right to left, revealing the journey step by step. When you reach the last card, the section unpins and normal scrolling resumes.

- Wrap the timeline section in a tall container (`height: 300vh`) to give scroll room
- The inner section uses `position: sticky; top: 0` to pin during scroll
- Map vertical `scrollYProgress` to a horizontal `translateX` on the cards row
- Fix the horizontal line position: calculate it to pass through the exact vertical center of the dot circles (not `top: 50%` of the full container — anchor to the dot row)
- The gradient progress line animates width in sync with the horizontal scroll
- Glass morphism cards with soft gradient glows remain as-is

**Files**: `TimelineCarousel.tsx`

## 2. Project Modal — Compact Carousel Instead of Scrolling Gallery

**Problem**: Modal is too tall, requires scrolling, gallery is overwhelming.

**Solution**: Replace the vertical image gallery with a **step-by-step carousel** inside the modal. The modal fits on screen without scrolling.

- Modal: `max-w-3xl`, vertically centered, no internal scroll needed
- Replace the `gallery` array with a `steps` array — each step has a label/caption and an image placeholder
- Render one step at a time with left/right arrow buttons and dot indicators
- Each step shows: a single image placeholder (or side-by-side pair) + a brief caption below
- "View full project →" button visible at the bottom without clipping
- Step counter: "1 / 4" in the corner

**Data structure change**:
```ts
steps: [
  { image: "Hero image", caption: "Brief explanation of this step" },
  { image: "Process sketch", caption: "..." },
  ...
]
```

**Files**: `ProjectCells.tsx`

## 3. Reduce Whitespace Between Timeline and Selected Work

**Problem**: Too much gap between the two sections.

**Solution**: Reduce padding on the bottom of the timeline section and top of the selected work section. Change `py-20 sm:py-28` on `ProjectCells` to `pt-8 sm:pt-12 pb-20 sm:pb-28`.

**Files**: `ProjectCells.tsx`

