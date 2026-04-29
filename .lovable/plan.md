You’re right — I can see why this has been frustrating. The previous attempts used shadow colors like `hsla(var(--indigo), 0.45)`. Because the CSS variable is stored as space-separated HSL values, that syntax can be ignored by the browser, meaning the intended indigo shadow/halo may not render at all.

Plan:
1. Edit `src/pages/About.tsx` in the Then / Now card section.
2. Keep the layout exactly as requested:
   - Left card: Then / Graphic Designer
   - Right card: Now / AI Operations PM
3. Keep the Graphic Designer card flat with no shadow.
4. Replace the AI Operations PM shadow and glow with reliable CSS that will definitely render, using either:
   - `hsl(var(--indigo) / 0.45)` syntax, or
   - explicit fallback colors like `rgba(99, 102, 241, 0.45)`.
5. Make the shadow visually obvious by applying it directly to the AI Operations PM card wrapper, for example:
   - strong soft purple/indigo outer shadow
   - visible border/ring around the card
   - optional glow layer behind the card using valid CSS color syntax
6. Remove any invalid `hsla(var(--indigo), ...)` / `hsla(var(--purple), ...)` syntax from this section so the browser cannot silently drop the effect again.
7. Visually check `/about` after the change to confirm the right-hand AI Operations PM card has the shadow and the left-hand Graphic Designer card is flat.

Technical note:
The core issue is likely CSS color syntax, not the card selection. `hsl(var(--indigo))` works, but `hsla(var(--indigo), 0.45)` can fail because the CSS variable is defined as `239 84% 67%`, not comma-separated values. I’ll use browser-safe syntax so the shadow actually appears.