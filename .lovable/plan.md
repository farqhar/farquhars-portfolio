## What's actually wrong

No images are missing. All five sets are present and serving correctly (100 originals, 100 dot grids, 100 comp diagrams, 100 grid overlays, 100 colour grids), on both the preview and the published site.

The bug is the URL. The experience loads its files with **relative** paths (`assets/…`, `components/…`, `images/…`).

- `…/measured-aesthetic/index.html` → paths resolve correctly, 107/107 images load, zero 404s.
- `…/measured-aesthetic` (no trailing slash) → the browser treats `measured-aesthetic` as a *file*, so relative paths resolve against the site root: `/assets/hw-30.png`, `/components/data.js`, `/images/originals/…` — all 404. Result is a blank white page with only the CSS outlines and text, exactly what you described.

Confirmed by loading both URLs: the first returns no failed requests, the second returns 404s for every script, handwriting PNG and photograph.

## The fix

1. **Add `<base href="/measured-aesthetic/">` to `public/measured-aesthetic/index.html`.** One line in the `<head>` makes every relative path resolve correctly no matter which form of the URL is opened — with or without the trailing slash. This is the whole fix for the shared-link problem.

2. **Point the in-site link at the canonical URL.** Set the project's `experience_url` to `/measured-aesthetic/` (with trailing slash) so the "View the live experience" button on the Measured Aesthetic card never produces the broken form.

3. **Check the in-page anchors still work** after adding the base tag — the right-hand section nav uses `#s-arrival`-style hashes, and a `<base>` tag makes bare `#hash` links resolve against the base URL. If any break, switch those hrefs to explicit JS scroll or full paths.

## Verify

Load all three forms in a browser and confirm zero failed requests and images rendering on each:

- `/measured-aesthetic`
- `/measured-aesthetic/`
- `/measured-aesthetic/index.html`

Then step through arrival, loading radial, centre of gravity, grids and the gallery lightbox to confirm the handwriting titles, photographs and analysis renders all appear.

## Note

This needs a republish to take effect on `farquhars-portfolio.lovable.app` — it's a frontend change.
