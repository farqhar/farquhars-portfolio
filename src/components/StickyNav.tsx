import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const StickyNav = () => {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > window.innerHeight * 0.8);
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span
          className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-foreground/70"
        >
          Farquhar MacDougall
        </span>
        <Link
          to="/work"
          className="gradient-indigo text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          See full portfolio →
        </Link>
      </div>
    </motion.nav>
  );
};

export default StickyNav;
