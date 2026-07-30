## 1. Replace the black to green gradients

The harsh gradients start at pure Ink `#0A0A0A`. They appear in:
- `src/data/projectsSeed.ts` (three project hero backgrounds: `#0A0A0A → #2B2B2B → sage`)
- `src/components/ProjectDeck.tsx` (`.pd-bg-4`, plus the dark mock treatments)

Swap the black end-stop for a softer, warmer deep-sage charcoal so the ramp reads as one family instead of black-to-green:

```
linear-gradient(135deg, #2A2F2B 0%, #3E463F 55%, #7A9B7E 100%)
```

Same treatment anywhere a `#0A0A0A` gradient stop sits next to sage. Solid Ink used for text and the teaser hero background stays as-is, since that is the brand colour and reads correctly.

Any project hero backgrounds saved in the database will also be checked and updated to the new ramp so the live site matches.

## 2. Headshot white background

The current headshot is a PNG in storage but still has a solid white shape behind the subject. I will download it, run a background removal to produce a true transparent PNG, re-upload it to the media bucket, and point the `headshot_url` setting at the new file. The About page already renders it over the off-white background, so it will sit cleanly once transparent.

If the cut-out edges come out rough (hair is the usual risk) I will report back rather than ship a bad mask.

## 3. Title change

Change "AI Operations PM" to "AI Innovation Lead" in:
- `src/pages/About.tsx` (Then / Now card)
- `src/components/admin/sections/AboutSection.tsx` (CMS fallback text)

The "AI Operations" skills group heading stays unless you want that renamed too.
