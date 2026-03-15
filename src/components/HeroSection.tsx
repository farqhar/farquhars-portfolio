import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay" style={{ background: "#0a0a1a" }}>
      {/* Radial gradient orbs */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          transform: "translate(30%, 30%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-8 sm:mb-12"
          style={{ color: "#94a3b8" }}
        >
          Farquhar MacDougall
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight"
          style={{ color: "#f1f5f9" }}
        >
          Some people make things look good.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-2xl sm:text-4xl md:text-5xl font-semibold mt-3 sm:mt-4 gradient-text-indigo"
        >
          I make things make sense.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-3 z-10"
      >
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full bg-white/80"
            style={{ animation: "bounce-dot 1.8s ease-in-out infinite" }}
          />
        </div>
        <span className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "#64748b" }}>
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
