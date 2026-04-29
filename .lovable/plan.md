## What's actually going on

The "folders" you see on the Work page are rendered by **`src/components/ProjectDeck.tsx`** — a hardcoded array of **5 projects** (CABER AIQ Programme, AIQ ROI Platform, Ascenda Health, Pain Point Discovery, Wollip Signatures). That's the new content from your Claude/Cursor edits.

The **Backend → Projects** admin reads from a different source: the `projects` table in the database, which still holds the **old 8-project seed** (CJC Digital Construction Landing Page, AI Workflow Survey System, etc.). That's why the CMS looks dated — it literally is.

So there are two fixes:
1. Make the CMS reflect the folder content.
2. Swap the Work page CTA for the About-page style (Email me + LinkedIn).

---

## 1. Sync backend content to the folder projects

I'll align the database + admin to the 5 ProjectDeck projects so editing in the CMS actually updates what's on the Work page.

**Approach:** make `ProjectDeck` data-driven from the database (instead of hardcoded), and reseed the `projects` table with the 5 new entries. The CMS already edits this table, so it will "just work" after.

Steps:
- **Extend the `Project` type** (`src/data/projectsSeed.ts`) with the new fields ProjectDeck uses: `tagline`, `client`, `overview`, `stats` (array of `{value, label}`), `tags` (string[]), plus the visual fields `bgClass` and `mockType`. Existing fields (problem/process/outcome/honest/quotes/files) stay — they're still used by the case-study route and admin editor.
- **Replace `projectsSeed`** with the 5 ProjectDeck projects, mapped into the extended schema.
- **Migration** to add the new columns to `projects`: `tagline text`, `client text`, `overview text`, `stats jsonb default '[]'`, `tags jsonb default '[]'`, `bg_class text`, `mock_type text`.
- **Reseed the database**: delete the 8 old rows and insert the 5 new ones with all the new field values.
- **Update `useProjects.ts`** row mapper to read/write the new columns.
- **Update `cms-save` edge function** to persist the new columns.
- **Refactor `ProjectDeck.tsx`** to read its `PROJECTS` array from `useProjects()` instead of the hardcoded constant. Keep all the styles/animation untouched.
- **Update the admin `ProjectEditor`** to expose the new fields (tagline, client, overview, stats list, tags list) so you can edit them. Existing problem/process/outcome/honest fields stay for the deeper case-study page.
- **Update `WorkSection.tsx`** highlights so the four hero tiles reflect the new project realities (the current "4,743%", "147 hrs/wk", "100+", "$12M LOST" come from the old portfolio). I'll propose new defaults pulled from your new stats (e.g. "$12.7M inefficiency", "124 pain points", "40+ interviews", "v2 phased commercialisation") — you can edit them in the CMS after.

After this, the admin **Backend → Projects** list will show the 5 current folder projects, and edits will update the live folder cards immediately.

## 2. Replace the Work page CTA

Currently the Work page closes with `WorkClosingCTA` ("See full portfolio" + "Get in touch" → /about).

Replace it so it matches the About page contact card:
- Heading: "Let's talk."
- Sub: "farqmac@me.com · Sydney, Australia"
- Two buttons:
  - **Email me →** (`mailto:farqmac@me.com`, gradient indigo fill)
  - **LinkedIn** (`https://www.linkedin.com/in/farquharm/`, outline, opens new tab)

I'll rewrite `WorkClosingCTA.tsx` to mirror the About contact-card markup/styles. Keeps the glass card + entry animation, just swaps the content and actions. Honors the project rule that LinkedIn is the only social link.

---

## Files touched

- `src/data/projectsSeed.ts` — extended type + 5 new projects
- `src/components/ProjectDeck.tsx` — read from `useProjects()` instead of constant
- `src/hooks/useProjects.ts` — row mapper updated for new columns
- `src/components/admin/ProjectEditor.tsx` — new editable fields
- `src/components/admin/sections/WorkSection.tsx` — refreshed highlight defaults
- `src/components/work/WorkClosingCTA.tsx` — Email + LinkedIn CTA
- `supabase/functions/cms-save/index.ts` — persist new columns
- DB migration: add columns to `projects`
- DB data: delete old 8 rows, insert new 5 rows

## Out of scope

- Visual changes to the folder animation itself (you said it's right).
- Case-study route (`/work/:slug`) layout — it'll still work; the new fields just give it more to display, but I won't redesign it unless you ask.
