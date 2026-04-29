import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";

/* -------------------- Layout constants (SVG viewBox 1000 x 600) -------------------- */

const VB_W = 1000;
const VB_H = 600;

// Linear left half — gentle wave
// Brief (130, 380) -> Stakeholders (320, 200) -> System map (560, 380) -> enter loop at (700, 320)
const LEFT_PATH =
  "M 80 380 C 180 380, 220 200, 320 200 S 460 380, 560 380 S 660 320, 720 320";

// Loop circle (the iteration cycle)
const LOOP_CX = 820;
const LOOP_CY = 320;
const LOOP_R = 110;

// Ship sits at right of loop, Feedback at left of loop
const SHIP = { x: LOOP_CX + LOOP_R, y: LOOP_CY };
const FEEDBACK = { x: LOOP_CX - LOOP_R, y: LOOP_CY };

const TOTAL_LAPS = 3;

/* -------------------- Linear nodes (left half) -------------------- */

type LinearNode = {
  x: number;
  y: number;
  threshold: number;
  label: string;
  caption: string;
  // text placement relative to node
  side: "above" | "below";
};

const LINEAR_NODES: LinearNode[] = [
  {
    x: 80,
    y: 380,
    threshold: 0.1,
    label: "Brief",
    caption: "Write the brief before opening any tools.",
    side: "below",
  },
  {
    x: 320,
    y: 200,
    threshold: 0.2,
    label: "Stakeholders",
    caption: "Treat stakeholder management as the work.",
    side: "above",
  },
  {
    x: 560,
    y: 380,
    threshold: 0.34,
    label: "System map",
    caption: "Map the system end-to-end first.",
    side: "below",
  },
];

/* -------------------- Caption pill (HTML overlay) -------------------- */

const CaptionPill = ({
  xPct,
  yPct,
  label,
  caption,
  opacity,
  reduced,
  align = "center",
  maxWidth = "16ch",
}: {
  xPct: number;
  yPct: number;
  label: string;
  caption: string;
  opacity: MotionValue<number> | number;
  reduced: boolean;
  align?: "left" | "center" | "right";
  maxWidth?: string;
}) => {
  const translateX =
    align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: `translate(${translateX}, -50%)`,
        opacity: reduced ? 1 : (opacity as MotionValue<number>),
        maxWidth,
      }}
      className="pointer-events-none"
    >
      <div
        className="rounded-lg px-2.5 py-1.5"
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(4px)",
          border: "1px solid hsla(var(--indigo), 0.18)",
          boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
        }}
      >
        <p
          className="text-[10px] font-semibold mb-0.5"
          style={{
            color: "hsl(var(--indigo))",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          className="text-[11.5px] text-muted-foreground"
          style={{ lineHeight: 1.35 }}
        >
          {caption}
        </p>
      </div>
    </motion.div>
  );
};

/* -------------------- Linear node (SVG dot) -------------------- */

