import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Building, BookOpen, Users, Mail, Phone } from "lucide-react";

const areas = [
  { icon: Building, title: "Our facilities", desc: "Maintain and improve our gathering spaces, sanctuary, and youth wing." },
  { icon: BookOpen, title: "Education", desc: "Make Hebrew classes, learning programs, and scholarships accessible to all." },
  { icon: Users, title: "Community care", desc: "Visits, meals, and support for elders, families, and those in need." },
  { icon: Heart, title: "Outreach", desc: "Welcome programs and partnerships with the wider Kisii community." },
];

const tiers = ["KSh 1,000", "KSh 5,000", "KSh 10,000", "Custom"];

const Donate = () => (
  <>
    <PageHero
      title="Support our community"
      subtitle="Every gift — large or small — helps us welcome, teach, celebrate, and care."
    />

    <section className="py-20">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Why give?</div>
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Your generosity sustains us</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our community runs on the dedication of our members and the generosity of our supporters. Donations directly fund programs, facilities, and care for those in our community who need it most.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are committed to transparency. A summary of how donations are used is shared each year in our community report.
          </p>

          <Card className="mt-8 p-6 border-border bg-card shadow-card">
            <h3 className="font-display font-bold text-lg text-primary mb-3">Suggested gift amounts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tiers.map((t) => (
                <div key={t} className="border border-border rounded-lg py-4 text-center font-display font-semibold text-primary hover:border-accent hover:bg-accent-soft transition-smooth cursor-default">
                  {t}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">All amounts welcomed. Recurring monthly gifts of any size make a lasting impact.</p>
          </Card>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-primary mb-4">Where your gift goes</h3>
          <div className="space-y-3">
            {areas.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-5 border-border bg-card hover:shadow-soft transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 gradient-warm">
      <div className="container mx-auto px-4">
        <Card className="p-8 md:p-10 border-border bg-card shadow-soft max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-primary mb-6">How to give</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-primary mb-2">Bank transfer</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Account name:</strong> Kisiijewish Community<br />
                <strong>Bank:</strong> Equity Bank Kenya<br />
                <strong>Account:</strong> 0000-XXXX-XXXX-XXXX<br />
                <strong>Reference:</strong> "Donation - [Your Name]"
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Mobile money</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>M-Pesa Paybill:</strong> 000000<br />
                <strong>Account:</strong> "Donation"<br />
                Or send via Send Money: <strong>+254 700 000 000</strong>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-primary">Need help giving, or want to discuss a larger gift?</p>
              <p className="text-sm text-muted-foreground mt-1">Our treasurer would love to speak with you.</p>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              <Link to="/contact"><Mail className="mr-2 h-4 w-4" /> Contact Treasurer</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  </>
);

export default Donate;
