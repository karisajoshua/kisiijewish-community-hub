import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Users, BookOpen, Heart, Calendar } from "lucide-react";

const benefits = [
  { icon: Calendar, title: "Member events", desc: "Priority access and discounts on community events." },
  { icon: BookOpen, title: "Learning programs", desc: "Free or reduced fees for classes and workshops." },
  { icon: Users, title: "Community voice", desc: "Vote in community decisions and serve on committees." },
  { icon: Heart, title: "Pastoral care", desc: "Support during life cycle events — joys and sorrows alike." },
];

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const Membership = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.from("membership_applications").insert({
      name: data.name, email: data.email,
      phone: data.phone || null, location: data.location || null, message: data.message || null,
    });
    setSubmitting(false);
    if (error) return toast.error("Could not submit. Please try again.");
    toast.success("Thank you! We'll be in touch soon.");
    reset();
  };

  return (
    <>
      <PageHero title="Become a member" subtitle="Membership is a meaningful way to belong, contribute, and shape the future of our community." />

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Why join?</div>
              <h2 className="font-display text-3xl font-bold text-primary mb-3">Belong to something larger</h2>
              <p className="text-muted-foreground leading-relaxed">
                Members are the heart of our community. Your membership supports our programs, our facilities, and the warm welcome we extend to every new face.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="p-5 border-border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-primary">{title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="bg-accent-soft border border-accent/20 rounded-xl p-5">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <Check className="h-4 w-4 text-accent" /> Open to all
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed">
                We welcome members of every background, age, and stage of Jewish life. Financial assistance is available — please reach out in confidence.
              </p>
            </div>
          </div>

          <Card className="lg:col-span-2 p-7 border-border bg-card shadow-soft h-fit">
            <h3 className="font-display text-2xl font-bold text-primary mb-1">Apply for membership</h3>
            <p className="text-sm text-muted-foreground mb-5">We'll respond within a few days.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="City, Country" />
              </div>
              <div>
                <Label htmlFor="message">Tell us about yourself</Label>
                <Textarea id="message" rows={4} {...register("message")} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Membership;
