# Fix the Work page folder experience

The current `FolderReveal` is broken in three ways: (1) the file tabs are absolutely positioned inside the folder body so they're hidden behind it, (2) the front cover sits on top of the body so it looks like one floating card, (3) a single 260vh sticky section creates a giant gap before the footer with nothing happening. We'll replace it with a clean, vertically pinned sequence — one folder per project — and end with a short CTA.

## What it will feel like

```text
[ Hero — unchanged ]
        ↓ scroll
┌─────────────── Folder 01 (pinned) ─────────────┐
│  Closed folder centered                        │
│  → cover lifts → files fan out from inside     │
│  → hover a file = it rises + previews          │
│  → click a file = open case study              │
└────────────────────────────────────────────────┘
        ↓ scroll past the pin
┌─────────────── Folder 02 (pinned) ─────────────┐
│  Same animation, next project's files          │
└────────────────────────────────────────────────┘
        ↓ ... one per project ...
[ Closing CTA — "See the full portfolio" + contact ]
[ Footer ]
```

## How each folder behaves

Each folder is its own `<section>` with **height ≈ 150vh** and a child that's `sticky top-0 h-screen`. Inside that sticky stage:

1. **Progress 0 → 0.35**: closed folder sits centered. Cover shows project number (01, 02…), title, "N files inside" label, brand chip. Subtle "scroll to open ↓" hint.
2. **Progress 0.35 → 0.6**: cover rotates open (`rotateX: 0 → -110deg`, `transformOrigin: top center`, `transformPerspective: 1400`) and fades. Folder body shadow deepens.
3. **Progress 0.55 → 0.95**: the project's `files[]` (sub-pieces) fan **upward out of the folder** as labeled tabs, staggered. Each tab shows `FILE 0X · <piece name>` and a tiny thumbnail strip. They settle in a stepped cascade above/inside the open folder body.
4. **Hover a file tab**: it lifts ~24px, brightens, and the folder body cross-fades to that file's preview image + caption.
5. **Click a file tab**: navigates to `/work/<project-slug>` (and later we can scroll to that file anchor inside the case study).
6. **Progress 0.95 → 1**: gentle hold so the user sees the open state before the next folder pins in.

Folders with no `files[]` defined gracefully treat the project itself as the single "file" (so nothing breaks for unedited projects).

## Closing CTA

A small section after the last folder, before the footer:
- Eyebrow: "End of folder"
- Headline: "Want the full picture?"
- Two buttons: **See full portfolio** (primary, prioritized per brand rules) + **Get in touch**
- Glass card, indigo accents, no extra socials.

This kills the dead gap before the footer.

## Visual rules (matches existing brand)

- Glass morphism body (60% white, 20px blur, soft indigo border).
- Cover uses indigo→blue→purple gradient with the giant project number in `gradient-text-indigo`.
- File tabs: indigo-tinted glass, active = solid indigo with white text + glow.
- No skeuomorphic manila — keep the premium Apple-minimal aesthetic.
- Respects `prefers-reduced-motion`: each folder renders fully open as a normal stacked layout, no sticky pin.

## Mobile (<768px)

Sticky scroll-jacking feels bad on touch. On mobile each folder becomes a tap-to-open card: tap the cover → it opens in place (no scroll-pin), files render as a vertical accordion list. Section height collapses to `auto` so there's no gap.

## Files to change

```text
EDIT   src/components/work/FolderReveal.tsx
       → Rewrite as <FolderSequence projects={...} /> that maps each
         project to a <ProjectFolder /> sticky section.
       → New <ProjectFolder /> handles its own useScroll/useTransform,
         cover-lift, file fan-out, hover preview, click-through.

EDIT   src/pages/Work.tsx
       → Mount <FolderSequence /> (renamed export) in place of <FolderReveal />.
       → Add new <WorkClosingCTA /> section between the sequence and the
         footer so there's no dead space.

NEW    src/components/work/WorkClosingCTA.tsx
       → Small glass CTA card: "See full portfolio" + "Get in touch".
```

No DB or admin changes. Uses existing `projects.files` jsonb (already in schema and admin editor). Uses existing `useProjects` hook.

## Technical notes

- Each `<ProjectFolder>` owns its own `sectionRef` and `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` so pins chain naturally.
- Section height: `clamp(900px, 150vh, 1400px)` to stay reasonable on tall monitors.
- File tabs animate `y` from `0` (tucked into folder) to a negative offset like `-(index+1)*44 - 60` so they fan upward out of the folder mouth, with `opacity` 0→1 staggered across the fan-out window. `zIndex` increases with index so later tabs sit on top.
- Hover state lives in the folder component (`activeFileIndex`); folder body has `<AnimatePresence mode="wait">` cross-fading the preview image.
- Front cover uses `pointer-events-none` once `progress > 0.5` so it never blocks tab hover after opening.
- The whole stage uses `transformStyle: preserve-3d` and a shared `perspective: 1600` on the sticky wrapper.
- Reduced motion path: `useReducedMotion()` → render each folder as a plain stacked layout with the file list visible, no sticky pin (`height: auto`).
- Mobile path: `useIsMobile()` (already in the project) → same as reduced-motion: tap to expand instead of scroll-pin.

## What stays the same

- The hero (eyebrow, headline, subhead, 4 highlight tiles) is untouched.
- Routing (`/work/<slug>`), the case study page, and the admin editor are untouched.
- The `files[]` field added in the previous step is what powers the in-folder fan — no schema changes.
