import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSetting } from "@/hooks/useSiteSettings";

const footerFallback = {
  tagline: "A warm, welcoming home for every member of our community — built on tradition, learning, and care for one another.",
  columns: [
    { title: "Explore", links: [
      { label: "About Us", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Programs", href: "/programs" },
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
    ]},
    { title: "Get Involved", links: [
      { label: "Become a Member", href: "/membership" },
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/programs" },
      { label: "Contact Us", href: "/contact" },
    ]},
  ],
};

const contactFallback = { email: "hello@kisiijewish.org", phone: "+254 700 000 000", address: "Kisii Town, Kenya", hours: "" };
const socialFallback = { facebook: "", instagram: "", youtube: "", whatsapp: "" };

export const Footer = () => {
  const { data: footer } = useSetting<any>("footer", footerFallback);
  const { data: contact } = useSetting<any>("contact_info", contactFallback);
  const { data: social } = useSetting<any>("social_links", socialFallback);

  const f = footer ?? footerFallback;
  const c = contact ?? contactFallback;
  const s = social ?? socialFallback;

  const socialIcons: Array<{ key: string; icon: any; label: string }> = [
    { key: "facebook", icon: Facebook, label: "Facebook" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "youtube", icon: Youtube, label: "YouTube" },
    { key: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="mb-4 inline-block bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/15 backdrop-blur-sm">
            <Logo variant="footer" className="brightness-0 invert" />
          </div>
          <p className="text-sm text-primary-foreground/75 leading-relaxed">{f.tagline}</p>
        </div>

        {(f.columns ?? []).slice(0, 2).map((col: any, i: number) => (
          <div key={i}>
            <h4 className="font-display font-semibold text-base mb-4 text-primary-foreground">{col.title}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {(col.links ?? []).map((l: any, li: number) => (
                <li key={li}>
                  <Link to={l.href} className="hover:text-primary-foreground transition-smooth">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-primary-foreground">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            {c.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-foreground/70 shrink-0" />
                <span>{c.address}</span>
              </li>
            )}
            {c.phone && (
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary-foreground/70 shrink-0" />
                <span>{c.phone}</span>
              </li>
            )}
            {c.email && (
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary-foreground/70 shrink-0" />
                <span>{c.email}</span>
              </li>
            )}
          </ul>
          <div className="flex gap-3 mt-5">
            {socialIcons.map(({ key, icon: Icon, label }) =>
              s[key] ? (
                <a key={key} href={s[key]} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-smooth" aria-label={label}>
                  <Icon className="h-4 w-4" />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Kisiijewish Community. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary-foreground transition-smooth">Privacy Policy</Link>
            <span aria-hidden className="opacity-40">·</span>
            <Link to="/terms" className="hover:text-primary-foreground transition-smooth">Terms of Service</Link>
            <span aria-hidden className="hidden sm:inline opacity-40">·</span>
            <span className="hidden sm:inline">Built with care for our community</span>
          </nav>
        </div>
      </div>
    </footer>
  );
};
