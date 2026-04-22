import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Reveal from "@/components/site/Reveal";
import PageTransition from "@/components/site/PageTransition";
import headshot from "@/assets/headshot-placeholder.jpg";

const howIWork = {
  discover: {
    heading: "Discover & Design",
    intro: "Understand the problem before reaching for the tool. Map the workflow before designing the screen.",
    points: [
      "Write the brief before opening Figma. If I can't say it, I can't ship it.",
      "Treat stakeholder management as the actual work, not friction around it.",
      "Map the system end-to-end before drawing a single component.",
    ],
  },
  iterate: {
    heading: "Rapid Iteration",
    intro: "Ship the smallest useful version, learn fast, and cut what isn't working.",
    points: [
      "Kill confused workflows instead of polishing them.",
      "Use AI to remove the boring parts so editorial judgement gets sharper.",
      "Prototype in days, not quarters — feedback is the only honest design tool.",
    ],
  },
};

const testimonials = [
  {
    quote: "Brought clarity to a process we'd been stuck on for months. The tooling he designed is now part of how we operate.",
    name: "[Stakeholder]",
    role: "Operations lead",
  },
  {
    quote: "Treats design and ops as the same problem. Rare combination — and exactly what we needed.",
    name: "[Director]",
    role: "Strategy & Brand",
  },
  {
    quote: "He'll tell you the honest version, not the polished one. That's why the work actually ships.",
    name: "[Engineering manager]",
    role: "Product team",
  },
];

const skills = {
  "Design foundation": ["Brand systems", "Type & layout", "Motion", "Web"],
  "AI Operations": ["Workflow design", "Internal tooling", "Process mapping", "Pilot evaluation"],
};

const thenNow = {
  then: {
    title: "Graphic Designer",
    body: "Brand systems, identity, type, motion. Working out what something is and how it should feel.",
    points: ["Visual systems", "Brand voice", "Editorial craft"],
  },
  now: {
    title: "AI Operations PM",
    body: "Designing AI workflows, internal tools, and the operating system around them. Same problem, different surface.",
    points: ["Workflow design", "Tooling roadmaps", "Cross-team translation"],
  },
};

/* -------------------- Mouse-reactive orb -------------------- */

const HeroOrb = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      x.set((e.clientX / w - 0.5) * 80);
      y.set((e.clientY / h - 0.5) * 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, hsla(var(--indigo), 0.22) 0%, hsla(var(--purple), 0.12) 40%, transparent 70%)",
      }}
      className="absolute -top-32 -right-20 w-[680px] h-[680px] rounded-full pointer-events-none blur-2xl"
    />
  );
};

/* -------------------- Then / Now -------------------- */

const ThenNow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-6 items-stretch mb-20"
    >
      {/* Then */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 sm:p-8 relative"
      >
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Then</p>
        <h3 className="text-xl font-semibold text-card-title mb-3">{thenNow.then.title}</h3>
        <p className="text-sm leading-relaxed text-card-desc mb-5">{thenNow.then.body}</p>
        <div className="flex flex-wrap gap-2">
          {thenNow.then.points.map((p) => (
            <span
              key={p}
              className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full"
              style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Connecting column — desktop only, lives in its own grid track */}
      <div className="hidden md:flex flex-col items-center justify-center w-[160px] pointer-events-none">
        <motion.svg width="160" height="60" viewBox="0 0 160 60" fill="none">
          <motion.path
            d="M 6 30 C 50 30, 110 30, 154 30"
            stroke="hsl(var(--indigo))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            fill="none"
          />
        </motion.svg>
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="text-center text-[9px] tracking-[0.22em] uppercase text-muted-foreground mt-2"
        >
          clarity · systems · craft
        </motion.p>
      </div>

      {/* Now */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 sm:p-8"
        style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px hsla(var(--indigo), 0.10)" }}
      >
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Now</p>
        <h3 className="text-xl font-semibold gradient-text-indigo mb-3">{thenNow.now.title}</h3>
        <p className="text-sm leading-relaxed text-card-desc mb-5">{thenNow.now.body}</p>
        <div className="flex flex-wrap gap-2">
          {thenNow.now.points.map((p) => (
            <span
              key={p}
              className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full"
              style={{ background: "hsla(var(--purple), 0.10)", color: "hsl(var(--purple))" }}
            >
              {p}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* -------------------- Now status card -------------------- */

const NowCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="inline-flex items-center gap-3 glass rounded-full pl-3 pr-5 py-2 mb-10"
  >
    <motion.span
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="w-2 h-2 rounded-full"
      style={{ background: "hsl(var(--indigo))", boxShadow: "0 0 10px hsl(var(--indigo))" }}
    />
    <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
      Currently · Building AI operations at <span className="text-card-title">[Company]</span>
    </p>
  </motion.div>
);

/* -------------------- Page -------------------- */

const About = () => {
  return (
    <PageTransition>
      <main className="pt-28 sm:pt-32 pb-24 relative overflow-hidden">
        <HeroOrb />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-4">About</p>
          </Reveal>

          <NowCard />

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.05] mb-6 max-w-3xl">
              I started in <span className="text-card-title">graphic design.</span><br />
              Now I build <span className="gradient-text-indigo">AI optimised workflows.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg leading-[1.7] text-card-desc max-w-2xl mb-20">
              The throughline is the same — act as a bridge between technical and non-technical departments,
              and make complicated things make sense. I'm Farquhar — I work where craft meets operations,
              most useful when the answer sits between a Figma file and a workflow.
            </p>
          </Reveal>

          {/* Then / Now */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">Then / Now</p>
          </Reveal>
          <ThenNow />

          {/* How I work */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">How I work</p>
          </Reveal>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
            {howIWork.map((line, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div layout className="glass rounded-2xl p-6 h-full">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2">0{i + 1}</p>
                  <p className="text-base leading-[1.6] text-card-title">{line}</p>
                </motion.div>
              </Reveal>
            ))}
          </motion.div>

          {/* Skills */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">Skills</p>
          </Reveal>
          <div className="space-y-5 mb-20">
            {Object.entries(skills).map(([group, items], gi) => (
              <Reveal key={group} delay={gi * 0.06}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground sm:w-44 shrink-0">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-full"
                        style={{ background: "hsla(var(--indigo), 0.08)", color: "hsl(var(--indigo))" }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contact */}
          <Reveal>
            <div className="glass rounded-2xl p-8 sm:p-10 text-center">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">Get in touch</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-card-title mb-2">Let's talk.</h2>
              <p className="text-sm text-muted-foreground mb-6">farqmac@me.com · Sydney, Australia</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:farqmac@me.com"
                  className="gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  Email me →
                </a>
                <a
                  href="https://www.linkedin.com/in/farquharm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-6 py-3 rounded-full border hover:bg-foreground/5 transition-colors w-full sm:w-auto"
                  style={{ borderColor: "hsla(var(--indigo), 0.4)", color: "hsl(var(--indigo))" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </PageTransition>
  );
};

export default About;
