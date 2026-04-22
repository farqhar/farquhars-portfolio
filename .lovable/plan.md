
# Quick wins + Split-view CMS shell (with full media editing everywhere)

Doing all four items, with the explicit guarantee that **every image and video on every page** is replaceable via the CMS — not just the headshot.

## 1. Headshot uploader wired into /admin
- Mount `HeadshotUploader` inside the new CMS shell under **Global → Identity**.
- `About.tsx` reads `headshot_url` from `site_settings` (fallback to placeholder).

## 2. "See full portfolio" → top of /work
- Add `useEffect(() => window.scrollTo(0,0), [])` to `Work.tsx`, `CaseStudy.tsx` (About already has it). Covers CTA, nav, direct URL.

## 3. "← Back to site" pill on /admin
- Fixed top-left glass pill on the CMS shell linking to `/`.

## 4. Split-view CMS shell at /admin

```text
┌─ 380px ─────────┬──────────────────────────┐
│ ← Back to site  │                          │
│ PAGES           │  <iframe> live preview   │
│  • Teaser       │  of selected page,       │
│  • About        │  reloads on save         │
│  • Work         │                          │
│  • Projects ▸   │                          │
│  • Global       │                          │
│ ─────────────── │                          │
│ Section fields  │                          │
│ [Save]          │                          │
└─────────────────┴──────────────────────────┘
```

### Editable surface — every page, every asset

A reusable `<MediaField>` (image OR video) is used everywhere an image/video appears today. Each field uploads to the `site-media` bucket under a path like `site-media/<page>/<key>/<file>` and stores the public URL in `site_content`.

**Teaser (`/`)**
- Hero: eyebrow, headline, subhead, CTA label + URL.
- Hero background media (image/video swap).
- Timeline carousel: each slide's heading, body, **image/video**.
- Project cells: each card's title, blurb, **cover image**, modal carousel **images/videos** (add / remove / reorder).
- CTA section: heading, body, button label + URL.

**About (`/about`)**
- Hero: eyebrow, headline, subhead, **headshot**.
- Then/Now: each cell's heading + body.
- "How I work": both purple section headings + bullet list (editable list).
- Testimonials: add / edit / remove quote, name, role, **avatar image**.
- Contact card: heading, body, button label + URL.

**Work (`/work`)**
- Hero: eyebrow, headline, subhead.
- Four highlight tiles: number + caveat (editable list).
- Filter chip labels.

**Projects (`/work/:slug`)** — full per-project editor (extends today's editor)
- All existing text fields.
- **Cover image**, **hero image** — upload via `<MediaField>` instead of URL paste.
- Gallery: add / remove / reorder **images and videos** with alt text.
- Quotes list.

**Global (applies site-wide)**
- Identity: name, tagline, headshot, LinkedIn URL, footer copy.
- Theme placeholder (colours/fonts panel — phase 5, stub UI now).

### How media upload works
- New `<MediaField kind="image|video|any" />` component:
  - Drag-drop / click-to-upload, preview, replace, clear.
  - Uploads via supabase-js to `site-media` bucket using admin session token.
  - Returns public URL → saved into the relevant `site_content` row.
  - Also writes a row into the `media` table for reuse later (media library, phase 6).
- Storage RLS: extend `site-media` policies to allow INSERT/UPDATE/DELETE only when the request includes the admin session token (validated via the `cms-save` edge function's pre-signed upload, OR via a dedicated `cms-upload` edge function that streams the file with the service role). I'll use the edge-function approach so no client ever holds elevated keys.

### How content is read on the public site
- New `useSiteContent(page)` hook → React Query, single fetch per page, returns `get(section, key, fallback)`.
- Every component that currently has hard-coded copy or image paths (`HeroSection`, `TimelineCarousel`, `ProjectCells`, `CTASection`, `About`, `Work` highlights, `CaseStudy` body) is refactored to read via this hook with the **current value as fallback** — so nothing visually changes until you edit something.

### Backend changes
- Extend `cms-save` edge function to accept `site_content` writes (page/section/key/value_json) in addition to `site_settings`.
- New `cms-upload` edge function: validates admin password, accepts multipart upload, writes to `site-media` bucket with service role, returns public URL + inserts `media` row.
- Storage policy on `site-media`: public SELECT only; INSERT/UPDATE/DELETE denied to anon (only the service role used by `cms-upload` can write).

## Files touched

```text
# Quick wins
src/pages/Work.tsx                                  (scroll-to-top)
src/pages/CaseStudy.tsx                             (scroll-to-top)
src/pages/About.tsx                                 (read headshot from settings)

# CMS shell
src/pages/Admin.tsx                                 (rebuilt as CMSShell mount)
src/components/admin/CMSShell.tsx                   (new — split layout + back pill)
src/components/admin/PreviewFrame.tsx               (new — iframe + reload bridge)
src/components/admin/PagePicker.tsx                 (new)

# Section editors
src/components/admin/sections/GlobalSection.tsx     (new — identity + headshot)
src/components/admin/sections/TeaserSection.tsx     (new — hero, timeline, cells, CTA)
src/components/admin/sections/AboutSection.tsx      (new — hero, then/now, how-i-work, testimonials)
src/components/admin/sections/WorkSection.tsx       (new — hero, highlights, filters)
src/components/admin/sections/ProjectsSection.tsx   (new — wraps existing project list/editor + media)

# Reusable fields
src/components/admin/fields/TextField.tsx           (new)
src/components/admin/fields/TextAreaField.tsx       (new)
src/components/admin/fields/ListField.tsx           (new — add/remove/reorder)
src/components/admin/fields/MediaField.tsx          (new — image/video upload)

# Public-site wiring
src/hooks/useSiteContent.ts                         (new)
src/components/HeroSection.tsx                      (read from site_content)
src/components/TimelineCarousel.tsx                 (read from site_content)
src/components/ProjectCells.tsx                     (read from site_content)
src/components/CTASection.tsx                       (read from site_content)

# Backend
supabase/functions/cms-save/index.ts                (extend: site_content writes)
supabase/functions/cms-upload/index.ts              (new — service-role media upload)
supabase migration                                  (storage policies on site-media)
```

After this lands: every image, video, headline, and bullet on every page is editable from `/admin` with a live preview, and uploads go through a secure server-side path.
