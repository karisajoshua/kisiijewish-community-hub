import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
  received_amount: number | null;
  received_at: string | null;
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

const fmt = (currency: string, amount: number | null | undefined) =>
  amount == null ? "—" : `${currency} ${Number(amount).toLocaleString()}`;

const DonationsAdmin = () => {
  const qc = useQueryClient();
  useRealtimeInvalidate("donations", ["donations"]);
  const [filter, setFilter] = useState<string>("all");
  const [receiveTarget, setReceiveTarget] = useState<Donation | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<string>("");

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

  const handleStatusChange = (donation: Donation, newStatus: string) => {
    if (newStatus === donation.status) return;

    if (newStatus === "received") {
      // Open dialog to capture actual received amount
      setReceiveTarget(donation);
      setReceiveAmount(String(donation.received_amount ?? donation.amount ?? ""));
      return;
    }

    // Moving away from "received" clears the received amount
    const update: Record<string, any> = { status: newStatus };
    if (donation.status === "received") {
      update.received_amount = null;
      update.received_at = null;
    }

    void applyUpdate(donation.id, update, "Status updated");
  };

  const applyUpdate = async (id: string, update: Record<string, any>, successMsg: string) => {
    const { error } = await supabase.from("donations").update(update as any).eq("id", id);
    if (error) return toast.error("Could not update");
    toast.success(successMsg);
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const confirmReceive = async () => {
    if (!receiveTarget) return;
    const value = Number(receiveAmount);
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await applyUpdate(
      receiveTarget.id,
      { status: "received", received_amount: value, received_at: new Date().toISOString() },
      "Donation marked as received"
    );
    setReceiveTarget(null);
    setReceiveAmount("");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    const { error } = await supabase.from("donations").delete().eq("id", id);
    if (error) return toast.error("Could not delete");
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["donations"] });
  };

  const totalPledged = filtered.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalReceived = filtered
    .filter((d) => d.status === "received")
    .reduce((s, d) => s + Number(d.received_amount || 0), 0);

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
          <div className="font-display text-2xl font-bold text-primary">{totalPledged.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-1">Sum across currencies</div>
        </Card>
        <Card className="p-5 bg-sky-soft border-sky/30">
          <div className="text-xs text-sky uppercase">Total received</div>
          <div className="font-display text-2xl font-bold text-sky">{totalReceived.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-1">Sum across currencies</div>
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
            const pledged = Number(d.amount || 0);
            const received = d.received_amount != null ? Number(d.received_amount) : null;
            const variance = received != null ? received - pledged : 0;
            return (
              <Card key={d.id} className="p-5">
                <div className="grid md:grid-cols-[1fr_auto] gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-bold text-primary">{d.donor_name}</span>
                      <Badge variant="outline" className="text-xs">{d.donation_type}</Badge>
                      {d.frequency === "monthly" && <Badge className="bg-sky text-sky-foreground text-xs">monthly</Badge>}
                      {d.is_tribute && <Badge variant="secondary" className="text-xs">tribute</Badge>}
                      <Badge
                        variant={d.status === "received" ? "default" : "outline"}
                        className={d.status === "received" ? "bg-sky text-sky-foreground text-xs" : "text-xs"}
                      >
                        {d.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {d.donor_email}{d.donor_phone ? ` · ${d.donor_phone}` : ""}
                    </div>

                    {/* Pledged vs received */}
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                      <span>
                        <span className="text-muted-foreground">Pledged:</span>{" "}
                        <span className="font-bold text-primary">{fmt(d.currency, pledged)}</span>
                      </span>
                      {d.status === "received" && (
                        <span>
                          <span className="text-muted-foreground">Received:</span>{" "}
                          <span className="font-bold text-sky">{fmt(d.currency, received)}</span>
                          {received != null && variance !== 0 && (
                            <span className={`ml-2 text-xs ${variance > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                              ({variance > 0 ? "+" : ""}{variance.toLocaleString()} {variance > 0 ? "over" : "short"})
                            </span>
                          )}
                          {d.received_at && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              on {format(parseISO(d.received_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </span>
                      )}
                      <span className="text-muted-foreground text-xs">via {d.payment_method}</span>
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
                    {d.status === "received" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReceiveTarget(d);
                          setReceiveAmount(String(d.received_amount ?? d.amount ?? ""));
                        }}
                      >
                        Edit received
                      </Button>
                    )}
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

      {/* Receive dialog */}
      <Dialog
        open={!!receiveTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReceiveTarget(null);
            setReceiveAmount("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark donation as received</DialogTitle>
            <DialogDescription>
              {receiveTarget && (
                <>Pledged amount: <strong>{fmt(receiveTarget.currency, receiveTarget.amount)}</strong>. Enter the actual amount you received.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="received-amount">Amount received ({receiveTarget?.currency})</Label>
            <Input
              id="received-amount"
              type="number"
              min={0}
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              You can enter a different amount if the actual gift differs from what was pledged.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReceiveTarget(null); setReceiveAmount(""); }}>
              Cancel
            </Button>
            <Button onClick={confirmReceive} className="bg-sky text-sky-foreground hover:bg-sky/90">
              Confirm received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsAdmin;
