## Add an optional second hero image to project detail view

Currently each project has a single `hero` shown at the top-right of the detail view, with options for `heroFit` (cover/contain) and `heroAutoSize` (frame conforms to image aspect). I'll add an optional **second hero** that renders directly underneath the first using the exact same rendering logic — and renders nothing (no placeholder/shading) when not set.

### Data model changes (`src/data/projectsSeed.ts`)
Add three new optional fields to the project type, mirroring the existing hero fields:
- `hero2?: string` — image or video URL (omit to hide entirely)
- `hero2Fit?: "cover" | "contain"` — defaults to same behavior as `heroFit`
- `hero2AutoSize?: boolean` — defaults to `false`

No background field for hero2: when `hero2` is empty, nothing renders (no frame, no shading, no spacing).

### Component changes (`src/components/ProjectDeck.tsx`)
1. Add the three fields to the internal `Project` type and `normalizeProject()` (with the same defaulting logic used for hero1).
2. Extract the current hero render block (lines ~612-674) into a small inline helper `renderHero(src, fit, auto, background)` so both heroes use identical sizing/fit/auto-size logic, including:
   - Auto-size mode (frame matches natural aspect ratio)
   - Fixed-frame mode with cover/contain
   - Video vs image handling
   - Same border-radius and shadow
3. In `pd-detail-right`, render hero1 then conditionally render hero2 only when `hasImage(openProject.hero2)` is true.
4. Add a small vertical gap (e.g. `marginTop: 24px`) between the two heroes — applied only when hero2 is present, so single-hero layouts are unchanged.

### Result
- Projects with only `hero` set: unchanged.
- Projects with both `hero` and `hero2` set: second image stacks directly below the first, with the same resizing/fit/auto-size capability available independently.
- Projects with `hero2` omitted: no extra space, no shaded placeholder.

### Files to edit
- `src/data/projectsSeed.ts` (add optional fields to type)
- `src/components/ProjectDeck.tsx` (extend Project type, normalizer, and render block)
