## Rename "Analogue to Algorithm" to "Measured Aesthetic"

They are the same project, so every user-facing instance of the old name gets replaced. The live Work portfolio already carries the correct name in the database ("Measured Aesthetic"); the stale name only survives in code.

### Visible text changes

- `src/components/ProjectCells.tsx` — the teaser landing-page card: title becomes "Measured Aesthetic".
- `src/data/projectsSeed.ts` — fallback project entry: title becomes "Measured Aesthetic", and the two body paragraphs that lean on the old phrasing ("apply algorithmic logic to analogue material") get reworded to describe the same idea without the old project name.
- `src/components/TimelineCarousel.tsx` — the 2026 timeline entry: "Analogue to Algorithm — 280 film photographs..." becomes "Measured Aesthetic — 280 film photographs...".
- `src/components/admin/sections/TeaserSection.tsx` — the CMS field label "Analogue cover" becomes "Measured Aesthetic cover".

### Behind the scenes, unchanged on purpose

- The teaser cell slug `analogue-to-algorithm` and the CMS storage key `analogue_cover` stay as they are. They are internal identifiers, not shown anywhere, and renaming the key would orphan the cover image you have already uploaded.
- Image filenames (`analogue-contact.jpg`, `analogue-pipeline.jpg`) stay. Renaming them changes nothing visible and risks breaking imports.
- The seed project's slug stays too, since the live Work page reads from the database where the project is already `measured-aesthetic`.

### Also

Update the stored project memory so future work refers to it as "Measured Aesthetic" rather than "Analogue to Algorithm".

If you would rather I also rename the underlying slugs and asset files for tidiness, say so and I will include that; it just means re-uploading the teaser cover in the CMS.
