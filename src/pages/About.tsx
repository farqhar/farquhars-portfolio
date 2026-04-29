import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Reveal from "@/components/site/Reveal";
import PageTransition from "@/components/site/PageTransition";
import headshot from "@/assets/headshot-placeholder.jpg";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { useSiteContent } from "@/hooks/useSiteContent";

const howIWork = {
  discover: {
    heading: "Discover & Design",
     intro: "Understand the problem before reaching for the tool. Map the workflow before designing anything.",
    points: [
       "Write the brief before opening any tools. If I can't say it, I can't ship it.",
       "Treat stakeholder management as the work, not friction around it.",
      "Map the system end-to-end before drawing a single component.",
    ],
  },
  iterate: {
    heading: "Rapid Iteration",
    intro: "Ship the smallest useful version, learn fast, and cut what isn't working.",
    points: [
      "Kill confused workflows instead of polishing them.",
       "Use AI to remove the manual parts so judgement gets sharper.",
       "Prototype in days, feedback is the only honest design tool.",
    ],
  },
};

type Testimonial = { quote: string; name: string; role: string; avatar?: string };

const DEFAULT_TESTIMONIALS: Testimonial[] = [
   { quote: "Thank you for all the work you've done within the marketing team. There has been a lot of change, you've added enormous value beyond graphic design.", name: "JEN MANUEL", role: "MARKETING DIRECTOR" },
   { quote: "The genuine excitement and enthusiasm you bring to the workplace makes collaborating with you energising, and you’ve already had a great impact within the AIQ team.", name: "PATRICK CARROLL", role: "GENERAL MANAGER · AIQ INNOVATION" },
   { quote: "He'll tell you the honest version, not the polished one. That's why the work actually ships.", name: "[Director]", role: "MARKETING DIRECTOR · JACARANDA HUB" },
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
      {/* Then (flat) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 sm:p-8 relative"
        style={{ boxShadow: "none" }}
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

      {/* Now (highlighted) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 sm:p-8"
        style={{ boxShadow: "0 8px 16px rgba(0,0,0,0.06), 0 30px 80px hsla(var(--indigo), 0.35), 0 0 0 1px hsla(var(--indigo), 0.15)" }}
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

const NowCard = ({ status }: { status: string }) => (
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
    <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{status}</p>
  </motion.div>
);

/* -------------------- Page -------------------- */

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const { value: hs } = useSiteSetting<{ url: string }>("headshot_url");
  const { get } = useSiteContent("about");
  const headshotSrc = hs?.url || headshot;
   const status = get("hero", "status", "CURRENTLY · BUILDING AI OPERATIONS AT AIQ INNOVATION GROUP");
   const headline1 = get("hero", "headline1", "I started in design.");
  const headline2 = get("hero", "headline2", "Now I build AI optimised workflows.");
  const intro = get(
    "hero",
    "intro",
    "The concept is the same, act as a bridge between technical and non-technical departments, and translate complex ideas into digestible solutions.",
  );
  const contactHeading = get("contact", "heading", "Let's talk.");
  const contactSub = get("contact", "sub", "farqmac@me.com · Sydney, Australia");
  const testimonials = get<Testimonial[]>("testimonials", "items", DEFAULT_TESTIMONIALS);

  return (
    <PageTransition>
      <main className="pt-28 sm:pt-32 pb-24 relative overflow-hidden">
        <HeroOrb />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-4">About</p>
          </Reveal>

          <NowCard status={status} />

          {/* Hero with headshot */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 sm:gap-10 items-start mb-20">
            <div>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.05] mb-6 max-w-3xl">
                  <span className="text-card-title">{headline1}</span><br />
                  <span className="gradient-text-indigo">{headline2}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg leading-[1.7] text-card-desc max-w-2xl">{intro}</p>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div className="relative shrink-0">
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, hsla(var(--indigo), 0.35), transparent 70%)" }}
                />
                <img
                  src={headshotSrc}
                  alt="Farquhar MacDougall"
                  width={140}
                  height={140}
                  className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full object-cover"
                  style={{
                    boxShadow:
                      "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 5px hsla(var(--indigo), 0.35), 0 20px 40px hsla(var(--indigo), 0.18)",
                  }}
                />
              </div>
            </Reveal>
          </div>

          {/* Then / Now */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">Then / Now</p>
          </Reveal>
          <ThenNow />

          {/* How I work */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">How I work</p>
          </Reveal>
          <div className="space-y-14 mb-20">
            {([howIWork.discover, howIWork.iterate]).map((block, bi) => (
              <div key={block.heading}>
                <Reveal>
                  <h2 className="text-3xl sm:text-4xl font-semibold gradient-text-purple leading-tight mb-3">
                    {block.heading}
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="text-base leading-[1.7] text-card-desc max-w-2xl mb-6">
                    {block.intro}
                  </p>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {block.points.map((line, i) => (
                    <Reveal key={line} delay={0.1 + i * 0.06}>
                      <div className="glass rounded-2xl p-5 h-full">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
                          0{bi * 3 + i + 1}
                        </p>
                        <p className="text-sm leading-[1.55] text-card-title">{line}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">What people say</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full relative overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute -top-4 -left-1 text-[110px] font-serif leading-none pointer-events-none select-none"
                    style={{ color: "hsla(var(--indigo), 0.10)" }}
                  >
                    “
                  </span>
                  <p className="relative text-sm leading-[1.65] text-card-title mb-5">
                    {t.quote}
                  </p>
                  <div className="relative flex items-center gap-2.5">
                    {t.avatar && (
                      <img src={t.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    )}
                    <p className="text-[11px] tracking-wider uppercase text-muted-foreground">
                      {t.name} <span className="opacity-60">· {t.role}</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

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
              <h2 className="text-2xl sm:text-3xl font-semibold text-card-title mb-2">{contactHeading}</h2>
              <p className="text-sm text-muted-foreground mb-6">{contactSub}</p>
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
