import { Link } from "react-router-dom";
import { ArrowRight, Calendar, BookOpen, Users, Heart, Sparkles, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { EventCard } from "@/components/EventCard";
import { useAnnouncements, useEvents, useNews, useAlbums } from "@/hooks/useContent";
import { format, parseISO } from "date-fns";

const programs = [
  { icon: BookOpen, title: "Education", desc: "Hebrew classes, Torah study, and lifelong learning circles." },
  { icon: Users, title: "Youth", desc: "Mentorship, leadership retreats, and youth gatherings." },
  { icon: Sparkles, title: "Cultural", desc: "Holiday celebrations, music, art, and tradition-keeping." },
  { icon: Heart, title: "Community Support", desc: "Care for elders, families in need, and welcome for newcomers." },
];

const Home = () => {
  const { data: announcements } = useAnnouncements();
  const { data: events } = useEvents(false);
  const { data: news } = useNews();
  const { data: albums } = useAlbums();

  const upcoming = events?.slice(0, 3) ?? [];
  const featuredNews = news?.slice(0, 3) ?? [];
  const galleryPreview = albums?.flatMap((a: any) => a.gallery_photos ?? []).slice(0, 6) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl fade-in-up">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Welcome Home</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Kisiijewish <span className="text-accent">Community</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 leading-relaxed max-w-2xl">
              A warm and welcoming community rooted in tradition, learning, and care for one another. Join us as we celebrate, learn, and grow together.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                <Link to="/membership">Join Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/15">
                <Link to="/events">View Events</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements ribbon */}
      {announcements && announcements.length > 0 && (
        <section className="bg-accent-soft border-y border-accent/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm shrink-0">
                <Megaphone className="h-4 w-4 text-accent" />
                Announcements
              </div>
              <div className="flex-1 grid md:grid-cols-3 gap-3">
                {announcements.slice(0, 3).map((a: any) => (
                  <Link key={a.id} to={a.link || "#"} className="text-sm text-primary/85 hover:text-accent transition-smooth">
                    • {a.message}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About Us</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              A community built on tradition, faith, and friendship.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              For decades, the Kisiijewish Community has been a place to gather, learn, celebrate, and care for one another. We honor our shared heritage while embracing every new face that joins our family.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Whether you are exploring Jewish life, returning to community, or rooted here for years — there is a place for you with us.
            </p>
            <Button asChild variant="link" className="px-0 mt-4 text-accent">
              <Link to="/about">Learn our story <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200"
              alt="Community gathering"
              loading="lazy"
              className="rounded-2xl shadow-soft w-full aspect-[4/3] object-cover"
            />
            <div className="absolute -bottom-5 -left-5 hidden md:block bg-card rounded-xl shadow-card p-4 border border-border">
              <div className="font-display text-2xl font-bold text-primary">25+ Years</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Serving our community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="What's Happening"
            title="Upcoming Events"
            description="Join us for gatherings, learning, celebrations, and service throughout the year."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((e: any) => <EventCard key={e.id} event={e} />)}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/events">View all events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Programs preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Our Programs"
            title="Pathways to belong, learn, and serve"
            description="From our youngest learners to our elders, every member finds a place to grow."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 border-border bg-card hover:shadow-soft transition-smooth group">
                <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold group-hover:scale-105 transition-smooth">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
                </div>
                <h3 className="font-display font-bold text-lg text-primary mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="link" className="text-accent">
              <Link to="/programs">Explore all programs <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="News & Stories" title="Latest from our community" />
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
                    <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">{post.category}</div>
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

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader eyebrow="Gallery" title="Moments from our community" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {galleryPreview.map((p: any) => (
                <div key={p.id} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={p.image_url} alt={p.caption || ""} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-smooth" />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="link" className="text-accent">
                <Link to="/gallery">Browse the gallery <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Join / Donate CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl gradient-hero text-primary-foreground p-10 md:p-16 text-center shadow-soft relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
            <div className="relative">
              <Calendar className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Be part of our story
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-primary-foreground/85 leading-relaxed">
                Become a member, attend an event, or support our work — every small act helps our community thrive.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  <Link to="/membership">Become a Member</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/donate">Make a Donation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
