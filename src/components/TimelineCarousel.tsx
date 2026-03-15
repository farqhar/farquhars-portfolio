import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const cards = [
  {
    year: "2018",
    label: "Arrival",
    num: "01",
    title: "Left home. Landed in the unknown.",
    desc: "Arrived in Australia at 18 — two weeks before COVID closed the world. No plan. No map. Navigated it anyway. Learned that an unfamiliar environment is just a system you haven't mapped yet.",
    tags: ["Adaptability", "Resilience"],
  },
  {
    year: "2018–21",
    label: "Exploration",
    num: "02",
    title: "Three years. No fixed address.",
    desc: "Rainforests, deserts, islands, coastlines. Lived out of a backpack and a van. Every new environment demanded a new way of thinking. Pattern recognition as survival.",
    tags: ["Pattern recognition", "Independence"],
  },
  {
    year: "2023",
    label: "Two tracks",
    num: "03",
    title: "Career and study. At the same time.",
    desc: "Entered the industry and started my design degree simultaneously. Each pushed the other forward.",
    tags: [],
    dualBars: true,
  },
  {
    year: "2024–25",
    label: "Responsibility",
    num: "04",
    title: "Design as leverage.",
    desc: "Two global engineering brands. Solo. An agency, two people, one client. Stopped treating design as craft — started treating it as a tool for impact.",
    tags: ["Leadership", "Commercial", "Agency"],
  },
  {
    year: "2026",
    label: "Everything converging",
    num: "05",
    title: "Not a pivot. A destination.",
    desc: "Joined AIQ. Analogue to Algorithm — 280 film photographs, a data pipeline, a self-portrait made from patterns. Accepted into a Master of Commerce. AI, systems, design — all at once.",
    tags: ["AI", "Systems", "MCom"],
  },
];

const CornerBrackets = () => (
  <>
    <div className="absolute top-3 left-3">
      <div className="w-4 h-4 border-t border-l" style={{ borderColor: "rgba(99,102,241,0.25)" }} />
    </div>
    <div className="absolute bottom-3 right-3">
      <div className="w-4 h-4 border-b border-r" style={{ borderColor: "rgba(99,102,241,0.25)" }} />
    </div>
  </>
);

const DualBars = ({ active }: { active: boolean }) => (
  <div className="mt-4 rounded-[10px] p-4" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
    {[
      { label: "WORK", color: "#3b82f6", anim: "work-bar" },
      { label: "STUDY", color: "#8b5cf6", anim: "study-bar" },
    ].map((row) => (
      <div key={row.label} className="flex items-center gap-3 mb-2 last:mb-0">
        <span className="text-[10px] font-semibold tracking-wider w-12" style={{ color: row.color }}>
          {row.label}
        </span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(99,102,241,0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{
              background: row.label === "WORK"
                ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                : "linear-gradient(90deg, #8b5cf6, #a855f7)",
              width: active ? undefined : "0%",
              animation: active ? `${row.anim} 4.5s ease-in-out infinite` : "none",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

const TimelineCarousel = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Touch swipe
  const touchStart = useRef(0);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && current < cards.length - 1) setCurrent((c) => c + 1);
        if (delta < 0 && current > 0) setCurrent((c) => c - 1);
      }
    },
    [current]
  );

  const progress = ((current + 1) / cards.length) * 100;

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10"
      >
        {/* Eyebrow */}
        <p className="text-center text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-10 sm:mb-14">
          A few moments that shaped how I think
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-0.5 rounded-full" style={{ background: "#e2e8f0" }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)",
              }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
            {current + 1} / {cards.length}
          </span>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="w-8 h-8 rounded-full glass flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(cards.length - 1, c + 1))}
            disabled={current === cards.length - 1}
            className="w-8 h-8 rounded-full glass flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Card */}
        <div
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass rounded-[20px] overflow-hidden"
            >
              {/* Image placeholder */}
              <div
                className="relative h-[200px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.12))",
                  borderBottom: "1px dashed rgba(99,102,241,0.25)",
                }}
              >
                <CornerBrackets />
                <span className="text-sm" style={{ color: "rgba(99,102,241,0.4)" }}>
                  add photo here
                </span>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7 relative">
                {/* Ghost number */}
                <span
                  className="absolute top-2 right-6 text-7xl sm:text-8xl font-bold select-none gradient-text-indigo"
                  style={{ opacity: 0.06 }}
                >
                  {cards[current].num}
                </span>

                {/* Year pill */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
                    style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#6366f1",
                        animation: "pulse-dot 2s ease-in-out infinite",
                      }}
                    />
                    {cards[current].year} · {cards[current].label}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-card-title mb-2">
                  {cards[current].title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-card-desc">
                  {cards[current].desc}
                </p>

                {cards[current].dualBars && <DualBars active={true} />}

                {cards[current].tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {cards[current].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === current
                  ? "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)"
                  : "#cbd5e1",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TimelineCarousel;
