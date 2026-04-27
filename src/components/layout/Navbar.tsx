import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/programs", label: "Programs" },
  { to: "/news", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/membership", label: "Membership" },
  { to: "/donate", label: "Donate" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-smooth",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center shadow-gold">
            <Star className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-primary text-lg">Kisiijewish</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Community</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-smooth",
                  isActive
                    ? "text-accent"
                    : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
            <Link to="/membership">Join Us</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-secondary/60"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container mx-auto flex flex-col py-3 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium",
                    isActive ? "bg-secondary text-accent" : "text-foreground/80 hover:bg-secondary/60"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button asChild className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/membership" onClick={() => setOpen(false)}>Join Us</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
