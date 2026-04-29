import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

/**
 * Closing CTA on the Work page — mirrors the About page contact card.
 * Email + LinkedIn only (per project rule).
 */
const WorkClosingCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { get } = useSiteContent("about");
  const heading = get("contact", "heading", "Let's talk.");
  const sub = get("contact", "sub", "farqmac@me.com · Sydney, Australia");

  return (
    <section
      ref={ref}
      className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-8 pt-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-8 sm:p-10 text-center"
      >
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
          Get in touch
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-card-title mb-2">
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{sub}</p>
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
            style={{
              borderColor: "hsla(var(--indigo), 0.4)",
              color: "hsl(var(--indigo))",
            }}
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkClosingCTA;
