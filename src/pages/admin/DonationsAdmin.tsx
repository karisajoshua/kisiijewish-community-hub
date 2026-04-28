import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Donation = {
  id: string;
  created_at: string;
  donation_type: string;
  frequency: string;
  amount: number;
  currency: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  payment_method: string;
  is_tribute: boolean;
  tribute_name: string | null;
  status: string;
  notes: string | null;
};

const STATUSES = ["pending", "received", "thanked", "refunded", "cancelled"];

const DonationsAdmin = () => {
  const qc = useQueryClient();
  useRealtimeInvalidate("donations", ["donations"]);
  const [filter, setFilter] = useState<string>("all");

  const { data: donations, isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Donation[];
    },
  });

  const filtered = (donations ?? []).filter((d) => filter === "all" || d.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("donations").update({ status }).eq("id", id);
    if (error) return toast.error("Could not update status");
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    const { error } = await supabase.from("donations").delete().eq("id", id);
    if (error) return toast.error("Could not delete");
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const total = filtered.reduce((s, d) => s + Number(d.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Donations</h1>
          <p className="text-sm text-muted-foreground">Pledges submitted from the donate page.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Records</div><div className="font-display text-2xl font-bold text-primary">{filtered.length}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Total pledged</div><div className="font-display text-2xl font-bold text-primary">KES {total.toLocaleString()}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Pending</div><div className="font-display text-2xl font-bold text-primary">{(donations ?? []).filter(d => d.status === "pending").length}</div></Card>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No donations yet.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold text-primary">{d.donor_name}</span>
                    <Badge variant="outline" className="text-xs">{d.donation_type}</Badge>
                    {d.frequency === "monthly" && <Badge className="bg-sky text-sky-foreground text-xs">monthly</Badge>}
                    {d.is_tribute && <Badge variant="secondary" className="text-xs">tribute</Badge>}
                    <Badge variant={d.status === "received" ? "default" : "outline"} className="text-xs">{d.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {d.donor_email}{d.donor_phone ? ` · ${d.donor_phone}` : ""}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-primary">{d.currency} {Number(d.amount).toLocaleString()}</span>
                    <span className="text-muted-foreground"> · via {d.payment_method}</span>
                  </div>
                  {d.tribute_name && <div className="text-xs text-muted-foreground">In tribute to: {d.tribute_name}</div>}
                  {d.notes && <div className="text-xs text-muted-foreground italic">{d.notes}</div>}
                  <div className="text-xs text-muted-foreground">{format(parseISO(d.created_at), "MMM d, yyyy · h:mm a")}</div>
                </div>
                <div className="flex md:flex-col items-end gap-2">
                  <Select value={d.status} onValueChange={(v) => updateStatus(d.id, v)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => remove(d.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationsAdmin;
