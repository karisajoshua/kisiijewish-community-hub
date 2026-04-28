import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  received_amount: number | null;
  received_at: string | null;
};

const STATUSES = ["pending", "received", "thanked", "refunded", "cancelled"];

const formatMoney = (currency: string, amount: number) =>
  `${currency} ${Number(amount || 0).toLocaleString()}`;

const sumByCurrency = (rows: Donation[], pick: (d: Donation) => number) => {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const v = pick(r);
    if (!v) continue;
    out[r.currency] = (out[r.currency] ?? 0) + Number(v);
  }
  return out;
};

const renderTotals = (totals: Record<string, number>) => {
  const entries = Object.entries(totals);
  if (entries.length === 0) return "—";
  return entries.map(([cur, amt]) => `${cur} ${amt.toLocaleString()}`).join(" · ");
};

const DonationsAdmin = () => {
  const qc = useQueryClient();
  useRealtimeInvalidate("donations", ["donations"]);
  const [filter, setFilter] = useState<string>("all");
  const [receivedDialog, setReceivedDialog] = useState<{ row: Donation; value: string } | null>(null);

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

  const handleStatusChange = (row: Donation, status: string) => {
    if (status === "received") {
      setReceivedDialog({
        row,
        value: row.received_amount != null ? String(row.received_amount) : String(row.amount),
      });
      return;
    }
    void doStatusUpdate(row.id, { status });
  };

  const doStatusUpdate = async (id: string, payload: Record<string, any>) => {
    const { error } = await supabase.from("donations").update(payload as any).eq("id", id);
    if (error) {
      toast.error("Could not update");
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const confirmReceived = async () => {
    if (!receivedDialog) return;
    const v = Number(receivedDialog.value);
    if (!Number.isFinite(v) || v <= 0) {
      toast.error("Enter a valid amount received");
      return;
    }
    await doStatusUpdate(receivedDialog.row.id, {
      status: "received",
      received_amount: v,
      received_at: new Date().toISOString(),
    });
    setReceivedDialog(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    const { error } = await supabase.from("donations").delete().eq("id", id);
    if (error) return toast.error("Could not delete");
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const pledgedTotals = sumByCurrency(filtered, (d) => Number(d.amount));
  const receivedTotals = sumByCurrency(
    filtered.filter((d) => d.received_amount != null),
    (d) => Number(d.received_amount ?? 0),
  );

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground uppercase">Records</div>
          <div className="font-display text-2xl font-bold text-primary">{filtered.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground uppercase">Total pledged</div>
          <div className="font-display text-lg font-bold text-primary">{renderTotals(pledgedTotals)}</div>
        </Card>
        <Card className="p-5 bg-sky-soft border-sky/30">
          <div className="text-xs text-sky uppercase font-semibold">Total received</div>
          <div className="font-display text-lg font-bold text-primary">{renderTotals(receivedTotals)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground uppercase">Pending</div>
          <div className="font-display text-2xl font-bold text-primary">
            {(donations ?? []).filter(d => d.status === "pending").length}
          </div>
        </Card>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No donations yet.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const variance = d.received_amount != null ? Number(d.received_amount) - Number(d.amount) : null;
            return (
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
                    <div className="text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        <span className="text-xs text-muted-foreground uppercase mr-1">Pledged</span>
                        <span className="font-bold text-primary">{formatMoney(d.currency, d.amount)}</span>
                      </span>
                      {d.received_amount != null && (
                        <>
                          <span>
                            <span className="text-xs text-sky uppercase mr-1 font-semibold">Received</span>
                            <span className="font-bold text-sky">{formatMoney(d.currency, d.received_amount)}</span>
                          </span>
                          {variance !== null && variance !== 0 && (
                            <span className={cn(
                              "text-xs font-semibold",
                              variance > 0 ? "text-emerald-600" : "text-destructive"
                            )}>
                              {variance > 0 ? `+${variance.toLocaleString()} over` : `${variance.toLocaleString()} short`}
                            </span>
                          )}
                          {d.received_at && (
                            <span className="text-xs text-muted-foreground">
                              on {format(parseISO(d.received_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </>
                      )}
                      <span className="text-muted-foreground">· via {d.payment_method}</span>
                    </div>
                    {d.tribute_name && <div className="text-xs text-muted-foreground">In tribute to: {d.tribute_name}</div>}
                    {d.notes && <div className="text-xs text-muted-foreground italic">{d.notes}</div>}
                    <div className="text-xs text-muted-foreground">{format(parseISO(d.created_at), "MMM d, yyyy · h:mm a")}</div>
                  </div>
                  <div className="flex md:flex-col items-end gap-2">
                    <Select value={d.status} onValueChange={(v) => handleStatusChange(d, v)}>
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
            );
          })}
        </div>
      )}

      <Dialog open={!!receivedDialog} onOpenChange={(o) => !o && setReceivedDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as received</DialogTitle>
            <DialogDescription>
              {receivedDialog && (
                <>Pledged: <strong>{formatMoney(receivedDialog.row.currency, receivedDialog.row.amount)}</strong> from{" "}
                {receivedDialog.row.donor_name}. Enter the actual amount received.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="received-amount">Amount received ({receivedDialog?.row.currency})</Label>
            <Input
              id="received-amount"
              type="number"
              min="0"
              step="0.01"
              value={receivedDialog?.value ?? ""}
              onChange={(e) => setReceivedDialog((prev) => prev ? { ...prev, value: e.target.value } : prev)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceivedDialog(null)}>Cancel</Button>
            <Button onClick={confirmReceived}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsAdmin;
