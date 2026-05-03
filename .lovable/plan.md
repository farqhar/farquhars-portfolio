## Problem

The carousel size slider works for image gallery items but not for **videos** (e.g. the CV Generation Tool project, whose gallery is two `.mov` files at `widthPct: 25`).

### Root cause

In `src/components/ProjectDeck.tsx`, the marquee items use a CSS variable `--item-h` driven by the project's `galleryDefaultWidth` / per-image `widthPct`:

```css
.pd-marquee-item { height: var(--item-h, 320px); ... }
.pd-marquee-item img { display: block; height: 100%; width: auto; object-fit: cover; }
```

There's a rule for `img` but **no equivalent rule for `video`**. So `<video>` elements render at their intrinsic resolution and ignore the container height — making them look "huge" regardless of the size override.

## Fix

One-line CSS addition in `ProjectDeck.tsx`, mirroring the `img` rule:

```css
.pd-marquee-item video { display: block; height: 100%; width: auto; object-fit: cover; }
```

That's it — no schema, no data, no admin changes. The existing `widthPct: 25` value already in the database for the CV Generation Tool will then take effect.

## Verification

After the change, on the CV Generation Tool case study:
- Both `.mov` items should render at ~25% of the default marquee height (≈80px desktop / ≈50px mobile).
- Adjusting the slider in the admin (project default or per-image override) should resize videos live, identical to image behaviour.
