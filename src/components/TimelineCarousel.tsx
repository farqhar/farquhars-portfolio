import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Image imports
import img01Arrival from "@/assets/timeline/01-arrival.jpeg";
import img02Waterfall from "@/assets/timeline/02-waterfall.jpeg";
import img02Cave from "@/assets/timeline/02-cave.jpeg";
import img02Sailing from "@/assets/timeline/02-sailing.jpeg";
import img02Desert from "@/assets/timeline/02-desert.jpeg";
import img02Diving from "@/assets/timeline/02-diving.jpeg";
import img03Office from "@/assets/timeline/03-office.jpeg";
import img04Dubai from "@/assets/timeline/04-dubai.jpeg";
import img04RedCarpet from "@/assets/timeline/04-redcarpet.jpeg";
import img05Presenting from "@/assets/timeline/05-presenting.jpeg";

const cards = [
  {
    year: "2018–2020",
    label: "Arrival",
    num: "01",
    title: "Left home. Landed in the unknown.",
    desc: "Arrived in Australia at 18 — two weeks before COVID closed the world. No plan. No map. Navigated it anyway. Learned that an unfamiliar environment is just a system you haven't mapped yet.",
    tags: ["Adaptability", "Resilience"],
    images: [img01Arrival],
  },
  {
    year: "2020–2023",
    label: "Exploration",
    num: "02",
    title: "Three years. No fixed address.",
    desc: "Rainforests, deserts, islands, coastlines. Lived out of a backpack and a van. Every new environment demanded a new way of thinking. Pattern recognition as survival.",
    tags: ["Pattern recognition", "Independence"],
    images: [img02Waterfall, img02Cave, img02Sailing, img02Desert, img02Diving],
  },
  {
    year: "2023",
    label: "Two tracks",
    num: "03",
    title: "Career and study. At the same time.",
    desc: "Entered the industry and started my design degree simultaneously. Each pushed the other forward.",
    tags: [],
    dualBars: true,
    images: [img03Office],
  },
  {
    year: "2024–25",
    label: "Responsibility",
    num: "04",
    title: "Design as leverage.",
    desc: "Two global engineering brands. Solo. An agency, two people, one client. Stopped treating design as craft — started treating it as a tool for impact.",
    tags: ["Leadership", "Commercial", "Agency"],
    images: [img04Dubai, img04RedCarpet],
  },
  {
    year: "2026+",
    label: "Everything converging",
    num: "05",
    title: "Not a pivot. A destination.",
    desc: "Joined AIQ. Analogue to Algorithm — 280 film photographs, a data pipeline, a self-portrait made from patterns. Accepted into a Master of Commerce. AI, systems, design — all at once.",
    tags: ["AI", "Systems", "MCom"],
    images: [img05Presenting],
  },
];

/** Auto-cycling image carousel with crossfade */
const AutoCarousel = ({ images, className }: { images: string[]; className?: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className ?? ""}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
      {/* Maintain aspect ratio */}
      <img src={images[0]} alt="" className="w-full h-full object-cover invisible" />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{
                background: i === index ? "hsl(var(--indigo))" : "hsla(var(--indigo), 0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
      <AutoCarousel images={card.images} className="w-full h-48 mb-4" />
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

const DOT_SIZE = 16;

const TimelineCard = ({ card, index, onClick }: { card: typeof cards[0]; index: number; onClick: () => void }) => {
  const isAbove = index % 2 === 0;

  const cardContent = (
    <div className="cursor-pointer group w-full" onClick={onClick}>
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
          <AutoCarousel images={card.images} className="w-full h-28 mb-2" />
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
    </div>
  );

  return (
    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "280px" }}>
      {isAbove ? <div className="mb-3">{cardContent}</div> : <div style={{ height: "220px" }} />}

      <div className="flex flex-col items-center">
        <div className="w-px h-8" style={{ background: "hsla(var(--indigo), 0.25)" }} />
        <div className="relative" style={{ width: DOT_SIZE, height: DOT_SIZE }}>
          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "hsl(var(--indigo))", background: "hsl(var(--background))" }} />
          <div className="absolute inset-0 rounded-full" style={{ background: "hsla(var(--indigo), 0.3)", animation: "pulse-dot 2s ease-in-out infinite", transform: "scale(1.5)", filter: "blur(4px)" }} />
        </div>
        <div className="w-px h-8" style={{ background: "hsla(var(--indigo), 0.25)" }} />
      </div>

      <span className="text-[10px] font-semibold tracking-wider uppercase my-1" style={{ color: "hsl(var(--indigo))" }}>
        {card.year}
      </span>

      {!isAbove ? <div className="mt-3">{cardContent}</div> : <div style={{ height: "220px" }} />}
    </div>
  );
};

const TimelineCarousel = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<typeof cards[0] | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <div ref={wrapperRef} style={{ height: "300vh" }} className="relative">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsla(var(--blue), 0.06) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsla(var(--purple), 0.06) 0%, transparent 70%)" }} />

          <p className="text-center text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-10 sm:mb-14 relative z-10">
            A few moments that shaped how I think
          </p>

          <div className="relative w-full">
            <div className="relative" style={{ height: "auto" }}>
              <div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{ top: "calc(220px + 32px + 8px)", background: "hsla(var(--indigo), 0.12)" }}
              />
              <motion.div
                className="absolute left-0 h-px pointer-events-none"
                style={{ top: "calc(220px + 32px + 8px)", width: lineWidth, background: "linear-gradient(90deg, hsl(var(--blue)), hsl(var(--indigo)), hsl(var(--purple)))" }}
              />

              <motion.div className="flex gap-4 sm:gap-8 pl-[10vw]" style={{ x }}>
                {cards.map((card, i) => (
                  <TimelineCard key={card.num} card={card} index={i} onClick={() => setExpandedCard(card)} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedCard && <ExpandedCard card={expandedCard} onClose={() => setExpandedCard(null)} />}
      </AnimatePresence>
    </>
  );
};

export default TimelineCarousel;
