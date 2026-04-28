# Project image uploads + "Untitled Folder" Work grid

Two changes, both centred on the Projects feature. **Hero on `/work` is preserved exactly as-is** (eyebrow, headline, subhead, and the 4 highlight tiles). The folder grid replaces only the bento grid that sits below the hero.

## 1. Real image uploads for each project

Today the admin's `ProjectEditor` only accepts URL strings for cover/hero images, and projects live in `localStorage` (`useProjects`) — so even a working uploader wouldn't sync between devices. We fix both:

- **Move projects into the database.** New `projects` table mirroring the `Project` type, plus a `files` jsonb column for sub-folder galleries (see §2).
- **Seed existing 8 projects** from `projectsSeed.ts` in the migration.
- **Rewrite `useProjects`** to read from Supabase (with realtime sync) and write through the `cms-save` edge function.
- **Replace URL inputs in `ProjectEditor`** with the existing `MediaField` component — already wired to `cms-upload` and the `site-media` bucket. Files land in `site-media/projects/{slug}/...`.

Result: click "Upload", file goes to storage, URL persists, "Saved ✓" toast — same UX as the rest of the CMS.

## 2. "Untitled Folder" style grid (below the existing hero)

Replicating the Velvele reference: stacked manila-folder cards that scroll-rise, lift on hover, and expand to reveal sub-files inside.

### Public — `/work`

- **Hero stays untouched** — eyebrow, "I turn messy workflows / into shipped systems.", subhead, and the 4 highlight tiles remain at the top.
- Below the hero (and the existing filter pills + grid/list toggle), the bento `WorkCard` grid is **replaced** with a folder grid.
- **FolderCard** = tabbed shape: a coloured tab strip on top showing project number + short title, body holds the cover image and metric. Indigo/blue palette (no skeuomorphic beige) — keeps the Apple-minimal aesthetic.
- **Scroll-in**: each folder rises and fades in on viewport entry, staggered ~70ms (Framer Motion `whileInView`).
- **Hover**: folder lifts (`y: -8`), tab darkens, shadow grows, cover scales 1.04. Other folders dim slightly (existing pattern).
- **Click**: folder expands in place into a row of "file" sub-cards (image + caption). Clicking a file opens the case study (or a custom link). Clicking the tab again collapses it. Uses `layout` + `AnimatePresence` so the grid reflows smoothly.
- Existing `featuredSlugs` keep their wider bento spans.

### Admin — `/admin → Projects`

`ProjectEditor` gains a **Sub-projects (files in this folder)** section:
- Add / remove / reorder rows
- Each row: title, caption, image (via `MediaField`), optional link
- Stored as a `jsonb` array on the project row

## Technical details

**Migration**

```sql
create table public.projects (
  slug text primary key,
  title text not null,
  role text not null default '',
  timeline text not null default '',
  outcome_metric text not null default '',
  cover text not null default '/placeholder.svg',
  hero text not null default '/placeholder.svg',
  problem text not null default '',
  process text not null default '',
  outcome text not null default '',
  honest text not null default '',
  quotes jsonb not null default '[]'::jsonb,
  files jsonb not null default '[]'::jsonb, -- [{title, caption, image, href}]
  "order" int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "public read projects" on public.projects for select using (true);
-- writes go through cms-save (service role); no insert/update policy needed
-- seed: insert all 8 rows from projectsSeed
```

**Edge function**

Extend `cms-save` to accept `kind: "project"` with `{ slug, fields }` → upsert into `public.projects`. Auth check unchanged (`x-admin-password`).

**Frontend**

- `src/hooks/useProjects.ts` — Supabase-backed (load + realtime; writes via edge function).
- `src/data/projectsSeed.ts` — extend `Project` type with `files`; keep as fallback.
- `src/components/admin/ProjectEditor.tsx` — `MediaField` for cover/hero + new sub-projects editor.
- `src/pages/Work.tsx` — keep hero + controls; replace `WorkCard` with new `FolderCard` (tab + body + expand-on-click).

## Files touched

```
NEW  supabase/migrations/<ts>_projects_table.sql
NEW  src/components/admin/fields/SubProjectsField.tsx
NEW  src/components/work/FolderCard.tsx
EDIT supabase/functions/cms-save/index.ts        (handle kind:"project")
EDIT src/hooks/useProjects.ts                    (Supabase-backed)
EDIT src/data/projectsSeed.ts                    (add `files` to type)
EDIT src/components/admin/ProjectEditor.tsx      (MediaField + sub-projects)
EDIT src/pages/Work.tsx                          (swap grid only; hero preserved)
```

After this lands: hero stays exactly as it is today, the folder grid sits beneath it (scroll-rise, hover-lift, click-to-expand into sub-files), and every project supports real image uploads stored in Lovable Cloud.
