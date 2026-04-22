import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useProjects } from "@/hooks/useProjects";
import Reveal from "@/components/site/Reveal";
import PageTransition from "@/components/site/PageTransition";

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useProjects();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/work" replace />;

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <PageTransition>
      <main className="pb-24 relative overflow-hidden">
        {/* Hero */}
        <div
          ref={heroRef}
          className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden"
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10">
          <Reveal>
            <h1 className="text-3xl sm:text-5xl font-semibold text-card-title leading-[1.1] mb-3">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm sm:text-base text-muted-foreground mb-10">{project.role}</p>
          </Reveal>

          {/* Summary bar */}
          <Reveal delay={0.16}>
            <div className="glass rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-foreground/5 mb-16">
              {[
                { label: "Role", value: project.role.split("·")[0]?.trim() ?? project.role },
                { label: "Timeline", value: project.timeline },
                { label: "Outcome", value: project.outcomeMetric },
              ].map((item) => (
                <div key={item.label} className="p-5">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-card-title">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Problem */}
          <Reveal>
            <section className="mb-16">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">The Problem</p>
              <p className="text-lg sm:text-xl leading-[1.6] text-card-title">{project.problem}</p>
            </section>
          </Reveal>

          {/* Process */}
          <Reveal>
            <section className="mb-16">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">The Process</p>
              <p className="text-base leading-[1.7] text-card-desc whitespace-pre-line">{project.process}</p>
              <div
                className="mt-6 rounded-xl h-[240px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.06), hsla(var(--purple), 0.1))" }}
              >
                <span className="text-xs uppercase tracking-wider" style={{ color: "hsla(var(--indigo), 0.45)" }}>
                  Process visual
                </span>
              </div>
            </section>
          </Reveal>

          {/* Honest moment */}
          <Reveal>
            <section className="mb-16">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">An honest moment</p>
              <blockquote
                className="border-l-2 pl-5 sm:pl-6 italic text-base sm:text-lg leading-[1.7] text-card-desc"
                style={{ borderColor: "hsl(var(--indigo))" }}
              >
                {project.honest}
              </blockquote>
            </section>
          </Reveal>

          {/* Outcome */}
          <Reveal>
            <section className="mb-16">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">The Outcome</p>
              <p className="text-4xl sm:text-6xl font-semibold gradient-text-indigo leading-[1.05] mb-5">
                {project.outcomeMetric}
              </p>
              <p className="text-base leading-[1.7] text-card-desc">{project.outcome}</p>
            </section>
          </Reveal>

          {/* Recognition */}
          {project.quotes.length > 0 && (
            <Reveal>
              <section className="mb-20">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-4">Recognition</p>
                <div className="space-y-5">
                  {project.quotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="glass rounded-2xl p-6 text-base sm:text-lg leading-[1.6] text-card-title"
                    >
                      "{q.replace(/^"|"$/g, "")}"
                    </blockquote>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* Next */}
          <Reveal>
            <Link
              to={`/work/${next.slug}`}
              className="inline-flex items-center gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Next: {next.title} →
            </Link>
          </Reveal>
        </div>
      </main>
    </PageTransition>
  );
};

export default CaseStudy;