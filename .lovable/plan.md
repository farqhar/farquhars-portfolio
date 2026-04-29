## Problem

The "Rapid Iteration" loop currently begins drawing from the top (12 o'clock / 0°), which is why the screenshot shows a small arc floating disconnected from where the main wave line terminates. The main wave ends at the **left side** of the circle (9 o'clock / 270°), at the Feedback node, so the loop should start drawing from there.

## Change

### `src/components/about/ProcessJourney.tsx`

The animated loop circle uses `transform={`rotate(-90 ${LOOP_CX} ${LOOP_CY})`}` (line 382). An SVG `<circle>`'s `pathLength` animation starts at the 3 o'clock position by default; `rotate(-90)` shifts that start point to 12 o'clock.

To start the draw from the **9 o'clock** position (where the main wave ends at the Feedback node), change the rotation to `180`:

```tsx
transform={`rotate(180 ${LOOP_CX} ${LOOP_CY})`}
```

This will make the loop draw clockwise starting from the left edge of the circle — flowing seamlessly out of the end of the main wave path.

No other changes required.

## Files

- `src/components/about/ProcessJourney.tsx` (single line edit on the animated `<motion.circle>` transform)
