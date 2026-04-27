import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield } from "lucide-react";
import { format, parseISO } from "date-fns";

const Account = () => {
  const { user, isAdmin, loading } = useAuth();
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [application, setApplication] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const r = await supabase.from("event_rsvps").select("*, events(title, event_date)").eq("email", user.email!).order("created_at", { ascending: false });
      setRsvps(r.data ?? []);
      const a = await supabase.from("membership_applications").select("*").eq("email", user.email!).order("created_at", { ascending: false }).limit(1).maybeSingle();
      setApplication(a.data);
    })();
  }, [user]);

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">My Account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && <Button asChild className="bg-sky text-sky-foreground hover:bg-sky/90"><Link to="/admin"><Shield className="h-4 w-4 mr-1" /> Admin Dashboard</Link></Button>}
          <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 mr-1" /> Sign out</Button>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Role</div>
            {isAdmin ? <Badge className="mt-1">Admin</Badge> : <Badge variant="secondary" className="mt-1">Member</Badge>}
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Joined</div>
            <div className="text-sm">{format(parseISO(user.created_at!), "PP")}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="font-display font-bold text-primary mb-3">Membership application</h2>
        {application ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Submitted {format(parseISO(application.created_at), "PP")}</div>
            </div>
            <Badge variant={application.status === "approved" ? "default" : "secondary"} className="capitalize">{application.status}</Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">You haven't applied for membership yet.</p>
            <Button asChild size="sm"><Link to="/membership">Apply now</Link></Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-display font-bold text-primary mb-3">My RSVPs</h2>
        {rsvps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No RSVPs yet. <Link to="/events" className="text-sky underline">Browse events →</Link></p>
        ) : (
          <ul className="divide-y divide-border">
            {rsvps.map(r => (
              <li key={r.id} className="py-3 flex justify-between gap-3">
                <div>
                  <div className="font-medium">{r.events?.title}</div>
                  <div className="text-xs text-muted-foreground">{r.events?.event_date ? format(parseISO(r.events.event_date), "PP") : ""} · {r.guests} guest(s)</div>
                </div>
                <div className="text-xs text-muted-foreground">RSVP'd {format(parseISO(r.created_at), "PP")}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Account;
