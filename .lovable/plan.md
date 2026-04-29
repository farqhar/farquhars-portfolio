Replace the "Discover & Design" + "Rapid Iteration" sections in `src/pages/About.tsx` with a single scroll-driven, visually-led graphic inspired by the Gartner reference (Design Thinking → Lean Startup → Agile, but reframed in Farquhar's voice).

## Visual concept

A horizontal "double curve + cycle" path that draws itself as the user scrolls:

```text
  Discover         Iterate
   ___              ___
  /   \   ___    .-'   '-.
 /     \_/   \_.'         '.
*       *     *             *
brief  map   ship          learn
```

- One continuous SVG path: a rising arc on the left (Discover & Design), descending into a node, then a circular loop on the right (Rapid Iteration).
- 6 milestone nodes positioned along the path. Each maps to one of the existing 6 bullet points (3 from `discover.points`, 3 from `iterate.points`).
- A small icon glyph (lightbulb, map, flask, rocket, refresh, spark) sits at each node. No long copy — just the milestone label as a short caption that fades in when scroll reaches that node.
- Two section labels — "Discover & Design" and "Rapid Iteration" — anchor each half, replacing the current heading + intro paragraphs.

## Scroll behaviour

- The whole graphic lives inside a tall `section` (≈200vh) with the SVG in a `position: sticky` inner container, so it stays pinned while the user scrolls through it.
- Use Framer Motion `useScroll({ target, offset: ["start end", "end start"] })` + `useTransform` to drive:
  - `pathLength` of the SVG path from 0 → 1 as scroll progresses.
  - Each node's `opacity` / `scale` triggers as scroll passes its threshold (e.g. node 1 at 0.15, node 2 at 0.30, etc.).
  - Each milestone caption fades and slides up as its node activates.
- A small moving "tracer" dot follows the tip of the drawing path for extra life.

## Content mapping

Discover & Design (left arc):
1. Brief — "Write the brief before opening tools."
2. Stakeholders — "Treat stakeholder management as the work."
3. System map — "Map the system end-to-end first."

Rapid Iteration (right loop):
4. Ship small — "Smallest useful version, fast."
5. AI leverage — "Remove the manual parts so judgement sharpens."
6. Feedback — "Prototype in days. Feedback is the only honest tool."

Each label is short (2–4 words). The longer sentence is the caption that appears only when active.

## Technical approach

- Add a new component `ProcessJourney.tsx` (kept inside About.tsx or split as a sibling component file).
- SVG: 1200x420 viewBox, single `<motion.path>` with `pathLength` driven by `useTransform`.
- Nodes: array of `{ x, y, label, caption, threshold }`. Render each as a circle + label group with `motion.g` whose opacity is `useTransform(scrollYProgress, [t-0.05, t], [0, 1])`.
- Replace lines 274–305 (the "How I work" block) with `<ProcessJourney />`.
- Keep the `howIWork` data object as the source of truth for milestone copy, restructured into the 6-node array.
- Mobile fallback: below `md`, switch to a vertical version (path drawn top-to-bottom, nodes stacked on the right) so it still works on phones. Same scroll behaviour.
- Respect `prefers-reduced-motion`: skip the scroll-driven drawing and show the full path with all nodes visible.
- Styling stays on-brand: indigo/purple stroke with a soft glow, white background, thin line weight, geometric Apple-minimal feel — not the Gartner blue or the cartoony double-diamond palette.

## Files to change

- `src/pages/About.tsx` — remove the existing "How I work" block, drop in the new component, restructure the data.
- (Optional) `src/components/about/ProcessJourney.tsx` — new component if it grows past ~120 lines.

No backend or schema changes.