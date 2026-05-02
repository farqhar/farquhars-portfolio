import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Mail } from "lucide-react";

/**
 * Persistent floating "Contact me" button.
 * Visible on every route except the home teaser ("/") and admin routes.
 * Opens a mailto: link to farqmac@me.com.
 */
const FloatingContactCTA = () => {
  const { pathname } = useLocation();
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  return (
    <motion.a
      href="mailto:farqmac@me.com"
      aria-label="Contact Farquhar via email"
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 inline-flex items-center gap-2 glass rounded-full pl-4 pr-5 py-3 text-xs sm:text-sm font-medium shadow-lg hover:bg-white/80 transition-colors"
      style={{
        color: "hsl(var(--indigo))",
        animation: "pulse-glow 3s ease-in-out infinite",
      }}
    >
      <Mail className="w-4 h-4" />
      <span>Contact me</span>
      <span aria-hidden>→</span>
    </motion.a>
  );
};

export default FloatingContactCTA;
