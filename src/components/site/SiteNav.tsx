import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

const SiteNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  if (location.pathname === "/" || location.pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors"
        >
          Farquhar MacDougall
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px]">
            <nav className="flex flex-col gap-6 mt-10">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.18em] uppercase ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default SiteNav;