## Three pieces of work

1. Host the Measured Aesthetic HTML experience at its own shareable link
2. Link to it from the Measured Aesthetic project in Work
3. Roll the new personal brand (Archivo 800 / Work Sans, Ink / Off-white / Sage) across the whole portfolio

---

## 1. Measured Aesthetic experience

**What you need to upload first**

The HTML on its own won't run. It references files that weren't in the upload:

```text
assets/hw-04.png, hw-26, hw-30, hw-43, hw-44, hw-45, hw-46
assets/sat_positions.js
components/data.js
components/viz.js
../organised-final/grids /grids_rule of thirds .png
                         /grids_golden ratio.png
                         /grids_diagonal.png
                         /grids_centre axis .png
```

Zip the project folder (including the `organised-final/grids` folder that sits alongside it) and upload it. Until that lands, the Loading, Saturation, Grids and Gallery sections will be empty.

**How it gets hosted**

The experience is a self-contained scroll piece with its own fonts, snap scrolling and fixed nav. Rewriting it as React would risk breaking the animation timing, so it gets served verbatim:

- Everything goes into `public/measured-aesthetic/` — `index.html`, `assets/`, `components/`, and the grid images moved into `assets/grids/`.
- The one code edit to the HTML: change `GRID_BASE` from `../organised-final/grids%20/` to `assets/grids/`, and rename those four files to safe lowercase-hyphen names (no spaces).
- Images over 100 KB get pushed to the Lovable CDN so the repo stays light; the HTML references the CDN URLs.
- A small route rule so `/measured-aesthetic` (no trailing slash, no `.html`) serves it and the React router doesn't intercept.

**Result:** `https://farquhars-portfolio.lovable.app/measured-aesthetic` — a clean link to paste into the award submission.

---

## 2. Link from the Work project

- Add an optional `experienceUrl` + `experienceLabel` to the project data model (new `experience_url` / `experience_label` columns on `projects`, both nullable, with the usual grants).
- New fields in the CMS project editor so you can set the link per project without a code change.
- In the project detail view, when a URL is present, a prominent button appears under the intro: **"View the live experience →"**, opening in a new tab. Nothing renders when the field is empty, so no other project is affected.
- Set Measured Aesthetic's to `/measured-aesthetic`.

---

## 3. Brand rollout

From your brand guidebook:

| Token | Value |
| --- | --- |
| Ink | `#0A0A0A` |
| White | `#FFFFFF` |
| Off-white | `#F5F5F3` |
| Photo tile | `#2B2B2B` |
| Sage | `#7A9B7E` |

Type: **Archivo 800** for headings, **Work Sans** for body, italic for asides.

What changes:

- `index.css` design tokens rewritten: background off-white, foreground ink, primary/accent sage, borders derived from ink at low opacity. The indigo/blue/purple portfolio tokens are retired.
- The three indigo gradient utilities (`gradient-indigo`, `gradient-text-indigo`, `gradient-text-purple`) become a restrained sage-to-ink treatment, applied sparingly to stay true to the "sage on roughly 1 in 5" rule.
- Archivo and Work Sans loaded from Google Fonts; `--font-heading` / `--font-body` point at them; the CMS font picker gets both added to its curated list.
- The dark hero entry (`#0a0a1a`) becomes photo-tile ink `#2B2B2B`, keeping the dark-to-light transition but on brand.
- Glass morphism panels keep their structure, retinted from white-on-indigo to off-white-on-ink.
- Sweep of home, Work, About, project modal and CMS to remove any remaining hardcoded indigo classes.
- The seeded theme row in the database is updated to match, so the CMS Theme panel opens showing the new brand rather than the old indigo defaults.

The Measured Aesthetic experience itself is left exactly as designed — it's its own artefact and shouldn't inherit the site theme.

---

## Technical notes

- No new dependencies.
- One migration: two nullable text columns on `projects`, plus grants.
- `cms-save` edge function extended to accept the two new fields.
- Files touched: `public/measured-aesthetic/*` (new), `vite.config.ts` (route handling), `src/index.css`, `tailwind.config.ts`, `src/lib/theme.ts`, `src/data/projectsSeed.ts`, `src/hooks/useProjects.ts`, `src/components/ProjectDeck.tsx`, `src/components/admin/ProjectEditor.tsx`, `src/components/admin/fields/FontField.tsx`, plus colour sweeps across the page and site components.

## Sequence

The brand rollout can start now. The Measured Aesthetic hosting waits on the zip — if you approve this, I'll do the rebrand and the link plumbing first, then drop the experience in as soon as the folder arrives.
