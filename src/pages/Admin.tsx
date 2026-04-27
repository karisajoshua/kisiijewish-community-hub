import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, LogOut } from "lucide-react";
import { format, parseISO } from "date-fns";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("events");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
      const admin = roles?.some((r: any) => r.role === "admin") ?? false;
      setIsAdmin(admin);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center border-border bg-card">
          <h1 className="font-display text-2xl font-bold text-primary mb-2">Access restricted</h1>
          <p className="text-muted-foreground mb-5">Your account is not an admin. Please contact a community administrator.</p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>Sign out</Button>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  return (
    <div className="min-h-screen gradient-warm">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-primary-foreground/70">Manage your community content and submissions</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/">View site</Link>
            </Button>
            <Button onClick={handleSignOut} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"><LogOut className="h-4 w-4 mr-1" /> Sign out</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="events"><EventsAdmin /></TabsContent>
          <TabsContent value="news"><NewsAdmin /></TabsContent>
          <TabsContent value="announcements"><AnnouncementsAdmin /></TabsContent>
          <TabsContent value="rsvps"><RSVPsAdmin /></TabsContent>
          <TabsContent value="submissions"><SubmissionsAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ---------- Sub-tabs ----------

const EventsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", event_time: "", location: "", image_url: "" });
  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({ ...form, is_past: new Date(form.event_date) < new Date() });
    if (error) return toast.error(error.message);
    toast.success("Event added"); setForm({ title: "", description: "", event_date: "", event_time: "", location: "", image_url: "" }); load();
  };
  const del = async (id: string) => { await supabase.from("events").delete().eq("id", id); load(); };
  const togglePast = async (id: string, val: boolean) => { await supabase.from("events").update({ is_past: val }).eq("id", id); load(); };

  return (
    <div className="grid lg:grid-cols-3 gap-6 mt-6">
      <Card className="lg:col-span-1 p-5 bg-card border-border">
        <h3 className="font-display font-bold text-primary mb-4">Add new event</h3>
        <form onSubmit={add} className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <Input type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required />
          <Input placeholder="Time (e.g. 7:00 PM)" value={form.event_time} onChange={e => setForm({...form, event_time: e.target.value})} />
          <Input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
          <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Add event</Button>
        </form>
      </Card>
      <div className="lg:col-span-2 space-y-3">
        {items.map((e) => (
          <Card key={e.id} className="p-4 bg-card border-border flex items-center gap-4">
            {e.image_url && <img src={e.image_url} className="h-16 w-16 rounded object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary truncate">{e.title}</div>
              <div className="text-xs text-muted-foreground">{format(parseISO(e.event_date), "PP")} · {e.location}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => togglePast(e.id, !e.is_past)}>{e.is_past ? "Mark upcoming" : "Mark past"}</Button>
            <Button size="icon" variant="ghost" onClick={() => del(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const NewsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Community", image_url: "", featured: false });
  const load = async () => { const { data } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false }); setItems(data ?? []); };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("news_posts").insert({ ...form, slug: slugify(form.title) + "-" + Date.now().toString(36) });
    if (error) return toast.error(error.message);
    toast.success("Post added"); setForm({ title: "", excerpt: "", content: "", category: "Community", image_url: "", featured: false }); load();
  };
  const del = async (id: string) => { await supabase.from("news_posts").delete().eq("id", id); load(); };

  return (
    <div className="grid lg:grid-cols-3 gap-6 mt-6">
      <Card className="lg:col-span-1 p-5 bg-card border-border">
        <h3 className="font-display font-bold text-primary mb-4">Add news post</h3>
        <form onSubmit={add} className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <Input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
          <Textarea placeholder="Short excerpt" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required />
          <Textarea placeholder="Full content" rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
          <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured</label>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Publish</Button>
        </form>
      </Card>
      <div className="lg:col-span-2 space-y-3">
        {items.map((p) => (
          <Card key={p.id} className="p-4 bg-card border-border flex items-center gap-4">
            {p.image_url && <img src={p.image_url} className="h-16 w-16 rounded object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary truncate">{p.title} {p.featured && <span className="text-xs text-accent ml-2">★</span>}</div>
              <div className="text-xs text-muted-foreground">{p.category} · {format(parseISO(p.published_at), "PP")}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AnnouncementsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState(""); const [link, setLink] = useState("");
  const load = async () => { const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }); setItems(data ?? []); };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => { e.preventDefault();
    const { error } = await supabase.from("announcements").insert({ message: msg, link: link || null, active: true });
    if (error) return toast.error(error.message); setMsg(""); setLink(""); load();
  };
  const toggle = async (id: string, v: boolean) => { await supabase.from("announcements").update({ active: v }).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("announcements").delete().eq("id", id); load(); };
  return (
    <div className="space-y-4 mt-6 max-w-3xl">
      <Card className="p-5 bg-card border-border">
        <form onSubmit={add} className="flex flex-col md:flex-row gap-3">
          <Input placeholder="Message" value={msg} onChange={e => setMsg(e.target.value)} required className="flex-1" />
          <Input placeholder="Link (optional)" value={link} onChange={e => setLink(e.target.value)} className="md:w-64" />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Add</Button>
        </form>
      </Card>
      {items.map(a => (
        <Card key={a.id} className="p-4 bg-card border-border flex items-center gap-3">
          <div className="flex-1 text-sm">{a.message}</div>
          <Button size="sm" variant="outline" onClick={() => toggle(a.id, !a.active)}>{a.active ? "Active" : "Hidden"}</Button>
          <Button size="icon" variant="ghost" onClick={() => del(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </Card>
      ))}
    </div>
  );
};

const RSVPsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("event_rsvps").select("*, events(title)").order("created_at", { ascending: false });
    setItems(data ?? []);
  })(); }, []);
  return (
    <div className="space-y-3 mt-6">
      {items.length === 0 && <p className="text-muted-foreground">No RSVPs yet.</p>}
      {items.map(r => (
        <Card key={r.id} className="p-4 bg-card border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold text-primary">{r.name} <span className="text-muted-foreground text-sm">· {r.guests} guest(s)</span></div>
              <div className="text-xs text-muted-foreground">{r.email}{r.phone && ` · ${r.phone}`}</div>
              <div className="text-xs text-accent mt-1">{r.events?.title}</div>
            </div>
            <div className="text-xs text-muted-foreground">{format(parseISO(r.created_at), "PPp")}</div>
          </div>
          {r.notes && <p className="text-sm text-muted-foreground mt-2">"{r.notes}"</p>}
        </Card>
      ))}
    </div>
  );
};

const SubmissionsAdmin = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const m = await supabase.from("membership_applications").select("*").order("created_at", { ascending: false });
    const c = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMemberships(m.data ?? []); setContacts(c.data ?? []);
  })(); }, []);
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div>
        <h3 className="font-display font-bold text-primary mb-3">Membership applications</h3>
        <div className="space-y-3">
          {memberships.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
          {memberships.map(m => (
            <Card key={m.id} className="p-4 bg-card border-border">
              <div className="font-semibold text-primary">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email}{m.phone && ` · ${m.phone}`}{m.location && ` · ${m.location}`}</div>
              {m.message && <p className="text-sm mt-2 text-foreground/80">{m.message}</p>}
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-bold text-primary mb-3">Contact messages</h3>
        <div className="space-y-3">
          {contacts.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
          {contacts.map(c => (
            <Card key={c.id} className="p-4 bg-card border-border">
              <div className="font-semibold text-primary">{c.subject}</div>
              <div className="text-xs text-muted-foreground">{c.name} · {c.email}</div>
              <p className="text-sm mt-2 text-foreground/80">{c.message}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
