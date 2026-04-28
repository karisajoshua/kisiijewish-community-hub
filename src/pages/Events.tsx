import { PageHero } from "@/components/PageHero";
import { EventCard } from "@/components/EventCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useEvents } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const { data: upcoming, isLoading } = useEvents(false);
  const { data: past } = useEvents(true);

  return (
    <>
      <PageHero
        title="Events & gatherings"
        subtitle="Shabbat dinners, learning circles, holiday celebrations, and community service — there's always something happening."
      />

      <section id="upcoming" className="py-20 scroll-mt-28">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Upcoming" title="What's coming up" align="left" />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <Skeleton key={i} className="h-96" />)}
            </div>
          ) : upcoming?.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events at the moment. Please check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming?.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      {past && past.length > 0 && (
        <section id="past" className="py-20 gradient-warm scroll-mt-28">
          <div className="container mx-auto px-4">
            <SectionHeader eyebrow="Memories" title="Past events" align="left" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((e: any) => (
                <div key={e.id} className="group rounded-xl overflow-hidden bg-card shadow-card hover:shadow-soft transition-smooth">
                  {e.image_url && (
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={e.image_url} alt={e.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-primary">{e.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{e.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Events;
