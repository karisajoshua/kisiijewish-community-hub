import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSetting = <T = any>(key: string, fallback?: T) =>
  useQuery({
    queryKey: ["site_settings", key],
    queryFn: async (): Promise<T> => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return ((data?.value as unknown) as T) ?? (fallback as T);
    },
  });

export const useUpdateSetting = (key: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: any) => {
      const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings", key] }),
  });
};
