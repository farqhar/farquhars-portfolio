## 1. Put Measured Aesthetic first in the portfolio scroll

The Work page deck is ordered by the `order` value on each project. Measured Aesthetic is currently last (`order` 6), behind Pain Point Discovery (0) through Brand Touchpoint System (5).

Change: set Measured Aesthetic to the top and shift the rest down by one, keeping their relative sequence. This also fixes the existing duplicate `order = 4` (Animated Email Signatures and CV Generation Tool share it, so their order is currently arbitrary) by giving every project a distinct value.

Resulting order: Measured Aesthetic, Pain Point Discovery, AIQ ROI Platform, CJC Digital Construction Page, Animated Email Signatures, CV Generation Tool, Brand Touchpoint System.

## 2. Fix the wrong images in the live experience

Confirmed cause: the asset manifest at `public/measured-aesthetic/components/assets-manifest.js` only has real per-image files for two of the five variants.

- `originals` — 100 real files
- `dotGrids` — 100 real files
- `compDiagrams`, `gridOverlays`, `colourGrids` — a single sample file each, and `data.js` falls back to the original whenever a lookup misses

So every composition, grid and saturation view shows the original photograph. The section-to-variant wiring in `index.html` and `viz.js` is already correct; it is only the files that are missing.

Fix:

1. Download the three missing variant sets from the shared Drive folder (`03_comp_diagrams`, `04_grid_overlays`, `06_colour_grids` — 100 files each; `01_originals` and `02_dot_grids` are already in place).
2. Match each file to its film-scan ID (e.g. `000014840003`, `IMG_2528`) so it lines up with the `fn` field in `data.js`.
3. Optimise them the same way the existing sets were handled (resize and quantise the PNGs) so the repo does not balloon — the images folder is 29 MB today and 300 unoptimised PNGs would be far larger.
4. Save them into `public/measured-aesthetic/images/comp-diagrams/`, `grid-overlays/` and `colour-grids/`, and regenerate the manifest with all five variant maps fully populated.
5. Remove the three leftover placeholder files in `images/outputs/`.

## 3. Verify

Open the experience and step through each section — dot grid, composition/centre of gravity, grid overlays, saturation, and the gallery lightbox that shows all five variants of one image — checking that a different, correct render appears in each and that there are no 404s.

## Note

The Drive folder also has `05_data_txts`. The experience has an unused `dataJson` slot for it, but nothing currently displays raw data files, so I will leave it out unless you want a "view the data record" option added.
