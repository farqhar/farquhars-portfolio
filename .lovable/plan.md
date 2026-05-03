## Plan: Carousel sizing, hero auto-fit, and process journal PPT

Three changes. The first two are code; the third needs your previous PPT attached before I can match its style.

---

### 1. Carousel image sizing — project default + per-image override

**Database**
- Migration on `projects`:
  - `gallery_default_width int NOT NULL DEFAULT 100` (percent, 25–100)
  - `gallery` JSON items already free-form — extend each item shape to optionally carry `widthPct`.

**Backend**
- `supabase/functions/cms-save/index.ts` — accept `galleryDefaultWidth` / `gallery_default_width` in upsert.

**Types & data layer**
- `src/data/projectsSeed.ts`
  - `GalleryImage`: add `widthPct?: number` (25–100).
  - `Project`: add `galleryDefaultWidth?: number` (default 100).
- `src/hooks/useProjects.ts` — map `gallery_default_width` → `galleryDefaultWidth`.

**CMS editor** (`src/components/admin/ProjectEditor.tsx`)
- Above the gallery list: a "Default carousel size" slider (25–100%) using existing `NumberField`.
- For each gallery item: a small inline slider "Size override (%)" with a "Use default" reset button. Empty/undefined = inherit project default.
- Tiny helper text: "Lower % = smaller display in the carousel. Useful for tall/skinny images like email signatures."

**Front-end render** (`src/components/ProjectDeck.tsx`)
- In the marquee map, compute `const w = img.widthPct ?? openProject.galleryDefaultWidth ?? 100;`
- Apply to each `.pd-marquee-item` as a CSS variable: scale the item's max-width (and inner image max-height) by `w%` of the current size. Items with smaller `w` will appear smaller in the row; the marquee track keeps flowing normally.
- Lightbox unaffected — always shows full size.

---

### 2. Per-project hero auto-fit toggle

**Database**
- Migration on `projects`: `hero_auto_size boolean NOT NULL DEFAULT false`.

**Backend**
- `cms-save` — accept `heroAutoSize` / `hero_auto_size`.

**Types**
- `Project`: add `heroAutoSize?: boolean`.
- `useProjects.ts` — map row → field.

**CMS editor**
- Below the existing Fill/Fit toggle: a new toggle "Hero frame: Fixed / Auto-size to image".
- Helper: "Auto-size removes the coloured bars by shaping the frame to the image's natural aspect ratio. Layout shifts between projects."

**Front-end render** (`src/components/ProjectDeck.tsx`, hero block ~line 564)
- When `heroAutoSize` is true:
  - For images: read natural width/height (onLoad), then set the container's `aspect-ratio` to match. Render the `<img>` directly (not as background) so it dictates the frame.
  - For videos: use `aspect-ratio` from the video's `videoWidth/videoHeight` after `loadedmetadata`.
  - Force `fit = "cover"` since there's no leftover space — no bars possible.
- When false: keep current Fill/Fit behaviour exactly as is.

---

### 3. Process journal PPT

You picked "Upload the previous PPT now" but no file is attached to this message. After I implement #1 and #2, please attach the previous `.pptx` in your next message. Then I'll:

1. Parse it with `document--parse_document` to extract structure, headings, copy patterns.
2. Render thumbnails to capture exact style (colors, fonts, layouts, motifs).
3. Build a new `.pptx` with `pptxgenjs` matching that style, covering everything we've built since the last assignment closed:
   - Teaser → main site architecture, sticky nav, floating Contact CTA
   - Project deck (folder cards, hero Fill/Fit, hero auto-size, marquee gallery, lightbox)
   - CMS shell (sections, fields, media uploads, dirty-batch save, edge functions)
   - Carousel sizing controls (this build)
   - Lovable Cloud / Supabase backend (projects, site_content, theme tables, RLS)
4. QA every slide visually before delivering to `/mnt/documents/`.

---

### Unchanged
- All defaults preserve current visuals: `galleryDefaultWidth = 100`, `heroAutoSize = false`.
- No changes to lightbox, layout grid, footer, nav, or routing.

Approve to implement #1 + #2, and attach the PPT for #3.