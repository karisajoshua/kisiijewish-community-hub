import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";

const NewsPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_posts").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;
  if (!post) return <div className="container mx-auto py-20 text-center">Post not found.</div>;

  return (
    <article className="py-16">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6 text-accent">
          <Link to="/news"><ArrowLeft className="mr-1 h-4 w-4" /> Back to News</Link>
        </Button>
        {post.image_url && (
          <img src={post.image_url} alt={post.title} className="w-full max-h-[420px] object-cover rounded-2xl shadow-soft mb-10" />
        )}
        <div className="container-prose">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">{post.category}</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight">{post.title}</h1>
          <p className="text-sm text-muted-foreground mt-3">{format(parseISO(post.published_at), "MMMM d, yyyy")}</p>
          <div className="mt-8 prose prose-lg max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsPost;
