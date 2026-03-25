

# Wire Bondi → Boondi assets into Selected Work

## Changes in `src/components/ProjectCells.tsx`

### 1. Rename project
Change `title: "Bondi"` to `title: "Boondi"` in the projects array.

### 2. Copy uploaded assets into `src/assets/`
- `user-uploads://boondi-logo-ani.gif` → `src/assets/boondi-logo-ani.gif`
- `user-uploads://typo-systems-bondi-shape-dev.png` → `src/assets/boondi-shape-dev.png`
- `user-uploads://boondi-type-system.png` → `src/assets/boondi-type-system.png`
- `user-uploads://boondi-bus-v1.png` → `src/assets/boondi-bus-v1.png`

### 3. Update Boondi project card thumbnail
Use the GIF (`boondi-logo-ani.gif`) as the card's hero image instead of the placeholder text.

### 4. Update Boondi modal carousel steps
Wire the 4 images into the modal's step-by-step carousel:
- Step 1: `boondi-logo-ani.gif` — the animated logo
- Step 2: `boondi-shape-dev.png` — shape development from Bondi geography
- Step 3: `boondi-type-system.png` — the type system specimen
- Step 4: `boondi-bus-v1.png` — bus wrap application

Replace the placeholder `<span>` text in both the card and modal with actual `<img>` tags using ES6 imports.

### 5. Leave Chippy and Analogue to Algorithm as placeholders
No images yet — keep existing placeholder structure for those two projects.

