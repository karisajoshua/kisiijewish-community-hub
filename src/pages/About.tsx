import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { ScrollText, Users, HandHeart, GraduationCap, Globe } from "lucide-react";

const values = [
  {
    icon: ScrollText,
    title: "Torah & Faith",
    desc: "We are guided by the teachings of Torah and committed to living a life of holiness, integrity, and devotion.",
  },
  {
    icon: Users,
    title: "Community (Kehillah)",
    desc: "We believe in unity, belonging, and mutual responsibility within our community and the wider Jewish world.",
  },
  {
    icon: HandHeart,
    title: "Compassion (Chesed)",
    desc: "We serve with love and dignity, caring for orphans, widows, and vulnerable families.",
  },
  {
    icon: GraduationCap,
    title: "Education & Growth",
    desc: "We are dedicated to learning, teaching, and passing on Jewish knowledge, culture, and Hebrew language to future generations.",
  },
  {
    icon: Globe,
    title: "Partnership & Connection",
    desc: "We seek meaningful relationships with Jewish communities worldwide to strengthen identity and shared purpose.",
  },
];

const About = () => (
  <>
    <PageHero
      title="About our community"
      subtitle="Shalom and welcome to the Kisii Jewish Community — rooted in Torah, united in kehillah, and called to chesed."
    />

    {/* Who we are */}
    <section id="story" className="py-20 scroll-mt-28">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Who We Are</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Shalom and welcome to the Kisii Jewish Community
          </h2>
        </div>
        <div className="space-y-5 text-muted-foreground leading-relaxed text-base md:text-lg">
          <p>
            We are a growing and devoted Jewish community based in Kenya, with members spread across several counties.
            Our community is made up of individuals and families—some born into Jewish heritage and others who have
            joined through a deep and sincere commitment to living a Jewish life. Together, we are united by our love
            for Torah, our dedication to Jewish traditions, and our desire to walk faithfully in the ways of Hashem.
          </p>
          <p>
            At the heart of our community is the observance of Shabbat, the study of Torah, and the preservation of
            Jewish identity. We gather regularly for prayer, learning, and fellowship, striving to build a strong
            spiritual foundation for both present and future generations. We are passionate about deepening our
            understanding of Jewish law (Halacha), Hebrew language, and the richness of Jewish culture.
          </p>
          <p>
            Beyond our spiritual life, we are deeply committed to humanitarian work. Through our initiatives, we
            support orphans, vulnerable children, widows, and families in need. We provide basic necessities, promote
            education, and offer care and encouragement to those facing hardship. Our work is rooted in the Jewish
            value of chesed (loving-kindness)—serving others with dignity, compassion, and responsibility.
          </p>
          <p>
            As a community, we recognize the importance of connection with the wider Jewish world. We seek to build
            meaningful relationships with fellow Jewish communities, ללמוד together (learn together), and grow in
            authentic Jewish practice. We believe that even across great distances, we are one people—Am
            Yisrael—bound by shared faith, history, and purpose.
          </p>
          <p>
            We are on a journey of growth, learning, and service. With humility and hope, we continue to strengthen
            our community, preserve our heritage, and make a positive impact in the lives of those around us. We
            welcome friendship, partnership, and connection.
          </p>
          <p className="font-display text-xl text-primary font-semibold text-center pt-2">
            Karibu (Welcome) and Shalom.
          </p>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section id="mission" className="py-20 gradient-warm scroll-mt-28">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 max-w-6xl">
        <Card className="p-8 border-border bg-card shadow-card">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Mission Statement</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To nurture and sustain Jewish life in Kisii and across Kenya through faithful observance of Torah,
            preservation of Jewish identity and traditions, and compassionate service to our community—especially
            orphans, vulnerable children, and families in need.
          </p>
        </Card>
        <Card className="p-8 border-border bg-card shadow-card">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Vision Statement</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To build a thriving, united, and recognized Jewish community in Kenya that is deeply rooted in Torah,
            connected to the global Jewish family, and committed to transforming lives through faith, education, and
            acts of kindness (chesed).
          </p>
        </Card>
      </div>
    </section>

    {/* Values */}
    <section id="values" className="py-20 scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">What We Stand For</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
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
