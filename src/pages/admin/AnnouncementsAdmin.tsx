import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function AnnouncementsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState(""); const [link, setLink] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editMsg, setEditMsg] = useState(""); const [editLink, setEditLink] = useState("");

  const load = async () => { const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }); setItems(data ?? []); };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert({ message: msg, link: link || null, active: true });
    if (error) return toast.error(error.message);
    toast.success("Added"); setMsg(""); setLink(""); load();
  };
  const startEdit = (a: any) => { setEditing(a.id); setEditMsg(a.message); setEditLink(a.link ?? ""); };
  const saveEdit = async () => {
    if (!editing) return;
    await supabase.from("announcements").update({ message: editMsg, link: editLink || null }).eq("id", editing);
    setEditing(null); load();
  };
  const toggle = async (a: any) => { await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id); load(); };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("announcements").delete().eq("id", id); load(); };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Announcements</h2>
        <p className="text-sm text-muted-foreground">Slides shown in the homepage carousel.</p>
      </div>
      <Card className="p-4">
        <form onSubmit={add} className="flex flex-col md:flex-row gap-2">
          <Input placeholder="Message" value={msg} onChange={e => setMsg(e.target.value)} required className="flex-1" />
          <Input placeholder="Link (optional)" value={link} onChange={e => setLink(e.target.value)} className="md:w-64" />
          <Button type="submit">Add</Button>
        </form>
      </Card>
      {items.map(a => (
        <Card key={a.id} className="p-4">
          {editing === a.id ? (
            <div className="flex flex-col md:flex-row gap-2">
              <Input value={editMsg} onChange={e => setEditMsg(e.target.value)} className="flex-1" />
              <Input value={editLink} onChange={e => setEditLink(e.target.value)} className="md:w-64" />
              <Button onClick={saveEdit}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 text-sm">{a.message}{a.link && <span className="text-xs text-muted-foreground ml-2">→ {a.link}</span>}</div>
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
