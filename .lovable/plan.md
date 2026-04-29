Plan:

1. Update the Then / Now section in `src/pages/About.tsx`.
2. Keep the layout the same:
   - Left: Graphic Designer
   - Right: AI Operations PM
3. Remove the purple/indigo glow halo behind the AI Operations PM card entirely.
4. Change the AI Operations PM card interior to a plain white background, not glassy or tinted.
5. Add a smaller, neutral grey shadow behind the AI Operations PM card only.
6. Keep the Graphic Designer card flat with no shadow.
7. Preserve the existing rounded corners, spacing, typography, and content.

Technical details:
- Replace the current `absolute -inset-6 blur-2xl` coloured halo with no halo layer.
- Replace the current strong multi-layer purple/indigo `boxShadow` with a subtle grey shadow, for example `0 14px 30px rgba(15, 23, 42, 0.14)`.
- Override the right card background to `#ffffff` so the cell reads as plain white.
- Keep the border subtle and neutral, e.g. `1px solid rgba(15, 23, 42, 0.08)`, rather than purple.