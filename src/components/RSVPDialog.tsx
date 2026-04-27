import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(20),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export const RSVPDialog = ({
  event,
  open,
  onOpenChange,
}: {
  event: { id: string; title: string };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 1 },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.from("event_rsvps").insert({
      event_id: event.id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      guests: data.guests,
      notes: data.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit RSVP. Please try again.");
      return;
    }
    toast.success("Thank you! Your RSVP has been received.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">RSVP</DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div>
              <Label htmlFor="guests">Guests *</Label>
              <Input id="guests" type="number" min={1} max={20} {...register("guests")} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {submitting ? "Submitting..." : "Confirm RSVP"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
