import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Heart, BookOpen, Users, Star, Compass, Sparkles } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion", desc: "We care for every member of our community with warmth and dignity." },
  { icon: BookOpen, title: "Learning", desc: "Lifelong study of Torah, history, and our shared heritage." },
  { icon: Users, title: "Community", desc: "Together we are stronger — every voice belongs at our table." },
  { icon: Star, title: "Tradition", desc: "Honoring our ancestors while building for the next generation." },
  { icon: Compass, title: "Justice", desc: "Pursuing tikkun olam — the repair of our world." },
  { icon: Sparkles, title: "Joy", desc: "Celebrating life's moments together with song, food, and friendship." },
];

const leaders = [
  { name: "Rabbi Daniel Mwangi", role: "Spiritual Leader", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  { name: "Sarah Otieno", role: "Community Chair", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
  { name: "David Nyong'o", role: "Education Director", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
  { name: "Esther Kemunto", role: "Youth Coordinator", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
];

const timeline = [
  { year: "1998", title: "A small beginning", desc: "A handful of families began gathering for Shabbat in a member's home." },
  { year: "2005", title: "First community hall", desc: "We dedicated our first dedicated gathering space, opening doors to the wider community." },
  { year: "2014", title: "Education centre", desc: "Hebrew classes, youth programs, and adult learning launched in earnest." },
  { year: "2024", title: "Looking forward", desc: "Renovations, expanded programs, and a growing membership across generations." },
];

const About = () => (
  <>
    <PageHero
      title="About our community"
      subtitle="A story of faith, friendship, and dedication — built one Shabbat, one shared meal, one learning circle at a time."
    />

    <section className="py-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
        <Card className="p-8 border-border bg-card shadow-card">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our Mission</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">To nurture a warm, inclusive Jewish home for all.</h2>
          <p className="text-muted-foreground leading-relaxed">
            We exist to welcome, support, and inspire every member of our community — through worship, study, celebration, and service. We believe that a strong community is built person by person, gesture by gesture.
          </p>
        </Card>
        <Card className="p-8 border-border bg-card shadow-card">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our Vision</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">A vibrant community where tradition meets tomorrow.</h2>
          <p className="text-muted-foreground leading-relaxed">
            We envision a community where Jewish life thrives across generations — where children grow rooted in tradition, adults find lifelong learning, and elders are honored and engaged.
          </p>
        </Card>
      </div>
    </section>

    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our History</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">A community grown over generations</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="shrink-0 w-20 text-right">
                <div className="font-display text-2xl font-bold text-accent">{t.year}</div>
              </div>
              <div className="relative pl-6 border-l-2 border-accent/30 pb-6 group-last:pb-0 flex-1">
                <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent shadow-gold" />
                <h3 className="font-display font-bold text-lg text-primary">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our Leadership</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">The hands and hearts guiding our community</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((l) => (
            <Card key={l.name} className="overflow-hidden border-border bg-card text-center hover:shadow-soft transition-smooth">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={l.img} alt={l.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-primary">{l.name}</h3>
                <p className="text-sm text-accent font-medium mt-1">{l.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">What We Stand For</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Our values & beliefs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 border-border bg-card hover:shadow-soft transition-smooth">
              <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
