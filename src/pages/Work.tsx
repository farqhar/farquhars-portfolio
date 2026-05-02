import { motion } from "framer-motion";
import { useEffect } from "react";
import PageTransition from "@/components/site/PageTransition";
import { useSiteContent } from "@/hooks/useSiteContent";
import ProjectDeck from "@/components/ProjectDeck";
import WorkClosingCTA from "@/components/work/WorkClosingCTA";

/* -------------------- Hero highlights -------------------- */

const highlights = [
  { value: "$12.7M", label: "inefficiency identified", caveat: "across one engineering firm" },
  { value: "124", label: "pain points mapped", caveat: "quantified and prioritised" },
  { value: "40+", label: "stakeholders interviewed", caveat: "across departments" },
  { value: "v2", label: "AIQ ROI Platform", caveat: "phased commercialisation" },
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

/* -------------------- Page -------------------- */

const Work = () => {
  const { get } = useSiteContent("work");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const heroEyebrow = get("hero", "eyebrow", "I bridge design and AI operations");
  const heroSubhead = get(
    "hero",
    "subhead",
    "Eight projects. Real outcomes. Here's what I bring to my work.",
  );
  const cmsHighlights = highlights.map((h, i) => ({
    value: get("highlights", `v${i + 1}`, h.value),
    label: get("highlights", `l${i + 1}`, h.label),
    caveat: get("highlights", `c${i + 1}`, h.caveat),
  }));

  return (
    <PageTransition>
       <main className="pt-24 pb-24 sm:pt-[118px] sm:pb-[20px]">
        {/* Hero wrapper — overflow-hidden here only to clip the ambient orbs,
            kept separate so position:sticky inside ProjectDeck is not broken */}
        <div className="relative overflow-hidden">
          {/* ambient orbs */}
          <div
            className="absolute top-0 left-10 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsla(var(--indigo), 0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-10 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsla(var(--blue), 0.05) 0%, transparent 70%)",
            }}
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
                    transition={{
                      duration: 0.6,
                      delay: 0.9 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 1.1 + i * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        transformOrigin: "left",
                        background: "hsla(var(--indigo), 0.4)",
                      }}
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
            </section>
          </div>
        </div>

        {/* Scroll-driven card deck — no overflow on ancestors above this point */}
        <ProjectDeck />

        {/* Closing CTA */}
        <WorkClosingCTA />
      </main>
    </PageTransition>
  );
};

export default Work;
