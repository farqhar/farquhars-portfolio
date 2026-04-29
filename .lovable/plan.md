## Goals

1. "Discover & Design" label should appear *after* the Brief node animates in (not at the same time as the line).
2. The "Rapid Iteration" loop should visually start where the linear path ends — no gap.
3. Reduce empty space between How I Work and What People Say.
4. Make the small section eyebrow headings (How I work, Skills, Then / Now, What people say) read more clearly as headings instead of fading into the page.

## Changes

### `src/components/about/ProcessJourney.tsx`

**Label timing (Discover & Design)**
- Currently: `labelDiscover = useTransform(scrollYProgress, [0.03, 0.1], [0, 1])` — fades in immediately with the line.
- Update to fade in just after the Brief node lands: `[0.11, 0.16]`. Brief threshold is `0.1`, so label appears once Brief is visible.
- Keep `labelIterate` aligned with loop draw (currently `[0.32, 0.42]` — fine).

**Loop joins the path end**
- Path currently ends at `(720, 320)`. Loop is centered at `(820, 320)` with radius `110`, so its left edge sits at `x = 710` — close, but the path's actual end direction leaves a visible disconnect (curve ends going down/right while loop's left is at 9 o'clock).
- Extend `LEFT_PATH` so its final point lands exactly on the loop's left edge tangentially:
  - Change last segment so the path terminates at `(710, 320)` (Feedback / 9 o'clock point of the loop) with a smooth horizontal approach:
  - New path: `"M 80 380 C 180 380, 220 200, 320 200 S 460 380, 560 380 S 680 320, 710 320"`
- Move `LOOP_CX` left from `820` to `820` (unchanged) — left edge `710` now matches path end.
- This means the path visually flows directly into the Feedback node and the iteration ring begins exactly where the journey line ends.

**Tighten bottom spacing**
- Reduce wrapper height from `420vh` to `360vh` so the pinned section releases sooner.
- Reduce sticky top padding from `pt-[6vh]` to `pt-[4vh]`.

### `src/pages/About.tsx`

**Stronger eyebrow headings**
- Current pattern: `text-[10px] tracking-[0.18em] uppercase text-muted-foreground` — too faint.
- Upgrade the four section eyebrows (Then / Now, Skills, How I work, What people say) to a more obvious heading style:
  - `text-xs font-semibold tracking-[0.2em] uppercase text-card-title` (darker, bolder)
  - Add a short accent rule: a `<span>` 24px wide gradient bar (`gradient-indigo`) before or above the label, e.g.:
    ```tsx
    <div className="flex items-center gap-3 mb-5">
      <span className="block h-px w-8 bg-gradient-to-r from-[hsl(var(--indigo))] to-[hsl(var(--purple))]" />
      <p className="text-xs font-semibold tracking-[0.22em] uppercase text-card-title">Skills</p>
    </div>
    ```
- Apply identically to all four eyebrows for consistency.

**Reduce How I Work → Testimonials gap**
- ProcessJourney wrapper currently `mb-2` and the "How I work" eyebrow is in its own block above with default flow.
- Change ProcessJourney wrapper from `mb-2` to `-mt-8 mb-0` to pull the testimonials block up snugly under where the pinned animation releases.
- Also reduce the section-above margin: the eyebrow block currently has no explicit bottom margin issue, but ensure `mb-2` on the eyebrow stays tight.

## Files

- `src/components/about/ProcessJourney.tsx` — path geometry, label timing, wrapper height.
- `src/pages/About.tsx` — eyebrow heading style (4 places), spacing around ProcessJourney.

## Out of scope

No content rewrites, no testimonial content changes, no color palette changes.
