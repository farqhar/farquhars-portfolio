import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const projects = [
  {
    category: "Type Systems",
    title: "Bondi",
    teaser: "A typographic system built around place and character.",
    reveal: "What makes a typeface feel like somewhere?",
    details: "Explored the intersection of geography, culture, and letterform. Every glyph was shaped by Bondi's rhythm — from the curl of a wave to the arch of a pavilion.",
    gallery: [
      { type: "full" as const, label: "Hero image" },
      { type: "pair" as const, labels: ["Process sketch 1", "Process sketch 2"] },
      { type: "pair" as const, labels: ["Glyph detail", "In-context mockup"] },
      { type: "full" as const, label: "Final specimen" },
    ],
  },
  {
    category: "Illustration",
    title: "Chippy",
    teaser: "A character system originating from actual potato forms.",
    reveal: "Started with real potatoes. Ended with a world.",
    details: "Scanned, traced, and abstracted real potato forms into a character system. Built a brand world around them — packaging, animation, tone of voice.",
    gallery: [
      { type: "full" as const, label: "Character lineup" },
      { type: "pair" as const, labels: ["Scan process", "Trace overlay"] },
      { type: "pair" as const, labels: ["Packaging front", "Packaging back"] },
      { type: "full" as const, label: "Brand world overview" },
    ],
  },
  {
    category: "Data · Photography",
    title: "Analogue to Algorithm",
    teaser: "280 film photographs. A brightness pipeline. A self-portrait.",
    reveal: "What does data reveal that the eye misses?",
    details: "Shot 280 frames on 35mm film, then built a data pipeline to extract brightness, color, and composition metrics. The result: a self-portrait made entirely from patterns.",
    gallery: [
      { type: "full" as const, label: "Film contact sheet" },
      { type: "pair" as const, labels: ["Data extraction", "Brightness map"] },
      { type: "pair" as const, labels: ["Color analysis", "Composition grid"] },
      { type: "full" as const, label: "Final self-portrait" },
    ],
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

const ProjectModal = ({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="glass rounded-2xl max-w-5xl w-full relative z-10 mb-[5vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        style={{ background: "hsla(var(--indigo), 0.08)" }}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-6 sm:p-10">
        {/* Category + Title */}
        <span
          className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-4"
          style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}
        >
          {project.category}
        </span>

        <h2 className="text-2xl sm:text-3xl font-semibold text-card-title mb-2">{project.title}</h2>

        <p className="text-lg sm:text-xl font-semibold italic gradient-text-indigo pb-1 mb-6">
          {project.reveal}
        </p>

        {/* Image gallery */}
        <div className="space-y-3 mb-8">
          {project.gallery.map((row, i) => {
            if (row.type === "full") {
              return (
                <div
                  key={i}
                  className="w-full rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))",
                    border: "1px dashed hsla(var(--indigo), 0.2)",
                    minHeight: "240px",
                  }}
                >
                  <span className="text-sm" style={{ color: "hsla(var(--indigo), 0.35)" }}>{row.label}</span>
                </div>
              );
            }
            return (
              <div key={i} className="grid grid-cols-2 gap-3">
                {row.labels.map((label, j) => (
                  <div
                    key={j}
                    className="rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))",
                      border: "1px dashed hsla(var(--indigo), 0.2)",
                      minHeight: "180px",
                    }}
                  >
                    <span className="text-xs" style={{ color: "hsla(var(--indigo), 0.35)" }}>{label}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Details */}
        <p className="text-sm leading-relaxed text-card-desc mb-8">{project.details}</p>

        {/* CTA */}
        <a
          href="#"
          className="inline-block gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          View full project →
        </a>
      </div>
    </motion.div>
  </motion.div>
);

const ProjectCard = ({ project, index, onSelect }: { project: typeof projects[0]; index: number; onSelect: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="cursor-pointer group"
      onClick={onSelect}
    >
      <div className="relative">
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-[40px] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "hsla(var(--indigo), 0.12)" }}
        />
        <div
          className="glass rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)" }}
        >
          <div
            className="relative h-[180px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.07), hsla(var(--purple), 0.12))" }}
          >
            <CornerBrackets />
            <span className="text-sm" style={{ color: "hsla(var(--indigo), 0.4)" }}>add image here</span>
          </div>
          <div className="p-5">
            <span
              className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3"
              style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}
            >
              {project.category}
            </span>
            <h3 className="text-[15px] font-semibold text-card-title mb-1">{project.title}</h3>
            <p className="text-[13px] text-card-desc">{project.teaser}</p>
            <div className="mt-3 text-[10px] tracking-wider uppercase text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity">
              Click to view →
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
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <>
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
              <ProjectCard key={project.title} project={project} index={i} onSelect={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default ProjectCells;
