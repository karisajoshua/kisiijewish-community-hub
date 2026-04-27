import { useEffect, useState } from "react";
import { useSetting, useUpdateSetting } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function FooterAdmin() {
  const { data } = useSetting<any>("footer");
  const upd = useUpdateSetting("footer");
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data && !v) setV(data); }, [data]);
  if (!v) return null;

  const updateColumn = (i: number, patch: any) => {
    const c = [...v.columns]; c[i] = {...c[i], ...patch}; setV({...v, columns: c});
  };
  const updateLink = (ci: number, li: number, patch: any) => {
    const c = [...v.columns]; const links = [...c[ci].links]; links[li] = {...links[li], ...patch}; c[ci] = {...c[ci], links}; setV({...v, columns: c});
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Footer</h2>
        <p className="text-sm text-muted-foreground">Tagline and link columns shown in the site footer.</p>
      </div>
      <Card className="p-5 space-y-4">
        <div><Label>Tagline</Label><Input value={v.tagline ?? ""} onChange={e => setV({...v, tagline: e.target.value})} /></div>
        {(v.columns ?? []).map((col: any, ci: number) => (
          <Card key={ci} className="p-4 space-y-2 bg-muted/30">
            <div className="flex justify-between items-center">
              <Input placeholder="Column title" value={col.title} onChange={e => updateColumn(ci, { title: e.target.value })} className="max-w-xs" />
              <Button size="icon" variant="ghost" onClick={() => setV({...v, columns: v.columns.filter((_: any, i: number) => i !== ci)})}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            {col.links.map((l: any, li: number) => (
              <div key={li} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input placeholder="Label" value={l.label} onChange={e => updateLink(ci, li, { label: e.target.value })} />
                <Input placeholder="Link" value={l.href} onChange={e => updateLink(ci, li, { href: e.target.value })} />
                <Button size="icon" variant="ghost" onClick={() => updateColumn(ci, { links: col.links.filter((_: any, i: number) => i !== li) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => updateColumn(ci, { links: [...col.links, { label: "New", href: "/" }] })}><Plus className="h-4 w-4 mr-1" /> Add link</Button>
          </Card>
        ))}
        <Button variant="outline" onClick={() => setV({...v, columns: [...(v.columns ?? []), { title: "New column", links: [] }]})}><Plus className="h-4 w-4 mr-1" /> Add column</Button>
        <div><Button onClick={() => upd.mutate(v, { onSuccess: () => toast.success("Footer saved") })}>Save footer</Button></div>
      </Card>
    </div>
  );
}
