# Scroll-driven folder reveal — the Work page

Replace the entire grid below the hero with a single closed folder that opens as you scroll, fans out the projects as files inside, and lets you hover/click each file to enter its case study.

**Hero stays exactly as it is** (eyebrow, headline, subhead, 4 highlight tiles). Everything below — filter pills, view toggle, current grid — is removed.

## The interaction (matches the screen recording)

1. **Closed state** — A single tall folder card sits centred on the page. Front cover shows: small "Untitled Folder Interactive · 4:3" label, a giant `01` numeral, and a tiny `vve`-style brand chip in the corner. Indigo/blue gradient on glass, soft layered shadow.   
**As the user scrolls past the folder**, a sticky scroll section drives the reveal:
  - The folder's **front cover lifts up** (rotates ~-12° at the top edge, like opening a paper folder) and slides off the top.
    - Behind it, a **stack of file tabs fans out** one by one (staggered) — each tab is a project, labelled like `SECTION 01 · CJC LANDING PAGE`, `FILE 02 · WOLLIP`, etc., cascaded with a 28px vertical offset so every tab is visible.
2. **Fully open state** (sticky pinned while scrolling completes) — All 8 file tabs are visible, fanned. Hovering any tab:
  - **Lifts that tab up ~24px** and brings it forward (z-index spike).
    - The folder body underneath cross-fades to that project's preview: cover image, title, outcome metric, role, big faded number.
3. **Click a tab** → navigates to `/work/<slug>` (the case study).
4. **Mobile**: scroll-driven open is replaced with a one-tap "Open folder" affordance that triggers the same fan animation; tabs become a vertical accordion list, tap to preview, tap again to enter.

## How the scroll works

- A tall sticky section (`h-[200vh]`) wraps the folder.
- `useScroll` + `useTransform` map scroll progress 0 → 1 to:
  - Front cover `rotateX` 0 → -110°, `y` 0 → -200, `opacity` 1 → 0 (over 0–0.4)
  - Each tab `y` 0 → its fanned position, `opacity` 0 → 1, staggered across 0.3 → 0.9
- Once `progress > 0.95`, hover interactions become active.
- A subtle scroll hint ("scroll to open ↓") fades out as opening begins.

## Visuals

- **On-brand, not skeuomorphic**: glass morphism for tabs and folder body, indigo/blue gradient backgrounds, no Apple-grey manila.
- Front cover typography: oversized `01` in `gradient-text-indigo`, "Untitled Folder · Interactive" in mono uppercase eyebrow, brand chip top-right.
- Active tab gets indigo accent border + soft glow.
- Folder body shadow deepens as the cover lifts (sells the "opening" feeling).

## Files

```
NEW    src/components/work/FolderReveal.tsx    (whole scroll-driven folder + stack)
EDIT   src/pages/Work.tsx                      (remove filter pills, view toggle,
                                                old grid; mount <FolderReveal />)
DELETE src/components/work/FolderCard.tsx      (no longer used)
```

No DB or admin changes — uses the existing `projects` table and the editor we just shipped.

## Technical notes

- `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` for the sticky-section progress.
- Front cover uses `rotateX` with `transformOrigin: "top center"` and `transformPerspective: 1200` for the paper-fold.
- Tabs absolutely positioned within the folder body container; `top: i * 28px` once fanned. Hover via `whileHover={{ y: -24, zIndex: 50 }}` with spring.
- Folder body content driven by `activeIndex` state with `<AnimatePresence mode="wait">` cross-fade.
- Defaults `activeIndex = 0` so the body always shows project 01 at rest.
- `prefers-reduced-motion`: skip scroll animation, render fully open immediately.

## What carries over

The `files[]` sub-projects field on each project (added last step) is **kept** — clicking a tab still goes to its case study, where those sub-files render inside the case study layout. We can wire those back into the folder body later if you want a "preview the sub-files inline" affordance, but for this pass the folder = projects, click = enter.