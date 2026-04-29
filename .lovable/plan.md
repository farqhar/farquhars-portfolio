I’ll fix the About page so the shadow is clearly around the AI Operations PM card on the right, while Graphic Designer on the left stays flat.

Plan:
1. Update `src/pages/About.tsx` in the Then / Now section.
2. Keep the layout exactly as requested:
   - Left: Then / Graphic Designer
   - Right: Now / AI Operations PM
3. Remove/neutralize any shadow from the Graphic Designer card.
4. Add a much more visible highlight treatment to the AI Operations PM card, likely using:
   - stronger indigo outer glow
   - subtle indigo border/ring
   - a faint radial glow behind the card if needed, so it reads clearly on the white background
5. Make sure the effect is applied to the actual card wrapper, not just the text, so the whole AI Operations PM cell has the visible shadow around it.

Technical note:
The current inline `boxShadow` exists on the AI Operations card, but it is too subtle against the white/glass styling in the preview. I’ll make the glow/border stronger and ensure the card is `relative` with a visible surrounding glow that cannot be hidden by the glass styling.