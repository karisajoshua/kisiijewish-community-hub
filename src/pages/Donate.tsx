import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Building, BookOpen, Users, Mail } from "lucide-react";
import { useSetting } from "@/hooks/useSiteSettings";

const areas = [
  { icon: Building, title: "Our facilities", desc: "Maintain and improve our gathering spaces, sanctuary, and youth wing." },
  { icon: BookOpen, title: "Education", desc: "Make Hebrew classes, learning programs, and scholarships accessible to all." },
  { icon: Users, title: "Community care", desc: "Visits, meals, and support for elders, families, and those in need." },
  { icon: Heart, title: "Outreach", desc: "Welcome programs and partnerships with the wider Kisii community." },
];

const tiers = ["KSh 1,000", "KSh 5,000", "KSh 10,000", "Custom"];

const donateFallback = {
  intro: "Your donation helps preserve our heritage, educate our youth, and support families in need.",
  mpesa: "",
  paypal: "",
  bank: "",
};

const Donate = () => {
  const { data: donateData } = useSetting<any>("donate_info", donateFallback);
  const d = donateData ?? donateFallback;

  return (
    <>
      <PageHero
        title="Support our community"
        subtitle="Every gift — large or small — helps us welcome, teach, celebrate, and care."
      />

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-sky mb-2">Why give?</div>
            <h2 className="font-display text-3xl font-bold text-primary mb-4">Your generosity sustains us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{d.intro}</p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to transparency. A summary of how donations are used is shared each year in our community report.
            </p>

            <Card className="mt-8 p-6 border-border bg-card shadow-card">
              <h3 className="font-display font-bold text-lg text-primary mb-3">Suggested gift amounts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tiers.map((t) => (
                  <div key={t} className="border border-border rounded-lg py-4 text-center font-display font-semibold text-primary hover:border-sky hover:bg-sky-soft transition-smooth cursor-default">
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
                    <div className="h-11 w-11 rounded-xl bg-sky-soft flex items-center justify-center shrink-0">
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
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              {d.bank && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">Bank transfer</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{d.bank}</p>
                </div>
              )}
              {d.mpesa && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">M-Pesa</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{d.mpesa}</p>
                </div>
              )}
              {d.paypal && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">PayPal</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{d.paypal}</p>
                </div>
              )}
              {!d.bank && !d.mpesa && !d.paypal && (
                <div className="md:col-span-3 text-muted-foreground">
                  Donation details will be shared shortly. Please contact us in the meantime.
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary">Need help giving, or want to discuss a larger gift?</p>
                <p className="text-sm text-muted-foreground mt-1">Our treasurer would love to speak with you.</p>
              </div>
              <Button asChild className="bg-sky text-sky-foreground hover:bg-sky/90">
                <Link to="/contact"><Mail className="mr-2 h-4 w-4" /> Contact Treasurer</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Donate;
