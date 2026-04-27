import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar, Newspaper, ClipboardList, UserCheck, MessageSquare, Megaphone } from "lucide-react";

const Stat = ({ icon: Icon, label, value, to }: any) => (
  <Link to={to} className="block">
    <Card className="p-5 hover:shadow-soft transition-smooth">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-sky-soft text-sky flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">{value ?? "—"}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </Card>
  </Link>
);

export default function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const tables = ["events", "news_posts", "event_rsvps", "membership_applications", "contact_messages", "announcements"];
      const results = await Promise.all(tables.map((t) => supabase.from(t as any).select("*", { count: "exact", head: true })));
      const next: Record<string, number> = {};
      tables.forEach((t, i) => (next[t] = results[i].count ?? 0));
      setCounts(next);

      const m = await supabase.from("contact_messages").select("name, subject, created_at").order("created_at", { ascending: false }).limit(5);
      setRecent(m.data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Overview</h2>
        <p className="text-sm text-muted-foreground">Snapshot of community activity.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat icon={Calendar} label="Events" value={counts.events} to="/admin/events" />
        <Stat icon={Newspaper} label="News" value={counts.news_posts} to="/admin/news" />
        <Stat icon={ClipboardList} label="RSVPs" value={counts.event_rsvps} to="/admin/rsvps" />
        <Stat icon={UserCheck} label="Applications" value={counts.membership_applications} to="/admin/memberships" />
        <Stat icon={MessageSquare} label="Messages" value={counts.contact_messages} to="/admin/contacts" />
        <Stat icon={Megaphone} label="Announcements" value={counts.announcements} to="/admin/announcements" />
      </div>

      <Card className="p-5">
        <h3 className="font-display font-bold text-primary mb-4">Recent contact messages</h3>
        {recent.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        <ul className="divide-y divide-border">
          {recent.map((m, i) => (
            <li key={i} className="py-3 flex justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{m.subject}</div>
                <div className="text-xs text-muted-foreground">{m.name}</div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
