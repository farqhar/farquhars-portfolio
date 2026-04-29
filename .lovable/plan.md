## Change

In `src/pages/About.tsx`, update the headshot in the hero (lines ~249-267):

- Change the blur backdrop from `rounded-full` to `rounded-3xl` so the glow matches the new shape.
- Change the `<img>` from `rounded-full` to `rounded-2xl`.
- Increase size from `w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]` to `w-[180px] h-[180px] sm:w-[240px] sm:h-[240px]` (also bump `width`/`height` attributes to 240).
- Soften the ring shadow slightly so it reads as a square frame: keep the white inner ring and indigo outer ring, just larger drop shadow.

No other changes.