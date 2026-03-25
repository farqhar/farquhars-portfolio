import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import boondiHero from "@/assets/boondi-logo-ani.gif";
import boondiShapeDev from "@/assets/boondi-shape-dev.png";
import boondiTypeSystem from "@/assets/boondi-type-system.png";


const projects = [
  {
    category: "Type Systems",
    title: "Boondi",
    teaser: "A typeface rooted in place, shaped by culture.",
    reveal: "What happens when geography becomes a glyph?",
    details: "Cultural research, shape systems, and a typeface born from the land it represents.",
    cardImage: boondiHero,
    steps: [
      { image: boondiHero, caption: "A living mark — movement, rhythm, and place." },
      { image: boondiShapeDev, caption: "Researching cultural landmarks — Aboriginal and Western — to extract the shapes behind the system." },
      { image: boondiTypeSystem, caption: "Applying those shapes to build a typeface and icon set ready for brand use." },
    ],
  },
  {
    category: "Illustration",
    title: "Chippy",
    teaser: "A character system originating from actual potato forms.",
    reveal: "Started with real potatoes. Ended with a world.",
    details: "Scanned, traced, and abstracted real potato forms into a character system. Built a brand world around them — packaging, animation, tone of voice.",
    cardImage: null as string | null,
    steps: [
      { image: "Character lineup", caption: "The full character family — each derived from a unique potato scan." },
      { image: "Scan process", caption: "High-resolution scans of real potatoes used as the design foundation." },
      { image: "Packaging front", caption: "Brand packaging showcasing the character system in a retail context." },
      { image: "Brand world overview", caption: "The complete brand world — tone, animation, and visual identity." },
    ],
  },
  {
    category: "Data · Photography",
    title: "Analogue to Algorithm",
    teaser: "280 film photographs. A brightness pipeline. A self-portrait.",
    reveal: "What does data reveal that the eye misses?",
    details: "Shot 280 frames on 35mm film, then built a data pipeline to extract brightness, color, and composition metrics. The result: a self-portrait made entirely from patterns.",
    cardImage: null as string | null,
    steps: [
      { image: "Film contact sheet", caption: "280 frames of 35mm film — the raw material for the data pipeline." },
      { image: "Data extraction", caption: "Extracting brightness, color, and composition metrics from each frame." },
      { image: "Color analysis", caption: "Mapping colour patterns across the full set to find hidden structure." },
      { image: "Final self-portrait", caption: "The result: a self-portrait made entirely from photographic patterns." },
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

const ProjectModal = ({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = project.steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass rounded-2xl max-w-3xl w-full relative z-10"
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

        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
              style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}
            >
              {project.category}
            </span>
            <span className="text-[11px] text-muted-foreground">{currentStep + 1} / {project.steps.length}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-card-title mb-1">{project.title}</h2>
          <p className="text-sm sm:text-base font-semibold italic gradient-text-indigo pb-1 mb-4">
            {project.reveal}
          </p>

          {/* Carousel image */}
          <div className="relative mb-4">
            <div
              className="w-full rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))",
                border: typeof step.image === "string" && step.image.length < 30 ? "1px dashed hsla(var(--indigo), 0.2)" : "none",
                minHeight: "220px",
              }}
            >
              {typeof step.image === "string" && step.image.length < 30 ? (
                <span className="text-sm" style={{ color: "hsla(var(--indigo), 0.35)" }}>{step.image}</span>
              ) : (
                <img src={step.image} alt={step.caption} className="w-full h-full object-contain" />
              )}
            </div>

            {/* Nav arrows */}
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: "hsla(var(--background), 0.8)", backdropFilter: "blur(8px)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentStep < project.steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: "hsla(var(--background), 0.8)", backdropFilter: "blur(8px)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-sm leading-relaxed text-card-desc mb-4">{step.caption}</p>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {project.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === currentStep ? "hsl(var(--indigo))" : "hsla(var(--indigo), 0.2)",
                  transform: i === currentStep ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>

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
};

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
            className="relative h-[180px] flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.07), hsla(var(--purple), 0.12))" }}
          >
            <CornerBrackets />
            {project.cardImage ? (
              <img src={project.cardImage} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm" style={{ color: "hsla(var(--indigo), 0.4)" }}>add image here</span>
            )}
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
      <section ref={ref} className="relative pt-8 sm:pt-12 pb-20 sm:pb-28 overflow-hidden">
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
