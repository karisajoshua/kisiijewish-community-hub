import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  ShieldAlert,
  BookOpen,
  Users,
  HandHeart,
  Mail,
  CalendarDays,
  Newspaper,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAnnouncements, useEvents, useNews } from "@/hooks/useContent";
import { useSetting } from "@/hooks/useSiteSettings";
import { format, parseISO } from "date-fns";

const heroFallback = {
  eyebrow: "KISIIJEWISH",
  title: "COMMUNITY",
  subtitle: "TOGETHER · 2026",
  tagline: ["Faith", "Family", "Tradition"],
  image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800",
  cta_label: "2026 Community Gathering",
  primary_cta: { label: "Register", href: "/events" },
  secondary_cta: { label: "Join Us", href: "/membership" },
};

const promiseFallback = {
  headline_top: "OUR",
  headline_mid: "COMMUNITY",
  headline_bottom: "PROMISE",
  line1: "Proudly Jewish.",
  line2: "Standing together — it's what we do.",
  video_image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
};

const prioritiesFallback = [
  { label: "Heritage", body: "Preserving the traditions, language, and stories that shape who we are — for our children and the generations to come." },
  { label: "Education", body: "Hebrew classes, Torah study, and lifelong learning circles open to every member of the community." },
  { label: "Community Support", body: "Caring for elders, families in need, and welcoming newcomers with warmth and practical help." },
  { label: "Youth & Identity", body: "Investing in the next generation through mentorship, leadership retreats, and proud Jewish identity." },
];

