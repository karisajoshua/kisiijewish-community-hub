import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Star } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center">
              <Star className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="font-display font-bold text-lg">Kisiijewish</div>
          </div>
          <p className="text-sm text-primary-foreground/75 leading-relaxed">
            A warm, welcoming home for every member of our community — built on tradition, learning, and care for one another.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-accent">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-accent transition-smooth">About Us</Link></li>
            <li><Link to="/events" className="hover:text-accent transition-smooth">Events</Link></li>
            <li><Link to="/programs" className="hover:text-accent transition-smooth">Programs</Link></li>
            <li><Link to="/news" className="hover:text-accent transition-smooth">News</Link></li>
            <li><Link to="/gallery" className="hover:text-accent transition-smooth">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-accent">Get Involved</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/membership" className="hover:text-accent transition-smooth">Become a Member</Link></li>
            <li><Link to="/donate" className="hover:text-accent transition-smooth">Donate</Link></li>
            <li><Link to="/programs" className="hover:text-accent transition-smooth">Volunteer</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-smooth">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-accent">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>Kisii Town, Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>+254 700 000 000</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>hello@kisiijewish.org</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-smooth" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-smooth" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-smooth" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Kisiijewish Community. All rights reserved.</p>
          <p>Built with care for our community</p>
        </div>
      </div>
    </footer>
  );
};
