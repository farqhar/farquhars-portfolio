

# Add bus wrap back as step 4 in Boondi carousel

## Change

In `src/components/ProjectCells.tsx`:

1. **Re-add the bus wrap import** — add `import boondiBus from "@/assets/boondi-bus-v1.png";` after the other Boondi imports.

2. **Add step 4** to the Boondi `steps` array:
```js
{ image: boondiBus, caption: "The system in motion — brand identity applied to transit." }
```

## Files to update
- `src/components/ProjectCells.tsx`

