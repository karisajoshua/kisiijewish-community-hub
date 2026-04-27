import { useEffect, useState } from "react";
import { useSetting, useUpdateSetting } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SiteSettingsAdmin() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Site Settings</h2>
        <p className="text-sm text-muted-foreground">Contact info, social links, and donation details.</p>
      </div>
      <ContactBlock />
      <SocialBlock />
      <DonateBlock />
    </div>
  );
}

function ContactBlock() {
  const { data } = useSetting<any>("contact_info");
  const upd = useUpdateSetting("contact_info");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-display font-bold text-primary">Contact info</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Email</Label><Input value={v.email ?? ""} onChange={e => setV({...v, email: e.target.value})} /></div>
        <div><Label>Phone</Label><Input value={v.phone ?? ""} onChange={e => setV({...v, phone: e.target.value})} /></div>
        <div><Label>Address</Label><Input value={v.address ?? ""} onChange={e => setV({...v, address: e.target.value})} /></div>
        <div><Label>Hours</Label><Input value={v.hours ?? ""} onChange={e => setV({...v, hours: e.target.value})} /></div>
      </div>
      <Button onClick={() => upd.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save</Button>
    </Card>
  );
}

function SocialBlock() {
  const { data } = useSetting<any>("social_links");
  const upd = useUpdateSetting("social_links");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-display font-bold text-primary">Social links</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {["facebook","instagram","youtube","whatsapp"].map((k) => (
          <div key={k}><Label className="capitalize">{k}</Label><Input value={v[k] ?? ""} onChange={e => setV({...v, [k]: e.target.value})} /></div>
        ))}
      </div>
      <Button onClick={() => upd.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save</Button>
    </Card>
  );
}

function DonateBlock() {
  const { data } = useSetting<any>("donate_info");
  const upd = useUpdateSetting("donate_info");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;
  return (
    <Card className="p-5 space-y-3">
      <h3 className="font-display font-bold text-primary">Donate</h3>
      <div><Label>Intro</Label><Textarea value={v.intro ?? ""} onChange={e => setV({...v, intro: e.target.value})} /></div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>M-Pesa</Label><Input value={v.mpesa ?? ""} onChange={e => setV({...v, mpesa: e.target.value})} /></div>
        <div><Label>PayPal</Label><Input value={v.paypal ?? ""} onChange={e => setV({...v, paypal: e.target.value})} /></div>
        <div><Label>Bank</Label><Input value={v.bank ?? ""} onChange={e => setV({...v, bank: e.target.value})} /></div>
      </div>
      <Button onClick={() => upd.mutate(v, { onSuccess: () => toast.success("Saved") })}>Save</Button>
    </Card>
  );
}
