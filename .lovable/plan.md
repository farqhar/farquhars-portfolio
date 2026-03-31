# Add Chippy project images (3-step carousel)

## What changes

Update the Chippy project in `ProjectCells.tsx` to use real images instead of placeholder text, and reduce from 4 steps to 3.

## Assets to copy

1. `parsed-documents://…/page_1.jpg` → `src/assets/chippy-process.jpg` (full potato stamps overview)
2. `parsed-documents://…/img_p0_3.jpg` → `src/assets/chippy-stamp.jpg` (individual potato + print close-up)
3. `user-uploads://chippy_mural-4.svg` → `src/assets/chippy-mural.svg` (final character illustration)  


**Changes to copy in slide 3**  
**-** instead of description being about packaging can you open it up to creating range of brand assets that continue the brand typographic system 

## Code changes — `src/components/ProjectCells.tsx`

- Add three new imports for the Chippy assets
- Update the Chippy project object:
  - Set `cardImage` to `chippyMural` (the SVG character illustration as the card thumbnail)
  - Replace 4 text-only steps with 3 image steps:
    1. Process overview image — caption: "Real potatoes, ink-stamped — each shape became a character foundation."
    2. Stamp close-up — caption: "Potato meets page — capturing the organic form that drives the character system."
    3. Character mural — caption: "The full character world — illustration, colour, and personality derived from form."

## No other files touched