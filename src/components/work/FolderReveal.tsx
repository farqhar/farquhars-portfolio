import { Link } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { Project, ProjectFile } from "@/data/projectsSeed";
import { useIsMobile } from "@/hooks/use-mobile";

/* ============================================================
   FolderSequence — vertically pinned stack of project folders.
   One <ProjectFolder/> per project; each opens, fans out its
   files, and unpins as you scroll past it.
   ============================================================ */

type Props = { projects: Project[] };

const FolderReveal = ({ projects }: Props) => {
  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects],
  );

  return (
    <div className="relative">
      {sorted.map((p, i) => (
        <ProjectFolder
          key={p.slug}
          project={p}
          index={i}
          total={sorted.length}
        />
      ))}
    </div>
  );
};

export default FolderReveal;

/* ============================================================
   Single project folder — pinned, scroll-driven open + fan
   ============================================================ */

const ProjectFolder = ({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [activeFile, setActiveFile] = useState(0);
  const [tappedOpen, setTappedOpen] = useState(false);

  // Treat projects without files[] as having one synthetic "file"
  const files: ProjectFile[] = useMemo(() => {
    if (project.files && project.files.length > 0) return project.files;
    return [
      {
        title: project.title,
        caption: project.outcomeMetric,
        image: project.cover,
        href: `/work/${project.slug}`,
      },
    ];
  }, [project]);

  const skipScrollAnim = reduce || isMobile;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cover lift: 0.10 → 0.45
  const coverRotate = useTransform(scrollYProgress, [0.1, 0.45], [0, -110]);
  const coverY = useTransform(scrollYProgress, [0.1, 0.45], [0, -160]);
  const coverOpacity = useTransform(scrollYProgress, [0.32, 0.5], [1, 0]);
  const coverPointer = useTransform(scrollYProgress, (v) =>
    v > 0.5 ? "none" : "auto",
  );

  // Hint
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // Number label
  const numLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  // Force-open conditions (mobile tap, reduced motion)
  const forceOpen = skipScrollAnim && (tappedOpen || reduce);

  return (
    <section
      ref={sectionRef}
      aria-label={`Folder ${numLabel}: ${project.title}`}
      className="relative"
      style={{
        height: skipScrollAnim ? "auto" : "150vh",
      }}
    >
      <div
        className={
          skipScrollAnim
            ? "relative w-full py-16 px-4 sm:px-6"
            : "sticky top-0 h-screen w-full flex items-center justify-center px-4 sm:px-6"
        }
        style={{ perspective: 1600 }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, hsla(var(--indigo), 0.10), transparent 60%)",
          }}
        />

        {/* Section index, top-left */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
          Folder {numLabel} / {totalLabel}
        </div>

        {/* Scroll hint */}
        {!skipScrollAnim && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.24em] uppercase text-muted-foreground flex items-center gap-2"
          >
            <span>Scroll to open</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ↓
            </motion.span>
          </motion.div>
        )}

        {/* The folder stage */}
        <div
          className="relative mx-auto"
          style={{
            width: "min(820px, 92vw)",
            height: "min(560px, 76vh)",
            minHeight: 460,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ===== FOLDER BODY (always visible underneath) ===== */}
          <FolderBody
            project={project}
            files={files}
            activeFile={activeFile}
            indexLabel={numLabel}
          />

          {/* ===== FILE TABS (fan upward out of folder) ===== */}
          {(forceOpen || !skipScrollAnim) && (
            <FileFan
              files={files}
              scrollYProgress={scrollYProgress}
              fullyOpen={forceOpen}
              activeFile={activeFile}
              onHoverFile={setActiveFile}
              skipScrollAnim={skipScrollAnim}
            />
          )}

          {/* ===== FRONT COVER (lifts on scroll, or tap on mobile) ===== */}
          {!forceOpen && (
            <FrontCover
              project={project}
              numLabel={numLabel}
              filesCount={files.length}
              coverRotate={coverRotate}
              coverY={coverY}
              coverOpacity={coverOpacity}
              coverPointer={coverPointer}
              skipScrollAnim={skipScrollAnim}
              onTap={() => setTappedOpen(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------------- Front cover (closed state) ---------------- */

const FrontCover = ({
  project,
  numLabel,
  filesCount,
  coverRotate,
  coverY,
  coverOpacity,
  coverPointer,
  skipScrollAnim,
  onTap,
}: {
  project: Project;
  numLabel: string;
  filesCount: number;
  coverRotate: MotionValue<number>;
  coverY: MotionValue<number>;
  coverOpacity: MotionValue<number>;
  coverPointer: MotionValue<string>;
  skipScrollAnim: boolean;
  onTap: () => void;
}) => {
  const dynamicStyle = skipScrollAnim
    ? {}
    : {
        rotateX: coverRotate,
        y: coverY,
        opacity: coverOpacity,
        pointerEvents: coverPointer as unknown as MotionValue<any>,
      };

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer"
      onClick={skipScrollAnim ? onTap : undefined}
      style={{
        ...dynamicStyle,
        transformOrigin: "top center",
        transformPerspective: 1600,
        background:
          "linear-gradient(140deg, hsla(var(--indigo), 0.20), hsla(var(--blue), 0.16) 50%, hsla(var(--purple), 0.20))",
        border: "1px solid hsla(var(--indigo), 0.32)",
        boxShadow:
          "0 30px 80px hsla(var(--indigo), 0.22), inset 0 1px 0 rgba(255,255,255,0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 30,
      }}
    >
      {/* Top tab silhouette */}
      <div
        aria-hidden
        className="absolute -top-5 left-8 h-6 w-44 rounded-t-xl"
        style={{
          background: "hsla(var(--indigo), 0.24)",
          border: "1px solid hsla(var(--indigo), 0.32)",
          borderBottom: "none",
        }}
      />

      <div className="relative w-full h-full p-7 sm:p-10 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
              Untitled Folder · Interactive
            </p>
            <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground/70 mt-1">
              {filesCount} {filesCount === 1 ? "file" : "files"} inside
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{
              background: "hsla(var(--indigo), 0.18)",
              border: "1px solid hsla(var(--indigo), 0.32)",
              color: "hsl(var(--indigo))",
            }}
          >
            FM
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
            {project.role.split("·")[0].trim()}
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-card-title leading-tight mb-4 max-w-[80%]">
            {project.title}
          </h3>
          <p
            className="font-semibold leading-none gradient-text-indigo"
            style={{ fontSize: "clamp(6rem, 16vw, 11rem)" }}
          >
            {numLabel}
          </p>
        </div>

        {skipScrollAnim && (
          <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.24em] uppercase text-muted-foreground flex items-center gap-2">
            Tap to open <span>→</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ---------------- Folder body (preview area) ---------------- */

const FolderBody = ({
  project,
  files,
  activeFile,
  indexLabel,
}: {
  project: Project;
  files: ProjectFile[];
  activeFile: number;
  indexLabel: string;
}) => {
  const file = files[activeFile] ?? files[0];
  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.94), rgba(255,255,255,0.80))",
        border: "1px solid hsla(var(--indigo), 0.18)",
        boxShadow: "0 30px 80px hsla(var(--indigo), 0.22)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 10,
      }}
    >
      {/* Inner top tab silhouette so it still reads as a folder */}
      <div
        aria-hidden
        className="absolute -top-5 left-8 h-6 w-44 rounded-t-xl"
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid hsla(var(--indigo), 0.18)",
          borderBottom: "none",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${project.slug}-${activeFile}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex flex-col"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: "62%",
              background:
                "linear-gradient(135deg, hsla(var(--indigo), 0.10), hsla(var(--purple), 0.14))",
            }}
          >
            <img
              src={file.image || project.cover}
              alt={file.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 40%" }}
            />
            <div className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-white/85 mix-blend-difference font-mono">
              File {String(activeFile + 1).padStart(2, "0")} /{" "}
              {String(files.length).padStart(2, "0")}
            </div>
          </div>
          <div className="relative flex-1 p-5 sm:p-7">
            <div
              aria-hidden
              className="absolute -top-2 right-4 text-[100px] sm:text-[140px] font-semibold leading-none pointer-events-none select-none gradient-text-indigo opacity-[0.10]"
            >
              {indexLabel}
            </div>
            <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-2">
              {project.title}
            </p>
            <h4 className="text-lg sm:text-xl font-semibold text-card-title leading-snug mb-1">
              {file.title}
            </h4>
            <p className="text-[12px] sm:text-sm text-card-desc leading-relaxed max-w-xl">
              {file.caption}
            </p>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-3">
              Hover a file to preview · Click to open the case study
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ---------------- File fan (the staggered tabs) ---------------- */

const FileFan = ({
  files,
  scrollYProgress,
  fullyOpen,
  activeFile,
  onHoverFile,
  skipScrollAnim,
}: {
  files: ProjectFile[];
  scrollYProgress: MotionValue<number>;
  fullyOpen: boolean;
  activeFile: number;
  onHoverFile: (i: number) => void;
  skipScrollAnim: boolean;
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      {files.map((file, i) => (
        <FileTab
          key={`${file.title}-${i}`}
          file={file}
          index={i}
          total={files.length}
          scrollYProgress={scrollYProgress}
          fullyOpen={fullyOpen}
          isActive={i === activeFile}
          onHover={() => onHoverFile(i)}
          skipScrollAnim={skipScrollAnim}
        />
      ))}
    </div>
  );
};

const FileTab = ({
  file,
  index,
  total,
  scrollYProgress,
  fullyOpen,
  isActive,
  onHover,
  skipScrollAnim,
}: {
  file: ProjectFile;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  fullyOpen: boolean;
  isActive: boolean;
  onHover: () => void;
  skipScrollAnim: boolean;
}) => {
  // Window per tab (across the 0.5 → 0.95 portion of scroll)
  const span = 0.45;
  const start = 0.5 + (index / Math.max(1, total)) * span * 0.5;
  const end = Math.min(0.97, start + 0.18);

  // Final fanned offset above the folder body
  const finalY = -((index + 1) * 38) - 24;
  const horizontalOffset = (index / Math.max(1, total - 1 || 1)) * 60;

  // Animate y from 0 (tucked) → finalY (fanned upward)
  const y = useTransform(scrollYProgress, [start, end], [0, finalY]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  const animatedStyle =
    fullyOpen || skipScrollAnim
      ? { y: finalY, opacity: 1 }
      : { y, opacity };

  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-auto"
      style={{
        top: 16,
        zIndex: 20 + index,
        ...animatedStyle,
      }}
    >
      <Link
        to={file.href || "#"}
        onMouseEnter={onHover}
        onFocus={onHover}
        className="block"
        aria-label={`Open ${file.title}`}
      >
        <motion.div
          whileHover={{ y: -22 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{
            marginLeft: horizontalOffset + 28,
            marginRight: 28,
          }}
        >
          <div
            className="rounded-t-xl px-4 py-2.5 flex items-center gap-3 transition-colors duration-200"
            style={{
              background: isActive
                ? "hsl(var(--indigo))"
                : "hsla(var(--indigo), 0.18)",
              border: "1px solid hsla(var(--indigo), 0.38)",
              borderBottom: "none",
              color: isActive ? "white" : "hsl(var(--indigo))",
              boxShadow: isActive
                ? "0 10px 28px hsla(var(--indigo), 0.40)"
                : "0 2px 8px hsla(var(--indigo), 0.10)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span className="text-[10px] font-mono opacity-80 tracking-wider">
              FILE {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] tracking-[0.14em] uppercase font-medium truncate flex-1">
              {file.title}
            </span>
            <span className="text-[10px] opacity-70 hidden sm:inline">
              open →
            </span>
          </div>
          <div
            className="h-1.5 rounded-b-md"
            style={{
              background: isActive
                ? "hsla(var(--indigo), 0.30)"
                : "hsla(var(--indigo), 0.10)",
              borderLeft: "1px solid hsla(var(--indigo), 0.22)",
              borderRight: "1px solid hsla(var(--indigo), 0.22)",
              borderBottom: "1px solid hsla(var(--indigo), 0.22)",
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};
