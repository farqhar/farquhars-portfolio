import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useProjects } from "@/hooks/useProjects";
import Reveal from "@/components/site/Reveal";
import PageTransition from "@/components/site/PageTransition";
import { Project } from "@/data/projectsSeed";

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

const WorkCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/work/${project.slug}`} className="block group">
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
              <img src={project.cover} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-2xl sm:text-3xl font-semibold gradient-text-indigo leading-tight mb-2">
                {project.outcomeMetric}
              </p>
              <h3 className="text-[15px] font-semibold text-card-title mb-1">{project.title}</h3>
              <p className="text-[12px] text-card-desc">{project.role}</p>
              <div className="mt-3 text-[10px] tracking-wider uppercase text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity">
                Open case study →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Work = () => {
  const { projects } = useProjects();

  return (
    <PageTransition>
      <main className="pt-28 pb-24 sm:pt-32 sm:pb-32 relative overflow-hidden">
        <div
          className="absolute top-0 left-10 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--indigo), 0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--blue), 0.05) 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
              Here's what I actually built
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-[1.1] mb-3 text-card-title max-w-3xl">
              Eight projects.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-base sm:text-lg italic text-muted-foreground max-w-2xl mb-14 sm:mb-20">
              Each one cost something to make. The metrics are real. The honest moments more so.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <WorkCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Work;