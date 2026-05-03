## Goal

Make uploaded PDFs first-class gallery items in the project carousel:
- Show a real PDF preview tile in the marquee (not a broken `<img>`).
- Open it in the existing lightbox and let the user **scroll/page through every PDF page**.

## Why it's broken now

`ProjectDeck.tsx` only knows two media types: image and video (`isVideoUrl`). Any PDF URL falls into the `<img>` branch, so the browser tries to load a `.pdf` as an image and renders nothing.

## Approach

Use `react-pdf` (which wraps `pdfjs-dist`) — the standard, well-maintained way to render PDFs in React. Lightweight, no server needed.

### 1. Detect PDFs
Add a helper next to `isVideoUrl`:
```ts
const isPdfUrl = (url: string) => /\.pdf(\?|$)/i.test(url);
```

### 2. Marquee tile (thumbnail)
When the gallery item is a PDF, render `<Document><Page pageNumber={1} /></Document>` sized to the existing `--item-h` slot. Same size-slider behaviour as images/videos — no schema or CMS change needed.

### 3. Lightbox (paged viewer)
When a PDF is opened in the lightbox, replace the single `<img>`/`<video>` with a paged PDF viewer:

```text
┌──────────────────────────────────┐
│  [‹ prev page]  Page 3 / 12  [next page ›]  │
│                                  │
│        ┌────────────────┐        │
│        │   PDF page 3   │        │
│        │   (rendered)   │        │
│        └────────────────┘        │
└──────────────────────────────────┘
```

- Internal page state: `pdfPage`, total via `onLoadSuccess`.
- Reuses the existing lightbox chrome; the existing left/right arrows still move between **gallery items**.
- New small in-lightbox controls (or just mouse-wheel / arrow keys when a PDF is open) move between **pages of the current PDF**.
- Resets `pdfPage` to 1 when switching gallery items.

### 4. Worker setup
`react-pdf` needs the pdf.js worker. Configure once at module top:
```ts
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
```

This works out-of-the-box with Vite (no public-folder copy needed).

### 5. Storage / CORS
PDFs already upload to the public `site-media` bucket and are served from the Supabase CDN, which sends permissive CORS — pdf.js will fetch them fine. No backend change required.

## Files to edit

- `src/components/ProjectDeck.tsx` — add `isPdfUrl`, PDF branch in marquee item, paged PDF viewer in lightbox, page-state reset on item switch.
- `package.json` — add `react-pdf` (brings in `pdfjs-dist`).

No DB / edge-function / CMS changes.

## Out of scope

- Multi-page **inline** scrolling inside the small marquee tile (only first page shown as preview — full doc is in the lightbox).
- PDF text-selection / search UI (page render only, which is what you asked for).
