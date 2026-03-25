

# Reduce padding above subtitle, increase gap to timeline cards

## Changes in `src/components/TimelineCarousel.tsx`

1. **Desktop subtitle (line 346)**: Reduce bottom margin from `mb-10 sm:mb-14` to `mb-4 sm:mb-6` — less space between the subtitle and the timeline cards below

2. **Mobile subtitle (line 309)**: Reduce bottom margin from `mb-8` to `mb-4`

This keeps the subtitle closer to the section top while giving more visual breathing room before the card content by maintaining the existing card wrapper heights.

