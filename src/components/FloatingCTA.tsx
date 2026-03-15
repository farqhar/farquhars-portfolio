import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > window.innerHeight * 0.5);
  });

  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        pointerEvents: visible ? "auto" as const : "none" as const,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 gradient-indigo text-primary-foreground text-xs sm:text-sm font-medium px-5 py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
      style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
    >
      See full portfolio →
    </motion.a>
  );
};

export default FloatingCTA;
