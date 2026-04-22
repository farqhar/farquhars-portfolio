import { useEffect, useRef, useState } from "react";

/** Animate a number from 0 to `end` once `active` becomes true. */
export function useCountUp(end: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);

  return value;
}

/** Pull leading number from a metric string like "4,743% engagement" → 4743 */
export function parseLeadingNumber(input: string): number | null {
  const m = input.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}
