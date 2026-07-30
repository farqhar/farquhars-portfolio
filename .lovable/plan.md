The Drive link works and is publicly readable: `project.zip`, 291 MB. That is far too large to sit in the repo, so the work is mostly about sorting what belongs in the codebase from what belongs in storage.

## What the experience is currently missing

`public/measured-aesthetic/index.html` is already hosted and references these, none of which exist yet:

- `components/data.js` and `components/viz.js` — the dataset and visualisation code
- `assets/sat_positions.js` — satellite position data
- `assets/hw-04, hw-26, hw-30, hw-43, hw-44, hw-45, hw-46 .png` — the handwritten headings
- `assets/grids/grids-rule-of-thirds.png`, `grids-golden-ratio.png`, `grids-diagonal.png`, `grids-centre-axis.png`
- The photo library used by the gallery and grid overlays, whose paths come from inside `data.js`

## Approach

**1. Fetch and inventory.** Download the zip to a scratch folder outside the project, unpack it, and print a size-sorted tree. Nothing enters the repo at this stage. I'll confirm the zip contains no `.git` folder before touching anything.

**2. Split by size.** Two destinations:

- **Into the repo** (`public/measured-aesthetic/`): the JS files, the seven handwriting PNGs, and the four grid overlays. These are small and referenced by fixed relative paths.
- **Into your `site-media` storage bucket**: the photo library. These are the bulk of the 291 MB and have no business in the codebase. They get uploaded under a `measured-aesthetic/` prefix and served from the public bucket URL.

If the photo set turns out to be small (under roughly 20 MB total), I'll keep it in the repo instead and skip the bucket, since that's simpler.

**3. Rewire paths.** Read `components/data.js` to see how photo paths are constructed, then set the base path to the bucket URL in one place. The `GRID_BASE` and handwriting paths stay relative, since those files ship with the page. The gallery's `onerror` fallback to `outputs.original` gets pointed at the same base so a missing derivative still shows the source photo.

**4. Verify.** Load `/measured-aesthetic` in a headless browser, screenshot each section (Loading, Saturation, Grids, Rules, Gallery), and check the console for 404s. I'll iterate until there are no missing-asset errors and every section renders. You'll get the screenshots.

## Two things worth flagging

- If the zip contains a full working project rather than just the experience folder, I'll take only the files the hosted page references, not the whole tree.
- If any filenames differ from what the HTML expects (for example the grid overlays being named differently), I'll rename on the way in rather than editing the HTML, so the page stays as close to your original as possible.

### Technical notes

Files touched: new files under `public/measured-aesthetic/assets/` and `public/measured-aesthetic/components/`, plus a base-path edit in `index.html` or `data.js` if photos go to the bucket. Uploads use the existing public `site-media` bucket. No database schema, CMS, or React changes.
