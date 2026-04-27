import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const blankAlbum = { title: "", description: "", event_date: "", cover_image: "" };

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blankAlbum);

  const load = async () => { const { data } = await supabase.from("gallery_albums").select("*, gallery_photos(*)").order("created_at", { ascending: false }); setAlbums(data ?? []); };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (!payload.event_date) delete payload.event_date;
    const res = editing
      ? await supabase.from("gallery_albums").update(payload).eq("id", editing.id)
      : await supabase.from("gallery_albums").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Album updated" : "Album created");
    setOpen(false); setForm(blankAlbum); setEditing(null); load();
  };

  const delAlbum = async (id: string) => {
    if (!confirm("Delete this album and all its photos?")) return;
    await supabase.from("gallery_photos").delete().eq("album_id", id);
    await supabase.from("gallery_albums").delete().eq("id", id);
    load();
  };

  if (selected) {
    const album = albums.find(a => a.id === selected.id) ?? selected;
    return <AlbumDetail album={album} onBack={() => { setSelected(null); load(); }} onChange={load} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Gallery</h2>
          <p className="text-sm text-muted-foreground">Manage photo albums and images.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(blankAlbum); } }}>
          <DialogTrigger asChild><Button onClick={() => { setEditing(null); setForm(blankAlbum); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> New album</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit album" : "New album"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><Label>Description</Label><Textarea value={form.description ?? ""} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><Label>Event date</Label><Input type="date" value={form.event_date ?? ""} onChange={e => setForm({...form, event_date: e.target.value})} /></div>
              <div><Label>Cover image</Label><ImageUpload folder="gallery" value={form.cover_image} onChange={(url) => setForm({...form, cover_image: url})} /></div>
              <Button type="submit" className="w-full">{editing ? "Save" : "Create album"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map(a => (
          <Card key={a.id} className="overflow-hidden">
            <button onClick={() => setSelected(a)} className="block w-full text-left">
              {a.cover_image ? <img src={a.cover_image} className="h-40 w-full object-cover" alt="" /> : <div className="h-40 bg-muted" />}
              <div className="p-3">
                <div className="font-semibold text-primary">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.gallery_photos?.length ?? 0} photos</div>
              </div>
            </button>
            <div className="p-3 pt-0 flex gap-1">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditing(a); setForm({ ...blankAlbum, ...a, event_date: a.event_date ?? "" }); setOpen(true); }}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
              <Button size="icon" variant="ghost" onClick={() => delAlbum(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
        {albums.length === 0 && <p className="text-sm text-muted-foreground">No albums yet.</p>}
      </div>
    </div>
  );
}

function AlbumDetail({ album, onBack, onChange }: { album: any; onBack: () => void; onChange: () => void }) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addPhoto = async () => {
    if (!imageUrl) return toast.error("Upload an image first");
    const { error } = await supabase.from("gallery_photos").insert({ album_id: album.id, image_url: imageUrl, caption: caption || null });
    if (error) return toast.error(error.message);
    setCaption(""); setImageUrl(""); onChange();
  };
  const delPhoto = async (id: string) => { if (!confirm("Delete photo?")) return; await supabase.from("gallery_photos").delete().eq("id", id); onChange(); };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back to albums</Button>
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">{album.title}</h2>
        <p className="text-sm text-muted-foreground">{album.gallery_photos?.length ?? 0} photos</p>
      </div>
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Add photo</h3>
        <ImageUpload folder={`gallery/${album.id}`} value={imageUrl} onChange={setImageUrl} />
        <Input placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} />
        <Button onClick={addPhoto} disabled={!imageUrl}>Add to album</Button>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(album.gallery_photos ?? []).map((p: any) => (
          <div key={p.id} className="relative group">
            <img src={p.image_url} alt={p.caption ?? ""} className="w-full aspect-square object-cover" />
            <button onClick={() => delPhoto(p.id)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 opacity-0 group-hover:opacity-100 transition-smooth">
              <Trash2 className="h-3 w-3" />
            </button>
            {p.caption && <div className="text-xs text-muted-foreground mt-1 truncate">{p.caption}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
