import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import PageTransition from "@/components/site/PageTransition";
import { Project } from "@/data/projectsSeed";
import { useSiteContent } from "@/hooks/useSiteContent";

/* -------------------- Hero highlights -------------------- */

const highlights = [
  { value: "4,743%", label: "engagement lift", caveat: "on one landing page I rebuilt" },
  { value: "147 hrs/wk", label: "process waste", caveat: "identified in a workflow audit" },
  { value: "100+", label: "brand touchpoints", caveat: "catalogued & systemised" },
  { value: "3d → 20m", label: "tender drafting", caveat: "tool in build, supporting role" },
];

const HeroHeadline = () => {
  const lines = [
    ["I", "turn", "messy", "workflows"],
    ["into", "shipped", "systems."],
  ];
  let i = 0;
  return (
    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          <span className="inline-block">
            {line.map((word) => {
              const delay = 0.15 + i * 0.07;
              i++;
              return (
                <motion.span
                  key={`${li}-${word}-${i}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-[0.25em]"
                >
                  <span className={li === 0 ? "text-card-title" : "gradient-text-indigo"}>
                    {word}
                  </span>
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </h1>
  );
};

const HighlightsStrip = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
    {highlights.map((h, i) => (
      <motion.div
        key={h.label}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left", background: "hsla(var(--indigo), 0.4)" }}
          className="absolute top-0 left-0 right-0 h-px"
        />
        <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold gradient-text-indigo leading-tight mb-2">
          {h.value}
        </p>
        <p className="text-[11px] sm:text-xs tracking-wider uppercase text-muted-foreground mb-1">
          {h.label}
        </p>
        <p className="text-[10px] italic text-muted-foreground/70 leading-snug">
          {h.caveat}
        </p>
      </motion.div>
    ))}
  </div>
);

/* -------------------- Card -------------------- */

type ViewMode = "grid" | "list";

const featuredSlugs = new Set([
  "cjc-digital-construction-landing-page",
  "ai-workflow-survey-system",
  "cv-generation-tool-engineering-tender-automation",
]);

const cardSpan = (idx: number, slug: string, view: ViewMode) => {
  if (view === "list") return "col-span-12";
  // bento rhythm: featured = 2 cols on lg, else 1 col; mobile always 1
  if (featuredSlugs.has(slug)) return "col-span-12 sm:col-span-6 lg:col-span-8";
  return "col-span-12 sm:col-span-6 lg:col-span-4";
};

const WorkCard = ({
  project,
  index,
  view,
  hovered,
  setHovered,
}: {
  project: Project;
  index: number;
  view: ViewMode;
  hovered: string | null;
  setHovered: (s: string | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isHovered = hovered === project.slug;
  const isOther = hovered !== null && !isHovered;
  const isList = view === "list";
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      layout
      ref={ref}
      onMouseEnter={() => setHovered(project.slug)}
      onMouseLeave={() => setHovered(null)}
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      className={`${cardSpan(index, project.slug, view)} group`}
      style={{ opacity: isOther ? 0.55 : 1, transition: "opacity 0.4s ease" }}
      animate={{ opacity: inView ? (isOther ? 0.55 : 1) : 0, y: inView ? 0 : 20 }}
    >
      <Link to={`/work/${project.slug}`} className="block h-full">
        <motion.div
          layout
          className={`glass rounded-2xl overflow-hidden relative ${
            isList ? "flex flex-row items-stretch h-full" : "flex flex-col h-full"
          }`}
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.08)" }}
          whileHover={{ y: -4 }}
        >
          {/* Big background project number */}
          {!isList && (
            <div
              aria-hidden
              className="absolute -top-4 -right-2 text-[140px] font-semibold leading-none pointer-events-none select-none gradient-text-indigo opacity-[0.08] z-0"
            >
              {numberLabel}
            </div>
          )}
          {/* Cursor spotlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), hsla(var(--indigo), 0.10), transparent 60%)",
            }}
          />
          {/* Cover */}
          <motion.div
            layout
            className={`relative overflow-hidden ${
              isList ? "w-40 sm:w-56 shrink-0" : "h-[200px]"
            }`}
            style={{ background: "linear-gradient(135deg, hsla(var(--indigo), 0.07), hsla(var(--purple), 0.12))" }}
          >
            <motion.img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={false}
              animate={{ scale: isHovered ? 1.06 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-white/85 mix-blend-difference">
              {numberLabel} / 08
            </div>
            {/* Slide-up metric reveal on hover (grid only) */}
            {!isList && (
              <motion.div
                initial={false}
                animate={{ y: isHovered ? 0 : "100%" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 px-4 py-3 backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.78)" }}
              >
                <p className="text-base sm:text-lg font-semibold gradient-text-indigo leading-tight">
                  {project.outcomeMetric}
                </p>
                <p className="text-[10px] tracking-wider uppercase text-muted-foreground mt-0.5">
                  {project.role}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Body */}
          <motion.div layout className={`p-5 relative z-10 ${isList ? "flex-1" : ""}`}>
            {isList && (
              <p className="text-xl sm:text-2xl font-semibold gradient-text-indigo leading-tight mb-2">
                {project.outcomeMetric}
              </p>
            )}
            <h3 className="text-[16px] sm:text-[17px] font-semibold text-card-title leading-snug mb-1">
              {project.title}
            </h3>
            <p className="text-[12px] text-card-desc">{project.role}</p>
            <div className="mt-3 text-[10px] tracking-wider uppercase text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity">
              Open case study →
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

/* -------------------- Filters & view toggle -------------------- */

type Filter = "All" | "Design" | "AI Ops" | "Brand";

const filterFor = (p: Project): Filter[] => {
  const r = p.role.toLowerCase();
  const tags: Filter[] = ["All"];
  if (/(brand|identity|signature|touchpoint)/.test(r)) tags.push("Brand");
  if (/(design|motion|web|product)/.test(r)) tags.push("Design");
  if (/(ai|workflow|operations|automation|tooling)/.test(r)) tags.push("AI Ops");
  return tags;
};

/* -------------------- Page -------------------- */

const Work = () => {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<ViewMode>("grid");
  const [hovered, setHovered] = useState<string | null>(null);
  const { get } = useSiteContent("work");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const heroEyebrow = get("hero", "eyebrow", "I bridge design and AI operations");
   const heroSubhead = get("hero", "subhead", "Eight projects. Real outcomes. Here's what I bring to my work.");
  const cmsHighlights = highlights.map((h, i) => ({
    value: get("highlights", `v${i + 1}`, h.value),
    label: get("highlights", `l${i + 1}`, h.label),
    caveat: get("highlights", `c${i + 1}`, h.caveat),
  }));

  const filtered = useMemo(
    () => projects.filter((p) => filter === "All" || filterFor(p).includes(filter)),
    [projects, filter],
  );

  const filters: Filter[] = ["All", "Design", "AI Ops", "Brand"];

  return (
    <PageTransition>
      <main className="pt-24 pb-24 sm:pt-28 sm:pb-32 relative overflow-hidden">
        {/* ambient orbs */}
        <div
          className="absolute top-0 left-10 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--indigo), 0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--blue), 0.05) 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* HERO */}
          <section className="pt-8 pb-14 sm:pt-12 sm:pb-20">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5"
            >
              {heroEyebrow}
            </motion.p>
            <HeroHeadline />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg italic text-muted-foreground max-w-2xl mt-6"
            >
              {heroSubhead}
            </motion.p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
              {cmsHighlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 1.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left", background: "hsla(var(--indigo), 0.4)" }}
                    className="absolute top-0 left-0 right-0 h-px"
                  />
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold gradient-text-indigo leading-tight mb-2">{h.value}</p>
                  <p className="text-[11px] sm:text-xs tracking-wider uppercase text-muted-foreground mb-1">{h.label}</p>
                  <p className="text-[10px] italic text-muted-foreground/70 leading-snug">{h.caveat}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="relative text-[11px] tracking-[0.18em] uppercase px-4 py-2 rounded-full transition-colors"
                    style={{
                      color: active ? "hsl(var(--indigo))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "hsla(var(--indigo), 0.10)", border: "1px solid hsla(var(--indigo), 0.25)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f}</span>
                  </button>
                );
              })}
            </div>

            <div className="glass rounded-full p-1 flex items-center">
              {(["grid", "list"] as ViewMode[]).map((v) => {
                const active = v === view;
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="relative px-3 py-1.5 rounded-full text-[11px] tracking-[0.18em] uppercase flex items-center gap-1.5"
                    style={{ color: active ? "hsl(var(--indigo))" : "hsl(var(--muted-foreground))" }}
                  >
                    {active && (
                      <motion.span
                        layoutId="view-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "hsla(var(--indigo), 0.10)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {v === "grid" ? <LayoutGrid className="w-3 h-3" /> : <Rows3 className="w-3 h-3" />}
                      {v}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GRID */}
          <motion.div
            layout
            onMouseMove={(e) => {
              const card = (e.target as HTMLElement).closest<HTMLElement>(".group");
              if (!card) return;
              const r = card.getBoundingClientRect();
              card.style.setProperty("--mx", `${e.clientX - r.left}px`);
              card.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
            className="grid grid-cols-12 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filtered.map((p, i) => (
                <WorkCard
                  key={p.slug}
                  project={p}
                  index={i}
                  view={view}
                  hovered={hovered}
                  setHovered={setHovered}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Work;
