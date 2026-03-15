import { useRef, useState, useEffect, useCallback } from "react";
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

const DualBars = () => (
  <div className="mt-3 rounded-lg p-3" style={{ background: "hsla(var(--indigo), 0.05)", border: "1px solid hsla(var(--indigo), 0.1)" }}>
    {[
      { label: "WORK", color: "hsl(var(--blue))", anim: "work-bar" },
      { label: "STUDY", color: "hsl(var(--purple))", anim: "study-bar" },
    ].map((row) => (
      <div key={row.label} className="flex items-center gap-3 mb-2 last:mb-0">
        <span className="text-[10px] font-semibold tracking-wider w-12" style={{ color: row.color }}>{row.label}</span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "hsla(var(--indigo), 0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{
              background: row.label === "WORK"
                ? "linear-gradient(90deg, hsl(var(--blue)), hsl(var(--indigo)))"
                : "linear-gradient(90deg, hsl(var(--purple)), #a855f7)",
              animation: `${row.anim} 4.5s ease-in-out infinite`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

const ExpandedCard = ({ card, onClose }: { card: typeof cards[0]; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="glass rounded-2xl p-6 sm:p-8 max-w-lg w-full relative z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-lg">✕</button>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>
        {card.year} · {card.label}
      </span>
      <h3 className="text-xl font-semibold text-card-title mb-3">{card.title}</h3>
      <p className="text-sm leading-relaxed text-card-desc mb-4">{card.desc}</p>
      {card.dualBars && <DualBars />}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {card.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>{tag}</span>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
);

const CARD_WIDTH = 340;
const GAP = 24;
const SPEED = 0.4;

const TimelineCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [paused, setPaused] = useState(false);
  const [expandedCard, setExpandedCard] = useState<typeof cards[0] | null>(null);
  const rafRef = useRef<number>(0);
  const scrollPos = useRef(0);

  const totalWidth = cards.length * (CARD_WIDTH + GAP);

  const animate = useCallback(() => {
    if (!paused && scrollRef.current) {
      scrollPos.current += SPEED;
      if (scrollPos.current >= totalWidth) {
        scrollPos.current -= totalWidth;
      }
      scrollRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [paused, totalWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Duplicate cards for seamless loop
  const displayCards = [...cards, ...cards];

  // Progress dot position
  const progressPercent = (scrollPos.current / totalWidth) * 100;

  return (
    <>
      <section ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsla(var(--blue), 0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, hsla(var(--purple), 0.06) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-center text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-10 sm:mb-14">
            A few moments that shaped how I think
          </p>

          {/* Horizontal scrolling container */}
          <div
            className="overflow-hidden cursor-grab"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex will-change-transform"
              style={{ gap: `${GAP}px`, paddingLeft: "5%" }}
            >
              {displayCards.map((card, i) => (
                <div
                  key={`${card.num}-${i}`}
                  className="flex-shrink-0 group cursor-pointer"
                  style={{ width: CARD_WIDTH }}
                  onClick={() => setExpandedCard(card)}
                >
                  <div className="relative">
                    {/* Soft glow underneath */}
                    <div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-[40px] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "hsla(var(--indigo), 0.15)" }}
                    />
                    <div
                      className="glass rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 relative"
                      style={{
                        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)",
                      }}
                    >
                      {/* Ghost number */}
                      <span className="absolute top-2 right-4 text-6xl font-bold select-none gradient-text-indigo" style={{ opacity: 0.06 }}>
                        {card.num}
                      </span>

                      {/* Year pill */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--indigo))", animation: "pulse-dot 2s ease-in-out infinite" }} />
                        {card.year} · {card.label}
                      </span>

                      <h3 className="text-[15px] font-semibold text-card-title mb-2">{card.title}</h3>
                      <p className="text-[12px] leading-relaxed text-card-desc line-clamp-3">{card.desc}</p>

                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {card.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="mt-3 text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ color: "hsl(var(--indigo))" }}>
                        Click to expand →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="max-w-xs mx-auto mt-8 h-0.5 rounded-full relative" style={{ background: "hsl(var(--border))" }}>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(var(--blue)), hsl(var(--indigo)), hsl(var(--purple)))",
                left: `${progressPercent}%`,
                boxShadow: "0 0 10px hsla(var(--indigo), 0.4)",
              }}
              animate={{ left: `${progressPercent}%` }}
            />
          </div>
        </motion.div>
      </section>

      {/* Expanded card modal */}
      <AnimatePresence>
        {expandedCard && <ExpandedCard card={expandedCard} onClose={() => setExpandedCard(null)} />}
      </AnimatePresence>
    </>
  );
};

export default TimelineCarousel;
