I can see what’s going wrong: the workflow section is effectively being skipped/overscrolled, and the sticky graphic is not getting a reliable pinned viewport moment. Increasing `360vh` alone is not enough because the section is inside the narrow About content flow and the browser/preview scroll jumps can move straight past the sticky window.

Plan:

1. Make the “How I work” journey a proper pinned scroll section
   - Move the `ProcessJourney` out of the constrained `max-w-4xl` content column so it can own the viewport width and pin cleanly.
   - Keep the “How I work” heading aligned with the rest of the page, but make the animation section a full-width scroll chapter.
   - This will stop the page from jumping straight from the hero/Then-Now area to the contact/footer.

2. Rebuild the sticky structure to use a reliable scroll pattern
   - Use an outer wrapper with enough height, e.g. `min-h-[420vh]` or `500vh`.
   - Use an inner sticky panel like `sticky top-0 h-screen flex items-center` instead of `top-[10vh] h-[80vh]`.
   - Add internal vertical padding so the diagram is centered but still has the whole viewport available.
   - This makes the browser hold on the diagram for the whole draw/loop animation.

3. Retune scroll timing so “Rapid Iteration” stays visible
   - Split the animation into clear phases:
     - first 20–30%: draw Discover & Design path
     - middle 55–60%: hold the loop on screen and run the 3 feedback laps
     - final 10–15%: animate the diagram out and release to the next page section
   - Delay the exit animation until the very end, so the rapid iteration part cannot slide away before it is seen.

4. Add a fallback for fast scroll / trackpad jumps
   - Keep the rapid iteration loop visible for a larger progress range.
   - Avoid relying on a tiny `0.55–0.92` scroll band for all three laps.
   - Make the lap counter and feedback labels appear early and remain visible during the loop.

5. Clean up related copy while I’m there
   - Remove the remaining “Use AI to remove the manual parts...” point from the About page’s `howIWork.iterate.points`, since you asked to focus on how you actually work for this section.

Technical files to update:

- `src/pages/About.tsx`
  - Restructure the “How I work” section so `ProcessJourney` is outside the constrained content container and has a full-width pinned scroll area.
  - Remove the leftover AI leverage copy from the Rapid Iteration bullet list data.

- `src/components/about/ProcessJourney.tsx`
  - Change the sticky container from `top-[10vh] h-[80vh]` to a full viewport sticky panel.
  - Increase scroll height and retune `useScroll` offsets.
  - Push the exit transform to the final scroll phase only.
  - Keep captions and loop labels visible for longer.

Validation:

- Test `/about` at the user’s viewport size, around `1172x885`.
- Scroll through the section manually and confirm:
  - the diagram pins instead of disappearing,
  - “Rapid Iteration” remains visible during the 3 laps,
  - the page only continues to testimonials/contact after the loop has completed.