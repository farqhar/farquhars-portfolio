import { Link, useLocation } from "react-router-dom";

const SiteFooter = () => {
  const location = useLocation();
  if (location.pathname === "/" || location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-foreground/5 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
            Farquhar MacDougall
          </p>
          <p className="text-sm text-card-desc max-w-xs leading-relaxed">
            Bridging design and AI operations. I make complicated things make sense.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] tracking-[0.18em] uppercase">
          <Link to="/work" className="text-muted-foreground hover:text-foreground transition-colors">
            Work
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <a
            href="https://www.linkedin.com/in/farquharm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:farqmac@me.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6 flex items-center justify-between text-[10px] text-muted-foreground/70">
        <span>© {new Date().getFullYear()} Farquhar MacDougall</span>
        <Link
          to="/admin"
          className="tracking-[0.18em] uppercase hover:text-foreground/60 transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
};

export default SiteFooter;
