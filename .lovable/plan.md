## Per-project Hero Fit / Fill toggle

Add a control on each project in the CMS so you can choose whether the modal hero is **cropped to fill** (current) or **scaled to fit** (whole image visible).

### Changes

**Database**
- Migration: add `hero_fit text NOT NULL DEFAULT 'cover'` to `projects`.

**Backend**
- `supabase/functions/cms-save/index.ts` — accept `heroFit` / `hero_fit` in the upsert payload.

**Types & data layer**
- `src/data/projectsSeed.ts` — add `heroFit?: "cover" | "contain"` to `Project`.
- `src/hooks/useProjects.ts` — map `hero_fit` row → `heroFit`, default `"cover"`.

**CMS editor** (`src/components/admin/ProjectEditor.tsx`)
- Under the Hero MediaField, add a small two-button toggle:
  - **Fill (crop)** — fills the box, may crop edges.
  - **Fit (whole image)** — shows the full image, may letterbox.
- Tiny helper text explaining the trade-off.

**Front-end render** (`src/components/ProjectDeck.tsx`)
- Read `openProject.heroFit` (default `"cover"`) and pass through `dbToCard`.
- Image: switch `background-size` between `cover` and `contain`; add `background-repeat: no-repeat`.
- Video: switch `object-fit` between `cover` and `contain`.
- In `contain` mode, give the container a soft neutral tint so letterbox bars look intentional.

### Unchanged
- Default is `cover` so every existing project looks identical until toggled.
- Layout, marquee, modal structure, cover thumbnail — all untouched.

Approve to implement.