import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { X } from "lucide-react";

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
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>
        {card.year} · {card.label}
      </span>
      {/* Image placeholder */}
      <div
        className="w-full h-40 rounded-xl mb-4 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))",
          border: "1px dashed hsla(var(--indigo), 0.2)",
        }}
      >
        <span className="text-xs" style={{ color: "hsla(var(--indigo), 0.35)" }}>add image here</span>
      </div>
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

const TimelineCard = ({ card, index, onClick }: { card: typeof cards[0]; index: number; onClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isAbove = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="flex-shrink-0 flex flex-col items-center"
      style={{ width: "280px" }}
    >
      {/* Card above or spacer */}
      {isAbove ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="cursor-pointer group mb-3 w-full"
          onClick={onClick}
        >
          <div className="relative">
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[30px] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "hsla(var(--indigo), 0.15)" }}
            />
            <div
              className="glass rounded-2xl p-4 transition-all duration-300 group-hover:-translate-y-1 relative"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)" }}
            >
              <span className="absolute top-1 right-3 text-5xl font-bold select-none gradient-text-indigo" style={{ opacity: 0.06 }}>
                {card.num}
              </span>
              <h3 className="text-[14px] font-semibold text-card-title mb-1.5">{card.title}</h3>
              <p className="text-[11px] leading-relaxed text-card-desc line-clamp-3">{card.desc}</p>
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>{tag}</span>
                  ))}
                </div>
              )}
              <div className="mt-2 text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "hsl(var(--indigo))" }}>
                Click to expand →
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div style={{ height: "180px" }} />
      )}

      {/* Stem + dot */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={inView ? { opacity: 1, scaleY: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
        style={{ originY: isAbove ? 1 : 0 }}
      >
        <div className="w-px h-8" style={{ background: "hsla(var(--indigo), 0.25)" }} />
        <div className="relative">
          <div
            className="w-4 h-4 rounded-full border-2"
            style={{ borderColor: "hsl(var(--indigo))", background: "hsl(var(--background))" }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "hsla(var(--indigo), 0.3)", animation: "pulse-dot 2s ease-in-out infinite", transform: "scale(1.5)", filter: "blur(4px)" }}
          />
        </div>
        <div className="w-px h-8" style={{ background: "hsla(var(--indigo), 0.25)" }} />
      </motion.div>

      {/* Year label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-[10px] font-semibold tracking-wider uppercase my-1"
        style={{ color: "hsl(var(--indigo))" }}
      >
        {card.year}
      </motion.span>

      {/* Card below or spacer */}
      {!isAbove ? (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="cursor-pointer group mt-3 w-full"
          onClick={onClick}
        >
          <div className="relative">
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[30px] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "hsla(var(--indigo), 0.15)" }}
            />
            <div
              className="glass rounded-2xl p-4 transition-all duration-300 group-hover:-translate-y-1 relative"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)" }}
            >
              <span className="absolute top-1 right-3 text-5xl font-bold select-none gradient-text-indigo" style={{ opacity: 0.06 }}>
                {card.num}
              </span>
              <h3 className="text-[14px] font-semibold text-card-title mb-1.5">{card.title}</h3>
              <p className="text-[11px] leading-relaxed text-card-desc line-clamp-3">{card.desc}</p>
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>{tag}</span>
                  ))}
                </div>
              )}
              <div className="mt-2 text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "hsl(var(--indigo))" }}>
                Click to expand →
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div style={{ height: "180px" }} />
      )}
    </div>
  );
};

const TimelineCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [expandedCard, setExpandedCard] = useState<typeof cards[0] | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

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
          <p className="text-center text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-16 sm:mb-20">
            A few moments that shaped how I think
          </p>

          {/* Timeline container */}
          <div className="relative max-w-6xl mx-auto px-4">
            {/* Horizontal line */}
            <div
              className="absolute left-0 right-0 h-px"
              style={{
                top: "50%",
                background: "hsla(var(--indigo), 0.12)",
              }}
            />
            <motion.div
              className="absolute left-0 h-px"
              style={{
                top: "50%",
                width: lineWidth,
                background: "linear-gradient(90deg, hsl(var(--blue)), hsl(var(--indigo)), hsl(var(--purple)))",
              }}
            />

            {/* Cards row */}
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              {cards.map((card, i) => (
                <TimelineCard key={card.num} card={card} index={i} onClick={() => setExpandedCard(card)} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {expandedCard && <ExpandedCard card={expandedCard} onClose={() => setExpandedCard(null)} />}
      </AnimatePresence>
    </>
  );
};

export default TimelineCarousel;
