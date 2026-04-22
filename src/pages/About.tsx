import Reveal from "@/components/site/Reveal";
import PageTransition from "@/components/site/PageTransition";

const howIWork = [
  "I write the email before I open Figma. If I can't say it, I can't design it.",
  "I'd rather kill a feature than ship a confused one.",
  "I treat stakeholder management as the actual work, not the friction around it.",
  "I use AI to remove the boring parts so the editorial judgment gets sharper, not lazier.",
];

const skills = {
  Direction: ["Creative Direction", "Brand Strategy", "Product Design"],
  Craft: ["Type Systems", "Motion", "Web", "Identity"],
  Operations: ["AI Workflow Design", "Internal Tooling", "Process Mapping"],
  Tools: ["Figma", "After Effects", "React", "Python", "Notion"],
};

const timeline = [
  { year: "2024 — Now", title: "Independent", body: "Founder of Wollip. Consulting on AI workflow + brand systems." },
  { year: "2022 — 2024", title: "CJC Group", body: "Creative direction across digital, motion, and internal comms automation." },
  { year: "2019 — 2022", title: "Studio + agency", body: "Brand and product design across early-stage and enterprise clients." },
  { year: "2015 — 2019", title: "Design education", body: "Communication design — type, systems, and the politics of clarity." },
];

const About = () => {
  return (
    <PageTransition>
      <main className="pt-28 sm:pt-32 pb-24 relative overflow-hidden">
        <div
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(var(--purple), 0.06) 0%, transparent 70%)" }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-4">About</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.05] mb-8 max-w-3xl">
              <span className="gradient-text-indigo">I bridge design thinking and AI operations.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg leading-[1.7] text-card-desc max-w-2xl mb-20">
              I'm Farquhar — a creative director who builds the systems behind the brand as carefully as the brand itself.
              I work where craft meets operations, and I tend to be useful when the answer is somewhere between a Figma file
              and a workflow.
            </p>
          </Reveal>

          {/* How I work */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">How I work</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
            {howIWork.map((line, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2">0{i + 1}</p>
                  <p className="text-base leading-[1.6] text-card-title">{line}</p>
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground sm:w-32 shrink-0">{group}</p>
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

          {/* Timeline */}
          <Reveal>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">Path</p>
          </Reveal>
          <div className="space-y-4 mb-20">
            {timeline.map((entry, i) => (
              <Reveal key={entry.year} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground sm:w-32 shrink-0">{entry.year}</p>
                  <div>
                    <p className="text-base font-semibold text-card-title mb-1">{entry.title}</p>
                    <p className="text-sm text-card-desc leading-relaxed">{entry.body}</p>
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