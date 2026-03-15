import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2400);
    const t2 = setTimeout(() => setPhase(2), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay"
      style={{ background: "hsl(var(--hero-bg))" }}
    >
      {/* Floating animated gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(var(--blue), 0.2) 0%, transparent 70%)",
          top: "-15%",
          left: "-15%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(var(--purple), 0.2) 0%, transparent 70%)",
          bottom: "-15%",
          right: "-15%",
        }}
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -35, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Phase content */}
      <div className="relative z-10 text-center px-6 max-w-3xl min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-semibold"
                style={{ color: "hsl(var(--hero-foreground))" }}
              >
                My name is Farquhar.
              </h1>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p
                className="text-lg sm:text-2xl md:text-3xl font-medium italic"
                style={{ color: "hsl(var(--hero-muted))" }}
              >
                It's pronounced like Parker,
              </p>
              <p
                className="text-lg sm:text-2xl md:text-3xl font-medium italic mt-1"
                style={{ color: "hsl(var(--hero-muted))" }}
              >
                with an F.
              </p>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Name - letter stagger */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-8 sm:mb-12"
                style={{ color: "hsl(var(--hero-muted))" }}
              >
                {"FARQUHAR MACDOUGALL".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.p>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight"
                style={{ color: "hsl(var(--hero-foreground))" }}
              >
                Some people make things look good.
              </motion.h1>

              {/* Animated line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
                className="w-[60%] h-px my-4 sm:my-6 origin-left gradient-indigo"
              />

              {/* Gradient subtitle - fixed clipping */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-2xl sm:text-4xl md:text-5xl font-semibold gradient-text-indigo pb-2 overflow-visible"
              >
                I make things make sense.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator - only after phase 2 */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 z-10"
          >
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full bg-white/80"
                style={{ animation: "bounce-dot 1.8s ease-in-out infinite" }}
              />
            </div>
            <span className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
              Scroll to explore
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
