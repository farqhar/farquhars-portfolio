# Polish "How I Work" — clearer feedback loop with arrows

Tighten the section, fix the visual issues from the previous iteration, and replace the current "spinning comet" with a clean, unbroken circle that has **arrow heads chasing around it** to make the feedback/iteration loop unmistakable.

## 1. Pull the section up — remove floating empty space

In `src/pages/About.tsx`:
- Tighten the eyebrow under "How I work" (`mb-5` → `mb-2`).
- Add a negative top offset on the `ProcessJourney` wrapper (`-mt-16 sm:-mt-24`) and reduce its bottom margin (`mb-20` → `mb-10`).

In `src/components/about/ProcessJourney.tsx`:
- Anchor the sticky stage to the upper portion of the viewport: change the inner sticky from `flex items-center` to `flex items-start pt-[6vh]` so the diagram appears earlier as you scroll in.
- Reduce the wrapper height from `500vh` to `420vh` (still ample dwell time for the laps).

## 2. Remove the floating purple triangle

Delete the `markerEnd="url(#arrow)"` from the animated left path and remove the `<marker id="arrow">` def. (The new loop arrows below replace the need for any path arrowheads.)

## 3. Clean, unbroken feedback loop with chasing arrows

Replace the current spinning comet arc + glow dot with a much clearer construct:

- **Always-visible full ring**: keep one solid circle stroked with the indigo→purple gradient at full opacity once the loop has drawn in. The ring never breaks or disappears during the laps — this addresses "make sure the circle is not broken".
- **Two chevron arrows orbiting the ring**: render two small arrow markers (`▶`-style chevrons made from a short SVG path) placed 180° apart, both tangent to the ring so they read as "flowing around it". Wrap them in a `motion.g` with `rotate: spinDeg` around `(LOOP_CX, LOOP_CY)` so they travel together around the loop as you scroll, completing 3 laps.
- **Subtle trailing glow** behind each arrow (small radial gradient, ~20px) so the motion has weight without competing with the ring.
- Each arrow's tip points along the direction of travel (clockwise), which visually reinforces "iteration / feedback flowing".

Reduced-motion fallback: render the ring + two static arrows at 0° and 180° with no rotation.

## 4. Lighten the loop nodes (no more heavy black look)

Soften `LoopNode`:
- Outer halo `r=24`, fill at ~8% alpha.
- Middle white disc keeps `r=11` but stroke goes from `1.8` → `1.2` and uses the node color at 60% alpha instead of full strength.
- Inner dot `r=3`.

This removes the "black bullseye" reading from the screenshot.

## 5. Give "Ship small" room to breathe

Currently it wraps to four squashed lines.
- Move it from `xPct(SHIP.x + 30), yPct(SHIP.y + 70)` to `xPct(SHIP.x - 10), yPct(SHIP.y + 110)`, `align="center"`.
- Add an optional `maxWidth` prop on `CaptionPill` and pass `22ch` for this one pill so it reads as "Smallest useful version, fast." in two comfortable lines.

## 6. Remove the lap counter

Delete the `Lap N / 3` block, the `lapCounterOpacity` transform, and the `lap` state + `setLap` listener. Keep the pulse-on-crossing logic so Ship/Feedback still flash gently each time an arrow passes them — that becomes the new visual cue for "a cycle completed".

## Files to edit

- `src/pages/About.tsx` — spacing only.
- `src/components/about/ProcessJourney.tsx` — arrows, ring cleanup, node lightening, Ship caption move, lap counter removal, sticky positioning.

## Technical notes

- Arrow chevron path: `M -6 -5 L 0 0 L -6 5` translated to `(LOOP_CX + LOOP_R, LOOP_CY)` and rotated 90° so it points clockwise tangent to the ring at the 3-o'clock position. The second arrow is the same path translated to `(LOOP_CX - LOOP_R, LOOP_CY)` rotated -90°. Wrapping both in a `motion.g` rotated by `spinDeg` makes them orbit while keeping their tangent orientation.
- The unbroken ring is just a static `<circle>` (no `pathLength` animation) shown once `loopDrawLength` reaches 1; the existing draw-in `<motion.circle>` stays for the initial reveal phase, then we render the solid ring on top with `opacity` driven by `useTransform(scrollYProgress, [0.36, 0.42], [0, 1])`.
- No new dependencies.
