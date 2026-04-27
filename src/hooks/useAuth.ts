import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadRole = async (uid: string | undefined) => {
      if (!uid) { setIsAdmin(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (!mounted) return;
      setIsAdmin((data ?? []).some((r) => r.role === "admin"));
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      // defer to avoid deadlock per Supabase guidance
      setTimeout(() => loadRole(session?.user?.id), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      loadRole(data.session?.user?.id).finally(() => mounted && setLoading(false));
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return { user, isAdmin, loading };
};
