## Plan: Assessment 3 Process Journal PPTX — "Beyond the Teaser"

I parsed your A2 deck and locked the visual style. This A3 journal will match it exactly and — per your note — include explicit **layout iteration / wireframe** slides in the same V1 / V2 / V3 (Final) format you used for the timeline in A2 (pages 24–26).

---

### Style system (locked to A2)

- **Background**: white `FFFFFF`.
- **Type**: Helvetica/Arial as cross-platform stand-in for the system-ui face in A2.
  - Cover title 88pt · section dividers 64pt · slide titles 36pt · eyebrow 11pt tracked uppercase gray `888888` · body 14pt `1F2937` · captions 12pt `6B7280`.
- **Accent**: indigo `6366F1`, used sparingly (one keyline, one dot, one quote pull).
- **Margins**: 0.6" all sides, left-aligned, no centred bullets, no underline rules under titles.
- **Wireframes**: drawn as flat vector boxes inside the slide using `pptxgenjs` shapes — light gray fills `F3F4F6`, 1pt outlines `D1D5DB`, labels in 12pt — same dry, schematic look as A2's V1/V2/V3 diagrams.

---

### Deck structure (~28 slides)

1. **Cover** — "Beyond the Teaser" / CDM303A · Assessment 3 / Farquhar MacDougall
2. **Contents** — 7 chapters (Where A2 Ended · Architecture · Project Deck · CMS & Backend · Layout Iterations · Iteration Log · Reflection)
3. **Where A2 Ended** — recap of teaser, hero, timeline, project cells, CTA
4. **What changed in scope** — single-page teaser → live multi-route portfolio with backend
5. **Chapter divider — Architecture**
6. **From single page to multi-route site** — Index / Work / About / CaseStudy
7. **Sticky nav + page transitions** — `SiteNav`, `PageTransition`, `Reveal`
8. **Floating Contact CTA** — persistent across every non-teaser route, mailto, glass rationale, why it had to survive inside project modals
9. **Chapter divider — Project Deck**
10. **Folder cards → modal carousel** — `ProjectDeck.tsx`, glass cards, centred non-scrolling modal
11. **Hero modes: Fill / Fit / Auto-size** — three modes, problem each solves
12. **Marquee gallery + lightbox** — continuous scroll row, click-to-lightbox
13. **Carousel sizing controls** — project default 25–100% slider + per-image override (the email-signature fix)
14. **Chapter divider — CMS & Backend**
15. **Why a CMS** — content needs to evolve without redeploys
16. **CMS shell** — sections (Global, Theme, Teaser, Work, Projects, About), dirty-batch save, preview frame
17. **Field system** — Text / Number / Color / Font / Media / List / SubProjects
18. **Lovable Cloud backend** — `projects`, `site_content`, theme tables, RLS, edge functions (`cms-save`, `cms-upload`, `verify-admin`)

---

### Chapter — **Layout Iterations** (new, per your request)

Same V1 / V2 / V3 (Final) treatment as A2 pages 24–26, applied to the three biggest layouts built since A2. Each gets a wireframe diagram drawn in shapes + a short rationale paragraph.

19. **Chapter divider — Layout Iterations**

20. **Project Deck — V1** *Flat folder grid · single hero image, no carousel*
    - Wireframe: 3 stacked cards, hero block, single image area.
    - Rationale: read like a normal grid; no progressive disclosure; hero swallowed tall images.

21. **Project Deck — V2** *Modal carousel + fixed 4:5 hero frame*
    - Wireframe: card → modal with hero on top, marquee row beneath, lightbox overlay icon.
    - Rationale: introduced the click-to-expand pattern; still letterboxed odd-shaped images with a coloured frame.

22. **Project Deck — V3 (Final)** *Hero Fill/Fit/Auto-size + per-image carousel sizing*
    - Wireframe: hero with toggle indicator, marquee row showing items at varying widths (one tall/skinny "email signature" item rendered narrow), lightbox.
    - Rationale: project-level default + per-image override removed the blow-up problem; auto-size kills the coloured bars when chosen.

23. **CMS Shell — V1** *Single long form · everything on one page*
    - Wireframe: vertical stack of every field; save button at bottom.
    - Rationale: unscannable; one accidental change risked saving everything; no preview.

24. **CMS Shell — V2** *Sectioned tabs + immediate save per field*
    - Wireframe: left-rail section list, right-pane fields, per-field save buttons.
    - Rationale: solved navigation but writes thrashed the backend and broke undo.

25. **CMS Shell — V3 (Final)** *Sections + dirty-batch save + live preview frame*
    - Wireframe: left rail, centre fields with dirty dots, right preview iframe, sticky SaveBar with diff count.
    - Rationale: edits feel safe (review-then-commit), preview confirms intent, edge function writes once.

26. **Floating CTA — V1 / V2 / V3** *(single slide, three side-by-side wireframes)*
    - V1: CTA only on home → invisible mid-journey.
    - V2: present on routes but hidden by project modal stacking context.
    - V3 (Final): `z-[300]` glass pill, rendered above modals, persistent on every non-teaser route.

---

27. **Iteration Log** — A2-style HTML table (Change · Reasoning · Type) covering: hero auto-fit, carousel per-image sizing, floating CTA z-index fix, edge function batch writes, RLS hardening on `projects`.
28. **Reflection — What this build proves** — designing the editing surface alongside the public surface; AI-assisted dev as continuous practice; the system, not just the artefact.

---

### Generation & QA

1. Write `/tmp/build_journal.js` using `pptxgenjs`. Wireframes built with `slide.addShape(pptx.ShapeType.rect, {...})` and labelled with small text boxes.
2. Render to `/mnt/documents/CDM303A_FMacDougall_A3_Process.pptx`.
3. Convert to PDF via LibreOffice → `pdftoppm` JPGs.
4. Visually inspect every slide for overflow, contrast, alignment, accidental accent lines, leftover placeholder copy, and that wireframes match the rationale text.
5. Re-render until clean. Report QA findings in the final reply.

Output artifact: `CDM303A_FMacDougall_A3_Process.pptx`.

Approve to build.
