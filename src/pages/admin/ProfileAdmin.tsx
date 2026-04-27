import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";

export default function ProfileAdmin() {
  const { user } = useAuth();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setForm(data ?? { id: user.id, display_name: "", avatar_url: "", bio: "" });
    })();
  }, [user]);

  if (!form) return <p>Loading…</p>;

  const save = async () => {
    const { error } = await supabase.from("profiles").upsert({
      id: form.id, display_name: form.display_name, avatar_url: form.avatar_url, bio: form.bio, updated_at: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">My Profile</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
      <Card className="p-5 space-y-3">
        <div><Label>Display name</Label><Input value={form.display_name ?? ""} onChange={e => setForm({...form, display_name: e.target.value})} /></div>
        <div><Label>Avatar</Label><ImageUpload folder="avatars" value={form.avatar_url} onChange={(url) => setForm({...form, avatar_url: url})} /></div>
        <div><Label>Bio</Label><Textarea rows={4} value={form.bio ?? ""} onChange={e => setForm({...form, bio: e.target.value})} /></div>
        <Button onClick={save}>Save profile</Button>
      </Card>
    </div>
  );
}
