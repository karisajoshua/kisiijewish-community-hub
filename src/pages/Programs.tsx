import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Baby,
  UtensilsCrossed,
  HeartHandshake,
  GraduationCap,
  LifeBuoy,
  BookOpen,
  Users,
  Briefcase,
  Stethoscope,
  HandHeart,
  ArrowRight,
} from "lucide-react";

const whatWeDo = [
  {
    icon: Sparkles,
    title: "Celebrating Jewish Festivals",
    id: "festivals",
    desc: "We observe and celebrate the Jewish calendar with joy and reverence, including Shabbat and major festivals. These gatherings strengthen our faith, preserve our traditions, and bring our community together in unity.",
  },
  {
    icon: Baby,
    title: "Orphans Project",
    id: "orphans",
    desc: "We care for orphaned and vulnerable children by providing essential support such as shelter, clothing, emotional care, and guidance. Our goal is to give every child dignity, stability, and hope for the future.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Project",
    id: "food",
    desc: "We provide food assistance to families facing hardship, ensuring that no one in our community goes hungry. This includes regular food distribution and emergency support when needed.",
  },
  {
    icon: HeartHandshake,
    title: "Widows Project",
    id: "widows",
    desc: "We support widows through care programs that provide emotional support, basic needs, and empowerment opportunities, helping them live with dignity and independence.",
  },
  {
    icon: GraduationCap,
    title: "Education Project",
    id: "education",
    desc: "We believe education is key to transformation. We support children by providing access to schooling, learning materials, and mentorship to help them build a better future.",
  },
  {
    icon: LifeBuoy,
    title: "Disaster Response",
    id: "disaster",
    desc: "During times of crisis—such as drought, floods, or other emergencies—we respond with relief support, providing food, supplies, and care to affected families.",
  },
];

const activities = [
  {
    icon: BookOpen,
    title: "Torah & Hebrew Learning Programs",
    desc: "Regular classes for children and adults to learn Torah, Hebrew, and Jewish traditions.",
  },
  {
    icon: Users,
    title: "Youth & Mentorship Programs",
    desc: "Guiding young people through mentorship, life skills, and faith-based leadership.",
  },
  {
    icon: Briefcase,
    title: "Women's Empowerment Programs",
    desc: "Training, small business support, and skills development for women and widows.",
  },
  {
    icon: Stethoscope,
    title: "Community Health Outreach",
    desc: "Basic medical camps, hygiene education, and wellness support for vulnerable families.",
  },
  {
    icon: HandHeart,
    title: "Volunteer & Service Programs",
    desc: "Engaging community members and partners in active service and outreach.",
  },
];

const Programs = () => (
  <>
    <PageHero
      title="What we do"
      subtitle="At the Kisii Jewish Community, our work is rooted in faith, compassion, and responsibility — strengthening Jewish life while serving those in need through practical and impactful programs."
    />

    {/* What We Do */}
    <section id="what-we-do" className="py-20 scroll-mt-28">
      <div className="container mx-auto px-4 space-y-10">
        {whatWeDo.map(({ icon: Icon, title, desc, id }, i) => (
          <Card
            key={title}
            id={id}
            className="p-8 md:p-10 border-border bg-card shadow-card overflow-hidden scroll-mt-28"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="h-14 w-14 rounded-2xl gradient-gold flex items-center justify-center mb-5 shadow-gold">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={2.2} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                  0{i + 1}
                </div>
                <h2 className="font-display text-2xl font-bold text-primary leading-tight">{title}</h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-6">{desc}</p>
                <Button asChild variant="link" className="px-0 text-accent">
                  <Link to="/contact">
                    Get involved <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>

    {/* Activities */}
    <section id="activities" className="py-20 gradient-warm scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Programs & Activities
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Activities</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ongoing programs that nurture learning, leadership, empowerment, health, and service across our
            community.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {activities.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 border-border bg-card hover:shadow-soft transition-smooth">
              <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-semibold">
            <Link to="/contact">Partner with us</Link>
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default Programs;
