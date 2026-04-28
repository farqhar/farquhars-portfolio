import { Link } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Project } from "@/data/projectsSeed";

type Props = { projects: Project[] };

const TAB_OFFSET = 36; // px gap between tab strips when fanned

const FolderReveal = ({ projects }: Props) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  const total = projects.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cover lifts and rotates open between 0 → 0.4
  const coverRotate = useTransform(scrollYProgress, [0, 0.4], [0, -118]);
  const coverY = useTransform(scrollYProgress, [0, 0.4], [0, -180]);
  const coverOpacity = useTransform(scrollYProgress, [0.3, 0.42], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bodyShadow = useTransform(
    scrollYProgress,
    [0, 0.5],
    [
      "0 8px 24px hsla(var(--indigo), 0.10)",
      "0 30px 80px hsla(var(--indigo), 0.28)",
    ],
  );

  // Each tab fades and slides into its fanned position between 0.25 → 0.85
  const tabProgress = (i: number) => {
    const start = 0.25 + (i / total) * 0.5;
    const end = start + 0.18;
    return { start: Math.min(start, 0.95), end: Math.min(end, 0.99) };
  };

  const active = projects[activeIndex] ?? projects[0];
  const numberLabel = (i: number) => String(i + 1).padStart(2, "0");

  // For reduced motion: render fully open, no scroll animation.
  const fullyOpen = reduce;

  const folderWidth = "min(820px, 92vw)";

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: fullyOpen ? "auto" : "260vh" }}
      aria-label="Projects folder"
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-visible"
        style={{ perspective: 1600 }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, hsla(var(--indigo), 0.10), transparent 60%)",
          }}
        />

        {/* Scroll hint */}
        {!fullyOpen && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.24em] uppercase text-muted-foreground flex items-center gap-2"
          >
            <span>Scroll to open</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </motion.div>
        )}

        {/* The folder stage */}
        <div
          className="relative"
          style={{
            width: folderWidth,
            height: "min(560px, 78vh)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* ===== FOLDER BODY (always visible, content swaps with active) ===== */}
          <FolderBody
            project={active}
            index={activeIndex}
            total={total}
            shadow={bodyShadow}
            fullyOpen={fullyOpen}
          />

          {/* ===== FILE TABS (fan out as you scroll) ===== */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((p, i) => {
              const { start, end } = tabProgress(i);
              return (
                <FileTab
                  key={p.slug}
                  project={p}
                  index={i}
                  total={total}
                  scrollYProgress={scrollYProgress}
                  appearStart={start}
                  appearEnd={end}
                  isActive={i === activeIndex}
                  onHover={() => setActiveIndex(i)}
                  fullyOpen={fullyOpen}
                />
              );
            })}
          </div>

          {/* ===== FRONT COVER (the closed folder cover, lifts on scroll) ===== */}
          {!fullyOpen && (
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                rotateX: coverRotate,
                y: coverY,
                opacity: coverOpacity,
                transformOrigin: "top center",
                transformPerspective: 1600,
                background:
                  "linear-gradient(140deg, hsla(var(--indigo), 0.18), hsla(var(--blue), 0.14) 50%, hsla(var(--purple), 0.18))",
                border: "1px solid hsla(var(--indigo), 0.30)",
                boxShadow:
                  "0 24px 60px hsla(var(--indigo), 0.20), inset 0 1px 0 rgba(255,255,255,0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <FrontCoverContent total={total} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------------- Front cover ---------------- */

const FrontCoverContent = ({ total }: { total: number }) => (
  <div className="relative w-full h-full p-8 sm:p-10 flex flex-col">
    {/* Top tab silhouette (gives it folder shape) */}
    <div
      aria-hidden
      className="absolute -top-5 left-8 h-6 w-40 rounded-t-xl"
      style={{
        background: "hsla(var(--indigo), 0.22)",
        border: "1px solid hsla(var(--indigo), 0.30)",
        borderBottom: "none",
      }}
    />

    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
          Untitled Folder · Interactive
        </p>
        <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground/70 mt-1">
          {total} files · 4:3
        </p>
      </div>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-semibold"
        style={{
          background: "hsla(var(--indigo), 0.15)",
          border: "1px solid hsla(var(--indigo), 0.30)",
          color: "hsl(var(--indigo))",
        }}
      >
        FM
      </div>
    </div>

    <div className="mt-auto">
      <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
        Selected Work
      </p>
      <p
        className="font-semibold leading-none gradient-text-indigo"
        style={{ fontSize: "clamp(8rem, 22vw, 16rem)" }}
      >
        01
      </p>
    </div>
  </div>
);

/* ---------------- Folder body (content swap area) ---------------- */

const FolderBody = ({
  project,
  index,
  total,
  shadow,
  fullyOpen,
}: {
  project: Project;
  index: number;
  total: number;
  shadow: ReturnType<typeof useTransform<string>> | string;
  fullyOpen: boolean;
}) => {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
        border: "1px solid hsla(var(--indigo), 0.18)",
        boxShadow: fullyOpen
          ? "0 24px 60px hsla(var(--indigo), 0.18)"
          : (shadow as unknown as string),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Top inner-tab silhouette so it still reads as a folder when open */}
      <div
        aria-hidden
        className="absolute -top-5 left-8 h-6 w-44 rounded-t-xl"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid hsla(var(--indigo), 0.18)",
          borderBottom: "none",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex flex-col"
        >
          {/* Cover image */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: "62%",
              background:
                "linear-gradient(135deg, hsla(var(--indigo), 0.10), hsla(var(--purple), 0.14))",
            }}
          >
            <img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-white/85 mix-blend-difference">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          </div>

          {/* Meta */}
          <div className="relative flex-1 p-5 sm:p-7">
            <div
              aria-hidden
              className="absolute -top-2 right-4 text-[100px] sm:text-[140px] font-semibold leading-none pointer-events-none select-none gradient-text-indigo opacity-[0.10]"
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <p className="text-2xl sm:text-3xl font-semibold gradient-text-indigo leading-tight mb-1">
              {project.outcomeMetric}
            </p>
            <h3 className="text-[15px] sm:text-base font-semibold text-card-title leading-snug mb-1">
              {project.title}
            </h3>
            <p className="text-[11px] text-card-desc">{project.role}</p>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-3">
              Hover a file to preview · Click to open
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------------- File tab ---------------- */

const FileTab = ({
  project,
  index,
  total,
  scrollYProgress,
  appearStart,
  appearEnd,
  isActive,
  onHover,
  fullyOpen,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  appearStart: number;
  appearEnd: number;
  isActive: boolean;
  onHover: () => void;
  fullyOpen: boolean;
}) => {
  // Final fanned position: stagger from the top of the folder downward
  const finalTop = 14 + index * TAB_OFFSET;

  // Animate from -40px (tucked into folder) → finalTop
  const top = useTransform(
    scrollYProgress,
    [appearStart, appearEnd],
    [-40, finalTop],
  );
  const opacity = useTransform(
    scrollYProgress,
    [appearStart, appearEnd],
    [0, 1],
  );

  // Tabs drift right with index for that "fanned cards" cascade
  const horizontalOffset = useMemo(() => {
    // Stagger left → right across width, but keep first one anchored.
    const max = 60; // px
    return (index / Math.max(1, total - 1)) * max;
  }, [index, total]);

  const numberLabel = String(index + 1).padStart(2, "0");
  const sectionLabel = index === 0 ? "SECTION 01" : `FILE ${numberLabel}`;

  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-auto"
      style={
        fullyOpen
          ? { top: finalTop, opacity: 1, zIndex: 10 + index }
          : { top, opacity, zIndex: 10 + index }
      }
    >
      <Link
        to={`/work/${project.slug}`}
        onMouseEnter={onHover}
        onFocus={onHover}
        className="block"
      >
        <motion.div
          whileHover={{ y: -28, zIndex: 80 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{
            marginLeft: horizontalOffset + 24,
            marginRight: 24,
            zIndex: isActive ? 60 : 10 + index,
          }}
        >
          {/* Tab strip */}
          <div className="flex items-end -mb-px">
            <div
              className="rounded-t-xl px-4 py-2 flex items-center gap-3 transition-colors duration-200"
              style={{
                background: isActive
                  ? "hsla(var(--indigo), 0.95)"
                  : "hsla(var(--indigo), 0.16)",
                border: "1px solid hsla(var(--indigo), 0.35)",
                borderBottom: "none",
                color: isActive ? "white" : "hsl(var(--indigo))",
                minWidth: "55%",
                maxWidth: "75%",
                boxShadow: isActive
                  ? "0 8px 24px hsla(var(--indigo), 0.35)"
                  : "0 2px 6px hsla(var(--indigo), 0.10)",
              }}
            >
              <span className="text-[10px] font-mono opacity-80">
                {sectionLabel}
              </span>
              <span className="text-[11px] tracking-[0.14em] uppercase font-medium truncate">
                {project.title}
              </span>
              <span className="ml-auto text-[10px] opacity-70">
                {project.outcomeMetric}
              </span>
            </div>
          </div>

          {/* Tab "page" sliver — gives a hint of the file body when hovered */}
          <div
            className="h-2 rounded-b-md"
            style={{
              background: isActive
                ? "hsla(var(--indigo), 0.25)"
                : "hsla(var(--indigo), 0.08)",
              border: "1px solid hsla(var(--indigo), 0.20)",
              borderTop: "none",
              marginRight: 24,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default FolderReveal;
