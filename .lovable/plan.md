
# Polish v3 + Visual CMS

Two parts: (A) finalise the v3 polish with your tweaks, (B) build a true split-view visual CMS that controls the whole site.

---

## A. Polish v3 — adjusted

### A1. Admin link placement (consistent across site)
- The teaser already has the **"See full portfolio →"** floating CTA bottom-right, so a bottom-right admin link would collide.
- **New approach**: put the Admin link **bottom-left, fixed, tiny + muted** on every page (teaser, work, about, case study). Same component, same position site-wide. No clash with the floating CTA.
- Implementation: rename `HomeAdminLink.tsx` → `AdminLink.tsx`, mount globally in `App.tsx` (hidden only on `/admin`). Remove the duplicate Admin link from `SiteFooter`.

### A2. All other v3 items proceed as approved
- Case study back button (`← All work`, top-left glass pill) + TL;DR bar no truncation.
- Honest highlight numbers with italic caveats.
- Bento grid hand-tuned `gridTemplateAreas`, big background numbers 01–08, hover-reveal metric panel, **count-up removed**.
- About page: scroll-to-top, 3-column Then/Connector/Now (fixes line overlap), circular headshot placeholder, purple `DISCOVER & DESIGN` / `RAPID ITERATION` hierarchy, testimonials section.

---

## B. Visual CMS — split-view, whole-site content control

A new admin experience at `/admin` that looks like this:

```text
┌───────────────┬──────────────────────────────────────┐
│  CMS PANEL    │                                      │
│  (left, 380px)│        LIVE SITE PREVIEW             │
│               │        (iframe, right)               │
│  Page picker  │                                      │
│  ┌─────────┐  │   - Renders /, /work, /work/:slug,   │
│  │ Teaser  │  │     /about exactly as published      │
│  │ Work    │  │   - Updates instantly as you edit    │
│  │ About   │  │   - Click any text/image in preview  │
│  │ Project │  │     to jump to its field on the left │
│  └─────────┘  │                                      │
│               │                                      │
│  Section ed.  │                                      │
│  - text       │                                      │
│  - image/vid  │                                      │
│  - colour     │                                      │
│  - font       │                                      │
│               │                                      │
│  [Save] [↺]   │                                      │
└───────────────┴──────────────────────────────────────┘
```

### B1. What's editable

**Per page** (Teaser, Work, About, each Project):
- All headlines, sub-copy, body text, button labels, link URLs.
- Images and videos (upload, replace, reorder, alt text).
- Per-page accent colour + per-page heading font (overrides global).

**Global theme** (applies site-wide):
- Brand colours: primary, accent, background, text, muted (colour-picker UI).
- Fonts: heading font, body font (curated Google Fonts list + "custom upload").
- Heading styles: H1/H2/H3 size + weight + tracking.
- Logo / wordmark text.

**Media library**:
- Upload images + videos (mp4, webm) to a **storage bucket**.
- Reuse uploaded media across any page.
- Auto-generate responsive sizes for images.

### B2. How it works (technical)

**Backend (Lovable Cloud)**:
- New tables (all behind admin-only RLS using the runtime password check via a session token):
  - `site_content` — `{ page, section, key, value_json }`. Stores all text, links, image refs per page/section.
  - `theme` — single-row `{ colors_json, fonts_json, headings_json }` for global tokens.
  - `media` — `{ id, kind, url, alt, width, height }`.
  - `projects` already covered by existing flow; merged into the new editor UI.
- New **storage bucket** `site-media` (public read, admin write) for image/video uploads.
- Edge functions: extend `verify-admin` to mint a short-lived session token; new `cms-save` function validates token + writes content.

**Frontend**:
- Public site reads content from a single `useSiteContent()` hook (cached via React Query) — falls back to current hard-coded copy if a key is missing, so nothing breaks on day one.
- Theme tokens injected as CSS variables on `<html>` so colour/font changes are global and instant.
- Existing components (`HeroSection`, `ProjectCells`, `About`, etc.) refactored to read from the content map instead of inline strings — done incrementally, page by page.

**Admin split-view**:
- New `/admin` shell: left panel (CMS form) + right panel (`<iframe src="/?preview=token">`).
- Left panel uses **schema-driven forms** per page (one schema entry per editable field) so adding new editable fields later is one-line.
- Right preview communicates via `postMessage`: 
  - Site → CMS: "user clicked field X" (deep-link to that form field).
  - CMS → Site: "draft updated, re-render" (live preview without save).
- Save button persists draft → publishes to `site_content`. Undo restores previous version (last 10 kept).

### B3. Rollout order
1. Schema + storage bucket + RLS + auth token.
2. Split-view shell with iframe + page picker.
3. Wire **Teaser** page first (proof of concept end-to-end).
4. Wire About, Work hero, Projects, Case Study sections.
5. Theme controls (colours, fonts, headings).
6. Media library + click-to-edit overlay in preview.

You'll be able to ship after step 3 and iterate.

---

## Files touched

```text
# Polish v3
src/components/AdminLink.tsx                  (new — global bottom-left)
src/components/site/SiteFooter.tsx            (remove admin link)
src/App.tsx                                   (mount AdminLink globally)
src/pages/Work.tsx                            (highlights + bento + remove count-up)
src/hooks/useCountUp.ts                       (delete)
src/pages/CaseStudy.tsx                       (back button + TL;DR fix)
src/pages/About.tsx                           (scroll-top, 3-col fix, headshot, purple hierarchy, testimonials)
src/assets/headshot-placeholder.jpg           (new)

# CMS — phase 1 (schema + shell + Teaser wired)
supabase migrations                           (site_content, theme, media tables + RLS)
storage bucket                                 site-media (public read)
supabase/functions/verify-admin/index.ts      (extend: issue session token)
supabase/functions/cms-save/index.ts          (new — token-gated writes)
src/hooks/useSiteContent.ts                   (new — cached content reader)
src/lib/theme.ts                              (new — inject CSS vars from theme row)
src/pages/Admin.tsx                           (rebuilt as split-view shell)
src/components/admin/CMSPanel.tsx             (new — left form panel + page picker)
src/components/admin/PreviewFrame.tsx         (new — right iframe + postMessage bridge)
src/components/admin/fields/*                 (new — Text, RichText, Image, Video, Color, Font, Number)
src/components/admin/MediaLibrary.tsx         (new — upload + browse)
src/components/HeroSection.tsx                (read from useSiteContent, fallback to current copy)
```

Phases 2–6 (About, Projects, theme controls, click-to-edit overlay) follow in subsequent passes once phase 1 is live.
