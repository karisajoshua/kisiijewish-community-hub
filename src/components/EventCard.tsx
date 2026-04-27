import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RSVPDialog } from "./RSVPDialog";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string | null;
  location: string;
  image_url: string | null;
  is_past: boolean;
}

export const EventCard = ({ event }: { event: Event }) => {
  const [open, setOpen] = useState(false);
  const date = parseISO(event.event_date);

  return (
    <Card className="group overflow-hidden border-border bg-card shadow-card hover:shadow-soft transition-smooth flex flex-col">
      {event.image_url && (
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-accent font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            {format(date, "MMM d, yyyy")}
          </div>
          {event.event_time && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {event.event_time}
            </div>
          )}
        </div>
        <h3 className="font-display text-xl font-bold text-primary mb-2 leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{event.location}</span>
        </div>
        <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3 mb-5 flex-1">{event.description}</p>
        {!event.is_past && (
          <Button
            onClick={() => setOpen(true)}
            className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
          >
            RSVP Now
          </Button>
        )}
      </div>
      <RSVPDialog event={event} open={open} onOpenChange={setOpen} />
    </Card>
  );
};
