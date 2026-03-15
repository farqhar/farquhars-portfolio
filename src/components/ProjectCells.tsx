import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    category: "Type Systems",
    title: "Bondi",
    teaser: "A typographic system built around place and character.",
    reveal: "What makes a typeface feel like somewhere?",
    details: "Explored the intersection of geography, culture, and letterform. Every glyph was shaped by Bondi's rhythm — from the curl of a wave to the arch of a pavilion.",
  },
  {
    category: "Illustration",
    title: "Chippy",
    teaser: "A character system originating from actual potato forms.",
    reveal: "Started with real potatoes. Ended with a world.",
    details: "Scanned, traced, and abstracted real potato forms into a character system. Built a brand world around them — packaging, animation, tone of voice.",
  },
  {
    category: "Data · Photography",
    title: "Analogue to Algorithm",
    teaser: "280 film photographs. A brightness pipeline. A self-portrait.",
    reveal: "What does data reveal that the eye misses?",
    details: "Shot 280 frames on 35mm film, then built a data pipeline to extract brightness, color, and composition metrics. The result: a self-portrait made entirely from patterns.",
  },
];

const CornerBrackets = () => (
  <>
    <div className="absolute top-3 left-3">
      <div className="w-4 h-4 border-t border-l" style={{ borderColor: "hsla(var(--indigo), 0.25)" }} />
    </div>
    <div className="absolute bottom-3 right-3">
      <div className="w-4 h-4 border-b border-r" style={{ borderColor: "hsla(var(--indigo), 0.25)" }} />
    </div>
  </>
);

const FlipCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="relative">
        {/* Soft glow underneath */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-[40px] rounded-full blur-xl transition-opacity duration-500"
          style={{
            background: "hsla(var(--indigo), 0.12)",
            opacity: flipped ? 1 : 0,
          }}
        />

        <div
          className="relative transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="glass rounded-2xl overflow-hidden transition-shadow duration-300"
            style={{
              backfaceVisibility: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)",
            }}
          >
            <div
              className="relative h-[180px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsla(var(--indigo), 0.07), hsla(var(--purple), 0.12))",
              }}
            >
              <CornerBrackets />
              <span className="text-sm" style={{ color: "hsla(var(--indigo), 0.4)" }}>add image here</span>
            </div>
            <div className="p-5">
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3" style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}>
                {project.category}
              </span>
              <h3 className="text-[15px] font-semibold text-card-title mb-1">{project.title}</h3>
              <p className="text-[13px] text-card-desc">{project.teaser}</p>
              <div className="mt-3 text-[10px] tracking-wider uppercase text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity">
                Click to flip →
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="glass rounded-2xl overflow-hidden absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)",
            }}
          >
            <div className="p-5 h-full flex flex-col">
              <CornerBrackets />
              <p className="text-lg font-semibold italic mb-4 gradient-text-indigo pb-1">
                {project.reveal}
              </p>
              {/* Mini image gallery grid */}
              <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))",
                      border: "1px dashed hsla(var(--indigo), 0.2)",
                      minHeight: "60px",
                    }}
                  >
                    <span className="text-[9px]" style={{ color: "hsla(var(--indigo), 0.3)" }}>img {n}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] leading-relaxed text-card-desc mb-4">{project.details}</p>
              <a
                href="#"
                className="gradient-indigo text-primary-foreground text-xs font-medium px-4 py-2 rounded-full text-center hover:opacity-90 transition-opacity mt-auto"
              >
                View full project →
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCells = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsla(var(--indigo), 0.05) 0%, transparent 70%)" }} />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, hsla(var(--blue), 0.05) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-10 sm:mb-14"
        >
          Selected Work
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <FlipCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCells;
