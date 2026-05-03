## Problem

Two issues with PDFs in the project carousel:

1. **PDFs fail to load entirely.** Both the marquee tile and the lightbox show no rendered page. Cause: `pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)` does not produce a valid asset URL through Vite at runtime — the worker never starts, so every `<Document>` silently stays in the loading/error state. With react-pdf 10 + pdfjs-dist 5, this is a known Vite gotcha.

2. **No preview thumbnail in the marquee.** Even once the worker works, the current `pd-pdf-thumb` uses a fixed `aspectRatio: 1/1.414` wrapper that ignores the carousel's `--item-h` size variable, so PDFs don't scale with the size slider like images/videos do.

## Fix

### 1. Worker — use Vite's `?url` import

In `src/components/ProjectDeck.tsx`, replace the `new URL(...)` call with Vite's explicit URL import (this is the pattern react-pdf documents for Vite):

```ts
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
```

This guarantees a real, hashed asset URL in both dev and prod builds.

### 2. Marquee — first-page preview that respects `--item-h`

Rewrite the PDF branch in the marquee tile so the first page renders as a real thumbnail and fills the same slot as images/videos:

```tsx
) : isPdfUrl(img.url) ? (
  <div
    className="pd-pdf-thumb"
    style={{
      height: "100%",
      aspectRatio: "1 / 1.414",
      background: "#fff",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none", // clicks go to the parent button
    }}
  >
    <Document
      file={img.url}
      loading={<span style={{ fontSize: 10, color: "#888" }}>PDF…</span>}
      error={<span style={{ fontSize: 10, color: "#c00" }}>PDF failed</span>}
    >
      {/* height in CSS pixels — pdf.js needs a numeric height, not %.
          Read the live --item-h from the surrounding gallery. */}
      <Page
        pageNumber={1}
        height={itemPxH}        // computed from gallery ref
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </Document>
  </div>
)
```

Add a small `useLayoutEffect` near the gallery that reads the computed `--item-h` (already set in CSS) into a state value (`itemPxH`) and updates it on resize / size-slider change. Re-using the existing slider value is cheaper — it's already in component state — so we just convert the slider's vh-based size into pixels (`Math.round(window.innerHeight * sizePct / 100)`).

### 3. Lightbox — add a small fallback link

Below the existing pager, add an "Open PDF in new tab" link so even if rendering fails (corrupt file, very large doc) the user has an escape hatch:

```tsx
<a href={url} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.7, fontSize: 12, textDecoration: "underline" }}>
  Open PDF in new tab
</a>
```

## Files to edit

- `src/components/ProjectDeck.tsx` — worker import, marquee PDF tile (first-page preview that respects size slider), lightbox fallback link.

No package, schema, edge-function or CMS changes.

## Out of scope

- Caching rendered thumbnails (re-renders on every mount; fine for the small number of PDFs in a portfolio).
- Multi-page scroll inside the marquee tile.
