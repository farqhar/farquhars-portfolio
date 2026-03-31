

# Add Analogue to Algorithm images (2-step carousel)

## Assets
1. **Image 1 (card + carousel step 1)**: Film contact sheet — `parsed-documents://20260331-110445-197278/Major_Project_-_Assessment_2.pdf/images/page_1.jpg` → `src/assets/analogue-contact.jpg`
2. **Image 2 (carousel step 2)**: Data pipeline diagram — `parsed-documents://20260331-110454-489097/Major_Project_-_Assessment_2-data.pdf/images/page_1.jpg` → `src/assets/analogue-pipeline.jpg`

## Code changes — `src/components/ProjectCells.tsx`

- Add imports for both new assets
- Update the "Analogue to Algorithm" project:
  - Set `cardImage` to `analogueContact`
  - Reduce from 4 placeholder steps to 2 real steps:
    1. Contact sheet — caption: "280 frames of 35mm film — the raw material for the data pipeline."
    2. Pipeline diagram — caption: "A custom Python pipeline that analyses each film photograph across six dimensions — translating composition, brightness, colour, and spatial weight into structured data."

## Files touched
- `src/assets/analogue-contact.jpg` (new)
- `src/assets/analogue-pipeline.jpg` (new)
- `src/components/ProjectCells.tsx` (imports + project data update)

