
# Save buttons + Testimonials editor + Theme (Phase 2)

Three things in one pass.

## 1. Explicit Save buttons everywhere

Today every `TextField` / `MediaField` saves **on blur** silently — that's why it doesn't feel like anything happened. Fix:

- Add a `useDirtyFields` store (Zustand-lite, in-memory) that tracks pending edits per `(page, section, key)`.
- `TextField` switches from save-on-blur to **buffered**: typing updates local + dirty store, doesn't hit the network.
- `MediaField` keeps immediate upload (files are big, can't buffer), but flashes a "Saved ✓" toast so it's visible.
- New **sticky save bar** at the bottom of the CMS panel:
  ```text
  ┌─────────────────────────────────┐
  │ 3 unsaved changes  [Discard] [Save] │
  └─────────────────────────────────┘
  ```
  - Disabled when no dirty fields.
  - Save → batches all dirty writes through `cms-save`, clears store, fires `fm_cms_updated` so the iframe reloads.
  - Discard → reverts inputs to last saved value.
- Also warns on page-picker switch and browser close if dirty.

## 2. Testimonials editor (About page)

Currently the testimonials grid in `About.tsx` is hard-coded. Wire it up:

- New `ListField` component — add / remove / reorder array items, each item rendered with a custom child template.
- New `TestimonialsEditor` in `AboutSection.tsx` using `ListField` where each row has:
  - Quote (textarea)
  - Name (text)
  - Role (text)
  - Avatar (`MediaField`, image, optional)
- Stored as a single `site_content` row: `page='about'`, `section='testimonials'`, `key='items'`, `value_json={ value: [{quote,name,role,avatar}, ...] }`.
- `About.tsx` reads via `useSiteContent('about').get('testimonials','items', DEFAULT_TESTIMONIALS)` — current hard-coded array becomes the fallback so nothing changes visually until you edit.

## 3. CMS Phase 2 — Theme controls

A new **Theme** entry in the page picker (alongside Global). Edits the existing `theme` table (single row).

### What's editable

**Colors** (color-picker UI with hex input + swatch):
- Background, Foreground, Primary, Accent, Muted, Border.
- Stored as `colors_json: { background:"#…", foreground:"#…", … }`.

**Typography**:
- Heading font (curated dropdown: Inter, Instrument Serif, Playfair, Space Grotesk, Geist, plus current default).
- Body font (same list).
- Stored as `fonts_json: { heading:"Inter", body:"Inter" }`.

**Heading scale** (sliders + numeric):
- H1 size, H2 size, H3 size, tracking, weight.
- Stored as `headings_json: { h1:{size:64,weight:700,tracking:-0.02}, h2:{…}, h3:{…} }`.

### How it's applied site-wide

- New `src/lib/theme.ts` exports `useTheme()` — reads the single `theme` row, injects CSS variables on `<html>`:
  ```css
  --bg: #…; --fg: #…; --primary: #…; --accent: #…;
  --font-heading: "Inter", system-ui;
  --font-body: "Inter", system-ui;
  --h1-size: 64px; --h1-weight: 700; …
  ```
- Mounted once in `App.tsx` so changes propagate everywhere instantly (and into the admin iframe on save).
- `tailwind.config.ts` extended with `fontFamily.heading` / `fontFamily.body` mapped to the CSS vars; existing color tokens (`--primary`, etc.) already in `index.css` are overridden by the theme row when present.
- Curated Google Fonts loaded on demand via a `<link>` injection in `useTheme()` so only chosen fonts download.

### Backend

- Extend `cms-save` to handle a third table: `theme`. Body shape `{ password, table:"theme", value: { colors_json?, fonts_json?, headings_json? } }`. Updates the single existing row (or inserts if empty).
- Migration: ensure exactly one `theme` row exists (insert default if empty) and add `theme_singleton` constraint.

### UI

`src/components/admin/sections/ThemeSection.tsx`:
```text
COLORS
  [■] Background  #0a0a1a
  [■] Foreground  #ffffff
  [■] Primary     #6366f1
  …
TYPOGRAPHY
  Heading font  [Inter ▾]
  Body font     [Inter ▾]
HEADINGS
  H1  size [64] weight [700] tracking [-0.02]
  H2  …
  H3  …
[ Reset to defaults ]
```

All inputs flow through the same dirty-store + sticky save bar.

## Files touched

```text
# Save buttons
src/lib/cmsDirty.ts                              (new — dirty-fields store)
src/components/admin/SaveBar.tsx                 (new — sticky save bar)
src/components/admin/CMSShell.tsx                (mount SaveBar, dirty-guard on page change)
src/components/admin/fields/TextField.tsx        (buffered save via dirty store)
src/components/admin/fields/MediaField.tsx       (toast on save)

# Testimonials
src/components/admin/fields/ListField.tsx        (new — generic add/remove/reorder)
src/components/admin/sections/AboutSection.tsx   (add TestimonialsEditor)
src/pages/About.tsx                              (read testimonials from site_content)

# Theme phase 2
src/components/admin/sections/ThemeSection.tsx   (new)
src/components/admin/PagePicker.tsx              (add Theme entry)
src/components/admin/CMSShell.tsx                (route to ThemeSection)
src/components/admin/fields/ColorField.tsx       (new — picker + hex)
src/components/admin/fields/FontField.tsx        (new — curated dropdown)
src/components/admin/fields/NumberField.tsx      (new — slider + input)
src/lib/theme.ts                                 (new — useTheme + CSS var injection + Google Fonts loader)
src/App.tsx                                      (mount useTheme)
src/lib/cmsApi.ts                                (add saveTheme + batched saveAll)
supabase/functions/cms-save/index.ts             (handle table:"theme")
supabase migration                               (ensure single theme row + defaults)
tailwind.config.ts                               (font-heading / font-body tokens)
```

After this lands: nothing saves silently anymore — you click Save, you see "Saved ✓"; testimonials are fully editable; and the whole site's colours, fonts, and heading scale are controlled from `/admin → Theme` with live preview.
