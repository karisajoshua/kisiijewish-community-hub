import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { useAlbums } from "@/hooks/useContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";

const Gallery = () => {
  const { data: albums } = useAlbums();
  const [openAlbum, setOpenAlbum] = useState<any>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  return (
    <>
      <PageHero title="Gallery" subtitle="Moments, memories, and faces from our community life." />

      <section id="albums" className="py-20 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums?.map((a: any) => (
              <button key={a.id} onClick={() => setOpenAlbum(a)} className="text-left group">
                <Card className="overflow-hidden border-border bg-card shadow-card hover:shadow-soft transition-smooth">
                  {a.cover_image && (
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={a.cover_image} alt={a.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-primary">{a.title}</h3>
                    {a.event_date && <p className="text-xs text-muted-foreground mt-1">{format(parseISO(a.event_date), "MMMM yyyy")}</p>}
                    <p className="text-xs text-accent font-medium mt-2">{a.gallery_photos?.length ?? 0} photos</p>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!openAlbum} onOpenChange={() => setOpenAlbum(null)}>
        <DialogContent className="max-w-5xl">
          {openAlbum && (
            <div>
              <h2 className="font-display text-2xl font-bold text-primary mb-1">{openAlbum.title}</h2>
              {openAlbum.description && <p className="text-sm text-muted-foreground mb-5">{openAlbum.description}</p>}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto">
                {openAlbum.gallery_photos?.map((p: any) => (
                  <button key={p.id} onClick={() => setPreviewImg(p.image_url)} className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <img src={p.image_url} alt={p.caption || ""} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-smooth" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none p-0">
          {previewImg && <img src={previewImg} alt="" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
