## 1. Gradient text legibility

Right now one gradient (`gradient-text-indigo`) runs Ink → Sage and is used on both light and dark surfaces, so on the dark landing hero the first half of the headline is near-black on near-black.

Two variants instead of one:

- **On light backgrounds** (Work, About, project cards, case study): dark sage `#4E6B52` → brand sage `#7A9B7E`. Green-to-green, no black, still passes contrast on the off-white page.
- **On the dark landing hero**: white `#FFFFFF` → brand sage `#7A9B7E`, so the line starts legible and resolves into the accent.

The solid-fill button gradient (`gradient-indigo`, used on CTAs) gets the same dark-sage → sage treatment so buttons stay readable with white text.

`gradient-text-purple` is a leftover alias, it gets pointed at the same light-background pair.

## 2. Remove remaining purple / blue tints

These are hardcoded blue-violet RGBA values that survived the rebrand, mostly sitting on top of imagery in the project modal:

- `src/components/ProjectDeck.tsx`: the ambient glow behind the modal, the five `pd-bg-*` project backdrops, and the `pd-mock-*` overlays that wash across mock imagery. All swapped to neutral ink or a very low-opacity sage.
- `src/components/TimelineCarousel.tsx`: a violet `#a855f7` progress bar and two violet ambient orbs.
- The `--blue` / `--purple` legacy tokens stay pointed at ink/sage so nothing else can reintroduce a violet cast.

Net effect: no colour cast over any uploaded image or video. Backdrops become neutral paper or ink, with sage used only as a faint accent.

## 3. On the asset zip

Uploading through this chat has a 20 MB / 10 file limit, so a large zip won't go through, and files produced inside Claude can't be transferred across to this project directly. Three options that do work, easiest first:

- **Drop the assets in your own site storage.** You already have a public `site-media` bucket. Upload the images there through the CMS media uploader, and I'll point the Measured Aesthetic page at those URLs.
- **Any public link** (Google Drive, Dropbox, WeTransfer, GitHub repo) pasted into chat. I can fetch and unpack it.
- **Batches through this chat.** Under 10 files and 20 MB per message, as many messages as it takes.

This is independent of the colour work above, so it doesn't block anything.

### Technical notes

Files touched: `src/index.css` (gradient utilities, plus a new light-on-dark variant), `src/components/HeroSection.tsx` (hero headline and its divider rule use the new dark-surface variant), `src/components/ProjectDeck.tsx`, `src/components/TimelineCarousel.tsx`. No database, CMS, or data-model changes.
