import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const STATUSES = ["pending", "approved", "rejected"];

export default function MembershipsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const load = async () => { const { data } = await supabase.from("membership_applications").select("*").order("created_at", { ascending: false }); setItems(data ?? []); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("membership_applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated"); load();
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("membership_applications").delete().eq("id", id); load(); };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Membership Applications</h2>
        <p className="text-sm text-muted-foreground">Review and approve applicants.</p>
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
      <div className="space-y-2">
        {items.map(m => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="font-semibold text-primary">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email}{m.phone && ` · ${m.phone}`}{m.location && ` · ${m.location}`}</div>
                <div className="text-xs text-muted-foreground mt-1">Applied {format(parseISO(m.created_at), "PP")}</div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={m.status} onValueChange={(v) => updateStatus(m.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
                <Button asChild size="sm" variant="outline"><a href={`mailto:${m.email}`}>Email</a></Button>
                <Button size="icon" variant="ghost" onClick={() => del(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            {m.message && <p className="text-sm mt-3 text-foreground/80 border-l-2 border-sky pl-3">{m.message}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
