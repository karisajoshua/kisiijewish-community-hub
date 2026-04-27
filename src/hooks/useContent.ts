import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "./useRealtimeInvalidate";

export const useEvents = (past = false) => {
  useRealtimeInvalidate("events", ["events"]);
  return useQuery({
    queryKey: ["events", past],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_past", past)
        .order("event_date", { ascending: !past });
      if (error) throw error;
      return data;
    },
  });
};

export const useNews = () => {
  useRealtimeInvalidate("news_posts", ["news"]);
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAnnouncements = () => {
  useRealtimeInvalidate("announcements", ["announcements"]);
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAlbums = () => {
  useRealtimeInvalidate("gallery_albums", ["albums"]);
  useRealtimeInvalidate("gallery_photos", ["albums"]);
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*, gallery_photos(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
