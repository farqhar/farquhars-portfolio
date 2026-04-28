import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, FolderOpen, Folder } from "lucide-react";
import { Project } from "@/data/projectsSeed";

type Props = {
  project: Project;
  index: number;
  total: number;
  hovered: string | null;
  setHovered: (s: string | null) => void;
};

const FolderCard = ({ project, index, total, hovered, setHovered }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState(false);

  const isHovered = hovered === project.slug;
  const isOther = hovered !== null && !isHovered;
  const numberLabel = String(index + 1).padStart(2, "0");
  const files = project.files ?? [];
  const hasFiles = files.length > 0;

  return (
    <motion.div
      layout
      ref={ref}
      onMouseEnter={() => setHovered(project.slug)}
      onMouseLeave={() => setHovered(null)}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: inView ? (isOther ? 0.55 : 1) : 0,
        y: inView ? 0 : 40,
      }}
      transition={{
        duration: 0.65,
        delay: inView ? Math.min(index * 0.07, 0.4) : 0,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative"
    >
      <motion.button
        type="button"
        onClick={() => hasFiles && setOpen((o) => !o)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="block w-full text-left"
        style={{ cursor: hasFiles ? "pointer" : "default" }}
      >
        <div className="relative flex items-end z-10 -mb-px">
          <div
            className="rounded-t-xl px-4 py-2 flex items-center gap-2 transition-colors"
            style={{
              background: isHovered ? "hsla(var(--indigo), 0.18)" : "hsla(var(--indigo), 0.10)",
              border: "1px solid hsla(var(--indigo), 0.25)",
              borderBottom: "none",
              minWidth: "55%",
            }}
          >
            {hasFiles ? (
              open ? (
                <FolderOpen className="w-3.5 h-3.5" style={{ color: "hsl(var(--indigo))" }} />
              ) : (
                <Folder className="w-3.5 h-3.5" style={{ color: "hsl(var(--indigo))" }} />
              )
            ) : (
              <span className="text-[10px] font-mono opacity-70" style={{ color: "hsl(var(--indigo))" }}>
                {numberLabel}
              </span>
            )}
            <span
              className="text-[11px] tracking-[0.14em] uppercase font-medium truncate"
              style={{ color: "hsl(var(--indigo))" }}
            >
              {project.title}
            </span>
            {hasFiles && (
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-auto"
              >
                <ChevronDown className="w-3.5 h-3.5" style={{ color: "hsl(var(--indigo))" }} />
              </motion.span>
            )}
          </div>
        </div>

        <motion.div
          layout
          className="glass rounded-b-2xl rounded-tr-2xl overflow-hidden relative"
          style={{
            boxShadow: isHovered
              ? "0 12px 40px hsla(var(--indigo), 0.18), 0 4px 8px rgba(0,0,0,0.06)"
              : "0 4px 6px rgba(0,0,0,0.04), 0 16px 40px hsla(var(--indigo), 0.06)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-6 -right-3 text-[160px] font-semibold leading-none pointer-events-none select-none gradient-text-indigo opacity-[0.07] z-0"
          >
            {numberLabel}
          </div>

          <div
            className="relative overflow-hidden h-[220px] sm:h-[240px]"
            style={{
              background: "linear-gradient(135deg, hsla(var(--indigo), 0.08), hsla(var(--purple), 0.12))",
            }}
          >
            <motion.img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={false}
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-white/85 mix-blend-difference">
              {numberLabel} / {String(total).padStart(2, "0")}
            </div>
            {hasFiles && (
              <div
                className="absolute top-3 right-3 text-[10px] tracking-[0.14em] uppercase px-2 py-1 rounded-full backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.85)", color: "hsl(var(--indigo))" }}
              >
                {files.length} {files.length === 1 ? "file" : "files"}
              </div>
            )}
          </div>

          <div className="p-5 relative z-10">
            <p className="text-xl sm:text-2xl font-semibold gradient-text-indigo leading-tight mb-2">
              {project.outcomeMetric}
            </p>
            <p className="text-[12px] text-card-desc mb-3">{project.role}</p>

            <div className="flex items-center justify-between gap-3">
              <Link
                to={`/work/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] tracking-wider uppercase text-muted-foreground hover:text-card-title transition-colors"
              >
                Open case study →
              </Link>
              {hasFiles && (
                <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
                  {open ? "Close folder" : "Open folder"}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && hasFiles && (
          <motion.div
            key="files"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mt-2 rounded-2xl p-4 sm:p-5"
              style={{
                background: "hsla(var(--indigo), 0.04)",
                border: "1px solid hsla(var(--indigo), 0.12)",
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {files.map((f, i) => {
                  const inner = (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -4 }}
                      className="block bg-white rounded-xl overflow-hidden"
                      style={{
                        border: "1px solid hsla(var(--indigo), 0.12)",
                        boxShadow: "0 2px 8px hsla(var(--indigo), 0.06)",
                      }}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={f.image || "/placeholder.svg"}
                          alt={f.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-[12px] font-medium text-card-title leading-snug truncate">
                          {f.title}
                        </p>
                        {f.caption && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {f.caption}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                  const href = f.href || `/work/${project.slug}`;
                  const isExternal = /^https?:\/\//.test(href);
                  return isExternal ? (
                    <a key={i} href={href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      {inner}
                    </a>
                  ) : (
                    <Link key={i} to={href} onClick={(e) => e.stopPropagation()}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FolderCard;
