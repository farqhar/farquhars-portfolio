

# Fix Chippy carousel: re-copy broken images, add menu mockup, reorder

## Problems to fix
1. **Images 2/3 not displaying** — `chippy-process.jpg` and `chippy-stamp.jpg` were likely written as non-binary files, so Vite imports resolve to short strings that hit the `s.image.length < 30` text-placeholder check in the modal.
2. **Wrong order** — needs to be: mural → process → menu mockup.
3. **Missing image 3** — now provided: the restaurant menu mockup.

## Changes

### 1. Copy menu mockup to assets
- Copy `user-uploads://Restaurant_Menu_Mockup-chippy.png` → `src/assets/chippy-menu.png`

### 2. Re-copy process image properly
- Re-copy the parsed PDF page image (`chippy-process.jpg`) as a proper binary file to ensure it renders.

### 3. Remove unused `chippy-stamp.jpg`
- Delete `src/assets/chippy-stamp.jpg` — no longer needed.

### 4. Update `src/components/ProjectCells.tsx`
- Replace `chippyStamp` import with `chippyMenu` import for the new menu mockup
- Reorder and update the 3 steps:

```
steps: [
  { image: chippyMural, caption: "The character world — illustration, colour, and personality derived from organic potato forms." },
  { image: chippyProcess, caption: "Real potatoes, ink-stamped — each shape became a character foundation." },
  { image: chippyMenu, caption: "From form to brand — creating a range of assets that extend the typographic system born from potato prints." },
]
```

## Files touched
- `src/assets/chippy-menu.png` (new)
- `src/assets/chippy-process.jpg` (re-copied as proper binary)
- `src/assets/chippy-stamp.jpg` (deleted)
- `src/components/ProjectCells.tsx` (import + steps update)

