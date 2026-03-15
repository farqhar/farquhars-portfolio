import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    category: "Type Systems",
    title: "Bondi",
    teaser: "A typographic system built around place and character.",
    reveal: "What makes a typeface feel like somewhere?",
  },
  {
    category: "Illustration",
    title: "Chippy",
    teaser: "A character system originating from actual potato forms.",
    reveal: "Started with real potatoes. Ended with a world.",
  },
  {
    category: "Data · Photography",
    title: "Analogue to Algorithm",
    teaser: "280 film photographs. A brightness pipeline. A self-portrait.",
    reveal: "What does data reveal that the eye misses?",
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

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.1)"
          : "0 8px 32px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image placeholder */}
      <div
        className="relative h-[180px] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.12))",
        }}
      >
        <CornerBrackets />
        <span className="text-sm" style={{ color: "rgba(99,102,241,0.4)" }}>
          add image here
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <span
          className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3"
          style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1" }}
        >
          {project.category}
        </span>
        <h3 className="text-[15px] font-semibold text-card-title mb-1">{project.title}</h3>
        <p className="text-[13px] text-card-desc">{project.teaser}</p>

        <div className="h-px my-3" style={{ background: "rgba(99,102,241,0.1)" }} />

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: hovered ? "40px" : "0px",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p className="text-[13px] italic" style={{ color: "#6366f1" }}>
            {project.reveal}
          </p>
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
      {/* Background orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

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
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCells;
