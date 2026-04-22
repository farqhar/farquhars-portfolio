import { Link, useLocation } from "react-router-dom";

/**
 * Tiny, fixed admin entry point shown bottom-left on every page except /admin itself.
 * Sits clear of the bottom-right floating CTA used on the teaser.
 */
const AdminLink = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <Link
      to="/admin"
      aria-label="Admin"
      className="fixed bottom-3 left-3 z-40 text-[9px] tracking-[0.22em] uppercase text-muted-foreground/40 hover:text-muted-foreground transition-colors px-2 py-1"
    >
      Admin
    </Link>
  );
};

export default AdminLink;