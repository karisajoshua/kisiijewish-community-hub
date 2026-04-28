import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNews } from "@/hooks/useContent";
import { format, parseISO } from "date-fns";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const News = () => {
  const { data: posts } = useNews();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    posts?.forEach((p: any) => set.add(p.category));
    return [...set];
  }, [posts]);

  const filtered = useMemo(() => {
    return (posts ?? []).filter((p: any) => {
      const matchQ = q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "All" || p.category === cat;
      return matchQ && matchC;
    });
  }, [posts, q, cat]);

  const featured = posts?.find((p: any) => p.featured);
  const rest = filtered.filter((p: any) => p.id !== featured?.id);

  return (
    <>
      <PageHero title="News & announcements" subtitle="Stories, updates, and reflections from across our community." />

      {featured && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Link to={`/news/${featured.slug}`} className="block group">
              <Card className="overflow-hidden border-border bg-card shadow-soft md:grid md:grid-cols-2">
                {featured.image_url && (
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                    <img src={featured.image_url} alt={featured.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
                  </div>
                )}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Featured · {featured.category}</div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
                  <div className="text-xs text-muted-foreground">{format(parseISO(featured.published_at), "MMMM d, yyyy")}</div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      <section id="latest" className="py-12 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news..." className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth",
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground/70 border-border hover:border-accent hover:text-accent"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post: any) => (
              <Link to={`/news/${post.slug}`} key={post.id} className="group">
                <Card className="overflow-hidden border-border bg-card shadow-card hover:shadow-soft transition-smooth h-full flex flex-col">
                  {post.image_url && (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img src={post.image_url} alt={post.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">{post.category}</div>
                    <h3 className="font-display text-xl font-bold text-primary mb-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="mt-4 text-xs text-muted-foreground">{format(parseISO(post.published_at), "MMM d, yyyy")}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts match your search.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
