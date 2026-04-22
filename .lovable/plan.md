# Polish pass v2 — animated layouts, real hero, scannable case studies

Same scope as the previous plan, with two changes you asked for:

- **Layout itself becomes the animation** (not just elements fading in)
- **Real hero banner** on `/work` that sells the value, not just labels the page

---

## 1. Global footer with admin link

New `src/components/site/SiteFooter.tsx`, mounted in `App.tsx` (hidden on `/` and `/admin`).

- Name + one-line tagline
- Work · About · LinkedIn · Email
- Small muted "Admin" link bottom-right → `/admin`
- Glass + indigo, matches site language.

## 2. `/work` — proper value-led hero banner

New full-width hero block above the grid (no image — typographic + motion):

```text
┌─────────────────────────────────────────────────┐
│ KICKER: I bridge design and AI operations       │
│                                                 │
│ HEADLINE (huge, gradient, 2 lines):             │
│   I turn messy workflows                        │
│   into shipped systems.                         │
│                                                 │
│ SUB: Eight projects. Real outcomes. Here's      │
│      what I actually built.                     │
│                                                 │
│ ┌──────────┬──────────┬──────────┬──────────┐  │
│ │ 4,743%   │ 147 hrs  │  100+    │ 3d→20m   │  │
│ │ engage   │ reclaimed│touchpoints│ tender   │  │
│ └──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────┘
```

Headline animates word-by-word (mask reveal). Stat tiles slide up in sequence and the divider lines draw themselves left-to-right.

## 3. `/work` grid — animated **layout**, not just elements

Instead of decorating each card, the grid itself is alive:

- **Bento layout** — cards have varied sizes (1×1, 2×1, 1×2 spans) using CSS grid + framer-motion `layout`. Featured projects take larger tiles; the rhythm feels editorial, not uniform.
- **Layout morph on filter/sort** — small "All / Design / AI Ops / Brand" filter chips re-flow the grid using `<motion.div layout>`; cards physically slide to new positions with spring easing.
- **Grid ↔ List view toggle** — switching views animates cards from tile → row using shared layout IDs (cards visibly transform, don't crossfade).
- **Hover reshape** — hovered card expands to span 2 columns; neighbours politely reflow around it with `layout` spring. Releases on mouse-out.
- **Cover-image zoom** + animated count-up on the metric (via new `useCountUp.ts`) stay as small polish on top.

No 3D tilt — the motion lives in the grid structure itself.

## 4. `/work/:slug` — scannable case study

- **Hero shrinks** to 40vh/55vh.
- **Sticky TL;DR bar** under hero: one-line problem · one-line outcome · the metric — always visible.
- **Tabbed deep-dive**: Problem · Process · Honest moment · Outcome · Recognition. Tabs use shared layout indicator (the active underline slides between tabs, content panels swap with directional slide — layout-driven, not fade).
- **"Read as long form"** toggle expands all panels inline using `layout` animation (page literally grows).
- **Scroll-to-top on Next**: `useEffect` on `slug` change → `window.scrollTo({ top: 0, behavior: 'instant' })`.

## 5. `/about` — accurate + layout-dynamic

Copy fixes:

- Headline: "I started in graphic design. Now I build AI optimised workflows."
- Sub: "The throughline is the same — act as a bridge to technical and non-technical departments."
- "Creative director" removed everywhere.
- Skills regrouped: Design foundation · AI Operations.
- **Timeline removed** entirely (per your edit).

Layout-driven dynamics:

- **Animated "Now" status card** at top — pulsing dot + "Currently: Building [Company placeholder]". Card itself gently breathes (subtle scale loop).
- **Then / Now split** — two columns labelled "Graphic Designer" and "AI Operations PM". On scroll into view, the columns slide in from opposite sides and a connecting line draws between them spelling the throughline (clarity · systems · craft).
- **Mouse-reactive gradient orb** behind the hero — orb position follows cursor with spring lag.
- **"How I work"** kept, copy updated to PM-at-AI-company voice. Cards use `layout` so they reflow elegantly on resize.

I'll leave `[Company]` as a clearly marked placeholder you can swap in later.

## 6. Build secrets — fallback path

Since you can't find Build Secrets in Workspace Settings, I'll switch admin auth to **Lovable Cloud runtime secret** during build (works on any plan; needs Cloud enabled — I'll prompt for that step). The login UI stays identical.

## Files touched

```text
src/components/site/SiteFooter.tsx   (new)
src/App.tsx                          (mount footer)
src/pages/Work.tsx                   (hero + bento grid + layout animations + view toggle)
src/hooks/useCountUp.ts              (new)
src/pages/CaseStudy.tsx              (smaller hero + sticky TL;DR + tabs + scroll-to-top)
src/pages/About.tsx                  (rewrite + Then/Now + Now card + orb)
src/components/admin/AdminLogin.tsx  (switch to Lovable Cloud secret check)
```

Homepage (`/`) untouched. All motion stays in the existing glass / indigo / framer-motion language — but the emphasis shifts from element-level fades to **layout-level choreography**.