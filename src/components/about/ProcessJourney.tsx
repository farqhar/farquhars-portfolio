import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import { useRef } from "react";

/* -------------------- Data -------------------- */

type Milestone = {
  x: number;
  y: number;
  threshold: number; // 0..1 along scroll progress
  label: string;
  caption: string;
  icon: "brief" | "stakeholders" | "map" | "ship" | "ai" | "feedback";
};

// SVG viewBox: 1200 x 420
// Left arc (Discover) rises and dips, then a circular loop (Iterate) on the right.
const PATH_D =
  "M 60 320 C 180 60, 320 60, 440 320 S 640 580, 760 320 A 140 140 0 1 1 760 319.9";

const MILESTONES: Milestone[] = [
  { x: 130, y: 230, threshold: 0.12, label: "Brief", caption: "Write the brief before opening tools.", icon: "brief" },
  { x: 250, y: 110, threshold: 0.24, label: "Stakeholders", caption: "Treat stakeholder management as the work.", icon: "stakeholders" },
  { x: 440, y: 320, threshold: 0.38, label: "System map", caption: "Map the system end-to-end first.", icon: "map" },
  { x: 760, y: 320, threshold: 0.55, label: "Ship small", caption: "Smallest useful version, fast.", icon: "ship" },
  { x: 900, y: 460, threshold: 0.72, label: "AI leverage", caption: "Remove the manual parts so judgement sharpens.", icon: "ai" },
  { x: 900, y: 180, threshold: 0.9, label: "Feedback", caption: "Prototype in days. Feedback is the only honest tool.", icon: "feedback" },
];

/* -------------------- Icon glyphs -------------------- */

const Glyph = ({ name }: { name: Milestone["icon"] }) => {
  const stroke = "hsl(var(--indigo))";
  const sw = 1.6;
  switch (name) {
    case "brief":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x={-7} y={-8} width={14} height={16} rx={2} />
          <path d="M -4 -3 H 4 M -4 1 H 4 M -4 5 H 1" />
        </g>
      );
    case "stakeholders":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={-4} cy={-2} r={3} />
          <circle cx={4} cy={-2} r={3} />
          <path d="M -9 7 C -9 3, -1 3, -1 7 M 1 7 C 1 3, 9 3, 9 7" />
        </g>
      );
    case "map":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M -8 -6 L -2 -8 L 4 -6 L 8 -8 V 6 L 4 8 L -2 6 L -8 8 Z" />
          <path d="M -2 -8 V 6 M 4 -6 V 8" />
        </g>
      );
    case "ship":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 0 -8 C 4 -4, 6 0, 6 4 C 6 7, 3 9, 0 9 C -3 9, -6 7, -6 4 C -6 0, -4 -4, 0 -8 Z" />
          <circle cx={0} cy={2} r={1.5} />
        </g>
      );
    case "ai":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" />
        </g>
      );
    case "feedback":
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M -7 -2 A 7 7 0 0 1 6 -5" />
          <path d="M 6 -8 V -5 H 3" />
          <path d="M 7 2 A 7 7 0 0 1 -6 5" />
          <path d="M -6 8 V 5 H -3" />
        </g>
      );
  }
};

/* -------------------- Node -------------------- */

const Node = ({
  m,
  scrollYProgress,
  reduced,
}: {
  m: Milestone;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) => {
  const fadeRange: [number, number] = [Math.max(0, m.threshold - 0.05), m.threshold];
  const opacity = useTransform(scrollYProgress, fadeRange, [0, 1]);
  const scale = useTransform(scrollYProgress, fadeRange, [0.6, 1]);
  const captionY = useTransform(scrollYProgress, fadeRange, [8, 0]);

  const captionAbove = m.y > 300;
  const captionOffset = captionAbove ? -54 : 38;
  const labelOffset = captionAbove ? -38 : 22;

  return (
    <motion.g
      style={reduced ? undefined : { opacity, transform: undefined }}
      initial={reduced ? { opacity: 1 } : false}
    >
      {/* Halo */}
      <motion.circle
        cx={m.x}
        cy={m.y}
        r={22}
        fill="rgba(99, 102, 241, 0.10)"
        style={reduced ? undefined : { scale, transformOrigin: `${m.x}px ${m.y}px` }}
      />
      {/* Disc */}
      <circle cx={m.x} cy={m.y} r={14} fill="#ffffff" stroke="hsl(var(--indigo))" strokeWidth={1.4} />
      {/* Icon */}
      <g transform={`translate(${m.x} ${m.y})`}>
        <Glyph name={m.icon} />
      </g>
      {/* Label */}
      <text
        x={m.x}
        y={m.y + labelOffset}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        letterSpacing={1.2}
        fill="hsl(var(--indigo))"
        style={{ textTransform: "uppercase" }}
      >
        {m.label}
      </text>
      {/* Caption */}
      <motion.text
        x={m.x}
        y={m.y + captionOffset}
        textAnchor="middle"
        fontSize={12}
        fill="hsl(var(--muted-foreground))"
        style={reduced ? undefined : { y: captionY }}
      >
        {m.caption}
      </motion.text>
    </motion.g>
  );
};

/* -------------------- ProcessJourney -------------------- */

const ProcessJourney = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  // Path drawing — most of the path draws across the middle of the scroll range.
  const pathLength = useTransform(scrollYProgress, [0.05, 0.92], [0, 1]);
  const sectionLabelDiscover = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const sectionLabelIterate = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-24 h-[80vh] flex items-center">
        <div className="w-full">
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-auto max-h-[70vh]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="journey-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--indigo))" />
                <stop offset="100%" stopColor="hsl(var(--purple))" />
              </linearGradient>
              <filter id="journey-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Section labels */}
            <motion.text
              x={250}
              y={40}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              letterSpacing={2.4}
              fill="hsl(var(--card-title))"
              style={reduced ? undefined : { opacity: sectionLabelDiscover }}
              initial={reduced ? { opacity: 1 } : false}
            >
              DISCOVER & DESIGN
            </motion.text>
            <motion.text
              x={830}
              y={40}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              letterSpacing={2.4}
              fill="hsl(var(--purple))"
              style={reduced ? undefined : { opacity: sectionLabelIterate }}
              initial={reduced ? { opacity: 1 } : false}
            >
              RAPID ITERATION
            </motion.text>

            {/* Faint baseline path (full) */}
            <path
              d={PATH_D}
              fill="none"
              stroke="rgba(99, 102, 241, 0.10)"
              strokeWidth={2}
              strokeLinecap="round"
            />

            {/* Animated drawing path */}
            <motion.path
              d={PATH_D}
              fill="none"
              stroke="url(#journey-stroke)"
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#journey-glow)"
              style={reduced ? { pathLength: 1 } : { pathLength }}
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            />

            {/* Milestone nodes */}
            {MILESTONES.map((m) => (
              <Node key={m.label} m={m} scrollYProgress={scrollYProgress} reduced={reduced} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProcessJourney;