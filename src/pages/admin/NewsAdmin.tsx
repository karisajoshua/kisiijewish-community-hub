import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2, Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const blank = { title: "", excerpt: "", content: "", category: "Community", image_url: "", featured: false };

export default function NewsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank);

  const load = async () => {
    const { data } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...blank, ...p }); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (!editing) payload.slug = slugify(form.title) + "-" + Date.now().toString(36);
    const res = editing
      ? await supabase.from("news_posts").update(payload).eq("id", editing.id)
      : await supabase.from("news_posts").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Post updated" : "Post published");
    setOpen(false); load();
  };

  const del = async (id: string) => { if (!confirm("Delete this post?")) return; await supabase.from("news_posts").delete().eq("id", id); load(); };
  const toggleFeatured = async (p: any) => { await supabase.from("news_posts").update({ featured: !p.featured }).eq("id", p.id); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">News</h2>
          <p className="text-sm text-muted-foreground">Stories and announcements published on the site.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required /></div>
              </div>
              <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required /></div>
              <div><Label>Content</Label><Textarea rows={8} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
              <div><Label>Image</Label><ImageUpload folder="news" value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured post</label>
              <Button type="submit" className="w-full">{editing ? "Save changes" : "Publish"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {items.map((p) => (
          <Card key={p.id} className="p-4 flex items-center gap-4">
            {p.image_url && <img src={p.image_url} className="h-14 w-14 object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary truncate">{p.title} {p.featured && <Star className="h-3 w-3 inline text-sky" />}</div>
              <div className="text-xs text-muted-foreground">{p.category} · {format(parseISO(p.published_at), "PP")}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => toggleFeatured(p)}>{p.featured ? "Unfeature" : "Feature"}</Button>
            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