const LinearDot = ({
  m,
  scrollYProgress,
  reduced,
}: {
  m: LinearNode;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) => {
  const range: [number, number] = [
    Math.max(0, m.threshold - 0.04),
    m.threshold + 0.01,
  ];
  const opacity = useTransform(scrollYProgress, range, [0, 1]);
  const scale = useTransform(scrollYProgress, range, [0.4, 1]);

  return (
    <motion.g
      style={
        reduced
          ? undefined
          : { opacity, transformOrigin: `${m.x}px ${m.y}px`, scale }
      }
    >
      <circle
        cx={m.x}
        cy={m.y}
        r={20}
        fill="rgba(99,102,241,0.10)"
      />
      <circle
        cx={m.x}
        cy={m.y}
        r={9}
        fill="#ffffff"
        stroke="hsl(var(--indigo))"
        strokeWidth={1.6}
      />
      <circle cx={m.x} cy={m.y} r={3} fill="hsl(var(--indigo))" />
    </motion.g>
  );
};

/* -------------------- Loop nodes (Ship & Feedback) with pulse -------------------- */

const LoopNode = ({
  x,
  y,
  pulseValue,
  baseOpacity,
  color,
  reduced,
}: {
  x: number;
  y: number;
  pulseValue: MotionValue<number>;
  baseOpacity: MotionValue<number>;
  color: string;
  reduced: boolean;
}) => {
  return (
    <motion.g
      style={
        reduced
          ? undefined
          : {
              opacity: baseOpacity,
              transformOrigin: `${x}px ${y}px`,
              scale: pulseValue,
            }
      }
    >
      <circle cx={x} cy={y} r={22} fill={`${color}1A`} />
      <circle
        cx={x}
        cy={y}
        r={11}
        fill="#ffffff"
        stroke={color}
        strokeWidth={1.8}
      />
      <circle cx={x} cy={y} r={3.5} fill={color} />
    </motion.g>
  );
};

/* -------------------- Main component -------------------- */

const ProcessJourney = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Path drawing across left half + into loop
  const leftPathLength = useTransform(scrollYProgress, [0.04, 0.28], [0, 1]);
  const loopDrawLength = useTransform(scrollYProgress, [0.28, 0.38], [0, 1]);

  // Section labels
  const labelDiscover = useTransform(scrollYProgress, [0.03, 0.1], [0, 1]);
  const labelIterate = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);

  // Loop spin: 3 laps across the bulk of the scroll — held in the middle so the
  // rapid iteration phase remains visible for a long stretch of pinned scroll.
  const spinDeg = useTransform(
    scrollYProgress,
    [0.4, 0.88],
    [0, 360 * TOTAL_LAPS],
  );

  // Exit translation (off the right edge) — only at the very end so the loop
  // never disappears before the user has watched the laps.
  const exitX = useTransform(scrollYProgress, [0.94, 1], [0, 320]);
  const exitOpacity = useTransform(scrollYProgress, [0.94, 1], [1, 0]);

  // Lap counter
  const [lap, setLap] = useState(0);
  useMotionValueEvent(spinDeg, "change", (v) => {
    const next = Math.min(TOTAL_LAPS, Math.floor(v / 360));
    setLap(next);
  });

  // Pulse Ship (angle 0°) and Feedback (angle 180°) each time tracer crosses
  const shipPulse = useMotionValue(1);
  const feedbackPulse = useMotionValue(1);
  const lastDeg = useRef(0);

  useMotionValueEvent(spinDeg, "change", (v) => {
    const prev = lastDeg.current;
    // detect crossing of multiples of 360 (Ship) and 180 mod 360 (Feedback)
    const crossed = (target: number) => {
      const a = ((prev - target) % 360 + 360) % 360;
      const b = ((v - target) % 360 + 360) % 360;
      return a > 270 && b < 90 && v > prev;
    };
    if (crossed(0)) {
      shipPulse.set(1.25);
      setTimeout(() => shipPulse.set(1), 180);
    }
    if (crossed(180)) {
      feedbackPulse.set(1.25);
      setTimeout(() => feedbackPulse.set(1), 180);
    }
    lastDeg.current = v;
  });

  // Loop node base opacity — appear right as the loop draws in.
  const shipOpacity = useTransform(scrollYProgress, [0.32, 0.4], [0, 1]);
  const feedbackOpacity = useTransform(scrollYProgress, [0.34, 0.42], [0, 1]);

  // Caption opacities
  const captionOpacities = LINEAR_NODES.map((n) =>
    useTransform(
      scrollYProgress,
      [n.threshold + 0.005, n.threshold + 0.06],
      [0, 1],
    ),
  );
  const shipCaptionOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.44],
    [0, 1],
  );
  const feedbackCaptionOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.46],
    [0, 1],
  );
  const lapCounterOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.48],
    [0, 1],
  );

  // Helper: convert SVG coords to percentages for HTML overlay
  const xPct = (x: number) => (x / VB_W) * 100;
  const yPct = (y: number) => (y / VB_H) * 100;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
          {/* SVG layer */}
          <motion.svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full h-auto max-h-[78vh] block"
            preserveAspectRatio="xMidYMid meet"
            style={reduced ? undefined : { x: exitX, opacity: exitOpacity }}
          >
            <defs>
              <linearGradient id="journey-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--indigo))" />
                <stop offset="100%" stopColor="hsl(var(--purple))" />
              </linearGradient>
              <linearGradient id="loop-stroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--indigo))" />
                <stop offset="100%" stopColor="hsl(var(--purple))" />
              </linearGradient>
              <radialGradient id="tracer-glow">
                <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity="0" />
              </radialGradient>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--purple))" />
              </marker>
            </defs>

            {/* Faint baseline path (left) */}
            <path
              d={LEFT_PATH}
              fill="none"
              stroke="hsla(var(--indigo), 0.10)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Faint baseline loop */}
            <circle
              cx={LOOP_CX}
              cy={LOOP_CY}
              r={LOOP_R}
              fill="none"
              stroke="hsla(var(--indigo), 0.10)"
              strokeWidth={2}
            />

            {/* Animated drawing — left path */}
            <motion.path
              d={LEFT_PATH}
              fill="none"
              stroke="url(#journey-stroke)"
              strokeWidth={2.5}
              strokeLinecap="round"
              markerEnd="url(#arrow)"
              style={
                reduced
                  ? { pathLength: 1 }
                  : { pathLength: leftPathLength }
              }
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            />

            {/* Animated loop draw-in (one full circle) */}
            <motion.circle
              cx={LOOP_CX}
              cy={LOOP_CY}
              r={LOOP_R}
              fill="none"
              stroke="url(#loop-stroke)"
              strokeWidth={2.5}
              transform={`rotate(-90 ${LOOP_CX} ${LOOP_CY})`}
              style={
                reduced
                  ? { pathLength: 1 }
                  : { pathLength: loopDrawLength }
              }
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            />

            {/* Linear nodes */}
            {LINEAR_NODES.map((m) => (
              <LinearDot
                key={m.label}
                m={m}
                scrollYProgress={scrollYProgress}
                reduced={reduced}
              />
            ))}

            {/* Loop nodes */}
            <LoopNode
              x={SHIP.x}
              y={SHIP.y}
              pulseValue={shipPulse}
              baseOpacity={shipOpacity}
              color="hsl(var(--indigo))"
              reduced={reduced}
            />
            <LoopNode
              x={FEEDBACK.x}
              y={FEEDBACK.y}
              pulseValue={feedbackPulse}
              baseOpacity={feedbackOpacity}
              color="hsl(var(--purple))"
              reduced={reduced}
            />

            {/* Spinning tracer arc + dot */}
            {!reduced && (
              <motion.g
                style={{
                  rotate: spinDeg,
                  transformOrigin: `${LOOP_CX}px ${LOOP_CY}px`,
                  opacity: shipOpacity,
                }}
              >
                {/* comet arc — 110° */}
                <path
                  d={describeArc(LOOP_CX, LOOP_CY, LOOP_R, -110, 0)}
                  fill="none"
                  stroke="url(#loop-stroke)"
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={0.85}
                />
                {/* tracer head dot at 0° (right of circle) */}
                <circle
                  cx={LOOP_CX + LOOP_R}
                  cy={LOOP_CY}
                  r={14}
                  fill="url(#tracer-glow)"
                />
                <circle
                  cx={LOOP_CX + LOOP_R}
                  cy={LOOP_CY}
                  r={5}
                  fill="hsl(var(--purple))"
                />
              </motion.g>
            )}
          </motion.svg>

          {/* Section labels (HTML for crispness) */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${xPct(280)}%`,
              top: `${yPct(40)}%`,
              transform: "translate(-50%, -50%)",
              opacity: reduced ? 1 : labelDiscover,
            }}
          >
            <p
              className="text-[11px] font-semibold whitespace-nowrap"
              style={{
                color: "hsl(var(--card-title))",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Discover & Design
            </p>
          </motion.div>
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${xPct(LOOP_CX)}%`,
              top: `${yPct(40)}%`,
              transform: "translate(-50%, -50%)",
              opacity: reduced ? 1 : labelIterate,
            }}
          >
            <p
              className="text-[11px] font-semibold whitespace-nowrap"
              style={{
                color: "hsl(var(--purple))",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Rapid Iteration
            </p>
          </motion.div>

          {/* Linear node captions — placed well clear of path */}
          {/* Brief: below */}
          <CaptionPill
            xPct={xPct(80)}
            yPct={yPct(380 + 70)}
            label={LINEAR_NODES[0].label}
            caption={LINEAR_NODES[0].caption}
            opacity={captionOpacities[0]}
            reduced={reduced}
            align="left"
          />
          {/* Stakeholders: above */}
          <CaptionPill
            xPct={xPct(320)}
            yPct={yPct(200 - 80)}
            label={LINEAR_NODES[1].label}
            caption={LINEAR_NODES[1].caption}
            opacity={captionOpacities[1]}
            reduced={reduced}
          />
          {/* System map: below */}
          <CaptionPill
            xPct={xPct(560)}
            yPct={yPct(380 + 70)}
            label={LINEAR_NODES[2].label}
            caption={LINEAR_NODES[2].caption}
            opacity={captionOpacities[2]}
            reduced={reduced}
          />

          {/* Ship caption — outside-bottom-right of loop */}
          <CaptionPill
            xPct={xPct(SHIP.x + 30)}
            yPct={yPct(SHIP.y + 70)}
            label="Ship small"
            caption="Smallest useful version, fast."
            opacity={shipCaptionOpacity}
            reduced={reduced}
            align="left"
          />
          {/* Feedback caption — outside-top-left of loop */}
          <CaptionPill
            xPct={xPct(FEEDBACK.x - 30)}
            yPct={yPct(FEEDBACK.y - 70)}
            label="Feedback"
            caption="Prototype in days. Feedback is the only honest tool."
            opacity={feedbackCaptionOpacity}
            reduced={reduced}
            align="right"
          />

          {/* Lap counter under the loop */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${xPct(LOOP_CX)}%`,
              top: `${yPct(LOOP_CY + LOOP_R + 20)}%`,
              transform: "translate(-50%, 0)",
              opacity: reduced ? 1 : lapCounterOpacity,
            }}
          >
            <p
              className="text-[10px] font-semibold tabular-nums"
              style={{
                color: "hsl(var(--purple))",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Lap {reduced ? TOTAL_LAPS : Math.max(1, lap || 1)} / {TOTAL_LAPS}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Helpers -------------------- */

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

export default ProcessJourney;