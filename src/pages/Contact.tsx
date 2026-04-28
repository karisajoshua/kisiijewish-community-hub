import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle, Lock } from "lucide-react";
import { useSetting } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  subject: z.string().trim().min(1, "Required").max(200),
  message: z.string().trim().min(1, "Required").max(5000),
});
type FormData = z.infer<typeof schema>;

const Contact = () => {
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { data: contact } = useSetting<any>("contact_info", { email: "hello@kisiijewish.org", phone: "+254 700 000 000", address: "Kisii Town, Kenya" });
  const { data: social } = useSetting<any>("social_links", { facebook: "", instagram: "", youtube: "", whatsapp: "" });
  const c = contact ?? {};
  const s = social ?? {};

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name ?? user.email?.split("@")[0] ?? ""));
  }, [user]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user.id,
      name: displayName || user.email?.split("@")[0] || "Member",
      email: user.email!,
      subject: data.subject,
      message: data.message,
    });
    setSubmitting(false);
    if (error) return toast.error("Could not send. Please try again.");
    toast.success("Message sent! We'll respond within the system.");
    reset();
  };

  return (
    <>
      <PageHero title="Get in touch" subtitle="We'd love to hear from you — for questions, visits, partnerships, or anything else." />

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
          <div id="visit" className="lg:col-span-2 space-y-4 scroll-mt-28">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-sky-soft flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Visit us</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{c.address || "Kisii Town, Kenya"}</p>
                  {c.hours && <p className="text-xs text-muted-foreground mt-1">{c.hours}</p>}
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-sky-soft flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Email</h3>
                  <a href={`mailto:${c.email}`} className="text-sm text-muted-foreground mt-1 hover:text-primary">{c.email}</a>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-sky-soft flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary">Phone</h3>
                  <a href={`tel:${c.phone}`} className="text-sm text-muted-foreground mt-1 hover:text-primary">{c.phone}</a>
                </div>
              </div>
            </Card>
            <div className="flex gap-3 pt-2">
              {[
                { key: "facebook", Icon: Facebook },
                { key: "instagram", Icon: Instagram },
                { key: "youtube", Icon: Youtube },
                { key: "whatsapp", Icon: MessageCircle },
              ].map(({ key, Icon }) => s[key] ? (
                <a key={key} href={s[key]} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-sky hover:text-sky-foreground transition-smooth"><Icon className="h-4 w-4" /></a>
              ) : null)}
            </div>
          </div>

          <Card id="message" className="lg:col-span-3 p-7 border-border bg-card shadow-soft scroll-mt-28">
            <h2 className="font-display text-2xl font-bold text-primary mb-1">Send us a message</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Members can write to us right here — we reply within the system, so you'll see our response in your account inbox.
            </p>

            {authLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !user ? (
              <div className="rounded-lg border-2 border-dashed border-sky/30 bg-sky-soft p-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-sky text-sky-foreground mx-auto flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-primary">Sign in to send a message</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Replies happen inside your account, so we need to know who's writing. It only takes a minute to create an account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button asChild className="bg-sky text-sky-foreground hover:bg-sky/90">
                    <Link to={`/auth?redirect=${encodeURIComponent("/contact#message")}`}>Sign in</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={`/auth?redirect=${encodeURIComponent("/contact#message")}`}>Create an account</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <Input value={displayName} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email ?? ""} readOnly className="bg-muted" />
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
            )}
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