const ctaStripFallback = {
  heading: "Will you stand with our community?",
  buttons: [
    { label: "Donate", href: "/donate" },
    { label: "Get Involved", href: "/membership" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const discoverTiles = [
  { icon: Users, label: "Community Directory", to: "/about" },
  { icon: HandHeart, label: "Our Programs", to: "/programs" },
  { icon: BookOpen, label: "Education", to: "/programs" },
  { icon: CalendarDays, label: "Community Calendar", to: "/events" },
  { icon: Newspaper, label: "News & Updates", to: "/news" },
  { icon: Mail, label: "Contact Us", to: "/contact" },
];

const Home = () => {
  const { data: announcements } = useAnnouncements();
  const { data: events } = useEvents(false);
  const { data: news } = useNews();
  const { data: heroData } = useSetting<any>("hero", heroFallback);
  const { data: promiseData } = useSetting<any>("promise", promiseFallback);
  const { data: prioritiesData } = useSetting<any[]>("priorities", prioritiesFallback);
  const { data: ctaStripData } = useSetting<any>("cta_strip", ctaStripFallback);

  const hero = heroData ?? heroFallback;
  const promise = promiseData ?? promiseFallback;
  const priorities = (prioritiesData ?? prioritiesFallback) as Array<{ label: string; body: string }>;
  const ctaStrip = ctaStripData ?? ctaStripFallback;

  const featuredEvent = events?.[0];
  const slides = announcements ?? [];
  const [slide, setSlide] = useState(0);
  const current = slides[slide % Math.max(slides.length, 1)];


  const featuredNews = news?.slice(0, 3) ?? [];

  return (
    <>
      {/* HERO — featured event with overlay badge */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[420px] max-h-[640px] overflow-hidden">
          <img
            src={
              featuredEvent?.image_url ||
              "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800"
            }
            alt={featuredEvent?.title || "Community gathering"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent" />

          {/* Floating headline badge */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-sky/95 text-sky-foreground rounded-md shadow-soft px-8 py-7 md:px-12 md:py-10 max-w-2xl text-center fade-in-up">
              <div className="font-display font-extrabold leading-[0.95] tracking-tight">
                <span className="block text-2xl md:text-3xl">KISIIJEWISH</span>
                <span className="block text-5xl md:text-7xl mt-1">
                  COMMUNITY
                </span>
                <span className="block text-base md:text-lg font-semibold tracking-[0.3em] mt-3">
                  TOGETHER · 2026
                </span>
              </div>
              <div className="mt-5 flex items-center justify-center gap-4 text-xs md:text-sm font-semibold uppercase tracking-wider text-sky-foreground/90">
                <span>Faith</span>
                <span className="h-1 w-1 rounded-full bg-sky-foreground/70" />
                <span>Family</span>
                <span className="h-1 w-1 rounded-full bg-sky-foreground/70" />
                <span>Tradition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar under hero */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider">
              {featuredEvent
                ? featuredEvent.title
                : "2026 Community Gathering"}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-background text-primary hover:bg-background/90 font-semibold uppercase tracking-wider"
              >
                <Link to="/events">Register</Link>
              </Button>
              <Button
                asChild
                className="bg-background text-primary hover:bg-background/90 font-semibold uppercase tracking-wider"
              >
                <Link to="/membership">Join Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement carousel strip */}
      {slides.length > 0 && current && (
        <section className="bg-sky-soft py-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-[1fr_2fr_auto] gap-6 items-center">
              <div className="aspect-[16/10] rounded-md overflow-hidden bg-muted shadow-card">
                <img
                  src={
                    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900"
                  }
                  alt={current.message}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-snug">
                  {current.message}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Our community is strongest when we all show up. Stay informed,
                  attend our gatherings, and help shape what comes next for the
                  Kisiijewish Community.
                </p>
                <Button
                  asChild
                  className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider"
                >
                  <Link to={current.link || "/news"}>Learn more</Link>
                </Button>
                <div className="mt-5 flex items-center gap-2">
                  {slides.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-smooth ${
                        i === slide % slides.length
                          ? "bg-primary"
                          : "bg-primary/25"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-3">
                <button
                  onClick={() =>
                    setSlide((s) => (s - 1 + slides.length) % slides.length)
                  }
                  className="h-10 w-10 rounded-full bg-background text-primary border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSlide((s) => (s + 1) % slides.length)}
                  className="h-10 w-10 rounded-full bg-background text-primary border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Big bold campaign block */}
      <section className="relative bg-sky text-sky-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_85%_30%,white,transparent_55%)]" />
        <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="font-display font-extrabold uppercase leading-[0.9] tracking-tight">
              <div className="text-2xl md:text-3xl text-primary">OUR</div>
              <div className="text-5xl md:text-7xl mt-1">COMMUNITY</div>
              <div className="text-5xl md:text-7xl">PROMISE</div>
            </div>
            <div className="mt-8 space-y-2">
              <div className="font-display text-2xl md:text-3xl font-extrabold uppercase text-primary leading-tight">
                Proudly Jewish.
              </div>
              <div className="font-display text-2xl md:text-3xl font-extrabold uppercase text-sky-foreground leading-tight">
                Standing together — it's what we do.
              </div>
            </div>
          </div>
          <div>
            <div className="aspect-video rounded-lg overflow-hidden bg-primary/30 shadow-soft relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200"
                alt="Why our community matters"
                className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
              />
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <PlayCircle className="h-20 w-20 text-background drop-shadow-lg" strokeWidth={1.2} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button asChild className="bg-background text-primary hover:bg-background/90 uppercase tracking-wider font-semibold">
                <Link to="/donate">Donate</Link>
              </Button>
              <Button asChild className="bg-background text-primary hover:bg-background/90 uppercase tracking-wider font-semibold">
                <Link to="/membership">Get Involved</Link>
              </Button>
              <Button asChild className="bg-background text-primary hover:bg-background/90 uppercase tracking-wider font-semibold">
                <Link to="/contact">Contact</Link>
              </Button>
              <Button asChild className="bg-background text-primary hover:bg-background/90 uppercase tracking-wider font-semibold">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro card "Our world is changing" */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-sky-soft rounded-md overflow-hidden grid md:grid-cols-[2fr_1fr]">
            <div className="p-8 md:p-12">
              <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase text-primary leading-[0.95]">
                Our community is growing
              </h2>
              <p className="mt-5 text-foreground/85 leading-relaxed max-w-prose">
                Across generations, the Kisiijewish Community has been a place
                to gather, learn, celebrate, and care for one another. As our
                world changes, we stay grounded in tradition — and we open our
                doors wider, together. Pooling our time and our generosity is
                how we make the biggest possible impact.
              </p>
            </div>
            <div className="min-h-[220px] md:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900"
                alt="Community celebration"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why we exist + accordion */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="font-display font-extrabold uppercase leading-[0.9] tracking-tight">
              <div className="text-xl md:text-2xl text-primary">A community that</div>
              <div className="text-5xl md:text-7xl text-sky mt-2">SHOWS</div>
              <div className="text-5xl md:text-7xl text-sky">UP</div>
            </div>
          </div>
          <div className="text-foreground/85 leading-relaxed space-y-4">
            <p>
              Your involvement strengthens our community, locally and beyond, at
              a moment when we are being asked to stand together more than ever.
              Every act — from learning, to volunteering, to giving — helps us
              continue caring for those who depend on us.
            </p>
            <p>
              This year, we are focused on four shared priorities. Each one
              represents the people, places, and traditions that hold our
              community together.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-10">
          <Accordion type="single" collapsible className="w-full">
            {priorities.map((p) => (
              <AccordionItem key={p.key} value={p.key} className="border-b border-border">
                <AccordionTrigger className="py-5 hover:no-underline">
                  <span className="inline-flex items-center justify-center bg-sky text-sky-foreground font-display font-extrabold uppercase tracking-wider px-4 py-2 text-sm md:text-base">
                    {p.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/85 leading-relaxed pb-6 pl-1">
                  {p.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At a time when there is so much asked of communities like ours, the
            foundations must remain strong. Together we continue our care work,
            support families, and pass on what matters most.
          </p>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-sky-soft py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase text-primary">
            Will you stand with our community?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider font-semibold px-8">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider font-semibold px-8">
              <Link to="/membership">Get Involved</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider font-semibold px-8">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Spread Kindness */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase text-sky leading-tight">
              Share a moment with someone you love
            </h2>
            <p className="mt-5 text-foreground/85 leading-relaxed">
              Celebrate a bar/bat mitzvah, welcome a new baby, offer sympathy,
              or simply let a friend know you're thinking of them. Send a
              Kisiijewish greeting card and share life's everyday moments with
              the people you care about.
            </p>
            <p className="mt-3 font-semibold text-foreground">
              Send instantly or schedule for a special date.
            </p>
            <Button asChild className="mt-6 bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold">
              <Link to="/contact">Send a card</Link>
            </Button>
          </div>
          <div className="relative h-[260px] md:h-[340px]">
            <div className="absolute top-2 right-8 w-48 md:w-64 aspect-[4/5] bg-sky-soft rounded-lg shadow-card rotate-6 flex items-center justify-center p-6 text-center">
              <div className="font-display font-extrabold uppercase text-primary text-xl md:text-2xl leading-tight">
                Mazal Tov<br/>on your<br/>simcha!
              </div>
            </div>
            <div className="absolute bottom-2 left-8 w-48 md:w-64 aspect-[4/5] bg-accent-soft rounded-lg shadow-soft -rotate-6 flex items-center justify-center p-6 text-center">
              <div className="font-display font-extrabold uppercase text-primary text-xl md:text-2xl leading-tight">
                Thinking<br/>of you,<br/>chaver
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest news */}
      {featuredNews.length > 0 && (
        <section className="py-16 gradient-warm">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase text-primary">
                Latest from the community
              </h2>
              <Link to="/news" className="hidden md:inline-flex items-center gap-1 text-sky font-semibold uppercase tracking-wider text-sm hover:text-primary">
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredNews.map((post: any) => (
                <Link to={`/news/${post.slug}`} key={post.id} className="group">
                  <Card className="overflow-hidden border-border bg-card shadow-card hover:shadow-soft transition-smooth h-full flex flex-col">
                    {post.image_url && (
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img src={post.image_url} alt={post.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs uppercase tracking-wider text-sky font-bold mb-2">{post.category}</div>
                      <h3 className="font-display text-xl font-bold text-primary mb-2 leading-snug">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="mt-4 text-xs text-muted-foreground">{format(parseISO(post.published_at), "MMM d, yyyy")}</div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Safety / See something */}
      <section className="py-16 border-t border-b border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-[2fr_1fr] gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              See something? Say something.
            </h2>
            <p className="mt-4 text-foreground/85 leading-relaxed max-w-2xl">
              If you've experienced a hate incident or witnessed something
              suspicious that may impact our community's safety, please reach
              out. In an emergency, your first call should always be to local
              emergency services.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-bold text-primary">Step 1: Call Emergency Services</div>
                <div className="text-sm text-muted-foreground mt-1">Police / Ambulance: <span className="font-semibold text-foreground">999</span></div>
                <div className="text-sm text-muted-foreground">Local Police Hotline: <span className="font-semibold text-foreground">+254 700 000 000</span></div>
              </div>
              <div>
                <div className="font-bold text-primary">Step 2: Contact Community Safety</div>
                <div className="text-sm text-muted-foreground mt-1">24/7 Hotline: <span className="font-semibold text-foreground">+254 711 222 333</span></div>
              </div>
            </div>
            <Button asChild className="mt-6 bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold">
              <Link to="/contact">Report an incident</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-44 w-44 rounded-full bg-sky text-sky-foreground border-[6px] border-primary flex items-center justify-center shadow-soft">
              <div className="text-center">
                <ShieldAlert className="h-10 w-10 mx-auto mb-1" />
                <div className="font-display font-extrabold tracking-widest text-sm">SAFE COMMUNITY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover tiles */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-center">
            Discover Kisiijewish
          </h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {discoverTiles.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="group bg-sky-soft hover:bg-sky hover:text-sky-foreground transition-smooth rounded-md p-8 text-center flex flex-col items-center gap-4 shadow-card hover:shadow-soft"
              >
                <Icon className="h-10 w-10 text-primary group-hover:text-sky-foreground transition-smooth" strokeWidth={1.6} />
                <div className="font-display font-bold text-primary group-hover:text-sky-foreground text-lg leading-tight">
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA strip */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
              Be part of our story.
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              Become a member, attend an event, or support our work — every act helps our community thrive.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold">
              <Link to="/membership">Become a Member</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 uppercase tracking-wider font-semibold">
              <Link to="/events"><Calendar className="mr-1 h-4 w-4" />View Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
