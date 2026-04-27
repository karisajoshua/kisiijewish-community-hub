import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Download } from "lucide-react";

export default function RSVPsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("event_rsvps").select("*, events(title)").order("created_at", { ascending: false });
    setItems(data ?? []);
  })(); }, []);

  const exportCSV = () => {
    const rows = [["Event","Name","Email","Phone","Guests","Notes","Date"]];
    items.forEach(r => rows.push([r.events?.title ?? "", r.name, r.email, r.phone ?? "", String(r.guests), (r.notes ?? "").replace(/\n/g," "), r.created_at]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "rsvps.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">RSVPs</h2>
          <p className="text-sm text-muted-foreground">All event responses.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" disabled={items.length === 0}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">No RSVPs yet.</p>}
      <div className="space-y-2">
        {items.map(r => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-semibold text-primary">{r.name} <span className="text-muted-foreground text-sm">· {r.guests} guest(s)</span></div>
                <div className="text-xs text-muted-foreground">{r.email}{r.phone && ` · ${r.phone}`}</div>
                <div className="text-xs text-sky mt-1">{r.events?.title}</div>
              </div>
              <div className="text-xs text-muted-foreground">{format(parseISO(r.created_at), "PPp")}</div>
            </div>
            {r.notes && <p className="text-sm text-muted-foreground mt-2">"{r.notes}"</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
