import { useState, useEffect } from "react";
import { useSetting, useUpdateSetting } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const Section = ({ title, children }: any) => (
  <Card className="p-5 space-y-4">
    <h3 className="font-display font-bold text-primary">{title}</h3>
    {children}
  </Card>
);

export default function HomepageAdmin() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Homepage</h2>
        <p className="text-sm text-muted-foreground">Edit hero, promise, priorities, and call-to-action.</p>
      </div>
      <HeroEditor />
      <PromiseEditor />
      <PrioritiesEditor />
      <CtaStripEditor />
    </div>
  );
}

function HeroEditor() {
  const { data } = useSetting<any>("hero");
  const update = useUpdateSetting("hero");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Section title="Hero">
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Eyebrow</Label><Input value={v.eyebrow ?? ""} onChange={e => setV({...v, eyebrow: e.target.value})} /></div>
        <div><Label>Title</Label><Input value={v.title ?? ""} onChange={e => setV({...v, title: e.target.value})} /></div>
        <div><Label>Subtitle</Label><Input value={v.subtitle ?? ""} onChange={e => setV({...v, subtitle: e.target.value})} /></div>
        <div><Label>CTA label (banner)</Label><Input value={v.cta_label ?? ""} onChange={e => setV({...v, cta_label: e.target.value})} /></div>
      </div>
      <div><Label>Tagline words (comma-separated)</Label><Input value={(v.tagline ?? []).join(", ")} onChange={e => setV({...v, tagline: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)})} /></div>
      <div><Label>Background image</Label><ImageUpload folder="hero" value={v.image_url} onChange={(url) => setV({...v, image_url: url})} /></div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Primary CTA label</Label><Input value={v.primary_cta?.label ?? ""} onChange={e => setV({...v, primary_cta: {...v.primary_cta, label: e.target.value}})} /></div>
        <div><Label>Primary CTA link</Label><Input value={v.primary_cta?.href ?? ""} onChange={e => setV({...v, primary_cta: {...v.primary_cta, href: e.target.value}})} /></div>
        <div><Label>Secondary CTA label</Label><Input value={v.secondary_cta?.label ?? ""} onChange={e => setV({...v, secondary_cta: {...v.secondary_cta, label: e.target.value}})} /></div>
        <div><Label>Secondary CTA link</Label><Input value={v.secondary_cta?.href ?? ""} onChange={e => setV({...v, secondary_cta: {...v.secondary_cta, href: e.target.value}})} /></div>
      </div>
      <Button onClick={() => update.mutate(v, { onSuccess: () => toast.success("Hero updated") })}>Save hero</Button>
    </Section>
  );
}

function PromiseEditor() {
  const { data } = useSetting<any>("promise");
  const update = useUpdateSetting("promise");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Section title="Promise block">
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>Top word</Label><Input value={v.headline_top ?? ""} onChange={e => setV({...v, headline_top: e.target.value})} /></div>
        <div><Label>Mid word</Label><Input value={v.headline_mid ?? ""} onChange={e => setV({...v, headline_mid: e.target.value})} /></div>
        <div><Label>Bottom word</Label><Input value={v.headline_bottom ?? ""} onChange={e => setV({...v, headline_bottom: e.target.value})} /></div>
      </div>
      <div><Label>Tagline 1</Label><Input value={v.line1 ?? ""} onChange={e => setV({...v, line1: e.target.value})} /></div>
      <div><Label>Tagline 2</Label><Input value={v.line2 ?? ""} onChange={e => setV({...v, line2: e.target.value})} /></div>
      <div><Label>Image</Label><ImageUpload folder="promise" value={v.video_image} onChange={(url) => setV({...v, video_image: url})} /></div>
      <Button onClick={() => update.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save promise</Button>
    </Section>
  );
}

function PrioritiesEditor() {
  const { data } = useSetting<any[]>("priorities");
  const update = useUpdateSetting("priorities");
  const [v, setV] = useState<any[] | null>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Section title="Priorities (accordion)">
      {v.map((p, i) => (
        <div key={i} className="border border-border p-3 space-y-2">
          <div className="flex justify-between items-center">
            <Label>Item {i + 1}</Label>
            <Button size="icon" variant="ghost" onClick={() => setV(v.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
          <Input placeholder="Label" value={p.label} onChange={e => { const c = [...v]; c[i] = {...c[i], label: e.target.value}; setV(c); }} />
          <Textarea placeholder="Body" value={p.body} onChange={e => { const c = [...v]; c[i] = {...c[i], body: e.target.value}; setV(c); }} />
        </div>
      ))}
      <Button variant="outline" onClick={() => setV([...v, { label: "New", body: "" }])}><Plus className="h-4 w-4 mr-1" /> Add priority</Button>
      <Button onClick={() => update.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save priorities</Button>
    </Section>
  );
}

function CtaStripEditor() {
  const { data } = useSetting<any>("cta_strip");
  const update = useUpdateSetting("cta_strip");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Section title="Call-to-action strip">
      <div><Label>Heading</Label><Input value={v.heading ?? ""} onChange={e => setV({...v, heading: e.target.value})} /></div>
      <Label>Buttons</Label>
      {(v.buttons ?? []).map((b: any, i: number) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input placeholder="Label" value={b.label} onChange={e => { const c = [...v.buttons]; c[i] = {...c[i], label: e.target.value}; setV({...v, buttons: c}); }} />
          <Input placeholder="Link" value={b.href} onChange={e => { const c = [...v.buttons]; c[i] = {...c[i], href: e.target.value}; setV({...v, buttons: c}); }} />
          <Button size="icon" variant="ghost" onClick={() => setV({...v, buttons: v.buttons.filter((_: any, idx: number) => idx !== i)})}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => setV({...v, buttons: [...(v.buttons ?? []), { label: "New", href: "/" }]})}><Plus className="h-4 w-4 mr-1" /> Add button</Button>
      <Button onClick={() => update.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save CTA</Button>
    </Section>
  );
}
