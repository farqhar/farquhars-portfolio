## Problem

The CMS already has one global save bar (`SaveBar`) rendered inside `CMSShell` for **every** section — Teaser, About, Work, Projects, Global, Theme. So technically a save control exists on the Work page too.

However, when no field has been edited yet, the Save button is rendered in a **disabled / greyed-out state** with the label "No unsaved changes". Visually this reads as "there is no save button here" — which matches what you're seeing on the Work page.

A second, smaller issue: the save bar lives at the bottom of the left CMS panel. On the Work section the form is short, but on longer sections the scroll area can mask it visually and it's easy to miss.

## Fix

Make the save bar unmistakable on every section, and give each section its own inline save shortcut so you never have to hunt for it.

### 1. Always show an enabled-looking Save button
Update `src/components/admin/SaveBar.tsx`:
- When there are 0 unsaved changes, still show a clearly styled **"Saved ✓"** button (not a greyed-out blob), so it's obvious where saving happens.
- When there are unsaved changes, keep the current amber highlight + active "Save (N)" button.
- Bump the bar's visual weight: stronger top border, slightly taller, sticky at the bottom of the panel with a subtle shadow so it stands out from the form above.

### 2. Add a small inline "Save" action at the top of every section
Create a tiny shared `SectionHeader` component used by:
- `TeaserSection.tsx`
- `AboutSection.tsx`
- `WorkSection.tsx`
- `ProjectsSection.tsx`
- `GlobalSection.tsx`
- `ThemeSection.tsx`

It renders the existing section title + description, plus a small Save button on the right that:
- Shows "Save (N)" with the live dirty count from `useDirtyCount()`.
- Calls the same `saveAllDirty()` flow used by `SaveBar` (so behaviour is identical).
- Is disabled + labelled "Saved" when count is 0.

This means whichever section you're editing, a Save button is visible at the top of the panel without scrolling.

### 3. Quick verification pass
After the changes, confirm in the preview:
- Open `/admin` → Work (full portfolio).
- A "Save" button is visible at the top of the section and at the bottom bar.
- Editing the "Eyebrow" field flips both buttons to active "Save (1)" + amber state.
- Clicking either one persists the change and resets to "Saved ✓".
- Repeat the smoke test on Teaser, About, Projects, Global, Theme.

## Files to change

- `src/components/admin/SaveBar.tsx` — restyle, always-visible save action even at 0 changes.
- `src/components/admin/sections/SectionHeader.tsx` — **new** shared header with inline Save.
- `src/components/admin/sections/TeaserSection.tsx`
- `src/components/admin/sections/AboutSection.tsx`
- `src/components/admin/sections/WorkSection.tsx`
- `src/components/admin/sections/ProjectsSection.tsx`
- `src/components/admin/sections/GlobalSection.tsx`
- `src/components/admin/sections/ThemeSection.tsx`

No DB / edge-function / schema changes — saving infrastructure (`cmsDirty`, `saveAllDirty`, `cms-save` edge function) is already wired and working.
