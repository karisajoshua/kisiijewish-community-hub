import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const merged = (profiles ?? []).map((p: any) => ({
      ...p,
      isAdmin: (roles ?? []).some((r: any) => r.user_id === p.id && r.role === "admin"),
    }));
    setUsers(merged);
  };
  useEffect(() => { load(); }, []);

  const promote = async (id: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Promoted to admin"); load();
  };
  const demote = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Admin removed"); load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Users & Roles</h2>
        <p className="text-sm text-muted-foreground">Promote members to admin or revoke admin access.</p>
      </div>
      <div className="space-y-2">
        {users.map(u => (
          <Card key={u.id} className="p-4 flex items-center gap-3">
            {u.avatar_url ? <img src={u.avatar_url} className="h-10 w-10 object-cover rounded-full" alt="" /> : <div className="h-10 w-10 rounded-full bg-sky-soft text-sky flex items-center justify-center font-bold">{(u.display_name ?? "?")[0]?.toUpperCase()}</div>}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary truncate">{u.display_name ?? "Unnamed"}</div>
              <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</div>
            </div>
            {u.isAdmin ? <Badge>Admin</Badge> : <Badge variant="secondary">Member</Badge>}
            {u.isAdmin
              ? <Button size="sm" variant="outline" onClick={() => demote(u.id)}>Remove admin</Button>
              : <Button size="sm" onClick={() => promote(u.id)}>Make admin</Button>}
          </Card>
        ))}
        {users.length === 0 && <p className="text-sm text-muted-foreground">No users yet.</p>}
      </div>
    </div>
  );
}
