import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User as UserIcon, Shield, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

type SubLink = { to: string; title: string; desc: string };
type MegaItem = {
  label: string;
  to: string;
  blurb: string;
  image: string;
  links: SubLink[];
};

const megaMenu: MegaItem[] = [
  {
    label: "About",
    to: "/about",
    blurb:
      "Who we are, where we come from, and what we stand for as a community.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    links: [
      { to: "/about", title: "Our Story", desc: "Our journey and purpose" },
      { to: "/about", title: "Mission & Vision", desc: "What guides us" },
      { to: "/about", title: "Leadership", desc: "Meet our community leaders" },
      { to: "/about", title: "History", desc: "Generations of community life" },
      { to: "/about", title: "Our Values", desc: "What we hold dear" },
    ],
  },
  {
    label: "Events",
    to: "/events",
    blurb: "Gather, celebrate, and learn together year-round.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    links: [
      { to: "/events", title: "Upcoming Events", desc: "What's coming up" },
      { to: "/events", title: "Past Events", desc: "Look back at what we've done" },
      { to: "/events", title: "Holidays & Shabbat", desc: "Mark the calendar" },
      { to: "/events", title: "Register / RSVP", desc: "Save your spot" },
    ],
  },
  {
    label: "Programs",
    to: "/programs",
    blurb: "Pathways to learn, lead, serve, and belong.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    links: [
      { to: "/programs", title: "Education", desc: "Hebrew, Torah, lifelong learning" },
      { to: "/programs", title: "Youth", desc: "For our next generation" },
      { to: "/programs", title: "Cultural", desc: "Music, art, celebration" },
      { to: "/programs", title: "Community Support", desc: "Care & connection" },
      { to: "/programs", title: "Volunteer", desc: "Give your time and talent" },
    ],
  },
  {
    label: "News",
    to: "/news",
    blurb: "Stories, announcements, and updates from our community.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600",
    links: [
      { to: "/news", title: "Latest News", desc: "Fresh stories and reports" },
      { to: "/news", title: "Announcements", desc: "What you need to know" },
      { to: "/news", title: "Newsletter", desc: "Subscribe for updates" },
    ],
  },
  {
    label: "Gallery",
    to: "/gallery",
    blurb: "Moments from our gatherings, captured.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    links: [
      { to: "/gallery", title: "Photo Albums", desc: "Browse by event" },
      { to: "/gallery", title: "Videos", desc: "Recorded highlights" },
      { to: "/gallery", title: "Submit Photos", desc: "Share your memories" },
    ],
  },
  {
    label: "Membership",
    to: "/membership",
    blurb: "Join a warm, welcoming home for every member of the community.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600",
    links: [
      { to: "/membership", title: "Become a Member", desc: "Start your journey" },
      { to: "/membership", title: "Member Benefits", desc: "What's included" },
      { to: "/membership", title: "Renew", desc: "Keep your membership active" },
      { to: "/membership", title: "Member Directory", desc: "Connect with members" },
    ],
  },
  {
    label: "Donate",
    to: "/donate",
    blurb: "Help sustain our community and the work we do.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600",
    links: [
      { to: "/donate", title: "Ways to Give", desc: "Choose what works for you" },
      { to: "/donate", title: "Donation Instructions", desc: "Step-by-step guide" },
      { to: "/donate", title: "Sponsor a Program", desc: "Back what you love" },
      { to: "/donate", title: "FAQ", desc: "Common questions answered" },
    ],
  },
  {
    label: "Contact",
    to: "/contact",
    blurb: "Reach out — we'd love to hear from you.",
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600",
    links: [
      { to: "/contact", title: "Get in Touch", desc: "Send us a message" },
      { to: "/contact", title: "Visit Us", desc: "Find our community space" },
      { to: "/contact", title: "Leadership Contacts", desc: "Reach our leaders" },
      { to: "/contact", title: "Prayer Requests", desc: "We pray together" },
    ],
  },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-smooth",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/85 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto flex h-24 lg:h-28 items-center justify-between px-4 gap-4">
        <Link to="/" className="flex items-center shrink-0" aria-label="Kisii Jewish Community — Home">
          <Logo variant="navbar" />
        </Link>

        {/* Desktop mega menu */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-0">
              <NavigationMenuItem>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 text-sm font-medium transition-smooth",
                      isActive
                        ? "text-sky"
                        : "text-foreground/80 hover:text-primary",
                    )
                  }
                >
                  Home
                </NavLink>
              </NavigationMenuItem>

              {megaMenu.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-primary hover:bg-secondary/60 data-[state=open]:bg-secondary/60 data-[state=open]:text-primary text-sm font-medium px-3">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[640px] p-6 grid grid-cols-[1fr_240px] gap-6 bg-background">
                      <ul className="grid grid-cols-2 gap-2">
                        {item.links.map((sub) => (
                          <li key={sub.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={sub.to}
                                className="block p-3 hover:bg-sky-soft transition-smooth group"
                              >
                                <div className="font-display font-semibold text-primary group-hover:text-sky text-sm">
                                  {sub.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                  {sub.desc}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-sky text-sky-foreground p-5 flex flex-col justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-widest font-semibold opacity-80 mb-2">
                            {item.label}
                          </div>
                          <p className="text-sm leading-relaxed">{item.blurb}</p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="bg-background text-primary hover:bg-background/90 mt-4 uppercase tracking-wider text-xs font-semibold w-fit"
                        >
                          <Link to={item.to}>Explore {item.label}</Link>
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-7 w-7 rounded-full bg-sky text-sky-foreground flex items-center justify-center text-xs font-bold">
                    {(user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link to="/account"><UserIcon className="h-4 w-4 mr-2" /> My Account</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="h-4 w-4 mr-2" /> Admin Dashboard</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign in</Link></Button>
          )}
          <Button
            asChild
            size="sm"
            className="bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold"
          >
            <Link to="/membership">Join Us</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 hover:bg-secondary/60"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="container mx-auto py-3 px-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "block px-3 py-3 text-sm font-semibold border-b border-border",
                  isActive ? "text-sky" : "text-foreground/85",
                )
              }
            >
              Home
            </NavLink>

            <Accordion type="multiple" className="w-full">
              {megaMenu.map((item) => (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="px-3 py-3 text-sm font-semibold text-foreground/85 hover:no-underline hover:text-primary">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="pl-3 flex flex-col">
                      <Link
                        to={item.to}
                        className="py-2 text-sm font-medium text-sky"
                      >
                        All {item.label} →
                      </Link>
                      {item.links.map((sub) => (
                        <Link
                          key={sub.title}
                          to={sub.to}
                          className="py-2 text-sm text-foreground/75 hover:text-primary"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              asChild
              className="mt-4 w-full bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold"
            >
              <Link to="/membership">Join Us</Link>
            </Button>

            {user ? (
              <div className="mt-2 flex flex-col gap-1">
                <Button asChild variant="outline" className="w-full"><Link to="/account"><UserIcon className="h-4 w-4 mr-1" /> My Account</Link></Button>
                {isAdmin && <Button asChild variant="outline" className="w-full"><Link to="/admin"><Shield className="h-4 w-4 mr-1" /> Admin</Link></Button>}
                <Button variant="ghost" className="w-full" onClick={signOut}><LogOut className="h-4 w-4 mr-1" /> Sign out</Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="mt-2 w-full"><Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign in</Link></Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
