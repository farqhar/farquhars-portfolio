

# Extend teaser into full portfolio site

Build out `/work`, `/work/:slug`, `/about`, and `/admin` while leaving the homepage (`/`) untouched. Reuse existing visual language: glass cards, indigo gradients, framer-motion entrance animations, sticky nav style, particle/orb backgrounds.

## Routes added to `App.tsx`

- `/` — existing `Index` (unchanged)
- `/work` — portfolio grid
- `/work/:slug` — case study
- `/about` — about page
- `/admin` — password-gated admin
- `*` — `NotFound`

Wrap routes with an `AnimatePresence` page-transition layer (crossfade + 12px y-shift) so navigation feels continuous.

## Shared building blocks (new)

- `src/data/projectsSeed.ts` — 8 seed projects with slug, title, role, cover, hero, problem, process, outcome metric + narrative, quotes, honest-moment, order
- `src/hooks/useProjects.ts` — reads/writes from `localStorage` key `fm_projects_v1`, falls back to seed; exposes `projects`, `getBySlug`, `save`, `add`, `reorder`
- `src/components/site/SiteNav.tsx` — minimal nav (name/logo · Work · About) shown on every route except `/`. Mobile hamburger using existing Sheet component
- `src/components/site/PageTransition.tsx` — wraps each non-home route in fade/slide motion
- `src/components/site/Reveal.tsx` — `useInView` fade-up wrapper with stagger prop (matches existing `ProjectCard` pattern)

## Page details

### `/work`
- Hero strip: small kicker "Here's what I actually built", then a single personal intro line in italic muted tone ("Eight projects. Each one cost something to make.")
- Grid: 8 cards, 1/2/3 cols responsive
- Each card leads with **outcome metric** in large gradient-text-indigo type, then project title, then role descriptor underneath
- Reuses glass card + corner brackets + hover lift from `ProjectCells`
- Staggered fade-up on scroll (delay = `index * 0.08`)

### `/work/:slug`
Layout sections, each wrapped in `Reveal`:
1. Full-width hero image with subtle parallax (`useScroll` + `useTransform` y -40 → 40)
2. Title + role descriptor
3. 3-column glass summary bar: **Role · Timeline · Outcome**
4. **The Problem** — short paragraph, generous leading
5. **The Process** — vertical step list with image placeholders + captions
6. **An honest moment** — italic blockquote, slightly looser, indigo left-border
7. **The Outcome** — huge gradient-text metric, narrative below
8. **Recognition** — pull-quote blockquotes
9. **Next project →** button (computes next slug from order, wraps to first)

Page-to-page navigation uses directional slide transition.

### `/about`
- Lead positioning statement (large gradient text): "I bridge design thinking and AI operations."
- Personal statement paragraph (placeholder)
- **How I work** — 4 honest, specific statements in a 2x2 glass grid
- Skills section — chips grouped by category
- Career timeline — reuses visual language of existing `TimelineCarousel` cards but in a vertical stacked list (no scroll-jacking)
- Contact — email + LinkedIn buttons matching `CTASection` style

### `/admin`
- Plain white background, system fonts, tailwind defaults — no glass, no gradients
- Login screen: single password input, compares against `import.meta.env.VITE_ADMIN_PASSWORD`. On success, store `fm_admin_session=true` in `sessionStorage`
- Dashboard: list of 8 projects with drag handles (use `@hello-pangea/dnd` if available, else simple up/down buttons to avoid new deps), "Add project" button, click row to edit
- Edit form: text inputs for title, role descriptor, cover URL, hero URL, problem, process, outcome text, outcome metric, quotes (one per line). Save writes to `localStorage` via `useProjects`
- Logout button clears session

## Existing file edits

- `src/App.tsx` — add routes + `AnimatePresence`
- `src/pages/Index.tsx` — unchanged
- `src/components/StickyNav.tsx` — change `href="#"` → `<Link to="/work">`
- `src/components/FloatingCTA.tsx` — same swap to `/work`
- `src/components/CTASection.tsx` — "See full portfolio" → `/work`
- `src/components/ProjectCells.tsx` — modal "View full project →" links to `/work/{slug}` for matching seed entries (boondi, chippy, analogue-to-algorithm)

## Seed data

8 projects, each with placeholder copy + grey image placeholders (data URI 1px grey or `/placeholder.svg`):
1. cjc-digital-construction-landing-page
2. ai-workflow-survey-system
3. cjc-air-and-ports-motion-video
4. brand-touchpoint-audit-ownership-framework
5. animated-email-signature-suite-case-happy-holidays
6. aiq-control-centre-internal-comms-automation
7. wollip-email-signature-saas
8. cv-generation-tool-engineering-tender-automation

Each gets a placeholder outcome metric (e.g. "4,743% engagement"), a "Creative Direction · Stakeholder Management"-style role descriptor, lorem-style problem/process/outcome paragraphs, 1–2 placeholder quotes, and an "honest moment" italic note — all editable via `/admin`.

## Admin password setup

After approval I'll request you add a `VITE_ADMIN_PASSWORD` runtime secret (also exposed at build time via Vite's `import.meta.env`). Until set, login will fail closed.

## Animation principles applied

- Every section uses `Reveal` (intersection-observer fade-up, 24px, 0.5s)
- Lists/grids use stagger via `index * 0.08–0.15` delay
- Page transitions: 0.35s crossfade + 12px y for non-home routes
- Hero parallax via `useScroll` on case study pages
- Hover: existing `-translate-y-1` + glow shadow pattern reused
- No new cursor — none exists today

## Files created

```text
src/App.tsx                                  (edit)
src/data/projectsSeed.ts                     (new)
src/hooks/useProjects.ts                     (new)
src/components/site/SiteNav.tsx              (new)
src/components/site/PageTransition.tsx       (new)
src/components/site/Reveal.tsx               (new)
src/pages/Work.tsx                           (new)
src/pages/CaseStudy.tsx                      (new)
src/pages/About.tsx                          (new)
src/pages/Admin.tsx                          (new)
src/components/admin/AdminLogin.tsx          (new)
src/components/admin/ProjectList.tsx         (new)
src/components/admin/ProjectEditor.tsx       (new)
src/components/StickyNav.tsx                 (edit — link)
src/components/FloatingCTA.tsx               (edit — link)
src/components/CTASection.tsx                (edit — link)
src/components/ProjectCells.tsx              (edit — modal CTA → slug)
```

No changes to homepage components' visuals, animations, or copy beyond the single CTA `href` swap.

