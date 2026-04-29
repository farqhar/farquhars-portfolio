## Goal

Redesign the project detail overlay (the view that opens when you click into a portfolio project) so all key information sits at the top, side-by-side with an auto-scrolling image carousel — nothing important hidden at the bottom.

## New layout

```text
┌──────────────────────────── overlay ───────────────────────────┐
│ ← Back to projects                                       [×]   │
│                                                                │
│ ┌──────────────────────────┬───────────────────────────────┐   │
│ │ LEFT COLUMN (sticky)     │ RIGHT COLUMN                  │   │
│ │                          │                               │   │
│ │ LABEL · CLIENT · TIMELINE│  ┌─────┐ ┌─────┐ ┌─────┐      │   │
│ │                          │  │ img │ │ img │ │ img │ →    │   │
│ │ Project Title            │  └─────┘ └─────┘ └─────┘      │   │
│ │ Tagline                  │  (auto-scrolls left,          │   │
│ │                          │   pauses on hover)            │   │
│ │ Role · Overview          │                               │   │
│ │ [stat] [stat] [stat]     │                               │   │
│ │ Tags                     │                               │   │
│ └──────────────────────────┴───────────────────────────────┘   │
│                                                                │
│      ↓ on smaller scroll: marquee continues below info ↓       │
└────────────────────────────────────────────────────────────────┘
```

- **Desktop (≥900px)**: 2 columns. Left column = ~46% width, holds title, meta, tagline, role, overview, stats, tags. Right column = ~54% width, holds the auto-scrolling image strip that runs full-height of the left column.
- **The marquee** continues to flow underneath the left column (full-width band) so images can "scroll under" the text area visually as you move down.
- **Mobile (<900px)**: stacks — info first, marquee strip below.

## Auto-scrolling image strip

- Continuous left-drift marquee using a duplicated track (CSS `@keyframes` translateX from 0 to -50%).
- Speed: ~40s per loop, configurable.
- Hovering anywhere on the strip pauses the animation (`animation-play-state: paused`).
- Each image is a fixed-height tile (~280px tall on desktop, ~200px on mobile) with rounded corners and a soft shadow; widths vary by image aspect ratio.
- Click an image → opens a lightbox (full-screen view, click backdrop or × to close).
- Graceful empty state: if a project has no gallery images, the right column falls back to the existing `heroBackground` gradient block so the layout doesn't collapse.

## CMS gallery field

Add a **Gallery images** field to each project in the admin (`ProjectEditor.tsx`):

- Multi-image uploader using the existing `cms-upload` edge function and `site-media` bucket.
- Drag-to-reorder, delete per image, optional alt text per image.
- Stored as `gallery` jsonb column on `projects` table: `[{ url, alt }, ...]`.

## Technical changes

**Database**
- Migration: add `gallery jsonb NOT NULL DEFAULT '[]'` to `public.projects`.

**Types & data layer**
- `src/data/projectsSeed.ts` — add `gallery?: { url: string; alt?: string }[]` to the `Project` type.
- `src/hooks/useProjects.ts` — map `gallery` from row to project.
- `supabase/functions/cms-save/index.ts` — accept and persist `gallery` on upsert.

**Detail overlay (`src/components/ProjectDeck.tsx`)**
- Replace the single-column `.pd-detail-content` block (lines 400–459) with a new two-column layout: `.pd-detail-grid` containing `.pd-detail-left` (sticky) and `.pd-detail-right` (marquee).
- Add `.pd-marquee` + `.pd-marquee-track` styles with the keyframe animation and `:hover { animation-play-state: paused }`.
- Move stats and tags into the left column so nothing critical is below the fold.
- Add lightbox state (`lightboxIdx`) + simple full-screen image viewer with prev/next + Esc-to-close.
- Mobile breakpoint stacks the grid.

**Admin (`src/components/admin/ProjectEditor.tsx`)**
- Add a "Gallery images" section using a small multi-upload UI (reuse `MediaField` pattern; allow multiple). Persist to project's `gallery` field via the existing save flow.

## Files touched

- New: supabase migration adding `gallery` column.
- Edited: `src/components/ProjectDeck.tsx`, `src/data/projectsSeed.ts`, `src/hooks/useProjects.ts`, `src/components/admin/ProjectEditor.tsx`, `supabase/functions/cms-save/index.ts`.

## Out of scope

- No changes to the deck animation itself, the Work hero, or the closing CTA.
- No changes to other pages.
