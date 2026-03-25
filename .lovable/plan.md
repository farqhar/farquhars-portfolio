# Fix Timeline: Vertical Scroll on Mobile/Tablet + Ensure Full Scroll Coverage

## Summary

Use the scroll-driven horizontal translation approach (same as desktop) for mobile and tablet too — keeping vertical page scroll that drives horizontal card movement. The key fix is ensuring the scroll container is tall enough that you reach the 2026+ card before the section ends.

## Changes — `src/components/TimelineCarousel.tsx`

### 1. Remove the mobile/desktop split

Delete the `isMobile` hook usage and the entire mobile branch (horizontal native scroll). Use the same scroll-driven `sticky` + `motion` approach for all screen sizes.

### 2. Increase scroll height and extend translation range

- Change `height: "300vh"` to `height: "400vh"` — gives more vertical scroll room so the timeline doesn't end before 2026+
- Change `x` transform from `["5%", "-65%"]` to `["2%", "-78%"]` — translates further to fully reveal the last card

### 3. Increase subtitle spacing

- Change `mb-4 sm:mb-6` to `mb-8 sm:mb-12` on the desktop, tablet and mobile subtitle (now the only subtitle)

### 4. Responsive card sizing

- Add responsive width to `TimelineCard`: `w-[240px] sm:w-[280px]` so cards fit better on smaller screens
- Reduce gap on mobile: keep `gap-4 sm:gap-8`

### 5. Card 04 focal point

- Change `objectPosition` from `"center 35%"` to `"center 20%"` to show the head in the red carpet image

### 6. Keep Card 05 as-is

- `objectPosition: "center 40%"` stays unchanged

### 7. Clean up

- Remove `useIsMobile` hook, `scrollContainerRef`, `mobileProgress`, `handleMobileScroll`
- Remove the mobile branch JSX entirely