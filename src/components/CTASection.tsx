import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", transform: "translate(-40%, -40%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", transform: "translate(40%, 40%)" }} />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-[28px] font-semibold leading-[1.3] mb-6"
          style={{ color: "#f1f5f9" }}
        >
          If something here made you think —
          <br />
          let's talk.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm mb-8"
          style={{ color: "#64748b" }}
        >
          farqmac@me.com
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#"
            className="gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
          >
            See full portfolio →
          </a>
          <a
            href="https://www.linkedin.com/in/farquharm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-6 py-3 rounded-full border hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
            style={{ borderColor: "rgba(99,102,241,0.4)", color: "#818cf8" }}
          >
            LinkedIn
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[11px] mt-8"
          style={{ color: "#475569" }}
        >
          Sydney, Australia · Available for opportunities
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
