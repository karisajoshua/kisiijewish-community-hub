import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const empty = { message: "", body: "", link: "", cta_label: "", image_url: "" };

export default function AnnouncementsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(empty);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert({
      message: form.message,
      body: form.body || null,
      link: form.link || null,
      cta_label: form.cta_label || null,
      image_url: form.image_url || null,
      active: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); setForm(empty); load();
  };
  const startEdit = (a: any) => { setEditing(a.id); setEditForm({ message: a.message ?? "", body: a.body ?? "", link: a.link ?? "", cta_label: a.cta_label ?? "", image_url: a.image_url ?? "" }); };
  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from("announcements").update({
      message: editForm.message,
      body: editForm.body || null,
      link: editForm.link || null,
      cta_label: editForm.cta_label || null,
      image_url: editForm.image_url || null,
    }).eq("id", editing);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const toggle = async (a: any) => { await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id); load(); };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("announcements").delete().eq("id", id); load(); };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Announcements</h2>
        <p className="text-sm text-muted-foreground">Slides shown in the homepage carousel — each one rotates with its own image and write-up.</p>
      </div>

      <Card className="p-4 space-y-3">
        <form onSubmit={add} className="space-y-3">
          <div><Label>Headline</Label><Input value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
          <div><Label>Write-up</Label><Textarea rows={3} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Short paragraph shown next to the image" /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Button label</Label><Input value={form.cta_label} onChange={e => setForm({ ...form, cta_label: e.target.value })} placeholder="Learn more" /></div>
            <div><Label>Button link</Label><Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/news" /></div>
          </div>
          <div><Label>Image</Label><ImageUpload folder="announcements" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} /></div>
          <Button type="submit">Add slide</Button>
        </form>
      </Card>

      {items.map(a => (
        <Card key={a.id} className="p-4">
          {editing === a.id ? (
            <div className="space-y-3">
              <div><Label>Headline</Label><Input value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} /></div>
              <div><Label>Write-up</Label><Textarea rows={3} value={editForm.body} onChange={e => setEditForm({ ...editForm, body: e.target.value })} /></div>
              <div className="grid md:grid-cols-2 gap-3">
                <div><Label>Button label</Label><Input value={editForm.cta_label} onChange={e => setEditForm({ ...editForm, cta_label: e.target.value })} /></div>
                <div><Label>Button link</Label><Input value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} /></div>
              </div>
              <div><Label>Image</Label><ImageUpload folder="announcements" value={editForm.image_url} onChange={(url) => setEditForm({ ...editForm, image_url: url })} /></div>
              <div className="flex gap-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {a.image_url && <img src={a.image_url} alt="" className="h-14 w-20 object-cover rounded border border-border" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{a.message}</div>
                {a.body && <div className="text-xs text-muted-foreground truncate">{a.body}</div>}
              </div>
              <Button size="sm" variant="outline" onClick={() => toggle(a)}>{a.active ? "Active" : "Hidden"}</Button>
              <Button size="icon" variant="ghost" onClick={() => startEdit(a)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
