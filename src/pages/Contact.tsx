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
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useSetting } from "@/hooks/useSiteSettings";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Required").max(200),
  message: z.string().trim().min(1, "Required").max(5000),
});
type FormData = z.infer<typeof schema>;

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { data: contact } = useSetting<any>("contact_info", { email: "hello@kisiijewish.org", phone: "+254 700 000 000", address: "Kisii Town, Kenya" });
  const { data: social } = useSetting<any>("social_links", { facebook: "", instagram: "", youtube: "", whatsapp: "" });
  const c = contact ?? {};
  const s = social ?? {};

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name, email: data.email, subject: data.subject, message: data.message,
    });
    setSubmitting(false);
    if (error) return toast.error("Could not send. Please try again.");
    toast.success("Message sent! We'll respond shortly.");
    reset();
  };

  return (
    <>
      <PageHero title="Get in touch" subtitle="We'd love to hear from you — for questions, visits, partnerships, or anything else." />

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Visit us</h3>
                  <p className="text-sm text-muted-foreground mt-1">Kisii Town<br />Kisii County, Kenya</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">hello@kisiijewish.org</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Phone</h3>
                  <p className="text-sm text-muted-foreground mt-1">+254 700 000 000</p>
                </div>
              </div>
            </Card>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-smooth"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-smooth"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-smooth"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <Card className="lg:col-span-3 p-7 border-border bg-card shadow-soft">
            <h2 className="font-display text-2xl font-bold text-primary mb-1">Send us a message</h2>
            <p className="text-sm text-muted-foreground mb-6">We typically respond within 1–2 days.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={6} {...register("message")} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="container mx-auto px-4 mt-12">
          <Card className="overflow-hidden border-border">
            <div className="aspect-[16/6] bg-muted relative">
              <iframe
                title="Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=34.7%2C-0.75%2C34.85%2C-0.6&layer=mapnik"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Contact;
