import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

const Particles = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-[3px] h-[3px] rounded-full"
        style={{
          background: "hsla(var(--indigo), 0.4)",
          top: `${15 + Math.random() * 70}%`,
          left: `${5 + Math.random() * 90}%`,
          animation: `particle-drift-${i % 4} ${12 + i * 3}s ease-in-out infinite`,
          opacity: 0.15 + Math.random() * 0.2,
        }}
      />
    ))}
  </>
);

const CurtainLine = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { get } = useSiteContent("teaser");
  const line1 = get("cta", "line1", "If something here made you think —");
  const line2 = get("cta", "line2", "let's talk.");
  const email = get("cta", "email", "farqmac@me.com");
  const primaryLabel = get("cta", "primaryLabel", "See full portfolio →");
  const footer = get("cta", "footer", "Sydney, Australia · Available for opportunities");

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "hsl(var(--hero-bg))" }}
    >
      {/* Orbital gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(var(--blue), 0.15) 0%, transparent 70%)",
          animation: "orbit-1 30s linear infinite",
          top: "50%",
          left: "50%",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(var(--purple), 0.15) 0%, transparent 70%)",
          animation: "orbit-2 35s linear infinite",
          top: "50%",
          left: "50%",
        }}
      />

      {/* Particles */}
      <Particles />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">
        <CurtainLine delay={0}>
          <h2
            className="text-2xl sm:text-[28px] font-semibold leading-[1.3]"
            style={{ color: "hsl(var(--hero-foreground))" }}
          >
            {line1}
          </h2>
        </CurtainLine>
        <CurtainLine delay={0.15}>
          <h2
            className="text-2xl sm:text-[28px] font-semibold leading-[1.3] mb-6"
            style={{ color: "hsl(var(--hero-foreground))" }}
          >
            {line2}
          </h2>
        </CurtainLine>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm mb-8"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {email}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/work"
            className="gradient-indigo text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            {primaryLabel}
          </Link>
          <a
            href="https://www.linkedin.com/in/farquharm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-6 py-3 rounded-full border hover:bg-white/5 transition-colors w-full sm:w-auto text-center"
            style={{ borderColor: "hsla(var(--indigo), 0.4)", color: "hsl(var(--indigo))" }}
          >
            LinkedIn
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-[11px] mt-8"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {footer}
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
