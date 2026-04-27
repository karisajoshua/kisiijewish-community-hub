import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to all changes on a Postgres table and invalidate the matching
 * React Query cache whenever a row is inserted, updated, or deleted.
 */
export const useRealtimeInvalidate = (table: string, queryKey: readonly unknown[]) => {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          qc.invalidateQueries({ queryKey: [queryKey[0]] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, qc]);
};
