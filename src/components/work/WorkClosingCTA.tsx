import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const WorkClosingCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-8 pt-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, hsla(var(--indigo), 0.10), transparent 70%)",
          }}
        />
        <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-4 relative">
          End of folder
        </p>
        <h2 className="text-2xl sm:text-4xl font-semibold leading-tight tracking-tight mb-4 relative">
          Want the <span className="gradient-text-indigo">full picture</span>?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 relative">
          The full portfolio has every case study, the back-of-house process,
          and the unedited honest reflections.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative">
          <a
            href="https://www.farquharmacdougall.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--indigo)), hsl(var(--blue)))",
              color: "white",
              boxShadow: "0 10px 28px hsla(var(--indigo), 0.30)",
            }}
          >
            See full portfolio <span>→</span>
          </a>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-colors duration-300"
            style={{
              borderColor: "hsla(var(--indigo), 0.30)",
              color: "hsl(var(--indigo))",
            }}
          >
            Get in touch
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkClosingCTA;
