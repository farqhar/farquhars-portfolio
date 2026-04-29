Rework the How I Work scroll journey: fix the sticky pinning, drop "AI leverage", give every label real breathing room, and turn the right-hand iteration loop into an animated 2–3 lap spiral that visibly cycles as you scroll.

## 1. Fix sticky pinning

`<main>` in `About.tsx` uses `overflow-hidden` (for HeroOrb), which kills `position: sticky` for descendants — that's why the journey scrolls past.

- Remove `overflow-hidden` from `<main>`.
- Wrap only the hero/orb in its own `relative overflow-hidden` clipper so HeroOrb is still contained.
- Inner journey container: `sticky top-[10vh] h-[80vh]` inside a `260vh` wrapper so there's plenty of scroll room for the loop to spin multiple times.

## 2. Five milestones (AI leverage removed)

Linear left half:
1. Brief — "Write the brief before opening any tools."
2. Stakeholders — "Treat stakeholder management as the work."
3. System map — "Map the system end-to-end first."

Looping right half:
4. Ship small — "Smallest useful version, fast." (sits on the loop)
5. Feedback — "Prototype in days. Feedback is the only honest tool." (opposite side of the loop)

## 3. Diagram redesign

```text
DISCOVER & DESIGN ──────────►   RAPID ITERATION
                                    ╭─ Feedback ─╮
 Brief → Stakeholders → System ─────┤  ↻ ↻ ↻    │
                       map          ╰─── Ship ◄──╯
```

- One seamless Bezier across the left for Brief → Stakeholders → System map.
- Smooth tangent handoff into a circular loop on the right.
- SVG `<marker>` arrowheads on each segment and one on the loop so direction is obvious.
- Faint full path at 10% opacity from frame 0; gradient stroke draws over it.

## 4. Multi-lap animated feedback loop (the new bit)

This is the key change.

- The loop is a separate `<motion.circle>` (or circular path) layered on top of the base diagram.
- Two visible elements spin around it as you scroll the second half:
  - A **gradient arc** ("comet tail") of ~120° that rotates around the loop, leaving a fading trail.
  - A **tracer dot** at the head of the arc.
- Rotation is driven by `useTransform(scrollYProgress, [0.55, 0.98], [0, 1080])` — that's **3 full laps** across the iteration portion of the scroll. (Configurable; we'll start with 3, can dial to 2 if it feels too much.)
- Each lap, the tracer passes through the Ship and Feedback nodes. We pulse those nodes (`scale 1 → 1.15 → 1`) every time the rotation crosses their angle, using a `motionValue.on("change")` listener — so visually you see "ship → feedback → ship → feedback → ship → feedback" as a real cycle.
- A small lap counter appears under the loop ("Lap 1 / 3", "Lap 2 / 3"...) that ticks up — reinforces the "iterate, iterate, iterate" idea without text walls.
- The whole loop subtly **breathes outward** with each lap (radius +2px on the pulse) to suggest the product getting better with each cycle.
- After the final lap, the tracer arcs **off the right edge of the canvas** (translateX animates to +120% as scrollYProgress reaches 1.0) — the "ship it out into the world" exit moment you described.

Reduced motion: show full path, both nodes, all 3 lap markers as static dots around the loop, no spinning.

## 5. Text breathing room (the other key fix)

Captions have been crashing into the line. Fix:

- Each node's **label** (uppercase, ~11px, indigo) and **caption** (~12px, muted) render as **HTML overlays** absolutely positioned over the SVG using percentage coords, not as `<text>` inside SVG. Gives real wrapping, line-height, and crisp type.
- Each text block:
  - `max-width: 14ch`, line-height 1.35
  - soft white backdrop: `rgba(255,255,255,0.92)`, `backdrop-blur: 4px`, `padding: 6px 10px`, `rounded-lg`, faint indigo border
  - thin connector line (1px, 30% opacity) from the backdrop to its node so the association is obvious even with a gap
- Layout rules:
  - Minimum **64px** clear distance between any text block and the path.
  - Captions alternate above/below the path so neighbours never collide.
  - For the loop, Ship caption sits **outside-bottom-right** of the circle and Feedback caption sits **outside-top-left** — both well clear of the spinning arc.
  - Minimum 24px gap between adjacent text blocks.

## 6. Scroll choreography

- Path drawing: `pathLength` 0 → 1 across `scrollYProgress` [0.05, 0.50] (left half + into loop).
- Linear node thresholds: 0.12 (Brief), 0.22 (Stakeholders), 0.34 (System map).
- Loop nodes appear at 0.50 (Ship) and 0.55 (Feedback).
- Loop spinning: [0.55, 0.95] → 1080° (3 laps).
- Exit animation: [0.95, 1.0] → tracer + arc translate off-canvas right, fade to 0.
- Section labels fade in at the start of each half.

## Files

- `src/components/about/ProcessJourney.tsx` — full rewrite: drop AI leverage, add markers, HTML caption overlay system, multi-lap rotating arc + tracer + lap counter + exit animation.
- `src/pages/About.tsx` — move `overflow-hidden` from `<main>` onto a hero-only wrapper so sticky works.