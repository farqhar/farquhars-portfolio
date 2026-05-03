## Changes to `src/pages/About.tsx`

**1. Align headshot to bottom of intro paragraph**
In the hero grid (currently `items-start`), switch alignment so the headshot column bottom-aligns with the text column:
- Change `items-start` → `items-end` on the `grid grid-cols-1 sm:grid-cols-[1fr_auto] ...` wrapper.

**2. Increase headshot size ~25%**
On the `<img>`:
- `w-[270px] h-[270px]` → `w-[340px] h-[340px]` (mobile)
- `sm:w-[360px] sm:h-[360px]` → `sm:w-[450px] sm:h-[450px]` (desktop)
- Update `width={360} height={360}` → `width={450} height={450}`

No other files affected. The bottom edge of the (now larger) headshot will sit flush with the last line of the intro paragraph on `sm+` screens; on mobile it stacks as before.