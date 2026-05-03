## Issues identified

**1. Video lightbox is too tall (you have to scroll)**
The `.pd-lightbox` CSS only constrains `img` to `max-height: 88vh`. The `<video>` element has no size cap, so it renders at intrinsic height and overflows the viewport.

**2. PDF thumbnails + modal preview not rendering**
The current implementation uses `react-pdf` (v10) with `pdfjs-dist` v5 and a Vite `?url` import for the worker. Even though the worker file exists and the PDF URL is reachable (verified via HTTP 200, `application/pdf`, 5.8 MB), `react-pdf` is failing silently — no PDF-related logs or network requests for `.pdf` files appear in the console snapshot, meaning the `<Document>` never even fetches the file. This is a known fragile combo (react-pdf v10 + pdfjs v5 + Vite worker URL imports).

Rather than continue fighting `react-pdf`, switch to two simpler approaches that "just work":
- **Modal preview**: a native `<iframe src={pdfUrl}>` — every modern browser renders PDFs inline, with built-in zoom/page nav.
- **Thumbnails**: a small `PdfThumb` component that uses `pdfjs-dist` directly to render page 1 onto a `<canvas>`. This bypasses react-pdf entirely.

## Changes — `src/components/ProjectDeck.tsx`

**A. Video lightbox sizing**
Add a CSS rule next to the existing `.pd-lightbox img` rule:
```css
.pd-lightbox video { max-width: 92vw; max-height: 88vh; border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.5); background: #000; }
```
Result: video fits entirely in viewport, no scrolling needed.

**B. Remove react-pdf**
- Remove imports of `Document`, `Page`, `pdfjs`, the two CSS files, and `pdfWorker`.
- Remove the `pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker` line.
- Remove `pdfPage` / `pdfTotal` state and the reset effect.

**C. Add `PdfThumb` component (inline, top of file)**
Uses `pdfjs-dist` directly:
```tsx
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PdfThumb({ url }: { url: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const targetW = 320;
        const scale = targetW / viewport.width;
        const v = page.getViewport({ scale });
        const canvas = ref.current;
        if (!canvas || cancelled) return;
        canvas.width = v.width; canvas.height = v.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport: v }).promise;
      } catch {/* ignore */}
    })();
    return () => { cancelled = true; };
  }, [url]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />;
}
```

**D. Replace gallery thumbnail PDF branch (line ~681)**
```tsx
) : isPdfUrl(img.url) ? (
  <div style={{ height: "100%", width: "100%", aspectRatio: "1 / 1.414", background: "#fff", overflow: "hidden" }}>
    <PdfThumb url={img.url} />
  </div>
) : (
```

**E. Replace lightbox PDF branch (lines ~722–766)**
Use a native iframe sized to the viewport:
```tsx
) : isPdfUrl(openProject.gallery[lightboxIdx].url) ? (
  <iframe
    src={openProject.gallery[lightboxIdx].url}
    title="PDF preview"
    onClick={(e) => e.stopPropagation()}
    style={{ width: "92vw", height: "92vh", border: "none", borderRadius: 12, background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
  />
) : (
```

## Notes
- `pdfjs-dist` and `react-pdf` are already installed; we keep `pdfjs-dist` and stop using `react-pdf` (can leave the dep in `package.json` to avoid touching the lockfile).
- `MediaField.tsx` (admin) shows a small "PDF" text placeholder for PDF uploads — leaving it as-is unless you want admin previews too.
