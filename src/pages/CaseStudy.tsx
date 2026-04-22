import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import PageTransition from "@/components/site/PageTransition";

type TabKey = "problem" | "process" | "honest" | "outcome" | "recognition";

const tabs: { key: TabKey; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "process", label: "Process" },
  { key: "honest", label: "Honest moment" },
  { key: "outcome", label: "Outcome" },
  { key: "recognition", label: "Recognition" },
];

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const [tab, setTab] = useState<TabKey>("problem");
  const [longForm, setLongForm] = useState(false);

  // Reset state + scroll on slug change
  useEffect(() => {
    setTab("problem");
    setLongForm(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/work" replace />;

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  const sections: Record<TabKey, JSX.Element> = {
    problem: (
      <p className="text-lg sm:text-xl leading-[1.6] text-card-title">{project.problem}</p>
    ),
    process: (
      <div>
        <p className="text-base leading-[1.7] text-card-desc whitespace-pre-line">{project.process}</p>
        <div
          className="mt-6 rounded-xl h-[200px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))" }}
        >
          <span className="text-xs uppercase tracking-wider" style={{ color: "hsla(var(--indigo), 0.45)" }}>
            Process visual
          </span>
        </div>
      </div>
    ),
    honest: (
      <blockquote
        className="border-l-2 pl-5 sm:pl-6 italic text-base sm:text-lg leading-[1.7] text-card-desc"
        style={{ borderColor: "hsl(var(--indigo))" }}
      >
        {project.honest}
      </blockquote>
    ),
    outcome: (
      <div>
        <p className="text-4xl sm:text-6xl font-semibold gradient-text-indigo leading-[1.05] mb-5">
          {project.outcomeMetric}
        </p>
        <p className="text-base leading-[1.7] text-card-desc">{project.outcome}</p>
      </div>
    ),
    recognition: project.quotes.length > 0 ? (
      <div className="space-y-4">
        {project.quotes.map((q, i) => (
          <blockquote key={i} className="glass rounded-2xl p-6 text-base sm:text-lg leading-[1.6] text-card-title">
            "{q.replace(/^"|"$/g, "")}"
          </blockquote>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground italic">No external recognition recorded yet.</p>
    ),
  };

  return (
    <PageTransition>
      <main className="pb-24 relative overflow-hidden">
        {/* Back to all work — glass pill, top-left under nav */}
        <Link
          to="/work"
          className="fixed top-20 left-4 sm:left-6 z-30 inline-flex items-center gap-2 glass rounded-full pl-3 pr-4 py-2 text-[11px] tracking-[0.16em] uppercase hover:bg-white/80 transition-colors"
          style={{ color: "hsl(var(--indigo))" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All work
        </Link>

        {/* Hero — shorter */}
        <div
          ref={heroRef}
          className="relative h-[40vh] sm:h-[55vh] w-full overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.08), hsla(var(--purple), 0.14))" }}
        >
          <motion.img
            src={project.hero}
            alt={project.title}
            style={{ y }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10">
          <motion.h1
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-semibold text-card-title leading-[1.1] mb-2"
          >
            {project.title}
          </motion.h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">{project.role}</p>

          {/* Sticky TL;DR */}
          <motion.div
            layout
            className="sticky top-32 sm:top-20 z-10 glass rounded-2xl p-4 sm:p-5 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">Problem</p>
              <p className="text-sm text-card-title leading-snug">{project.problem}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">Outcome</p>
              <p className="text-sm text-card-title leading-snug">{project.outcome}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">Metric</p>
              <p className="text-base font-semibold gradient-text-indigo leading-tight">
                {project.outcomeMetric}
              </p>
            </div>
          </motion.div>

          {/* View toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Deep dive</p>
            <button
              onClick={() => setLongForm((v) => !v)}
              className="text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border hover:bg-foreground/5 transition-colors"
              style={{ borderColor: "hsla(var(--indigo), 0.3)", color: "hsl(var(--indigo))" }}
            >
              {longForm ? "Tabbed view" : "Read as long form"}
            </button>
          </div>

          {/* Tabs */}
          {!longForm && (
            <>
              <div className="relative flex flex-wrap gap-1 border-b border-foreground/10 mb-8">
                {tabs.map((t) => {
                  const active = t.key === tab;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className="relative px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs tracking-[0.16em] uppercase transition-colors"
                      style={{ color: active ? "hsl(var(--indigo))" : "hsl(var(--muted-foreground))" }}
                    >
                      {active && (
                        <motion.span
                          layoutId="case-tab-underline"
                          className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full"
                          style={{ background: "hsl(var(--indigo))" }}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-[200px] mb-16"
                >
                  {sections[tab]}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {/* Long form */}
          {longForm && (
            <motion.div layout className="space-y-14 mb-16">
              {tabs.map((t) => (
                <motion.section layout key={t.key}>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
                    {t.label}
                  </p>
                  {sections[t.key]}
                </motion.section>
              ))}
            </motion.div>
          )}

          {/* Next */}
          <button
            onClick={() => {
              navigate(`/work/${next.slug}`);
            }}
            className="inline-flex items-center gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Next: {next.title} →
          </button>
        </div>
      </main>
    </PageTransition>
  );
};

export default CaseStudy;
