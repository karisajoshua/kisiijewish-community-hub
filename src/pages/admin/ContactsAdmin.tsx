import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function ContactsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const load = async () => { const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }); setItems(data ?? []); };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { if (!confirm("Delete message?")) return; await supabase.from("contact_messages").delete().eq("id", id); load(); };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Contact Messages</h2>
        <p className="text-sm text-muted-foreground">Messages submitted from the contact form.</p>
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      <div className="space-y-2">
        {items.map(c => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-primary">{c.subject}</div>
                <div className="text-xs text-muted-foreground">{c.name} · {c.email} · {format(parseISO(c.created_at), "PP")}</div>
                <p className="text-sm mt-2 text-foreground/80">{c.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="outline"><a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}>Reply</a></Button>
                <Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
