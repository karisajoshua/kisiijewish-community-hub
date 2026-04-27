import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Sparkles, Heart, HandHeart, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "Education Programs",
    color: "from-blue-100 to-blue-50",
    desc: "Hebrew language, Torah study, adult learning, and visiting scholar series — designed for every level of interest and experience.",
    items: ["Beginner & intermediate Hebrew", "Weekly Torah study circle", "Parent-and-child learning", "Guest lectures & seminars"],
  },
  {
    icon: Users,
    title: "Youth Programs",
    desc: "Helping our young people build identity, friendship, and leadership through immersive experiences.",
    items: ["Youth groups (ages 6-18)", "Annual leadership retreat", "Mentorship pairings", "Bar/Bat Mitzvah preparation"],
  },
  {
    icon: Sparkles,
    title: "Cultural Activities",
    desc: "Celebrating Jewish life, art, and tradition throughout the year.",
    items: ["Holiday celebrations", "Music & choir nights", "Film screenings & discussions", "Community art projects"],
  },
  {
    icon: Heart,
    title: "Community Support",
    desc: "Care, connection, and practical help for every member of our community.",
    items: ["Visits to elders & those who are unwell", "Meal trains for new parents & those grieving", "Welcome program for newcomers", "Confidential pastoral support"],
  },
  {
    icon: HandHeart,
    title: "Volunteer Opportunities",
    desc: "Tikkun olam in action — give your time and talents to projects that make a real difference.",
    items: ["Community garden", "Food drives & soup kitchen", "Tutoring & mentoring", "Event hospitality team"],
  },
];

const Programs = () => (
  <>
    <PageHero
      title="Our programs"
      subtitle="Pathways to learn, lead, serve, and belong — for every age and every stage of life."
    />

    <section className="py-20">
      <div className="container mx-auto px-4 space-y-12">
        {programs.map(({ icon: Icon, title, desc, items }, i) => (
          <Card key={title} className="p-8 md:p-10 border-border bg-card shadow-card overflow-hidden">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="h-14 w-14 rounded-2xl gradient-gold flex items-center justify-center mb-5 shadow-gold">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={2.2} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">0{i + 1}</div>
                <h2 className="font-display text-2xl font-bold text-primary leading-tight">{title}</h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-5">{desc}</p>
                <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="link" className="px-0 text-accent">
                  <Link to="/contact">Get involved <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  </>
);

export default Programs;
