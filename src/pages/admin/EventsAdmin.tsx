import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const blank = { title: "", description: "", event_date: "", event_time: "", location: "", image_url: "" };

export default function EventsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blank);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (e: any) => { setEditing(e); setForm({ ...blank, ...e }); setOpen(true); };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload = { ...form, is_past: new Date(form.event_date) < new Date() };
    const res = editing
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Event updated" : "Event added");
    setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id); load();
  };
  const togglePast = async (e: any) => {
    await supabase.from("events").update({ is_past: !e.is_past }).eq("id", e.id); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Events</h2>
          <p className="text-sm text-muted-foreground">Create, edit, and archive community events.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New event</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required /></div>
                <div><Label>Time</Label><Input placeholder="7:00 PM" value={form.event_time ?? ""} onChange={e => setForm({...form, event_time: e.target.value})} /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required /></div>
              <div><Label>Image</Label><ImageUpload folder="events" value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} /></div>
              <Button type="submit" className="w-full">{editing ? "Save changes" : "Create event"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {items.map((e) => (
          <Card key={e.id} className="p-4 flex items-center gap-4">
            {e.image_url && <img src={e.image_url} className="h-14 w-14 object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary truncate">{e.title} {e.is_past && <span className="text-xs text-muted-foreground ml-2">(past)</span>}</div>
              <div className="text-xs text-muted-foreground">{format(parseISO(e.event_date), "PP")} · {e.location}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => togglePast(e)}>{e.is_past ? "Mark upcoming" : "Mark past"}</Button>
            <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => del(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
      </div>
    </div>
  );
}
